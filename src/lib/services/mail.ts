import { Resend } from 'resend';

// Lazy initialization to avoid throwing at module load time when API key is missing
let resend: Resend | null = null;

const getResend = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

const getMyEmail = () =>
  process.env.NODE_ENV === 'production'
    ? 'no-reply@priashop.com'
    : 'onboarding@resend.dev';

const getDomain = () =>
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NEXT_PUBLIC_AUTH_TRUST_HOST;

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resendClient = getResend();
  if (!resendClient) {
    console.warn('Email service unavailable: RESEND_API_KEY not configured');
    return;
  }
  
  const confirmLink = `${getDomain()}/new-password?token=${token}`;

  await resendClient.emails.send({
    from: getMyEmail(),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href=${confirmLink}>here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const resendClient = getResend();
  if (!resendClient) {
    console.warn('Email service unavailable: RESEND_API_KEY not configured');
    return;
  }
  
  const confirmLink = `${getDomain()}/new-verification?token=${token}`;

  await resendClient.emails.send({
    from: getMyEmail(),
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const resendClient = getResend();
  if (!resendClient) {
    console.warn('Email service unavailable: RESEND_API_KEY not configured');
    return;
  }
  
  await resendClient.emails.send({
    from: getMyEmail(),
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}`,
  });
};
