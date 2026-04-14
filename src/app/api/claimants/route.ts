import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get('trackingId');

  if (!trackingId) {
    return NextResponse.json({ error: 'trackingId is required' }, { status: 400 });
  }

  const claimant = await prisma.claimant.findUnique({
    where: { trackingId: trackingId.toUpperCase().trim() },
  });

  if (!claimant) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({ found: true, claimant });
}
