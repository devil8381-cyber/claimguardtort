import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API routes
  if (pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token !== ADMIN_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized. Valid admin token required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/admin/:path*',
};
