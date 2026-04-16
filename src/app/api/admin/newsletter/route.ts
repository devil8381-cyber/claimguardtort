import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;
  const xAdmin = request.headers.get('x-admin-token');
  return xAdmin === ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
