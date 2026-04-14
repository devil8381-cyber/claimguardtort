import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ADMIN_TOKEN = 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { trackingId: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (status && status !== 'all') {
    where.status = status;
  }

  const [claimants, total] = await Promise.all([
    prisma.claimant.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.claimant.count({ where }),
  ]);

  return NextResponse.json({
    claimants,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { trackingId, firstName, lastName, email, phone, claimType, status, state, filedDate, notes } = body;

  if (!trackingId || !firstName || !lastName || !email) {
    return NextResponse.json(
      { error: 'trackingId, firstName, lastName, and email are required' },
      { status: 400 }
    );
  }

  try {
    const claimant = await prisma.claimant.create({
      data: {
        trackingId: trackingId.toUpperCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        claimType: claimType?.trim() || null,
        status: status?.trim() || 'Submitted',
        state: state?.trim() || null,
        filedDate: filedDate?.trim() || null,
        notes: notes?.trim() || null,
      },
    });
    return NextResponse.json({ claimant, success: true }, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: `Tracking ID "${trackingId}" already exists` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to create claimant' }, { status: 500 });
  }
}
