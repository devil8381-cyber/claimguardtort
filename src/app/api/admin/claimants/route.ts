import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const claimants = await db.claimant.findMany({
      include: {
        claims: {
          select: { id: true, trackingId: true, status: true, claimType: true },
          orderBy: { lastUpdated: 'desc' },
        },
        messages: {
          select: { id: true, message: true, createdAt: true, read: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(claimants);
  } catch (error) {
    console.error('Admin claimants list error:', error);
    return NextResponse.json(
      { error: 'Failed to load claimants' },
      { status: 500 }
    );
  }
}
