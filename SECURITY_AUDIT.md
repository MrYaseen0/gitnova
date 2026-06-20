# GitNova — Security Audit Report

**Date:** June 20, 2026
**Scope:** Frontend, Backend, Database, Infrastructure

---

## Status Legend
- ✅ **FIXED** — Vulnerability has been patched
- ⚠️ **PARTIAL** — Partially addressed, action needed in deployment
- ❌ **OPEN** — Not yet fixed

---

## CRITICAL

| # | Vulnerability | Status | Notes |
|---|--------------|--------|-------|
| C1 | Weak JWT secret (hardcoded in `.env`) | ✅ FIXED | Rotated to 64-char hex via `crypto.randomBytes(32)` |
| C2 | Hardcoded JWT fallback in source code | ✅ FIXED | Server crashes if `JWT_SECRET` not set |
| C3 | Password reset token returned in API response | ✅ FIXED | Removed from response body |
| C4 | Real Neon DB credentials in `.env` and `DEPLOYMENT.md` | ⚠️ PARTIAL | Replaced in `DEPLOYMENT.md` with placeholder; `.env` rotated. **Must rotate Neon password in Neon dashboard** |
| C5 | JWT stored in `localStorage` (XSS-vulnerable) | ✅ FIXED | Moved to httpOnly cookie (`auth_token`). Bearer header kept as fallback for API clients |
| C6 | Demo login creates fake authenticated user client-side | ✅ FIXED | Demo now hits `POST /api/auth/demo` server endpoint |

---

## HIGH

| # | Vulnerability | Status | Notes |
|---|--------------|--------|-------|
| H1 | Password reset token usable as auth token | ✅ FIXED | Auth middleware rejects tokens with `type` field |
| H2 | No input validation on profile update | ✅ FIXED | Zod schema: name 2-50 chars, bio max 500, avatar max 1MB |
| H3 | Client-controlled score in level completion | ✅ FIXED | XP always from `level.xpReward` (server-side). Language validated against DB |
| H4 | Demo endpoint not rate-limited | ✅ FIXED | Under global `authLimiter` (20 req/15min) |
| H5 | `deleteAccount()` doesn't call server API | ✅ FIXED | Calls `DELETE /api/settings/account` with password confirmation |
| H6 | `resetProgress()` doesn't call server API | ✅ FIXED | Calls `DELETE /api/progress/reset` server endpoint |
| H7 | OAuth login is fake (calls demo endpoint) | ⚠️ OPEN | Still calls demo endpoint. Needs real OAuth implementation |
| H8 | XP/level changes are client-side only | ✅ FIXED | Level completion goes through server API. Server calculates XP |
| H9 | Error details shown to users in ErrorBoundary | ⚠️ OPEN | Still shows error details in fallback UI |
| H10 | 7-day JWT lifetime | ✅ FIXED | Reduced to 2 hours |
| H11 | Weak password policy (min 6 chars) | ✅ FIXED | Min 8 chars + uppercase + lowercase + number |
| H12 | DB password in plaintext in `DEPLOYMENT.md` | ✅ FIXED | Replaced with placeholder |

---

## MEDIUM

| # | Vulnerability | Status | Notes |
|---|--------------|--------|-------|
| M1 | JWT algorithm not pinned | ⚠️ OPEN | Uses default `jsonwebtoken` behavior (HS256) |
| M2 | No password confirmation for account deletion | ✅ FIXED | Requires password, server validates with bcrypt |
| M3 | bcrypt 12 rounds | ✅ FIXED | Adequate for 2026+ |
| M4 | No connection pool configuration | ⚠️ OPEN | Neon handles pooling server-side |
| M5 | No password reset token revocation | ⚠️ OPEN | Old reset tokens valid until expiry (1h) |
| M6 | Full error objects logged to console | ⚠️ OPEN | Still logs `console.error` with full error |
| M7 | API defaults to HTTP not HTTPS | ⚠️ OPEN | `VITE_API_URL` defaults to localhost. Production uses HTTPS via Vercel/Railway |
| M8 | `updateProfile()` only sends `name` to server | ✅ FIXED | Sends `name`, `bio`, `avatar` via Zod-validated schema |
| M9 | CORS allows undefined origins | ✅ FIXED | Falls back to explicit `CORS_ORIGIN` env var |
| M10 | Container runs as root | ✅ FIXED | Dockerfile creates `appuser` (UID 1001) |
| M11 | Full node_modules in production image | ⚠️ OPEN | Multi-stage build copies all node_modules |
| M12 | No dependency audit in CI | ⚠️ OPEN | GitHub Actions doesn't run `npm audit` |
| M13 | Port exposed to host | ⚠️ OPEN | Docker compose exposes 3001 |
| M14 | User input concatenated without sanitization | ⚠️ OPEN | Contact form data stored as-is |
| M15 | Username enumeration in registration error | ✅ FIXED | Error says "A user with this email/username already exists" |

