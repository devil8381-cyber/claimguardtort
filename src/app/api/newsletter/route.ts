import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 requests per minute per IP
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 3);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, claimType, updates, deadlines, tips } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check for duplicate
    const existing = await db.newsletter.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter.' },
        { status: 409 }
      );
    }

    // Store subscription
    const subscriber = await db.newsletter.create({
      data: {
        email: trimmedEmail,
        claimType: claimType ? String(claimType).trim() : null,
        updates: typeof updates === 'boolean' ? updates : true,
        deadlines: typeof deadlines === 'boolean' ? deadlines : true,
        tips: typeof tips === 'boolean' ? tips : true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'You have been successfully subscribed to the ClaimGuard Pro newsletter!',
        id: subscriber.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const subscribers = await db.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        claimType: true,
        updates: true,
        deadlines: true,
        tips: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
