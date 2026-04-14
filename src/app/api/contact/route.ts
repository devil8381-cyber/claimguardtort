import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 5);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const claimId = formData.get('claimId') as string;
    const message = formData.get('message') as string;
    const contactMethod = formData.get('contactMethod') as string;
    const emailUpdates = formData.get('emailUpdates') === 'true';
    const smsAlerts = formData.get('smsAlerts') === 'true';
    const newsletter = formData.get('newsletter') === 'true';
    const files = formData.getAll('files') as File[];

    // Validation
    const errors: string[] = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }

    if (phone && typeof phone === 'string' && phone.trim() !== '') {
      if (!/^[\d\s\-\(\)\+]+$/.test(phone)) {
        errors.push('Please provide a valid phone number');
      }
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Check if claimant exists by claimId
    let claimantId: string | null = null;
    if (claimId && typeof claimId === 'string' && claimId.trim() !== '') {
      const existingClaim = await db.claim.findUnique({
        where: { trackingId: claimId.trim() },
        select: { claimantId: true },
      });
      if (existingClaim) {
        claimantId = existingClaim.claimantId;
      }
    }

    // Build file summary from uploaded files
    const fileNames = files.filter(f => f instanceof File).map(f => f.name).join(', ') || null;
    const totalSize = files.filter(f => f instanceof File).reduce((sum, f) => sum + f.size, 0);
    const fileSizeStr = files.length > 0 ? `${files.length} file(s), ${totalSize} bytes` : null;

    // Save message
    const contactMessage = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        claimId: claimId ? claimId.trim() : null,
        message: message.trim(),
        fileName: fileNames,
        fileSize: fileSizeStr,
        claimantId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. Our team will get back to you within 24 hours.',
        id: contactMessage.id,
        preferences: { emailUpdates, smsAlerts, newsletter },
        filesReceived: files.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
