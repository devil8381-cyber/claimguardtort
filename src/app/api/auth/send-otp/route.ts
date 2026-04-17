import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 OTP requests per minute per IP
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 3);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many OTP requests. Please wait 1 minute before trying again.' }, { status: 429 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    const claimant = await db.claimant.findUnique({ where: { email: trimmedEmail } });

    if (!claimant) {
      // Don't reveal if email exists or not (security)
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification code has been sent.',
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.claimant.update({
      where: { id: claimant.id },
      data: { otpCode: otp, otpExpiry },
    });

    // Send OTP email
    const emailResult = await sendOtpEmail(trimmedEmail, otp, 'account verification');
    console.log(`[AUTH SEND-OTP] OTP for ${trimmedEmail}: ${otp}, Email sent: ${emailResult.success}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
      otpSent: emailResult.success,
      emailError: emailResult.error || null,
    });
  } catch (error) {
    console.error('[AUTH SEND-OTP] Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
  }
}
