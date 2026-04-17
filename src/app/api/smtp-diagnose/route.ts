import { NextResponse } from 'next/server';
import { getSmtpDiagnostics, verifySmtp, sendEmail, type EmailSender } from '@/lib/email';

/**
 * PUBLIC SMTP DIAGNOSTIC — no auth needed
 * GET  → check config + test admin@ SMTP connection
 * POST → send a real test email: { sender, to }
 */
export async function GET() {
  try {
    const diagnostics = getSmtpDiagnostics();
    const configuredCount = Object.values(diagnostics).filter(d => d.configured).length;
    const totalCount = Object.keys(diagnostics).length;

    let verifyResult: any = null;
    try { verifyResult = await verifySmtp('admin'); } catch (err: any) {
      verifyResult = { ok: false, error: String(err), details: 'Error' };
    }

    return NextResponse.json({
      status: configuredCount === totalCount ? 'ALL_CONFIGURED' : configuredCount > 0 ? 'PARTIAL' : 'NOT_CONFIGURED',
      configured: `${configuredCount}/${totalCount}`,
      accounts: diagnostics,
      adminTest: verifyResult,
      envVarsNeeded: [
        'SMTP_HOST', 'SMTP_PORT', 'EMAIL_DOMAIN',
        'SMTP_DONOTREPLY_USER', 'SMTP_DONOTREPLY_PASS',
        'SMTP_ADMIN_USER', 'SMTP_ADMIN_PASS',
        'SMTP_DOCUMENTATION_USER', 'SMTP_DOCUMENTATION_PASS',
        'SMTP_UPDATES_USER', 'SMTP_UPDATES_PASS',
        'SMTP_SUPPORT_USER', 'SMTP_SUPPORT_PASS',
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender, to } = body;
    const valid: EmailSender[] = ['donotreply', 'admin', 'documentation', 'updates', 'support'];
    const s: EmailSender = valid.includes(sender) ? sender : 'admin';
    const recipient = to || 'admin@claimguardtort.com';

    const diagnostics = getSmtpDiagnostics();
    const config = diagnostics[s];
    const verify = await verifySmtp(s);
    const result = await sendEmail(s, {
      to: recipient,
      subject: `SMTP Test from ${config.email}`,
      html: `<h2>Test Successful!</h2><div class="success-box"><strong>From:</strong> ${config.email}<br><strong>To:</strong> ${recipient}<br><strong>Time:</strong> ${new Date().toISOString()}</div><p>If you got this, SMTP is working!</p>`,
    });

    return NextResponse.json({ success: result.success, from: config.email, to: recipient, verify, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
