import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { read } = body;

    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const message = await db.contactMessage.update({
      where: { id },
      data: { read: read !== undefined ? read : true },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Admin update message error:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
