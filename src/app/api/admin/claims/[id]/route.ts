import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, nextSteps } = body;

    const existing = await db.claim.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { lastUpdated: new Date() };
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (nextSteps !== undefined) updateData.nextSteps = nextSteps;

    const claim = await db.claim.update({
      where: { id },
      data: updateData,
      include: { claimant: true, history: { orderBy: { date: 'desc' } } },
    });

    if (status !== undefined && status !== existing.status) {
      await db.claimHistory.create({
        data: {
          status,
          notes: `Status changed from "${existing.status}" to "${status}"` + (notes ? `. ${notes}` : ''),
          claimId: id,
        },
      });
    }

    return NextResponse.json(claim);
  } catch (error) {
    console.error('Admin update claim error:', error);
    return NextResponse.json(
      { error: 'Failed to update claim' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.claim.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    await db.claimHistory.deleteMany({ where: { claimId: id } });
    await db.claim.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Claim deleted' });
  } catch (error) {
    console.error('Admin delete claim error:', error);
    return NextResponse.json(
      { error: 'Failed to delete claim' },
      { status: 500 }
    );
  }
}
