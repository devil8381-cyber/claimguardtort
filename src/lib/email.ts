/* ═══════════════════════════════════════════════════════════════
   EMAIL SYSTEM FOR CLAIMGUARD TORT — RESEND API (NO npm package)
   
   Uses Resend REST API via fetch() — NO nodemailer, NO resend package.
   Works on ALL cloud platforms (HTTPS port 443 only).
   Railway blocks SMTP ports (25/465/587) but HTTPS always works.
   
   ALL emails send from: donotreply@claimguardtort.com
   ═══════════════════════════════════════════════════════════════ */

const DOMAIN = process.env.EMAIL_DOMAIN || 'claimguardtort.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

const FROM_EMAIL = `"ClaimGuard Tort" <donotreply@${DOMAIN}>`;

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export function getSmtpDiagnostics() {
  const keySet = RESEND_API_KEY.length > 0;
  return {
    configured: keySet,
    email: `donotreply@${DOMAIN}`,
    user: 'Resend API',
    passSet: keySet,
    host: 'api.resend.com',
    port: 443,
  };
}

export async function verifySmtp() {
  if (!RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY_NOT_SET', details: 'RESEND_API_KEY env var is missing. Add it in Railway Variables.' };
  }
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: 'RESEND_API_ERROR', details: `Resend API error: ${data.message || res.status}` };
    }
    const count = data?.data?.length || 0;
    return { ok: true, details: `Resend API working for donotreply@${DOMAIN} — ${count} domain(s) registered` };
  } catch (err: any) {
    return { ok: false, error: err.code || err.message || String(err), details: 'Failed to reach Resend API' };
  }
}

export async function sendEmail(options: SendEmailOptions) {
  const toList = Array.isArray(options.to) ? options.to : [options.to];

  console.log(`[EMAIL] Sending from donotreply@${DOMAIN} to ${options.to}`);
  console.log(`[EMAIL] Provider: Resend API, Key set: ${RESEND_API_KEY ? 'YES' : 'NO'}`);

  if (!RESEND_API_KEY) {
    console.error('[EMAIL BLOCKED] RESEND_API_KEY not set. Add it in Railway Variables.');
    return { success: false, error: 'RESEND_API_KEY env var is missing. Add it in Railway Variables.' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: toList,
        subject: options.subject,
        html: options.html,
        text: options.text || stripHtml(options.html),
        reply_to: options.replyTo || `donotreply@${DOMAIN}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[EMAIL FAILED] ${data.name || 'Error'}: ${data.message}`);
      return { success: false, error: `${data.name || 'RESEND_ERROR'}: ${data.message}` };
    }

    console.log(`[EMAIL SENT] ✅ From: donotreply@${DOMAIN}, To: ${options.to}, ID: ${data.id}`);
    return { success: true, messageId: data.id, response: `Resend: ${data.id}` };
  } catch (error: any) {
    console.error(`[EMAIL FAILED] ${error.message || String(error)}`);
    return { success: false, error: `FETCH_ERROR: ${error.message || String(error)}` };
  }
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL TEMPLATES
   ═══════════════════════════════════════════════════════════════ */

const BRAND_COLORS = {
  primary: '#1e40af',
  secondary: '#f59e0b',
  dark: '#111827',
  light: '#f9fafb',
  gray: '#6b7280',
  border: '#e5e7eb',
  success: '#059669',
  danger: '#dc2626',
};

