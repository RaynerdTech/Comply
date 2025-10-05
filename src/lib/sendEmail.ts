// lib/sendEmail.ts
import fetch from "node-fetch";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM = process.env.RESEND_FROM!;

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
  const body = {
    from: FROM,
    to,
    subject: "Verify your Complyn account",
    html: `
      <p>Welcome to Complyn 👋</p>
      <p>Click the link below to verify your email and activate your company account:</p>
      <p><a href="${verifyUrl}">Verify email</a></p>
      <p>If that link doesn't work, copy and paste this URL into your browser:</p>
      <pre>${verifyUrl}</pre>
    `,
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${res.status} ${text}`);
  }
}
