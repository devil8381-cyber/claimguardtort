import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 10);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { referrerName, referrerEmail, referrerPhone, referralFirst, referralLast, referralPhone, claimType } = body;

    if (!referrerName || !referrerEmail || !referralFirst || !referralLast || !referralPhone) {
      return NextResponse.json({ error: 'All required fields must be filled in.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referrerEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const referral = await db.referral.create({
      data: {
        referrerName: referrerName.trim(),
        referrerEmail: referrerEmail.trim().toLowerCase(),
        referrerPhone: referrerPhone ? referrerPhone.trim() : null,
        referralFirst: referralFirst.trim(),
        referralLast: referralLast.trim(),
        referralPhone: referralPhone.trim(),
        claimType: claimType ? claimType.trim() : null,
        status: 'Pending',
        payoutAmount: '5000',
        paidOut: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Thank you, ${referrerName.split(' ')[0]}! Your referral for ${referralFirst} ${referralLast} has been submitted. If their case is approved, you'll receive a $5,000 payout!`,
      id: referral.id,
    });
  } catch (error) {
    console.error('Error submitting referral:', error);
    return NextResponse.json({ error: 'Failed to submit referral. Please try again.' }, { status: 500 });
  }
}

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const referrals = await db.referral.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    
    const total = await db.referral.count();
    const pending = await db.referral.count({ where: { status: 'Pending' } });
    const approved = await db.referral.count({ where: { status: 'Approved' } });
    const paid = await db.referral.count({ where: { paidOut: true } });
    const totalPayouts = await db.referral.aggregate({ _sum: { payoutAmount: true }, where: { paidOut: true } });
    
    return NextResponse.json({
      referrals,
      stats: {
        total,
        pending,
        approved,
        paid,
        totalPaidOut: totalPayouts._sum.payoutAmount ? Number(totalPayouts._sum.payoutAmount) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status, paidOut, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Referral ID is required' }, { status: 400 });
    }

    const VALID_STATUSES = ['Pending', 'Approved', 'Denied', 'Paid', 'Contacted', 'In Review'];
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updated = await db.referral.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paidOut !== undefined && { paidOut }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ success: true, referral: updated });
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json({ error: 'Failed to update referral' }, { status: 500 });
  }
}
