import { NextRequest, NextResponse } from 'next/server';

// SMS notification service (placeholder - integrate with Twilio)
// To activate: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env
// npm install twilio

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, type } = body;

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing required fields: to, message' }, { status: 400 });
    }

    // Validate phone number format (basic)
    if (!/^[\d\s\-\+\(\)]{7,20}$/.test(to)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // PLACEHOLDER: Log the SMS that would be sent
    console.log(`[SMS NOTIFICATION] Type: ${type || 'general'}, To: ${to}`);
    console.log(`[SMS NOTIFICATION] Body: ${message}`);

    // TODO: Uncomment below and install twilio to enable real SMS sending
    // import Twilio from 'twilio';
    // const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // const result = await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: to,
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'SMS notification logged successfully. Set TWILIO credentials to enable real sending.',
      loggedAt: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process SMS notification' }, { status: 500 });
  }
}