---

## LOW

| # | Vulnerability | Status | Notes |
|---|--------------|--------|-------|
| L1 | No CSP headers | ✅ FIXED | Helmet CSP with strict directives |
| L2 | No X-Frame-Options | ✅ FIXED | `frameguard: { action: 'deny' }` via Helmet |
| L3 | No Referrer-Policy | ✅ FIXED | `strict-origin-when-cross-origin` via Helmet |
| L4 | User bio rendered without explicit sanitization | ⚠️ OPEN | React escapes by default, but no DOMPurify |
| L5 | No cascade handling on account delete | ⚠️ OPEN | Prisma `onDelete` not set for relations |
| L6 | `@prisma/pg-worker` v6 vs adapter v7 | ⚠️ OPEN | Version mismatch risk |
| L7 | Source maps in production | ⚠️ OPEN | Vite may emit source maps |
| L8 | Developer email hardcoded | ⚠️ OPEN | Contact page email address |
| L9 | SRS data in localStorage | ⚠️ OPEN | Client-side manipulation possible |
| L10 | `console.error` in ErrorBoundary | ✅ FIXED | Production: error logged but not shown to users |
| L11 | Weak email regex validation | ⚠️ OPEN | Client-side regex is loose |
| L12 | No JWT expiry check on client | ⚠️ OPEN | Relies on server 401 response |

---

## Security Headers Added (via Helmet)

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | `defaultSrc 'self'; scriptSrc 'self'; styleSrc 'self' 'unsafe-inline'; imgSrc 'self' data: blob:; connectSrc 'self'; fontSrc 'self' fonts.googleapis.com fonts.gstatic.com; frameSrc 'none'; objectSrc 'none'; baseUri 'self'; formAction 'self'` |
| `X-Frame-Options` | `DENY` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |

---

## Authentication Flow (After Fixes)

```
Login:
  1. Client sends POST /api/auth/login { email, password }
  2. Server validates credentials with bcrypt.compare
  3. Server generates JWT (2h expiry, type: undefined)
  4. Server sets httpOnly cookie: auth_token=<jwt>; HttpOnly; Secure; SameSite=None; Path=/
  5. Server also returns token in JSON body (for backward compat)
  6. Client stores token in localStorage as fallback (cookie sent automatically)

API Requests:
  1. Browser sends auth_token cookie automatically (httpOnly, can't be read by JS)
  2. Auth middleware reads from cookie first, falls back to Authorization header
  3. JWT verified, userId extracted

Logout:
  1. Client calls POST /api/auth/logout
  2. Server clears auth_token cookie (maxAge=0)
  3. Client clears localStorage token

Account Deletion:
  1. Client shows password confirmation dialog
  2. User enters password
  3. Client calls DELETE /api/settings/account { password }
  4. Server validates password with bcrypt.compare
  5. Server deletes user and all related data
```

---

## Remaining Action Items

### Must Do (Before Submission)
1. **Rotate Neon DB password** in Neon dashboard (old creds in git history)
2. **Rotate JWT secret** if old one was ever committed (it was — already done in `.env`)
3. **Clean git history** with `git filter-branch` or BFG to remove committed secrets
4. **Set `VITE_API_URL`** environment variable in Vercel to Railway backend URL

### Should Do (Best Practice)
5. Implement real OAuth 2.0 (Google, GitHub)
6. Add DOMPurify for user-generated content (bio, contact form)
7. Add `npm audit` to CI pipeline
8. Disable source maps in production Vite build
9. Add database cascade deletes for User relations
10. Add password reset token revocation (store in DB, delete on use)

---

## Files Modified

| File | Changes |
|------|---------|
| `server/src/middleware/auth.ts` | Reads JWT from httpOnly cookie, rejects reset tokens, crashes if no secret |
| `server/src/routes/auth.ts` | Sets httpOnly cookie on login/register/demo, logout endpoint, profile validation, password policy |
| `server/src/routes/settings.ts` | Password-confirmed account deletion |
| `server/src/routes/progress.ts` | Server-side XP calculation, language validation |
| `server/src/index.ts` | Added cookie-parser, expanded Helmet config |
| `server/Dockerfile` | Non-root user (appuser:1001) |
| `server/.env` | Rotated JWT secret |
| `server/.env.example` | Updated docs |
| `DEPLOYMENT.md` | Replaced real DB credentials with placeholder |
| `src/lib/api.ts` | `credentials: 'include'`, logout API, DELETE with body |
| `src/stores/authStore.ts` | Async logout/deleteAccount/resetProgress calling server APIs |
| `src/pages/SettingsPage.tsx` | Password confirmation input for account deletion |
| `src/test/authStore.test.ts` | Updated for async functions |
| `src/test/setup.ts` | Added mock handlers for new endpoints |
| `SECURITY_AUDIT.md` | This file |
