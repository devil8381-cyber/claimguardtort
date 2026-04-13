import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingId } = body;

    if (!trackingId || typeof trackingId !== 'string' || trackingId.trim() === '') {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    const claim = await db.claim.findUnique({
      where: { trackingId: trackingId.trim() },
      include: {
        claimant: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        history: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: `No claim found with tracking ID "${trackingId}". Please verify your tracking ID and try again.` },
        { status: 404 }
      );
    }

    // Calculate progress based on status
    const statusProgress: Record<string, number> = {
      'Pending': 20,
      'Under Review': 50,
      'Correction Needed': 40,
      'Approved': 90,
      'Denied': 100,
    };

    return NextResponse.json({
      success: true,
      claim: {
        trackingId: claim.trackingId,
        status: claim.status,
        claimType: claim.claimType,
        description: claim.description,
        filedDate: claim.filedDate,
        lastUpdated: claim.lastUpdated,
        notes: claim.notes,
        nextSteps: claim.nextSteps,
        progress: statusProgress[claim.status] || 0,
        claimant: {
          firstName: claim.claimant.firstName.charAt(0) + '***',
          lastName: claim.claimant.lastName,
        },
        history: claim.history.map((h) => ({
          status: h.status,
          notes: h.notes,
          date: h.date,
        })),
      },
    });
  } catch (error) {
    console.error('Error tracking claim:', error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
