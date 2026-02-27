import type { Request, Response } from "express";
import { env } from "../../config/env.js";

import {
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "../../config/constants.js";
import {
  clearGoogleOAuthStateCookie,
  clearCsrfCookie,
  clearRefreshCookie,
  setCsrfCookie,
  setRefreshCookie,
} from "../../utils/cookies.js";
import {
  loginUser,
  logoutUserSession,
  refreshUserSession,
  registerUser,
  type SessionMeta,
  issueTokensForUserId,
} from "./auth.service.js";

const getSessionMeta = (req: Request): SessionMeta => ({
  ipAddress: req.ip ?? null,
  userAgent: req.get("user-agent") ?? null,
});

export const registerHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const tokens = await registerUser(email, password, getSessionMeta(req));

  setRefreshCookie(res, tokens.refreshToken);
  setCsrfCookie(res, tokens.csrfToken);

  res.status(201).json({ accessToken: tokens.accessToken });
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const tokens = await loginUser(email, password, getSessionMeta(req));

  setRefreshCookie(res, tokens.refreshToken);
  setCsrfCookie(res, tokens.csrfToken);

  res.json({ accessToken: tokens.accessToken });
};

export const googleOAuthCallbackHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cookieState = req.cookies?.[GOOGLE_OAUTH_STATE_COOKIE_NAME] as
    | string
    | undefined;
  const queryState = typeof req.query.state === "string" ? req.query.state : undefined;

  if (!cookieState || !queryState || cookieState !== queryState) {
    clearGoogleOAuthStateCookie(res);
    res.redirect(`${env.FRONTEND_URL}/login?error=invalid_oauth_state`);
    return;
  }

  clearGoogleOAuthStateCookie(res);

  const user = req.user as { id: string; email: string } | undefined;

  if (!user) {
    res.redirect(`${env.FRONTEND_URL}/login?error=google_auth_failed`);
    return;
  }

  const tokens = await issueTokensForUserId(user.id, getSessionMeta(req));
  setRefreshCookie(res, tokens.refreshToken);
  setCsrfCookie(res, tokens.csrfToken);

  res.redirect(`${env.FRONTEND_URL}/dashboard`);
};

export const refreshHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

  if (!refreshToken) {
    res.status(401).json({ message: "Missing refresh token" });
    return;
  }

  const tokens = await refreshUserSession(refreshToken, getSessionMeta(req));

  setRefreshCookie(res, tokens.refreshToken);
  setCsrfCookie(res, tokens.csrfToken);

  res.json({ accessToken: tokens.accessToken });
};

export const logoutHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

  if (refreshToken) {
    await logoutUserSession(refreshToken);
  }

  clearRefreshCookie(res);
  clearCsrfCookie(res);
  res.status(204).send();
};
