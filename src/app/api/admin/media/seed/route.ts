import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { existsSync, copyFileSync, mkdirSync } from 'fs';
import path from 'path';

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;
  const xAdmin = request.headers.get('x-admin-token');
  return xAdmin === ADMIN_TOKEN;
}

// Media items that exist in public/ and should be seeded into the DB
// key = unique identifier used in frontend code, filePath = relative to public/
const SEED_ITEMS = [
  // Hero
  { key: 'hero-bg', category: 'hero', filePath: 'hero-bg.png', fileName: 'hero-bg.png', alt: 'ClaimGuard Pro hero background', title: 'Hero Background', mediaType: 'image' },

  // Team members
  { key: 'team-sarah', category: 'team', filePath: 'team/sarah.jpg', fileName: 'sarah.jpg', alt: 'Sarah Mitchell - Founder', title: 'Sarah Mitchell', mediaType: 'image' },
  { key: 'team-david', category: 'team', filePath: 'team/david.jpg', fileName: 'david.jpg', alt: 'David Chen - Senior Claims Analyst', title: 'David Chen', mediaType: 'image' },
  { key: 'team-jessica', category: 'team', filePath: 'team/jessica.jpg', fileName: 'jessica.jpg', alt: 'Jessica Rodriguez - Client Relations', title: 'Jessica Rodriguez', mediaType: 'image' },
  { key: 'team-michael', category: 'team', filePath: 'team/michael.jpg', fileName: 'michael.jpg', alt: 'Michael Thompson - Document Specialist', title: 'Michael Thompson', mediaType: 'image' },
  { key: 'team-emily', category: 'team', filePath: 'team/emily.jpg', fileName: 'emily.jpg', alt: 'Emily Watson - Legal Strategy Advisor', title: 'Emily Watson', mediaType: 'image' },
  { key: 'team-marcus', category: 'team', filePath: 'team/marcus.jpg', fileName: 'marcus.jpg', alt: 'Marcus Johnson - Technology Director', title: 'Marcus Johnson', mediaType: 'image' },

  // Success stories
  { key: 'success-story-1', category: 'success', filePath: 'images/success-story-1.jpg', fileName: 'success-story-1.jpg', alt: 'Camp Lejeune success story', title: 'Camp Lejeune Victory', mediaType: 'image', sortOrder: 1 },
  { key: 'success-story-2', category: 'success', filePath: 'images/success-story-2.jpg', fileName: 'success-story-2.jpg', alt: 'Roundup success story', title: 'Roundup Settlement', mediaType: 'image', sortOrder: 2 },
  { key: 'success-story-3', category: 'success', filePath: 'images/success-story-3.jpg', fileName: 'success-story-3.jpg', alt: 'Talcum Powder success story', title: 'Talcum Powder Claim', mediaType: 'image', sortOrder: 3 },
  { key: 'success-story-4', category: 'success', filePath: 'images/success-story-4.jpg', fileName: 'success-story-4.jpg', alt: 'Hernia Mesh success story', title: 'Hernia Mesh Recovery', mediaType: 'image', sortOrder: 4 },
  { key: 'success-story-5', category: 'success', filePath: 'images/success-story-5.jpg', fileName: 'success-story-5.jpg', alt: 'Paraquat success story', title: 'Paraquat Compensation', mediaType: 'image', sortOrder: 5 },
  { key: 'success-story-6', category: 'success', filePath: 'images/success-story-6.jpg', fileName: 'success-story-6.jpg', alt: '3M Earplugs success story', title: '3M Earplugs Settlement', mediaType: 'image', sortOrder: 6 },

  // Testimonials
  { key: 'testimonial-maria', category: 'testimonials', filePath: 'testimonials/maria.jpg', fileName: 'maria.jpg', alt: 'Maria S.', title: 'Maria S.', mediaType: 'image' },
  { key: 'testimonial-david', category: 'testimonials', filePath: 'testimonials/david.jpg', fileName: 'david.jpg', alt: 'David W.', title: 'David W.', mediaType: 'image' },
  { key: 'testimonial-angela', category: 'testimonials', filePath: 'testimonials/angela.jpg', fileName: 'angela.jpg', alt: 'Angela T.', title: 'Angela T.', mediaType: 'image' },
  { key: 'testimonial-james', category: 'testimonials', filePath: 'testimonials/james.jpg', fileName: 'james.jpg', alt: 'James R.', title: 'James R.', mediaType: 'image' },
  { key: 'testimonial-patricia', category: 'testimonials', filePath: 'testimonials/patricia.jpg', fileName: 'patricia.jpg', alt: 'Patricia M.', title: 'Patricia M.', mediaType: 'image' },
  { key: 'testimonial-robert', category: 'testimonials', filePath: 'testimonials/robert.jpg', fileName: 'robert.jpg', alt: 'Robert L.', title: 'Robert L.', mediaType: 'image' },

  // Blog thumbnails
  { key: 'blog-camp-lejeune', category: 'blog', filePath: 'blog/camp-lejeune.jpg', fileName: 'camp-lejeune.jpg', alt: 'Camp Lejeune article', title: 'Camp Lejeune Water Contamination', mediaType: 'image' },
  { key: 'blog-roundup', category: 'blog', filePath: 'blog/roundup.jpg', fileName: 'roundup.jpg', alt: 'Roundup article', title: 'Roundup Settlement Guide', mediaType: 'image' },
  { key: 'blog-documentation', category: 'blog', filePath: 'blog/documentation.jpg', fileName: 'documentation.jpg', alt: 'Documentation guide article', title: 'Documentation Guide', mediaType: 'image' },
  { key: 'blog-nec-formula', category: 'blog', filePath: 'blog/nec-formula.jpg', fileName: 'nec-formula.jpg', alt: 'NEC Baby Formula article', title: 'NEC Baby Formula Claims', mediaType: 'image' },
  { key: 'blog-depo-provera', category: 'blog', filePath: 'blog/depo-provera.jpg', fileName: 'depo-provera.jpg', alt: 'Depo Provera article', title: 'Depo Provera Claims', mediaType: 'image' },

  // About & Contact
  { key: 'about-team', category: 'about', filePath: 'about-team.jpg', fileName: 'about-team.jpg', alt: 'ClaimGuard Pro team photo', title: 'Our Team', mediaType: 'image' },
  { key: 'contact-office', category: 'contact', filePath: 'contact-office.jpg', fileName: 'contact-office.jpg', alt: 'ClaimGuard Pro office', title: 'Our Office', mediaType: 'image' },

  // General / Branding
  { key: 'logo', category: 'branding', filePath: 'logo.png', fileName: 'logo.png', alt: 'ClaimGuard Pro Logo', title: 'Company Logo', mediaType: 'image' },
  { key: 'logo-svg', category: 'branding', filePath: 'logo.svg', fileName: 'logo.svg', alt: 'ClaimGuard Pro Logo SVG', title: 'Company Logo SVG', mediaType: 'image' },
  { key: 'referral-reward', category: 'referral', filePath: 'images/referral-reward.png', fileName: 'referral-reward.png', alt: 'Referral reward illustration', title: 'Referral Reward', mediaType: 'image' },
  { key: 'og-image', category: 'branding', filePath: 'og-image.png', fileName: 'og-image.png', alt: 'ClaimGuard Pro Open Graph image', title: 'OG Image', mediaType: 'image' },
];

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'media');

