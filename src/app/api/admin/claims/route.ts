import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const claims = await db.claim.findMany({
      include: {
        claimant: true,
        history: { orderBy: { date: 'desc' } },
      },
      orderBy: { lastUpdated: 'desc' },
    });
    return NextResponse.json(claims);
  } catch (error) {
    console.error('Admin claims list error:', error);
    return NextResponse.json(
      { error: 'Failed to load claims' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, trackingId, claimType, status, description, notes } = body;

    if (!firstName || !lastName || !email || !trackingId) {
      return NextResponse.json(
        { error: 'firstName, lastName, email, and trackingId are required' },
        { status: 400 }
      );
    }

    const existingClaim = await db.claim.findUnique({ where: { trackingId } });
    if (existingClaim) {
      return NextResponse.json(
        { error: 'A claim with this tracking ID already exists' },
        { status: 409 }
      );
    }

    const claimant = await db.claimant.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
      },
    });

    const claim = await db.claim.create({
      data: {
        trackingId,
        status: status || 'Pending',
        claimType: claimType || null,
        description: description || null,
        notes: notes || null,
        filedDate: new Date(),
        claimantId: claimant.id,
        history: {
          create: {
            status: status || 'Pending',
            notes: 'Claim created by admin',
          },
        },
      },
      include: { claimant: true, history: true },
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error('Admin create claim error:', error);
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exportFormat = searchParams.get('export');

    if (exportFormat === 'csv') {
      const claims = await db.claim.findMany({
        include: { claimant: true },
        orderBy: { lastUpdated: 'desc' },
      });

      const headers = ['Tracking ID', 'Claimant', 'Email', 'Status', 'Claim Type', 'Description', 'Notes', 'Filed Date', 'Last Updated'];
      const rows = claims.map(c => [
        c.trackingId,
        `${c.claimant.firstName} ${c.claimant.lastName}`,
        c.claimant.email,
        c.status,
        c.claimType || '',
        (c.description || '').replace(/"/g, '""'),
        (c.notes || '').replace(/"/g, '""'),
        c.filedDate ? new Date(c.filedDate).toLocaleDateString() : '',
        new Date(c.lastUpdated).toLocaleDateString(),
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="claims-export.csv"',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid export format' }, { status: 400 });
  } catch (error) {
    console.error('Admin claims export error:', error);
    return NextResponse.json(
      { error: 'Failed to export claims' },
      { status: 500 }
    );
  }
}
