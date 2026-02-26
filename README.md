# Code hunt hackathon repo

Frontend in nextjs
Backend as the express app

## Backend auth implementation

The backend authentication code is in `server/` and includes:
- Email/password auth with Argon2id hashing
- Google sign-in via ID token verification (`google-auth-library`)
- Stateless JWT access token + refresh token rotation
- Refresh token storage/revocation in PostgreSQL (Prisma)
- Rate limiting, CORS allowlist, Helmet, and centralized error handling

### CSRF strategy

Refresh tokens are stored in an httpOnly cookie and never exposed to JavaScript. To protect cookie-authenticated auth endpoints (`/refresh`, `/logout`), the server uses:
- `Origin` allowlist validation
- Double-submit token pattern: CSRF token in readable cookie + `X-CSRF-Token` header match

This keeps access tokens in response JSON while using secure cookie semantics for refresh tokens.
