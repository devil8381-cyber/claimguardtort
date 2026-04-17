import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    const claimant = await db.claimant.findUnique({ where: { email: trimmedEmail } });

    if (!claimant) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 404 });
    }

    if (!claimant.otpCode || !claimant.otpExpiry) {
      return NextResponse.json({ error: 'No active verification code. Please request a new one.' }, { status: 400 });
    }

    // Check OTP match
    if (claimant.otpCode !== trimmedOtp) {
      return NextResponse.json({ error: 'Invalid verification code. Please check and try again.' }, { status: 401 });
    }

    // Check OTP expiry
    if (new Date() > claimant.otpExpiry) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 410 });
    }

    // Mark as verified and clear OTP
    await db.claimant.update({
      where: { id: claimant.id },
      data: {
        emailVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
    });

    console.log(`[AUTH VERIFY-OTP] Email verified: ${trimmedEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      emailVerified: true,
    });
  } catch (error) {
    console.error('[AUTH VERIFY-OTP] Error:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
