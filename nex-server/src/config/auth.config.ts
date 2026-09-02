export const JWT_ISSUER = "nex-lms-api";
export const JWT_AUDIENCE = "nex-lms-client";

function readPositiveInteger(
  variableName: string,
  fallbackValue: number,
): number {
  const value = Number(
    process.env[variableName] ?? fallbackValue,
  );

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      `${variableName} must be a positive integer.`,
    );
  }

  return value;
}

export function getJwtAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_ACCESS_SECRET must contain at least 32 characters.",
    );
  }

  return secret;
}

export function getAccessTokenLifetimeSeconds() {
  return readPositiveInteger(
    "JWT_ACCESS_EXPIRES_IN_SECONDS",
    900,
  );
}

export function getRefreshTokenLifetimeDays() {
  return readPositiveInteger(
    "REFRESH_TOKEN_EXPIRES_IN_DAYS",
    30,
  );
}

export function getPasswordResetLifetimeMinutes() {
  return readPositiveInteger(
    "PASSWORD_RESET_EXPIRES_IN_MINUTES",
    15,
  );
}

export function getRefreshTokenExpiresAt() {
  const milliseconds =
    getRefreshTokenLifetimeDays() *
    24 *
    60 *
    60 *
    1000;

  return new Date(Date.now() + milliseconds);
}

export function getPasswordResetExpiresAt() {
  const milliseconds =
    getPasswordResetLifetimeMinutes() *
    60 *
    1000;

  return new Date(Date.now() + milliseconds);
}

export function getFrontendUrl(): string {
  return (
    process.env.FRONTEND_URL ??
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}