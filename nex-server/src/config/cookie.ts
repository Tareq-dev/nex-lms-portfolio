import type {
  CookieOptions,
} from "express";
import { env } from "./env.js";

export const ACCESS_TOKEN_COOKIE_NAME =
  "nex_lms_access_token";

export const REFRESH_TOKEN_COOKIE_NAME =
  "nex_lms_refresh_token";

function getBaseCookieOptions():
  CookieOptions {
  const isProduction =
    env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
      ? "none"
      : "lax",
  };
}

export function getAccessCookieOptions():
  CookieOptions {
  return {
    ...getBaseCookieOptions(),
    path: "/",
    maxAge:
      env.JWT_ACCESS_EXPIRES_IN_SECONDS *
      1000,
  };
}

export function getRefreshCookieOptions():
  CookieOptions {
  return {
    ...getBaseCookieOptions(),
    path: "/api/v1/auth",
    maxAge:
      env.REFRESH_TOKEN_EXPIRES_IN_DAYS *
      24 *
      60 *
      60 *
      1000,
  };
}

export function getAccessCookieClearOptions():
  CookieOptions {
  return {
    ...getBaseCookieOptions(),
    path: "/",
  };
}

export function getRefreshCookieClearOptions():
  CookieOptions {
  return {
    ...getBaseCookieOptions(),
    path: "/api/v1/auth",
  };
}