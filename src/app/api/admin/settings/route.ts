import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'company-settings.json');

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

const DEFAULT_SETTINGS = {
  companyName: 'ClaimGuard Pro',
  phone: '(484) 968-1529',
  phoneHref: 'tel:4849681529',
  email: 'info@claimguardpro.com',
  emailHref: 'mailto:info@claimguardpro.com',
  address: '1429 Walnut St, 14th Floor, Philadelphia, PA 19102',
  privacyEmail: 'privacy@claimguardpro.com',
  legalEmail: 'legal@claimguardpro.com',
};

async function ensureSettingsFile() {
  const dir = path.dirname(SETTINGS_FILE);
  try { await fs.mkdir(dir, { recursive: true }); } catch { /* already exists */ }
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  }
}

async function readSettings() {
  await ensureSettingsFile();
  const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function writeSettings(data: typeof DEFAULT_SETTINGS) {
  await ensureSettingsFile();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const current = await readSettings();
    const updated = { ...current, ...body };
    if (body.phone) {
      updated.phoneHref = 'tel:' + body.phone.replace(/[^0-9]/g, '');
    }
    if (body.email) {
      updated.emailHref = 'mailto:' + body.email;
    }
    await writeSettings(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
