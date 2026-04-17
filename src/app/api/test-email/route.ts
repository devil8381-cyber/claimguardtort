import { NextResponse } from 'next/server';
import {
  sendOtpEmail,
  sendWelcomeEmail,
  sendDocumentFollowUp,
  sendClaimUpdate,
  sendContactAutoReply,
  sendPasswordReset,
  sendDeadlineReminder,
  sendNewsletterConfirmation,
  sendReferralConfirmation,
} from '@/lib/email';

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'claimguard-admin-2025';

function auth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export async function POST(request: Request) {
  if (!auth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, to } = body;

    if (!type || !to) {
      return NextResponse.json({ error: 'Missing: type and to (recipient email)' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'otp':
        result = await sendOtpEmail(to, '123456', 'account verification');
        break;
      case 'welcome':
        result = await sendWelcomeEmail(to, 'Maria');
        break;
      case 'document_followup':
        result = await sendDocumentFollowUp(to, 'CG-2024-TEST', ['Medical Records', 'Proof of Residence'], 'May 1, 2025');
        break;
      case 'claim_update':
        result = await sendClaimUpdate(to, 'CG-2024-TEST', 'Under Review', 'Your claim is being reviewed by our team.', 'Wait for the review to complete.');
        break;
      case 'contact_reply':
        result = await sendContactAutoReply(to, 'Maria', 'TEST-001');
        break;
      case 'password_reset':
        result = await sendPasswordReset(to, 'https://claimguardtort.com/reset?token=test123');
        break;
      case 'deadline_reminder':
        result = await sendDeadlineReminder(to, 'CG-2024-TEST', 'Camp Lejeune', 'June 30, 2025', ['Medical records', 'Service records']);
        break;
      case 'newsletter':
        result = await sendNewsletterConfirmation(to, 'Camp Lejeune');
        break;
      case 'referral':
        result = await sendReferralConfirmation(to, 'John Smith', '5,000');
        break;
      default:
        return NextResponse.json({
          error: `Unknown type. Use one of: otp, welcome, document_followup, claim_update, contact_reply, password_reset, deadline_reminder, newsletter, referral`,
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      type,
      sentTo: to,
      result,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
