import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ADMIN_TOKEN = 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const text = await file.text();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    return NextResponse.json({ error: 'CSV must have a header row and at least one data row' }, { status: 400 });
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  let imported = 0;
  let updated = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 3) {
      errors.push(`Row ${i + 1}: Not enough columns`);
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || '').trim().replace(/^"|"$/g, '');
    });

    const trackingId = (row['trackingid'] || row['tracking_id'] || row['id'] || '').toUpperCase().trim();
    const firstName = row['firstname'] || row['first_name'] || row['fname'] || '';
    const lastName = row['lastname'] || row['last_name'] || row['lname'] || '';
    const email = row['email'] || '';

    if (!trackingId || !firstName || !lastName || !email) {
      errors.push(`Row ${i + 1}: Missing required fields (trackingId, firstName, lastName, email)`);
      continue;
    }

    try {
      const existing = await prisma.claimant.findUnique({ where: { trackingId } });
      if (existing) {
        await prisma.claimant.update({
          where: { trackingId },
          data: {
            firstName,
            lastName,
            email,
            phone: row['phone'] || null,
            claimType: row['claimtype'] || row['claim_type'] || row['case'] || null,
            status: row['status'] || 'Submitted',
            state: row['state'] || null,
            filedDate: row['fileddate'] || row['filed_date'] || row['date'] || null,
            notes: row['notes'] || null,
          },
        });
        updated++;
      } else {
        await prisma.claimant.create({
          data: {
            trackingId,
            firstName,
            lastName,
            email,
            phone: row['phone'] || null,
            claimType: row['claimtype'] || row['claim_type'] || row['case'] || null,
            status: row['status'] || 'Submitted',
            state: row['state'] || null,
            filedDate: row['fileddate'] || row['filed_date'] || row['date'] || null,
            notes: row['notes'] || null,
          },
        });
        imported++;
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      errors.push(`Row ${i + 1}: ${err.message || 'Unknown error'}`);
    }
  }

  return NextResponse.json({ imported, updated, errors, totalErrors: errors.length, success: true });
}