// POST /api/admin/media/seed — seed existing public/ images into the media DB
export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  let created = 0;
  let skipped = 0;
  let copied = 0;
  const errors: string[] = [];

  for (const item of SEED_ITEMS) {
    try {
      // Check if already in DB
      const existing = await prisma.mediaItem.findUnique({ where: { key: item.key } });
      if (existing) {
        skipped++;
        continue;
      }

      // Check if file exists in public/
      const publicPath = path.join(PUBLIC_DIR, item.filePath);
      const fileExists = existsSync(publicPath);

      let storedFilePath = item.filePath;
      let fileSize = 0;

      if (fileExists) {
        // Copy file to uploads/ so it's managed from one place
        storedFilePath = `${item.key}${path.extname(item.filePath)}`;
        const destPath = path.join(UPLOAD_DIR, storedFilePath);
        copyFileSync(publicPath, destPath);
        copied++;

        try {
          const { statSync } = await import('fs');
          fileSize = statSync(destPath).size;
        } catch { /* ignore */ }
      }

      await prisma.mediaItem.create({
        data: {
          key: item.key,
          category: item.category,
          filePath: storedFilePath,
          fileName: item.fileName,
          alt: item.alt,
          title: item.title,
          mediaType: item.mediaType || 'image',
          sortOrder: (item as { sortOrder?: number }).sortOrder || 0,
          fileSize,
          mimeType: '', // Will be served correctly by ext
        },
      });
      created++;
    } catch (e: unknown) {
      const err = e as { message?: string };
      errors.push(`${item.key}: ${err.message || 'unknown'}`);
    }
  }

  return NextResponse.json({
    success: true,
    created,
    skipped,
    copied,
    errors,
    total: SEED_ITEMS.length,
  });
}
