import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId')?.trim();
    const search = searchParams.get('search')?.trim();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // If trackingId is provided, look up specific claimant
    if (trackingId) {
      const claimant = await db.claimant.findUnique({
        where: { trackingId },
      });

      if (!claimant) {
        return NextResponse.json(
          { error: 'No claimant found with that tracking ID' },
          { status: 404 }
        );
      }

      return NextResponse.json({ claimants: [claimant], total: 1, page: 1, totalPages: 1 });
    }

    // Search by name, email, or trackingId
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { trackingId: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [claimants, total] = await Promise.all([
      db.claimant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.claimant.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      claimants,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Claimants search error:', error);
    return NextResponse.json(
      { error: 'Failed to search claimants' },
      { status: 500 }
    );
  }
}
