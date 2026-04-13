import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, claimId, message, fileName, fileSize } = body;

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
      // Basic phone format validation
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

    // Save message
    const contactMessage = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        claimId: claimId ? claimId.trim() : null,
        message: message.trim(),
        fileName: fileName && typeof fileName === 'string' ? fileName.trim() : null,
        fileSize: fileSize && typeof fileSize === 'string' ? fileSize.trim() : null,
        claimantId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. Our team will get back to you within 24 hours.',
        id: contactMessage.id,
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
