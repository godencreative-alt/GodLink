import { Resend } from 'resend';

let resend: Resend | null = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendVerificationEmail(email: string, token: string) {
  const client = getResend();
  if (!client) {
    console.warn('Resend not configured, skipping verification email');
    return;
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'godl.ink <noreply@godl.ink>',
      to: email,
      subject: 'Verify your godl.ink account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F5B544;">Welcome to godl.ink</h1>
          <p>Click the button below to verify your email address and activate your account.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #F5B544; color: #0B0D17; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">Or copy this link: <br/><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p style="color: #666; font-size: 12px; margin-top: 40px;">If you did not create an account, you can safely ignore this email.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send verification email');
  }
}