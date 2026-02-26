import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { REFRESH_COOKIE_NAME } from "../../config/constants.js";
import { clearCsrfCookie, clearRefreshCookie, setCsrfCookie, setRefreshCookie } from "../../utils/cookies.js";

const service = new AuthService();

const sessionMeta = (req: Request) => ({
  ipAddress: req.ip ?? null,
  userAgent: req.get("user-agent") ?? null,
});

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };
    const tokens = await service.register(email, password, sessionMeta(req));

    setRefreshCookie(res, tokens.refreshToken);
    setCsrfCookie(res, tokens.csrfToken);

    res.status(201).json({ accessToken: tokens.accessToken });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };
    const tokens = await service.login(email, password, sessionMeta(req));

    setRefreshCookie(res, tokens.refreshToken);
    setCsrfCookie(res, tokens.csrfToken);

    res.json({ accessToken: tokens.accessToken });
  }

  async google(req: Request, res: Response): Promise<void> {
    const { idToken } = req.body as { idToken: string };
    const tokens = await service.loginWithGoogle(idToken, sessionMeta(req));

    setRefreshCookie(res, tokens.refreshToken);
    setCsrfCookie(res, tokens.csrfToken);

    res.json({ accessToken: tokens.accessToken });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

    if (!refreshToken) {
      res.status(401).json({ message: "Missing refresh token" });
      return;
    }

    const tokens = await service.refresh(refreshToken, sessionMeta(req));

    setRefreshCookie(res, tokens.refreshToken);
    setCsrfCookie(res, tokens.csrfToken);

    res.json({ accessToken: tokens.accessToken });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

    if (refreshToken) {
      await service.logout(refreshToken);
    }

    clearRefreshCookie(res);
    clearCsrfCookie(res);
    res.status(204).send();
  }
}
