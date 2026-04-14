import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_TOKEN = 'claimguard-admin-2025';

function verifyAdmin(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${ADMIN_TOKEN}`;
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    if (format === 'csv' || format === 'download') {
      const claimants = await db.claimant.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const headers = [
        'tracking_id', 'first_name', 'last_name', 'email', 'phone',
        'claim_type', 'status', 'state', 'filed_date', 'notes',
      ];

      const rows = claimants.map(c => [
        c.trackingId || '',
        c.firstName,
        c.lastName,
        c.email,
        c.phone || '',
        c.claimType || '',
        c.status,
        c.state || '',
        c.filedDate || '',
        (c.notes || '').replace(/"/g, '""'),
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(r => r.map(v => `"${v}"`).join(',')),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="claimants-export.csv"',
        },
      });
    }

    if (format === 'sample') {
      const sampleCSV = `tracking_id,first_name,last_name,email,phone,claim_type,status,state,filed_date,notes
CLM-2024-001,John,Martinez,john.martinez@email.com,(555) 123-4567,Camp Lejeune,Submitted,NC,2024-01-15,Initial claim filed
CLM-2024-002,Sarah,Johnson,sarah.j@email.com,(555) 234-5678,Roundup,Under Review,OH,2024-02-20,Medical records submitted
CLM-2024-003,Robert,Williams,rwilliams@email.com,,Hernia Mesh,Validated,TX,2024-03-10,Surgery date confirmed
CLM-2024-004,Linda,Davis,l.davis@email.com,(555) 456-7890,Talc,Completed,FL,2023-11-05,Settlement received
CLM-2024-005,Michael,Brown,mbrown55@email.com,(555) 567-8901,Paraquat,Decision,CA,2024-01-30,Awaiting decision letter`;

      return new NextResponse(sampleCSV, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="claimant-sample-template.csv"',
        },
      });
    }

    // Stats endpoint
    if (format === 'stats') {
      const [total, statusGroups, claimTypeGroups] = await Promise.all([
        db.claimant.count(),
        db.claimant.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        db.claimant.groupBy({
          by: ['claimType'],
          _count: { claimType: true },
        }),
      ]);

      const statusCounts: Record<string, number> = {};
      statusGroups.forEach(g => {
        statusCounts[g.status] = g._count.status;
      });

      const claimTypeCounts: Record<string, number> = {};
      claimTypeGroups
        .filter(g => g.claimType)
        .sort((a, b) => b._count.claimType - a._count.claimType)
        .slice(0, 5)
        .forEach(g => {
          claimTypeCounts[g.claimType!] = g._count.claimType;
        });

      return NextResponse.json({
        total,
        statusCounts,
        claimTypeCounts,
      });
    }

    return NextResponse.json({ error: 'Invalid format parameter' }, { status: 400 });
  } catch (error) {
    console.error('Admin export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
