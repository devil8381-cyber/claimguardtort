import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ADMIN_TOKEN = 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;
  // Also support token via query param for window.open compatibility
  const { searchParams } = new URL(request.url);
  return searchParams.get('token') === ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'csv';

  if (format === 'stats') {
    const [total, claimants] = await Promise.all([
      prisma.claimant.count(),
      prisma.claimant.findMany(),
    ]);
    const statusCounts: Record<string, number> = {};
    const claimTypeCounts: Record<string, number> = {};
    for (const c of claimants) {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
      if (c.claimType) {
        claimTypeCounts[c.claimType] = (claimTypeCounts[c.claimType] || 0) + 1;
      }
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
