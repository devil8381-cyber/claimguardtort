import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'media');

// GET /api/media/file?path=filename — serve uploaded media file (public, no auth needed)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'File path required' }, { status: 400 });
  }

  // Prevent path traversal
  const sanitized = filePath.replace(/[^a-zA-Z0-9_.-]/g, '');
  if (!sanitized) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  const fullPath = path.join(UPLOAD_DIR, sanitized);

  if (!existsSync(fullPath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Verify the resolved path is within UPLOAD_DIR
  const resolvedPath = path.resolve(fullPath);
  const resolvedUploadDir = path.resolve(UPLOAD_DIR);
  if (!resolvedPath.startsWith(resolvedUploadDir + path.sep) && resolvedPath !== resolvedUploadDir) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const fileBuffer = await readFile(fullPath);

  // Determine content type
  const ext = path.extname(sanitized).toLowerCase();
  const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm',
    '.ogg': 'video/ogg',
  };
  const contentType = mimeMap[ext] || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}
