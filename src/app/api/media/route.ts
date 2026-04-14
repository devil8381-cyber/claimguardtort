import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/media — public endpoint returning all media as a key->url map
// Used by the frontend to resolve media keys to URLs
export async function GET() {
  try {
    const items = await prisma.mediaItem.findMany({
      select: { key: true, filePath: true, alt: true, title: true, mediaType: true, category: true, sortOrder: true },
      orderBy: { key: 'asc' },
    });

    // Build a map: key -> { url, alt, title, mediaType, category }
    const map: Record<string, { url: string; alt: string; title: string; mediaType: string; category: string; sortOrder: number }> = {};
    for (const item of items) {
      map[item.key] = {
        url: `/api/media/file?path=${encodeURIComponent(item.filePath)}`,
        alt: item.alt,
        title: item.title,
        mediaType: item.mediaType,
        category: item.category,
        sortOrder: item.sortOrder,
      };
    }

    return NextResponse.json(map);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}
