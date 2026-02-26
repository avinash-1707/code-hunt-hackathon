import type { CookieOptions, Response } from "express";
import { env } from "../config/env.js";
import { REFRESH_COOKIE_NAME, CSRF_COOKIE_NAME } from "../config/constants.js";

const secure = env.NODE_ENV === "production";

const baseCookie: CookieOptions = {
  secure,
  sameSite: env.COOKIE_SAME_SITE,
  path: "/api/v1/auth",
};

export const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...baseCookie,
    httpOnly: true,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...baseCookie,
    httpOnly: true,
  });
};

export const setCsrfCookie = (res: Response, csrfToken: string): void => {
  res.cookie(CSRF_COOKIE_NAME, csrfToken, {
    ...baseCookie,
    httpOnly: false,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
};

export const clearCsrfCookie = (res: Response): void => {
  res.clearCookie(CSRF_COOKIE_NAME, {
    ...baseCookie,
    httpOnly: false,
  });
};
