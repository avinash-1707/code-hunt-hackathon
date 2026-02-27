import { prisma } from "../../prisma/client.js";
import { env } from "../../config/env.js";
import { AppError } from "../../core/errors.js";
import { newId, sha256 } from "../../utils/crypto.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  type AppRole,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { AuthProvider } from "../../generated/prisma/enums.js";
import { Prisma, type User } from "../../generated/prisma/client.js";

export type SessionMeta = {
  ipAddress: string | null;
  userAgent: string | null;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
};

const asAuthError = (error: unknown, fallbackMessage: string): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (
    error instanceof Error &&
    error.message.includes("Invalid or expired token")
  ) {
    return new AppError(401, "Invalid or expired token");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new AppError(409, "Email already in use");
    }

    if (error.code === "P2021" || error.code === "P2022") {
      return new AppError(500, "Database schema is not up to date");
    }

    console.error(
      `[auth] Prisma known request error (${error.code}):`,
      error.message,
      error.meta,
    );
    return new AppError(500, "Database operation failed");
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("[auth] Prisma initialization error:", error.message);
    return new AppError(503, "Database is unavailable");
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("[auth] Prisma validation error:", error.message);
    return new AppError(400, "Invalid request data");
  }

  console.error("[auth] Unexpected auth error:", error);
  return new AppError(500, fallbackMessage);
};

const normalizeUserName = (user: {
  name: string | null;
  email: string;
}): string => {
  const trimmed = user.name?.trim();
  if (trimmed && trimmed.length > 0) return trimmed;

  return user.email.split("@")[0] ?? "User";
};

export const issueTokensForUser = async (
  user: User,
  meta: SessionMeta,
): Promise<TokenPair> => {
  const jti = newId();
  const familyId = newId();
  const csrfToken = newId();
  const expiresAt = new Date(
    Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  const userName = normalizeUserName({
    name: user.name ?? null,
    email: user.email,
  });

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    name: userName,
    role: user.role as AppRole,
  });
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
};

export const issueTokensForUserId = async (
  userId: string,
  meta: SessionMeta,
): Promise<TokenPair> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(401, "User not found");
  }

  return issueTokensForUser(user, meta);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  meta: SessionMeta,
): Promise<TokenPair> => {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, "Email already in use");
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        provider: AuthProvider.LOCAL,
        emailVerified: false,
      },
    });

    return issueTokensForUser(user, meta);
  } catch (error: unknown) {
    throw asAuthError(error, "Registration failed");
  }
};

export const loginUser = async (
  email: string,
  password: string,
  meta: SessionMeta,
): Promise<TokenPair> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      throw new AppError(401, "Invalid credentials");
    }

    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
      throw new AppError(401, "Invalid credentials");
    }

    return issueTokensForUser(user, meta);
  } catch (error: unknown) {
    throw asAuthError(error, "Login failed");
  }
};

export const refreshUserSession = async (
  refreshToken: string,
  meta: SessionMeta,
): Promise<TokenPair> => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const jtiHash = sha256(decoded.jti);
    const now = new Date();

    const existing = await prisma.refreshToken.findUnique({
      where: { jtiHash },
      include: { user: true },
    });

    if (!existing || existing.expiresAt <= now) {
      throw new AppError(401, "Invalid or expired refresh token");
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

    await prisma.$transaction(async (tx) => {
      const updated = await tx.refreshToken.updateMany({
        where: { id: existing.id, revokedAt: null },
        data: {
          revokedAt: now,
          replacedByJtiHash: newJtiHash,
        },
      });

      if (updated.count !== 1) {
        throw new AppError(401, "Session rotation failed");
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
        name: normalizeUserName({
          name: existing.user.name ?? null,
          email: existing.user.email,
        }),
        role: existing.user.role as AppRole,
      }),
      refreshToken: nextRefreshToken,
      csrfToken,
    };
  } catch (error: unknown) {
    throw asAuthError(error, "Session refresh failed");
  }
};

export const logoutUserSession = async (
  refreshToken: string,
): Promise<void> => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const jtiHash = sha256(decoded.jti);

    await prisma.refreshToken.updateMany({
      where: { jtiHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch (error: unknown) {
    throw asAuthError(error, "Logout failed");
  }
};
