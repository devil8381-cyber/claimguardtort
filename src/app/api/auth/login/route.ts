import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { compare } from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const claimant = await db.claimant.findUnique({ where: { email: trimmedEmail } });

    if (!claimant || !claimant.password) {
      return NextResponse.json({ error: 'Invalid email or password. If you don\'t have an account, please register first.' }, { status: 401 });
    }

    // Verify password
    const valid = await compare(password, claimant.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate session token
    const sessionToken = randomUUID();
    await db.claimant.update({
      where: { id: claimant.id },
      data: { sessionToken },
    });

    // Get all claims for this user
    const claims = await db.claim.findMany({
      where: { claimantId: claimant.id },
      include: { history: { orderBy: { date: 'desc' } } },
      orderBy: { lastUpdated: 'desc' },
    });

    console.log(`[AUTH LOGIN] User logged in: ${trimmedEmail}`);

    return NextResponse.json({
      success: true,
      token: sessionToken,
      user: {
        id: claimant.id,
        trackingId: claimant.trackingId,
        firstName: claimant.firstName,
        lastName: claimant.lastName,
        email: claimant.email,
        emailVerified: claimant.emailVerified,
      },
      claims: claims.map(c => ({
        id: c.id,
        trackingId: c.trackingId,
        status: c.status,
        claimType: c.claimType,
        description: c.description,
        filedDate: c.filedDate,
        lastUpdated: c.lastUpdated,
        notes: c.notes,
        nextSteps: c.nextSteps,
        history: c.history.map(h => ({ status: h.status, notes: h.notes, date: h.date })),
      })),
    });
  } catch (error) {
    console.error('[AUTH LOGIN] Error:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
