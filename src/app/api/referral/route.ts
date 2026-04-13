import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referrerName, referrerEmail, friendName, friendEmail, claimType } = body;

    if (!referrerName || !referrerEmail || !friendName || !friendEmail) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Store as a contact message for admin tracking
    await db.contactMessage.create({
      data: {
        name: referrerName,
        email: referrerEmail,
        message: `REFERRAL: ${referrerName} (${referrerEmail}) referred ${friendName} (${friendEmail}) for ${claimType || 'general claim'}.`,
        claimId: claimType || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Thank you, ${referrerName}! Your referral for ${friendName} has been submitted. We'll reach out to them shortly.` 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit referral' }, { status: 500 });
  }
}
