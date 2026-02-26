import { OAuth2Client } from "google-auth-library";

import { prisma } from "../../prisma/client.js";
import { env } from "../../config/env.js";
import { AppError } from "../../core/errors.js";
import { newId, sha256 } from "../../utils/crypto.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { AuthProvider } from "../../generated/prisma/enums.js";
import type { User } from "../../generated/prisma/client.js";

type SessionMeta = {
  ipAddress: string | null;
  userAgent: string | null;
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
};

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export class AuthService {
  async register(
    email: string,
    password: string,
    meta: SessionMeta,
  ): Promise<TokenPair> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, "Email already in use");
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        provider: AuthProvider.LOCAL,
        emailVerified: false,
      },
    });

    return this.issueTokens(user, meta);
  }

  async login(
    email: string,
    password: string,
    meta: SessionMeta,
  ): Promise<TokenPair> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      throw new AppError(401, "Invalid credentials");
    }

    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
      throw new AppError(401, "Invalid credentials");
    }

    return this.issueTokens(user, meta);
  }

  async loginWithGoogle(
    idToken: string,
    meta: SessionMeta,
  ): Promise<TokenPair> {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.email_verified) {
      throw new AppError(401, "Invalid Google token");
    }

    const email = payload.email.toLowerCase().trim();
    const googleId = payload.sub;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          provider: AuthProvider.GOOGLE,
          googleId,
          emailVerified: true,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, provider: AuthProvider.GOOGLE, emailVerified: true },
      });
    }

    return this.issueTokens(user, meta);
  }

  async refresh(refreshToken: string, meta: SessionMeta): Promise<TokenPair> {
    const decoded = verifyRefreshToken(refreshToken);
    const jtiHash = sha256(decoded.jti);
    const now = new Date();

    const existing = await prisma.refreshToken.findUnique({
      where: { jtiHash },
      include: { user: true },
    });

    if (!existing || existing.expiresAt <= now) {
      throw new AppError(401, "Invalid refresh token");
    }

    if (existing.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { familyId: existing.familyId, revokedAt: null },
        data: { revokedAt: now },
      });

      throw new AppError(401, "Refresh token reuse detected");
    }

    const newJti = newId();
    const newJtiHash = sha256(newJti);
    const csrfToken = newId();
    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    const nextRefreshToken = signRefreshToken({
      sub: existing.userId,
      jti: newJti,
      familyId: existing.familyId,
    });

    await prisma.$transaction(async (tx: any) => {
      const updated = await tx.refreshToken.updateMany({
        where: { id: existing.id, revokedAt: null },
        data: {
          revokedAt: now,
          replacedByJtiHash: newJtiHash,
        },
      });

      if (updated.count !== 1) {
        throw new AppError(401, "Token rotation failed");
      }

      await tx.refreshToken.create({
        data: {
          userId: existing.userId,
          jtiHash: newJtiHash,
          familyId: existing.familyId,
          expiresAt,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        },
      });
    });

    return {
      accessToken: signAccessToken({
        sub: existing.user.id,
        email: existing.user.email,
      }),
      refreshToken: nextRefreshToken,
      csrfToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const decoded = verifyRefreshToken(refreshToken);
    const jtiHash = sha256(decoded.jti);

    await prisma.refreshToken.updateMany({
      where: { jtiHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueTokens(user: User, meta: SessionMeta): Promise<TokenPair> {
    const jti = newId();
    const familyId = newId();
    const csrfToken = newId();
    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, jti, familyId });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        jtiHash: sha256(jti),
        familyId,
        expiresAt,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    return {
      accessToken,
      refreshToken,
      csrfToken,
    };
  }
}
