import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;
  const xAdmin = request.headers.get('x-admin-token');
  return xAdmin === ADMIN_TOKEN;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { trackingId } = await params;
  const body = await request.json();
  const { status, notes } = body;

  try {
    const updated = await prisma.claimant.update({
      where: { trackingId: trackingId.toUpperCase().trim() },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });
    return NextResponse.json({ claimant: updated, success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update claimant' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { trackingId } = await params;
  await prisma.claimant.deleteMany({
    where: { trackingId: trackingId.toUpperCase().trim() },
  });
  return NextResponse.json({ success: true });
}
