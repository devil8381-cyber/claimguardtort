import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_TOKEN = 'claimguard-admin-2025';

function verifyAdmin(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${ADMIN_TOKEN}`;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx];
      });
      rows.push(row);
    }
  }

  return rows;
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only .csv files are supported. Please convert your file to CSV format.' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No valid data rows found in CSV. Make sure the first row contains column headers.' },
        { status: 400 }
      );
    }

    // Validate required columns
    const firstRow = rows[0];
    const hasRequired = firstRow.hasOwnProperty('first_name') && firstRow.hasOwnProperty('last_name');
    if (!hasRequired) {
      return NextResponse.json(
        {
          error: 'Missing required columns. CSV must have: first_name, last_name. Optional columns: tracking_id, email, phone, claim_type, status, state, filed_date, notes',
        },
        { status: 400 }
      );
    }

    let imported = 0;
    let updated = 0;
    const errors: string[] = [];

    // Get current year and next sequence number
    const year = new Date().getFullYear();
    const existingClaimants = await db.claimant.findMany({
      where: { trackingId: { startsWith: `CLM-${year}-` } },
      select: { trackingId: true },
    });

    let nextSeq = 1;
    existingClaimants.forEach(c => {
      if (c.trackingId) {
        const parts = c.trackingId.split('-');
        const seq = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(seq) && seq >= nextSeq) {
          nextSeq = seq + 1;
        }
      }
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // 1-indexed, accounting for header row

      try {
        const firstName = (row.first_name || '').trim();
        const lastName = (row.last_name || '').trim();

        if (!firstName || !lastName) {
          errors.push(`Row ${rowNum}: Missing first_name or last_name`);
          continue;
        }

        let trackingId = (row.tracking_id || '').trim();

        // Auto-generate tracking ID if not provided
        if (!trackingId) {
          trackingId = `CLM-${year}-${String(nextSeq).padStart(3, '0')}`;
          nextSeq++;
        } else if (!trackingId.startsWith('CLM-')) {
          errors.push(`Row ${rowNum}: Tracking ID "${trackingId}" must start with "CLM-"`);
          continue;
        }

        const validStatuses = ['Submitted', 'Validated', 'Under Review', 'Decision', 'Completed'];
        let status = (row.status || 'Submitted').trim();
        if (!validStatuses.includes(status)) {
          errors.push(`Row ${rowNum}: Invalid status "${status}". Using "Submitted" instead.`);
          status = 'Submitted';
        }

        const email = (row.email || '').trim();
        const phone = (row.phone || '').trim() || null;
        const claimType = (row.claim_type || '').trim() || null;
        const state = (row.state || '').trim() || null;
        const filedDate = (row.filed_date || '').trim() || null;
        const notes = (row.notes || '').trim() || null;

        // Upsert: check if trackingId already exists
        const existing = await db.claimant.findUnique({
          where: { trackingId },
        });

        if (existing) {
          await db.claimant.update({
            where: { trackingId },
            data: {
              firstName,
              lastName,
              email: email || existing.email,
              phone: phone ?? existing.phone,
              claimType: claimType ?? existing.claimType,
              status,
              state: state ?? existing.state,
              filedDate: filedDate ?? existing.filedDate,
              notes: notes ?? existing.notes,
            },
          });
          updated++;
        } else {
          await db.claimant.create({
            data: {
              trackingId,
              firstName,
              lastName,
              email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@imported.local`,
              phone,
              claimType,
              status,
              state,
              filedDate,
              notes,
            },
          });
          imported++;
        }
      } catch (err) {
        errors.push(`Row ${rowNum}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      updated,
      errors: errors.length > 0 ? errors.slice(0, 50) : [],
      totalErrors: errors.length,
    });
  } catch (error) {
    console.error('CSV upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}
