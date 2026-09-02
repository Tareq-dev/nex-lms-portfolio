import nodemailer, {
  type Transporter,
} from "nodemailer";
import { env } from "../config/env.js";

let transporter: Transporter | null =
  null;

function createTransporter():
  Transporter | null {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
  } = env;

  const isConfigured =
    SMTP_HOST &&
    SMTP_USER &&
    SMTP_PASS &&
    SMTP_FROM;

  if (!isConfigured) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function getTransporter():
  Transporter | null {
  if (!transporter) {
    transporter = createTransporter();
  }

  return transporter;
}

export async function sendPasswordResetEmail(
  recipientEmail: string,
  resetUrl: string,
): Promise<void> {
  const emailTransporter =
    getTransporter();

  if (
    !emailTransporter ||
    !env.SMTP_FROM
  ) {
    if (env.NODE_ENV === "production") {
      throw new Error(
        "SMTP_CONFIGURATION_MISSING",
      );
    }

    console.log(
      "Development password reset URL:",
    );
    console.log(resetUrl);

    return;
  }

  await emailTransporter.sendMail({
    from: env.SMTP_FROM,
    to: recipientEmail,
    subject:
      "Reset your NEX-LMS password",

    text: [
      "You requested a password reset.",
      "",
      `Reset your password: ${resetUrl}`,
      "",
      "This link will expire soon.",
      "Ignore this email if you did not request it.",
    ].join("\n"),

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Reset your NEX-LMS password</h2>

        <p>
          You requested a password reset.
        </p>

        <p>
          <a href="${resetUrl}">
            Reset Password
          </a>
        </p>

        <p>
          This link will expire soon.
        </p>

        <p>
          Ignore this email if you did not request it.
        </p>
      </div>
    `,
  });
}