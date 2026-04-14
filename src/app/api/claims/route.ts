import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingId, status, claimType, description, claimantId, notes, nextSteps } = body;

    if (!trackingId || !claimantId) {
      return NextResponse.json(
        { error: 'Tracking ID and Claimant ID are required' },
        { status: 400 }
      );
    }

    // Check if tracking ID already exists
    const existing = await db.claim.findUnique({
      where: { trackingId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A claim with this tracking ID already exists' },
        { status: 409 }
      );
    }

    const claim = await db.claim.create({
      data: {
        trackingId,
        status: status || 'Pending',
        claimType,
        description,
        claimantId,
        notes,
        nextSteps,
        filedDate: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, claim },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
