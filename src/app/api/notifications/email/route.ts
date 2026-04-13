import { NextRequest, NextResponse } from 'next/server';

// Email notification service (placeholder - integrate with Resend/SendGrid)
// To activate: set RESEND_API_KEY in .env and install resend package
// npm install resend
// Then replace the placeholder with actual Resend API calls

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message, type } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, message' }, { status: 400 });
    }

    // PLACEHOLDER: Log the email that would be sent
    console.log(`[EMAIL NOTIFICATION] Type: ${type || 'general'}, To: ${to}, Subject: ${subject}`);
    console.log(`[EMAIL NOTIFICATION] Body: ${message}`);

    // TODO: Uncomment below and install resend to enable real email sending
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // const { data, error } = await resend.emails.send({
    //   from: 'ClaimGuard Pro <notifications@claimguardpro.com>',
    //   to: [to],
    //   subject,
    //   html: message,
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'Email notification logged successfully. Set RESEND_API_KEY to enable real sending.',
      loggedAt: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process email notification' }, { status: 500 });
  }
}
