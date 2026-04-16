import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;
  const xAdmin = request.headers.get('x-admin-token');
  if (xAdmin === ADMIN_TOKEN) return true;
  const { searchParams } = new URL(request.url);
  return searchParams.get('token') === ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'csv';

  if (format === 'stats') {
    const [total, statusGroups, claimTypeGroups] = await Promise.all([
      prisma.claimant.count(),
      prisma.claimant.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.claimant.groupBy({ by: ['claimType'], where: { claimType: { not: null } }, _count: { claimType: true } }),
    ]);
    const statusCounts: Record<string, number> = {};
    for (const g of statusGroups) {
      statusCounts[g.status] = g._count.status;
    }
    const claimTypeCounts: Record<string, number> = {};
    for (const g of claimTypeGroups) {
      if (g.claimType) claimTypeCounts[g.claimType] = g._count.claimType;
    }
    return NextResponse.json({ total, statusCounts, claimTypeCounts });
  }

  if (format === 'sample') {
    const csv = [
      'trackingId,firstName,lastName,email,phone,claimType,status,state,filedDate,notes',
      'CLM-2024-001,John,Doe,john@example.com,555-1234,Camp Lejeune,Submitted,PA,2024-01-15,Sample entry',
      'CLM-2024-002,Jane,Smith,jane@example.com,555-5678,Roundup,Validated,TX,2024-02-20,Sample entry',
    ].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=claimants-sample.csv',
      },
    });
  }

  // Full CSV export
  const claimants = await prisma.claimant.findMany({ orderBy: { createdAt: 'desc' } });
  const header = 'trackingId,firstName,lastName,email,phone,claimType,status,state,filedDate,notes';
  const rows = claimants.map((c) =>
    [c.trackingId, c.firstName, c.lastName, c.email, c.phone || '', c.claimType || '', c.status, c.state || '', c.filedDate || '', c.notes || '']
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv = [header, ...rows].join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=claimants-export.csv',
    },
  });
}
