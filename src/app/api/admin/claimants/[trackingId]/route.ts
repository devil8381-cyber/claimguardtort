import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_TOKEN = 'claimguard-admin-2025';

function verifyAdmin(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${ADMIN_TOKEN}`;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { trackingId } = await params;

    const existing = await db.claimant.findUnique({
      where: { trackingId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Claimant not found' },
        { status: 404 }
      );
    }

    await db.claimant.delete({
      where: { trackingId },
    });

    return NextResponse.json({
      success: true,
      message: `Claimant ${trackingId} deleted successfully`,
    });
  } catch (error) {
    console.error('Admin claimant delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete claimant' },
      { status: 500 }
    );
  }
}
