import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const claimantId = searchParams.get('claimantId');

    if (!claimantId) {
      return NextResponse.json(
        { error: 'claimantId is required' },
        { status: 400 }
      );
    }

    const claims = await db.claim.findMany({
      where: { claimantId },
      orderBy: { lastUpdated: 'desc' },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}

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

    // Verify claimant exists
    const claimant = await db.claimant.findUnique({ where: { id: claimantId } });
    if (!claimant) {
      return NextResponse.json(
        { error: 'Claimant not found' },
        { status: 404 }
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
