import type {
  Request,
  Response,
} from "express";
import { sendSuccess } from "../../common/http/api-response.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  getAccessCookieClearOptions,
  getAccessCookieOptions,
  getRefreshCookieClearOptions,
  getRefreshCookieOptions,
} from "../../config/cookie.js";
import { getValidated } from "../../middlewares/validate-request.js";
import {
  changeUserPassword,
  loginUser,
  refreshAuthentication,
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
  revokeRefreshSession,
} from "./auth.service.js";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./auth.validation.js";

function setAuthenticationCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    getAccessCookieOptions(),
  );

  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    getRefreshCookieOptions(),
  );
}

function clearAuthenticationCookies(
  res: Response,
): void {
  res.clearCookie(
    ACCESS_TOKEN_COOKIE_NAME,
    getAccessCookieClearOptions(),
  );

  res.clearCookie(
    REFRESH_TOKEN_COOKIE_NAME,
    getRefreshCookieClearOptions(),
  );
}

export async function register(
  _req: Request,
  res: Response,
): Promise<void> {
  const input =
    getValidated<RegisterInput>(
      res,
      "body",
    );

  const user = await registerUser(input);

  sendSuccess(res, {
    statusCode: 201,
    message:
      "Account created successfully.",
    data: {
      user,
    },
  });
}

export async function login(
  _req: Request,
  res: Response,
): Promise<void> {
  const input =
    getValidated<LoginInput>(
      res,
      "body",
    );

  const result = await loginUser(input);

  setAuthenticationCookies(
    res,
    result.accessToken,
    result.refreshToken,
  );

  sendSuccess(res, {
    message: "Login successful.",
    data: {
      user: result.user,
    },
  });
}

export async function refreshAccessToken(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken =
    req.cookies?.[
      REFRESH_TOKEN_COOKIE_NAME
    ];

  if (
    typeof refreshToken !== "string" ||
    !refreshToken
  ) {
    throw new Error(
      "INVALID_REFRESH_TOKEN",
    );
  }

  const result =
    await refreshAuthentication(
      refreshToken,
    );

  setAuthenticationCookies(
    res,
    result.accessToken,
    result.refreshToken,
  );

  sendSuccess(res, {
    message:
      "Authentication refreshed successfully.",
    data: {
      user: result.user,
    },
  });
}

export async function logout(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken =
    req.cookies?.[
      REFRESH_TOKEN_COOKIE_NAME
    ];

  if (
    typeof refreshToken === "string" &&
    refreshToken
  ) {
    await revokeRefreshSession(
      refreshToken,
    );
  }

  clearAuthenticationCookies(res);

  sendSuccess(res, {
    message: "Logout successful.",
    data: null,
  });
}

export async function forgotPassword(
  _req: Request,
  res: Response,
): Promise<void> {
  const input =
    getValidated<ForgotPasswordInput>(
      res,
      "body",
    );

  await requestPasswordReset(
    input,
  );

  sendSuccess(res, {
    message:
      "If an account exists, a password reset link has been sent.",
    data: null,
  });
}

export async function resetPassword(
  _req: Request,
  res: Response,
): Promise<void> {
  const input =
    getValidated<ResetPasswordInput>(
      res,
      "body",
    );

  await resetPasswordWithToken(input);

  clearAuthenticationCookies(res);

  sendSuccess(res, {
    message:
      "Password reset successfully. Please login again.",
    data: null,
  });
}

export async function changePassword(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) {
    throw new Error("UNAUTHENTICATED");
  }

  const input =
    getValidated<ChangePasswordInput>(
      res,
      "body",
    );

  await changeUserPassword(
    req.user.id,
    input,
  );

  clearAuthenticationCookies(res);

  sendSuccess(res, {
    message:
      "Password changed successfully. Please login again.",
    data: null,
  });
}

export async function getMe(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) {
    throw new Error("UNAUTHENTICATED");
  }

  sendSuccess(res, {
    message:
      "Authenticated user retrieved successfully.",
    data: {
      user: req.user,
    },
  });
}