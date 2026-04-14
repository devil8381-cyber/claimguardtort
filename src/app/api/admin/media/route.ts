import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ADMIN_TOKEN = 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'media');
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function sanitize(str: string): string {
  return str.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

// GET /api/admin/media — list all media items (optionally filter by category)
export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const items = await prisma.mediaItem.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json(items);
}

// POST /api/admin/media — upload new media file
export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const key = (formData.get('key') as string || '').trim();
    const category = (formData.get('category') as string || 'general').trim();
    const alt = (formData.get('alt') as string || '').trim();
    const title = (formData.get('title') as string || '').trim();

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!key) return NextResponse.json({ error: 'Media key is required' }, { status: 400 });

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 20MB.' }, { status: 400 });
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif',
      'video/mp4', 'video/webm', 'video/ogg',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed. Use images (jpg, png, gif, webp, svg, avif) or videos (mp4, webm, ogg).' }, { status: 400 });
    }

    const existing = await prisma.mediaItem.findUnique({ where: { key } });
    if (existing) {
      return NextResponse.json({ error: `Key "${key}" already exists. Use update to replace.` }, { status: 409 });
    }

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const ext = path.extname(file.name) || `.${file.type.split('/')[1] || 'bin'}`;
    const safeName = sanitize(path.basename(file.name, ext)) + ext;
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const mediaType = file.type.startsWith('video') ? 'video' : 'image';

    const mediaItem = await prisma.mediaItem.create({
      data: {
        key,
        category,
        filePath: uniqueName,
        fileName: file.name,
        alt,
        title,
        mediaType,
        fileSize: file.size,
        mimeType: file.type,
        sortOrder: 0,
      },
    });

    return NextResponse.json(mediaItem, { status: 201 });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error('Media upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}

// PATCH /api/admin/media — update metadata or replace file
export async function PATCH(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const id = (formData.get('id') as string || '').trim();
    const file = formData.get('file') as File | null;

    if (!id) return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });

    const existing = await prisma.mediaItem.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Media not found' }, { status: 404 });

    const updateData: Record<string, unknown> = {};

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large. Maximum 20MB.' }, { status: 400 });
      }

      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif',
        'video/mp4', 'video/webm', 'video/ogg',
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'File type not allowed.' }, { status: 400 });
      }

      if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
      }

      const oldPath = path.join(UPLOAD_DIR, existing.filePath);
      try { const { unlink } = await import('fs/promises'); await unlink(oldPath); } catch { /* ignore */ }

      const ext = path.extname(file.name) || `.${file.type.split('/')[1] || 'bin'}`;
      const safeName = sanitize(path.basename(file.name, ext)) + ext;
      const uniqueName = `${Date.now()}-${safeName}`;
      const filePath = path.join(UPLOAD_DIR, uniqueName);

      const bytes = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));

      updateData.filePath = uniqueName;
      updateData.fileName = file.name;
      updateData.mediaType = file.type.startsWith('video') ? 'video' : 'image';
      updateData.fileSize = file.size;
      updateData.mimeType = file.type;
    }

    const key = (formData.get('key') as string || '').trim();
    const category = (formData.get('category') as string || '').trim();
    const alt = (formData.get('alt') as string || '').trim();
    const title = (formData.get('title') as string || '').trim();
    const sortOrder = formData.get('sortOrder');

    if (key && key !== existing.key) {
      const conflict = await prisma.mediaItem.findUnique({ where: { key } });
      if (conflict && conflict.id !== id) {
        return NextResponse.json({ error: `Key "${key}" already in use by another media item.` }, { status: 409 });
      }
      updateData.key = key;
    }
    if (category) updateData.category = category;
    if (alt !== undefined) updateData.alt = alt;
    if (title !== undefined) updateData.title = title;
    if (sortOrder !== null && sortOrder !== undefined && sortOrder !== '') updateData.sortOrder = parseInt(String(sortOrder), 10) || 0;

    const updated = await prisma.mediaItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error('Media update error:', err);
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

// DELETE /api/admin/media — delete a media item
export async function DELETE(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Media ID required' }, { status: 400 });

  const item = await prisma.mediaItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: 'Media not found' }, { status: 404 });

  const filePath = path.join(UPLOAD_DIR, item.filePath);
  try {
    const { unlink } = await import('fs/promises');
    await unlink(filePath);
  } catch { /* file might already be gone */ }

  await prisma.mediaItem.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
