import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
  const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '100') || 100), 500);
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
  const body = await request.json();
  const { trackingId, firstName, lastName, email, phone, claimType, status, state, filedDate, notes } = body;

  if (!trackingId || !firstName || !lastName || !email) {
    return NextResponse.json(
      { error: 'trackingId, firstName, lastName, and email are required' },
      { status: 400 }
    );
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();

    // Check if email exists - link to existing or create new
    let claimant = await prisma.claimant.findUnique({ where: { email: trimmedEmail } });
    if (claimant) {
      // Update existing claimant
      claimant = await prisma.claimant.update({
        where: { email: trimmedEmail },
        data: {
          phone: phone?.trim() || claimant.phone,
          claimType: claimType?.trim() || claimant.claimType,
          status: status?.trim() || claimant.status,
        },
      });
    } else {
      claimant = await prisma.claimant.create({
        data: {
          trackingId: trackingId.toUpperCase().trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: trimmedEmail,
          phone: phone?.trim() || null,
          claimType: claimType?.trim() || null,
          status: status?.trim() || 'Submitted',
          state: state?.trim() || null,
          filedDate: filedDate?.trim() || null,
          notes: notes?.trim() || null,
        },
      });
    }
    return NextResponse.json({ claimant, success: true }, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: `A record with this identifier already exists` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to create claimant' }, { status: 500 });
  }
}
