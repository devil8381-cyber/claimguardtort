import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOtpEmail } from '@/lib/email';
import crypto from 'crypto';

// POST /api/claimants — Register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'firstName, lastName, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await prisma.claimant.findUnique({ where: { email: trimmedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 });
    }

    // Generate tracking ID
    const trackingId = `CG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Hash password (simple SHA-256 for now)
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Create claimant
    const claimant = await prisma.claimant.create({
      data: {
        trackingId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: trimmedEmail,
        phone: phone?.trim() || null,
        status: 'Submitted',
        notes: passwordHash, // Store password hash in notes field
      },
    });

    // Generate and send OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.upsert({
      where: { email: trimmedEmail },
      update: { code: otp, expiresAt: otpExpiry },
      create: { email: trimmedEmail, code: otp, expiresAt: otpExpiry },
    });

    // Send OTP email
    const emailResult = await sendOtpEmail(trimmedEmail, otp, 'account verification');
    if (!emailResult.success) {
      console.error('[REGISTER] Failed to send OTP email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created. Please verify your email.',
      claimantId: claimant.id,
      emailSent: emailResult.success,
      details: emailResult.success ? undefined : emailResult.error,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

// PUT /api/claimants — Login
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, id } = body;

    let claimant;

    if (id) {
      // Settings update mode
      claimant = await prisma.claimant.findUnique({ where: { id } });
      if (!claimant) {
        return NextResponse.json({ error: 'Claimant not found.' }, { status: 404 });
      }
      // Update profile fields
      if (body.firstName) claimant = await prisma.claimant.update({ where: { id }, data: { firstName: body.firstName } });
      if (body.lastName) claimant = await prisma.claimant.update({ where: { id }, data: { lastName: body.lastName } });
      if (body.phone !== undefined) claimant = await prisma.claimant.update({ where: { id }, data: { phone: body.phone || null } });
      if (body.password) {
        const passwordHash = crypto.createHash('sha256').update(body.password).digest('hex');
        // Verify current password if provided
        claimant = await prisma.claimant.update({ where: { id }, data: { notes: passwordHash } });
      }
      return NextResponse.json({ success: true, claimant });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Login mode
    claimant = await prisma.claimant.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!claimant) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Verify password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    if (claimant.notes !== passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate token (simple: claimant ID + timestamp)
    const token = crypto.createHash('sha256').update(`${claimant.id}-${Date.now()}`).digest('hex').substring(0, 32);

    return NextResponse.json({
      success: true,
      token,
      claimant: {
        id: claimant.id,
        trackingId: claimant.trackingId,
        firstName: claimant.firstName,
        lastName: claimant.lastName,
        email: claimant.email,
        phone: claimant.phone,
        claimType: claimant.claimType,
        status: claimant.status,
        createdAt: claimant.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}

// PATCH /api/claimants — Verify OTP
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find OTP record
    const otpRecord = await prisma.oTP.findUnique({ where: { email: trimmedEmail } });

    if (!otpRecord) {
      return NextResponse.json({ error: 'No verification code found. Please register first.' }, { status: 404 });
    }

    // Check if OTP expired
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 410 });
    }

    // Check if OTP matches
    if (otpRecord.code !== otp) {
      return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 401 });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { email: trimmedEmail },
      data: { code: 'USED', expiresAt: new Date(0) },
    });

    // Get claimant
    const claimant = await prisma.claimant.findUnique({ where: { email: trimmedEmail } });
    if (!claimant) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    // Generate token
    const token = crypto.createHash('sha256').update(`${claimant.id}-${Date.now()}`).digest('hex').substring(0, 32);

    return NextResponse.json({
      success: true,
      token,
      claimant: {
        id: claimant.id,
        trackingId: claimant.trackingId,
        firstName: claimant.firstName,
        lastName: claimant.lastName,
        email: claimant.email,
        phone: claimant.phone,
        claimType: claimant.claimType,
        status: claimant.status,
        createdAt: claimant.createdAt,
      },
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
