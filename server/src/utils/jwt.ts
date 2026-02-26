import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccessPayload = { sub: string; email: string; type: "access" };
export type RefreshPayload = {
  sub: string;
  jti: string;
  familyId: string;
  type: "refresh";
};

const asPayload = (decoded: string | JwtPayload): JwtPayload => {
  if (typeof decoded === "string") {
    throw new Error("Invalid JWT payload");
  }

  return decoded;
};

export const signAccessToken = (payload: Omit<AccessPayload, "type">): string =>
  jwt.sign({ ...payload, type: "access" }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  });

export const signRefreshToken = (payload: Omit<RefreshPayload, "type">): string =>
  jwt.sign({ ...payload, type: "refresh" }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });

export const verifyAccessToken = (token: string): AccessPayload => {
  const payload = asPayload(jwt.verify(token, env.ACCESS_TOKEN_SECRET));

  if (
    payload.type !== "access" ||
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string"
  ) {
    throw new Error("Invalid access token");
  }

  return { sub: payload.sub, email: payload.email, type: "access" };
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
  const payload = asPayload(jwt.verify(token, env.REFRESH_TOKEN_SECRET));

  if (
    payload.type !== "refresh" ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string" ||
    typeof payload.familyId !== "string"
  ) {
    throw new Error("Invalid refresh token");
  }

  return {
    sub: payload.sub,
    jti: payload.jti,
    familyId: payload.familyId,
    type: "refresh",
  };
};
