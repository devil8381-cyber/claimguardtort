import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'bcryptjs';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required: firstName, lastName, email, password' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already registered
    const existing = await db.claimant.findUnique({ where: { email: trimmedEmail } });
    if (existing && existing.password) {
      return NextResponse.json({ error: 'An account with this email already exists. Please login instead.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let claimant;

    if (existing) {
      // Update existing claimant with auth fields
      claimant = await db.claimant.update({
        where: { id: existing.id },
        data: {
          firstName: firstName.trim() || existing.firstName,
          lastName: lastName.trim() || existing.lastName,
          phone: phone ? phone.trim() : existing.phone,
          password: hashedPassword,
          otpCode: otp,
          otpExpiry,
          emailVerified: false,
        },
      });
    } else {
      // Create new claimant with auth
      const trackingId = `CG-${Date.now().toString(36).toUpperCase()}`;
      claimant = await db.claimant.create({
        data: {
          trackingId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: trimmedEmail,
          phone: phone ? phone.trim() : null,
          password: hashedPassword,
          otpCode: otp,
          otpExpiry,
          emailVerified: false,
        },
      });
    }

    // Send OTP email (from donotreply@)
    const emailResult = await sendOtpEmail(trimmedEmail, otp, 'account verification');
    console.log('[AUTH REGISTER] OTP email result:', emailResult);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email for a verification code.',
      email: trimmedEmail,
      otpSent: emailResult.success,
      emailError: emailResult.error || null,
    }, { status: 201 });
  } catch (error) {
    console.error('[AUTH REGISTER] Error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
