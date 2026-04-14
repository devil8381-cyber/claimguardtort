import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalClaims,
      pendingClaims,
      underReviewClaims,
      approvedClaims,
      deniedClaims,
      correctionNeededClaims,
      totalMessages,
      unreadMessages,
      totalNewsletter,
    ] = await Promise.all([
      db.claim.count(),
      db.claim.count({ where: { status: 'Pending' } }),
      db.claim.count({ where: { status: 'Under Review' } }),
      db.claim.count({ where: { status: 'Approved' } }),
      db.claim.count({ where: { status: 'Denied' } }),
      db.claim.count({ where: { status: 'Correction Needed' } }),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { read: false } }),
      db.newsletter.count(),
    ]);

    const totalClaimants = await db.claimant.count();

    return NextResponse.json({
      claims: {
        total: totalClaims,
        byStatus: {
          Pending: pendingClaims,
          'Under Review': underReviewClaims,
          Approved: approvedClaims,
          Denied: deniedClaims,
          'Correction Needed': correctionNeededClaims,
        },
      },
      claimants: {
        total: totalClaimants,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
      },
      newsletter: {
        total: totalNewsletter,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
