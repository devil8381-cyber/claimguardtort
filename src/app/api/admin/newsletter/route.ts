import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const subscribers = await db.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Admin newsletter list error:', error);
    return NextResponse.json(
      { error: 'Failed to load newsletter subscribers' },
      { status: 500 }
    );
  }
}
