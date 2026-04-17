import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET current authenticated user + their claims
 * Requires session token in Authorization header or body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authentication token required' }, { status: 401 });
    }

    const claimant = await db.claimant.findFirst({
      where: { sessionToken: token },
      include: {
        claims: {
          include: { history: { orderBy: { date: 'desc' } } },
          orderBy: { lastUpdated: 'desc' },
        },
      },
    });

    if (!claimant) {
      return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: claimant.id,
        trackingId: claimant.trackingId,
        firstName: claimant.firstName,
        lastName: claimant.lastName,
        email: claimant.email,
        phone: claimant.phone,
        emailVerified: claimant.emailVerified,
      },
      claims: claimant.claims.map(c => ({
        id: c.id,
        trackingId: c.trackingId,
        status: c.status,
        claimType: c.claimType,
        description: c.description,
        filedDate: c.filedDate,
        lastUpdated: c.lastUpdated,
        notes: c.notes,
        nextSteps: c.nextSteps,
        history: c.history.map(h => ({ status: h.status, notes: h.notes, date: h.date })),
      })),
    });
  } catch (error) {
    console.error('[AUTH ME] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