function emailWrapper(html: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${BRAND_COLORS.light}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: ${BRAND_COLORS.primary}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px; }
    .body { background-color: #ffffff; padding: 30px; border: 1px solid ${BRAND_COLORS.border}; border-top: none; }
    .body h2 { color: ${BRAND_COLORS.dark}; margin-top: 0; font-size: 20px; }
    .body p { color: ${BRAND_COLORS.dark}; line-height: 1.6; font-size: 15px; }
    .footer { background-color: ${BRAND_COLORS.dark}; padding: 20px 30px; text-align: center; border-radius: 0 0 12px 12px; }
    .footer p { color: rgba(255,255,255,0.6); font-size: 12px; margin: 0; }
    .footer a { color: ${BRAND_COLORS.secondary}; text-decoration: none; }
    .btn { display: inline-block; background-color: ${BRAND_COLORS.primary}; color: #ffffff !important; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 15px 0; }
    .btn:hover { background-color: #1e3a8a; }
    .highlight { background-color: #eff6ff; border-left: 4px solid ${BRAND_COLORS.primary}; padding: 12px 16px; margin: 15px 0; border-radius: 0 8px 8px 0; }
    .otp-code { font-size: 36px; font-weight: 700; color: ${BRAND_COLORS.primary}; text-align: center; padding: 20px; letter-spacing: 8px; background-color: #f0f5ff; border-radius: 12px; margin: 20px 0; }
    .warning { background-color: #fef3c7; border-left: 4px solid ${BRAND_COLORS.secondary}; padding: 12px 16px; margin: 15px 0; border-radius: 0 8px 8px 0; }
    .success-box { background-color: #ecfdf5; border-left: 4px solid ${BRAND_COLORS.success}; padding: 12px 16px; margin: 15px 0; border-radius: 0 8px 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ClaimGuard Tort</h1>
      <p>Fighting for Every Dollar You Deserve</p>
    </div>
    <div class="body">
      ${html}
    </div>
    <div class="footer">
      <p>ClaimGuard Tort | 1429 Walnut St, 14th Floor, Philadelphia, PA 19102</p>
      <p style="margin-top: 5px;">Phone: (484) 968-1529 | <a href="mailto:donotreply@claimguardtort.com">donotreply@claimguardtort.com</a></p>
      <p style="margin-top: 10px; font-size: 11px;">This email was sent by ClaimGuard Tort. If you did not request this, please ignore it.</p>
    </div>
  </div>
</body>
</html>`;
}

/* ─── 1. OTP EMAIL ─── */
export async function sendOtpEmail(to: string, otp: string, purpose: string = 'verification') {
  const html = `
    <h2>Verification Code</h2>
    <p>Your one-time verification code for <strong>${purpose}</strong> is:</p>
    <div class="otp-code">${otp}</div>
    <div class="warning">
      <strong>This code expires in 10 minutes.</strong> Do not share this code with anyone. If you did not request this, please ignore this email.
    </div>
  `;
  return sendEmail({
    to,
    subject: `Your ClaimGuard Tort OTP: ${otp}`,
    html: emailWrapper(html, 'Verification Code'),
    text: `Your ClaimGuard Tort verification code is: ${otp}. This code expires in 10 minutes.`,
  });
}

/* ─── 2. WELCOME EMAIL ─── */
export async function sendWelcomeEmail(to: string, firstName: string, claimantTrackingId?: string, claimTrackingId?: string) {
  const trackingInfo = claimTrackingId
    ? `<div class="highlight"><strong>Your Claim Tracking ID:</strong> ${claimTrackingId}<br>${claimantTrackingId ? `<strong>Your Client ID:</strong> ${claimantTrackingId}` : ''}</div>`
    : '';
  const html = `
    <h2>Welcome to ClaimGuard Tort, ${firstName}!</h2>
    <p>Thank you for choosing ClaimGuard Tort. Our team is dedicated to helping you navigate the mass tort claims process with confidence and clarity.</p>
    ${trackingInfo}
    <div class="highlight">
      <strong>What happens next?</strong>
      <ul>
        <li>A dedicated specialist will be assigned to your case</li>
        <li>We'll review your eligibility and documents</li>
        <li>You'll receive regular updates on your claim progress</li>
        <li>Our team is available 24/7 for any questions</li>
      </ul>
    </div>
    <p>You can track your claim status anytime by visiting our website and entering your tracking ID in the "Track My Claim" section.</p>
    <p>Feel free to contact us if you have any questions at all. We're here to help every step of the way.</p>
    <p>Best regards,<br><strong>The ClaimGuard Tort Team</strong></p>
  `;
  return sendEmail({
    to,
    subject: claimTrackingId
      ? `Welcome to ClaimGuard Tort — Your Claim ${claimTrackingId} Has Been Received!`
      : 'Welcome to ClaimGuard Tort — Let\'s Get Started!',
    html: emailWrapper(html, 'Welcome'),
  });
}

/* ─── 3. DOCUMENT FOLLOW-UP ─── */
export async function sendDocumentFollowUp(to: string, claimId: string, missingDocs: string[], deadline?: string) {
  const docsList = missingDocs.map(d => `<li><strong>${d}</strong></li>`).join('');
  const html = `
    <h2>Action Required: Missing Documents</h2>
    <p>We're currently processing your claim <strong>${claimId}</strong>, but we need additional documents to move forward.</p>
    <div class="warning">
      <strong>Missing Documents:</strong>
      <ul>${docsList}</ul>
    </div>
    ${deadline ? `<div class="warning"><strong>Deadline: ${deadline}</strong> — Please submit these documents as soon as possible to avoid delays.</div>` : ''}
    <p>Visit our website or contact us with any questions. Our document specialists are ready to help you gather everything needed.</p>
  `;
  return sendEmail({
    to,
    subject: `Action Required: Missing Documents for Claim ${claimId}`,
    html: emailWrapper(html, 'Missing Documents'),
  });
}

/* ─── 4. CLAIM STATUS UPDATE ─── */
export async function sendClaimUpdate(to: string, claimId: string, newStatus: string, notes?: string, nextSteps?: string) {
  const statusColors: Record<string, string> = {
    'Under Review': BRAND_COLORS.primary,
    'Approved': BRAND_COLORS.success,
    'Denied': BRAND_COLORS.danger,
    'Correction Needed': BRAND_COLORS.secondary,
    'Pending': BRAND_COLORS.gray,
  };
  const statusColor = statusColors[newStatus] || BRAND_COLORS.gray;
  const html = `
    <h2>Your Claim Status Has Been Updated</h2>
    <div class="highlight" style="border-left-color: ${statusColor};">
      <strong>Claim ID:</strong> ${claimId}<br>
      <strong>New Status:</strong> <span style="color: ${statusColor}; font-weight: 700;">${newStatus}</span>
    </div>
    ${notes ? `<p>${notes}</p>` : ''}
    ${nextSteps ? `<div class="highlight"><strong>Next Steps:</strong><br>${nextSteps}</div>` : ''}
    <p>Track your claim anytime at <a href="https://claimguardtort.com/#track-claim" style="color: ${BRAND_COLORS.primary};">claimguardtort.com</a></p>
  `;
  return sendEmail({
    to,
    subject: `Claim ${claimId} — Status Updated: ${newStatus}`,
    html: emailWrapper(html, 'Claim Update'),
  });
}

/* ─── 5. CONTACT FORM AUTO-REPLY ─── */
export async function sendContactAutoReply(to: string, firstName: string, messageId?: string) {
  const html = `
    <h2>Thank You for Reaching Out!</h2>
    <p>Hi ${firstName}, we've received your message and a member of our team will get back to you within <strong>24 hours</strong>.</p>
    <div class="success-box">
      <strong>Your reference ID:</strong> ${messageId || 'N/A'}<br>
      Keep this for your records. You can reference this ID in any follow-up communications.
    </div>
    <p>While you wait, check out our <a href="https://claimguardtort.com/#faq" style="color: ${BRAND_COLORS.primary};">FAQ section</a> for answers to common questions.</p>
    <p>Best regards,<br>The ClaimGuard Tort Support Team</p>
  `;
  return sendEmail({
    to,
    subject: 'We Received Your Message — ClaimGuard Tort',
    html: emailWrapper(html, 'Message Received'),
  });
}

/* ─── 6. ADMIN NOTIFICATION — NEW CONTACT ─── */
export async function sendAdminNewContact(data: { name: string; email: string; phone?: string; message: string; claimId?: string }) {
  const html = `
    <h2>New Contact Form Submission</h2>
    <div class="highlight">
      <strong>Name:</strong> ${data.name}<br>
      <strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a><br>
      ${data.phone ? `<strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a><br>` : ''}
      ${data.claimId ? `<strong>Claim ID:</strong> ${data.claimId}<br>` : ''}
    </div>
    <div class="highlight">
      <strong>Message:</strong><br>
      ${data.message}
    </div>
  `;
  return sendEmail({
    to: `admin@${DOMAIN}`,
    subject: `New Contact: ${data.name}`,
    html: emailWrapper(html, 'New Contact'),
  });
}

/* ─── 7. NEWSLETTER SUBSCRIPTION CONFIRMATION ─── */
export async function sendNewsletterConfirmation(to: string, claimType?: string) {
  const html = `
    <h2>You're Subscribed!</h2>
    <p>Thank you for subscribing to the ClaimGuard Tort newsletter${claimType ? ` for <strong>${claimType}</strong> updates` : ''}.</p>
    <div class="success-box">
      <strong>What you'll receive:</strong>
      <ul>
        <li>Claim deadline reminders</li>
        <li>Settlement news and updates</li>
        <li>Tips for strengthening your claim</li>
        <li>Eligibility information for new cases</li>
      </ul>
    </div>
    <p>You can unsubscribe at any time by clicking the link at the bottom of any email.</p>
  `;
  return sendEmail({
    to,
    subject: 'Subscribed to ClaimGuard Tort Updates',
    html: emailWrapper(html, 'Newsletter Subscription'),
  });
}

/* ─── 8. REFERRAL CONFIRMATION ─── */
export async function sendReferralConfirmation(to: string, referralName: string, payoutAmount: string) {
  const html = `
    <h2>Referral Submitted Successfully!</h2>
    <p>Thank you for referring <strong>${referralName}</strong> to ClaimGuard Tort!</p>
    <div class="success-box">
      <strong>Potential Referral Bonus:</strong> $${payoutAmount}<br>
      If the referral results in an approved claim, you'll receive your payout within 30 days of case resolution.
    </div>
    <p>We'll keep you updated on the referral status. Thank you for helping others access the justice they deserve!</p>
  `;
  return sendEmail({
    to,
    subject: `Referral Confirmed: ${referralName}`,
    html: emailWrapper(html, 'Referral Submitted'),
  });
}

/* ─── 9. PASSWORD RESET ─── */
export async function sendPasswordReset(to: string, resetLink: string) {
  const html = `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="btn">Reset Password</a>
    </div>
    <div class="warning">
      <strong>This link expires in 1 hour.</strong> If you did not request this, you can safely ignore this email. Your password will remain unchanged.
    </div>
  `;
  return sendEmail({
    to,
    subject: 'Reset Your ClaimGuard Tort Password',
    html: emailWrapper(html, 'Password Reset'),
    text: `Reset your password here: ${resetLink}`,
  });
}

/* ─── 10. DEADLINE REMINDER ─── */
export async function sendDeadlineReminder(to: string, claimId: string, caseType: string, deadline: string, missingItems: string[]) {
  const itemsList = missingItems.map(d => `<li>${d}</li>`).join('');
  const html = `
    <h2>Deadline Reminder</h2>
    <div class="warning">
      <strong>Case:</strong> ${caseType}<br>
      <strong>Claim ID:</strong> ${claimId}<br>
      <strong>Deadline:</strong> ${deadline}
    </div>
    <p>The filing deadline for your claim is approaching. Please ensure the following items are submitted:</p>
    <ul>${itemsList}</ul>
    <p><strong>Don't miss your chance!</strong> Once a filing window closes, you may permanently lose your right to submit a claim.</p>
    <a href="https://claimguardtort.com/#contact" class="btn">Contact Us Now</a>
  `;
  return sendEmail({
    to,
    subject: `URGENT: Deadline Reminder for ${caseType} — ${deadline}`,
    html: emailWrapper(html, 'Deadline Reminder'),
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
