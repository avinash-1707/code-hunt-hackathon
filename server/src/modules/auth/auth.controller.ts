import type { Request, Response } from "express";
import { REFRESH_COOKIE_NAME } from "../../config/constants.js";
import { AppError } from "../../core/errors.js";
import {
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
} from "./auth.service.js";

const getSessionMeta = (req: Request): SessionMeta => ({
  ipAddress: req.ip ?? null,
  userAgent: req.get("user-agent") ?? null,
});

export const registerHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };
  const tokens = await registerUser(name, email, password, getSessionMeta(req));

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

export const refreshHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

  if (!refreshToken) {
    throw new AppError(401, "Missing refresh token");
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
    try {
      await logoutUserSession(refreshToken);
    } catch (error: unknown) {
      if (!(error instanceof AppError) || error.statusCode !== 401) {
        throw error;
      }
    }
  }

  clearRefreshCookie(res);
  clearCsrfCookie(res);
  res.status(204).send();
};
