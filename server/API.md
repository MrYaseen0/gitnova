# GitNova API Documentation

Base URL: `http://localhost:3001/api`

## Table of Contents

- [Overview](#overview)
- [Server Setup](#server-setup)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Progress](#progress)
  - [Leaderboard](#leaderboard)
  - [Achievements](#achievements)
  - [Settings](#settings)
  - [Levels](#levels)
  - [Health](#health)

---

## Overview

GitNova is a gamified Git learning platform. The backend is built with **Express.js**, **Prisma ORM**, and **Neon PostgreSQL**. JWT tokens are used for stateless authentication with a 7-day expiry.

**Database**: Neon PostgreSQL via Prisma ORM
**ORM Output**: `server/src/generated/prisma`

---

## Server Setup

| Setting | Value |
|---------|-------|
| Port | `process.env.PORT` or `3001` |
| CORS Origin | `process.env.CORS_ORIGIN` or `http://localhost:5173` |
| Body Limit | 1 MB (JSON) |
| Helmet | Enabled (CSP configured) |
| JWT Expiry | 7 days |
| JWT Secret | `process.env.JWT_SECRET` |

**CORS Methods**: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
**CORS Headers**: `Content-Type`, `Authorization`
**Credentials**: Enabled

---

## Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

The token contains `{ userId }` and expires after 7 days. Two middleware modes exist:

- **`authMiddleware`** — Token required. Returns `401` if missing/invalid.
- **`optionalAuth`** — Token optional. Attaches `userId` if valid, continues otherwise.

---

## Rate Limiting

| Scope | Window | Max Requests |
|-------|--------|-------------|
| All `/api/` routes | 15 min | 100 |
| `/api/auth/` routes | 15 min | 20 |

Standard headers (`RateLimit-*`) are returned. Legacy `X-RateLimit-*` headers are disabled.

---

## Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "error": "Error message string"
}
```

**HTTP Status Codes**:

| Code | Meaning |
|------|---------|
| 400 | Validation error (Zod) or missing required fields |
| 401 | Authentication required or invalid/expired token |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email/username) |
| 500 | Internal server error |

---

## API Endpoints

---

### Auth

---

#### `POST /api/auth/register`

Create a new user account.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "username": "johndoe",
  "password": "secret123"
}
```

| Field | Type | Validation |
|-------|------|-----------|
| `email` | string | Valid email |
| `name` | string | Min 2 characters |
| `username` | string | Min 3 characters, alphanumeric + underscores only |
| `password` | string | Min 6 characters |

**Response (201)**:
```json
{
  "user": {
    "id": "clxyz...",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "xp": 0,
    "level": 1,
    "streak": 0,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors**:
- `409` — `"A user with this email already exists"` or `"A user with this username already exists"`
- `400` — Validation error message

**Side Effects**: Creates default `UserSettings` for the user. Logs `ACCOUNT_CREATED` activity.

---

#### `POST /api/auth/login`

Authenticate an existing user.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

| Field | Type | Validation |
|-------|------|-----------|
| `email` | string | Valid email |
| `password` | string | Non-empty |

**Response (200)**:
```json
{
  "user": {
    "id": "clxyz...",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": null,
    "bio": null,
    "role": "user",
    "xp": 250,
    "level": 3,
    "streak": 2,
    "isDemo": false,
    "lastActiveAt": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors**:
- `401` — `"Invalid email or password"`

**Side Effects**: Updates `lastActiveAt` timestamp.

---

#### `POST /api/auth/demo`

Create a temporary demo account with pre-set XP/level.

**Auth Required**: No

**Request Body**: None

**Response (201)**:
```json
{
  "user": {
    "id": "clxyz...",
    "email": "demo_1718000000000@demo.gitnova.local",
    "name": "Demo User",
    "username": "demo_1718000000000",
    "xp": 250,
    "level": 3,
    "streak": 2,
    "isDemo": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Side Effects**: Logs `DEMO_STARTED` activity. Demo users are excluded from leaderboards.

---

#### `GET /api/auth/me`

Get the current authenticated user's profile.

**Auth Required**: Yes

**Response (200)**:
```json
{
  "user": {
    "id": "clxyz...",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": "data:image/png;base64,...",
    "bio": "Learning Git",
    "role": "user",
    "xp": 500,
    "level": 5,
    "streak": 7,
    "isDemo": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "settings": {
      "id": "...",
      "userId": "...",
      "soundEnabled": true,
      "musicEnabled": true,
      "notifications": true,
      "difficulty": "normal",
      "theme": "light",
      "language": "en"
    }
  }
}
```

**Errors**:
- `401` — No token or invalid token
- `404` — `"User not found"`

---

#### `PUT /api/auth/profile`

Update the current user's profile.

**Auth Required**: Yes

**Request Body** (all fields optional):
```json
{
  "name": "New Name",
  "bio": "Updated bio",
  "avatar": "data:image/png;base64,..."
}
```

**Response (200)**:
```json
{
  "user": {
    "id": "clxyz...",
    "email": "user@example.com",
    "name": "New Name",
    "username": "johndoe",
    "avatar": "data:image/png;base64,...",
    "bio": "Updated bio",
    "xp": 500,
    "level": 5
  }
}
```

---

#### `POST /api/auth/forgot-password`

Request a password reset token.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |

**Response (200)**:
```json
{
  "message": "If an account with that email exists, a reset link has been sent.",
  "resetToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Note**: The `resetToken` is always returned in development. In production, only the message is returned and the token is sent via email. The same response is returned regardless of whether the email exists (prevents enumeration).

---

#### `POST /api/auth/reset-password`

Reset a user's password using a reset token.

**Auth Required**: No

**Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "password": "newpassword123"
}
```

| Field | Type | Validation |
|-------|------|-----------|
| `token` | string | Valid JWT reset token (1h expiry) |
| `password` | string | Min 6 characters |

**Response (200)**:
```json
{
  "message": "Password reset successful"
}
```

**Errors**:
- `400` — `"Invalid or expired reset token"` or `"Invalid token type"`

---

#### `POST /api/auth/avatar`

Upload a base64-encoded avatar image.

**Auth Required**: Yes

**Request Body**:
```json
{
  "avatar": "data:image/png;base64,iVBORw0KGgo..."
}
```

| Field | Type | Validation |
|-------|------|-----------|
| `avatar` | string | Must start with `data:image/`, max 500 KB decoded |

**Response (200)**:
```json
{
  "avatar": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Errors**:
- `400` — `"Avatar data is required"`, `"Invalid image format"`, or `"Image too large. Max 500KB."`

---

### Progress

All progress endpoints require authentication.

---

#### `POST /api/progress/complete`

Mark a level as completed and award XP.

**Auth Required**: Yes

**Request Body**:
```json
{
  "levelId": "clxyz...",
  "score": 95
}
```

| Field | Type | Default | Validation |
|-------|------|---------|-----------|
| `levelId` | string | — | Required |
| `score` | integer | 100 | 0–100 |

**Response (200)**:
```json
{
  "userLevel": {
    "id": "...",
    "userId": "...",
    "levelId": "...",
    "completed": true,
    "score": 95,
    "completedAt": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "xpGained": 50,
  "totalXp": 550,
  "newLevel": 6
}
```

- `newLevel` is only present if the user leveled up (500 XP per level).
- If the level was already completed, returns `{ "message": "Level already completed", "alreadyCompleted": true }`.

**Side Effects**: Awards XP, checks for level-up, logs `LEVEL_COMPLETED` activity, runs achievement checks.

---

#### `GET /api/progress`

Get the current user's completed levels and stats.

**Auth Required**: Yes

**Response (200)**:
```json
{
  "completedLevels": [
    {
      "id": "...",
      "userId": "...",
      "levelId": "...",
      "completed": true,
      "score": 100,
      "completedAt": "2026-01-01T00:00:00.000Z",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "level": {
        "id": "...",
        "title": "Git Basics",
        "language": "git",
        "difficulty": "beginner",
        "order": 1
      }
    }
  ],
  "stats": {
    "totalLevels": 50,
    "completedCount": 12,
    "percentage": 24
  }
}
```

---

#### `GET /api/progress/heatmap`

Get the user's activity heatmap data (days with completions).

**Auth Required**: Yes

**Response (200)**:
```json
{
  "heatmap": {
    "2026-01-01": 3,
    "2026-01-02": 1,
    "2026-01-05": 5
  }
}
```

Each key is a `YYYY-MM-DD` date string. The value is the count of activities (level completions + demo starts) on that day.

---

#### `GET /api/progress/analytics`

Get detailed analytics for the current user.

**Auth Required**: Yes

**Response (200)**:
```json
{
  "xpOverTime": {
    "2026-01-01": 100,
    "2026-01-02": 250,
    "2026-01-05": 400
  },
  "byLanguage": {
    "git": 10,
    "javascript": 5,
    "python": 3
  },
  "byDifficulty": {
    "beginner": 10,
    "intermediate": 5,
    "advanced": 3
  },
  "activityByDate": {
    "2026-01-01": 3,
    "2026-01-02": 1
  },
  "weeklyTrend": [
    { "week": "W1", "count": 2 },
    { "week": "W2", "count": 5 },
    { "week": "W3", "count": 3 },
    { "week": "W4", "count": 0 },
    { "week": "W5", "count": 1 },
    { "week": "W6", "count": 4 },
    { "week": "W7", "count": 2 },
    { "week": "W8", "count": 6 }
  ],
  "totals": {
    "xp": 500,
    "level": 5,
    "streak": 7,
    "completedCount": 18,
    "joinedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Leaderboard

---

#### `GET /api/leaderboard`

Get the global leaderboard (paginated, demo users excluded).

**Auth Required**: Optional (provides `currentUserRank` if authenticated)

**Query Parameters**:

| Param | Type | Default | Max |
|-------|------|---------|-----|
| `page` | integer | 1 | — |
| `limit` | integer | 20 | 50 |

**Response (200)**:
```json
{
  "leaderboard": [
    {
      "id": "...",
      "name": "Alice",
      "username": "alice",
      "avatar": null,
      "xp": 5000,
      "level": 10,
      "streak": 14,
      "rank": 1
    },
    {
      "id": "...",
      "name": "Bob",
      "username": "bob",
      "avatar": null,
      "xp": 3200,
      "level": 7,
      "streak": 5,
      "rank": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "currentUserRank": 42
}
```

- `currentUserRank` is `null` if not authenticated.

---

#### `GET /api/leaderboard/:username`

Get a specific user's public profile with completed levels and achievements.

**Auth Required**: No

**Path Parameters**:

| Param | Type |
|-------|------|
| `username` | string |

**Response (200)**:
```json
{
  "profile": {
    "name": "Alice",
    "username": "alice",
    "avatar": null,
    "bio": "Git enthusiast",
    "xp": 5000,
    "level": 10,
    "streak": 14,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "completedLevels": [
      {
        "id": "...",
        "completed": true,
        "score": 100,
        "completedAt": "2026-01-01T00:00:00.000Z",
        "level": {
          "id": "...",
          "title": "Git Basics",
          "language": "git",
          "difficulty": "beginner"
        }
      }
    ],
    "achievements": [
      {
        "id": "...",
        "earnedAt": "2026-01-01T00:00:00.000Z",
        "achievement": {
          "id": "...",
          "title": "First Commit",
          "description": "Complete your first level",
          "icon": "🎯",
          "category": "levels"
        }
      }
    ]
  },
  "rank": 1
}
```

**Errors**:
- `404` — `"User not found"`

---

### Achievements

---

#### `GET /api/achievements`

Get all available achievements.

**Auth Required**: No

**Response (200)**:
```json
{
  "achievements": [
    {
      "id": "...",
      "title": "First Commit",
      "description": "Complete your first level",
      "icon": "🎯",
      "category": "levels",
      "requirement": 1,
      "xpReward": 100,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

Sorted by category ascending, then requirement ascending.

---

#### `GET /api/achievements/mine`

Get all achievements with the current user's earned status.

**Auth Required**: Yes

**Response (200)**:
```json
{
  "achievements": [
    {
      "id": "...",
      "title": "First Commit",
      "description": "Complete your first level",
      "icon": "🎯",
      "category": "levels",
      "requirement": 1,
      "xpReward": 100,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "earned": true,
      "earnedAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "...",
      "title": "Git Master",
      "description": "Complete 50 levels",
      "icon": "👑",
      "category": "levels",
      "requirement": 50,
      "xpReward": 500,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "earned": false,
      "earnedAt": null
    }
  ],
  "stats": {
    "total": 20,
    "earned": 5,
    "percentage": 25
  }
}
```

---

#### `POST /api/achievements/report`

Submit a bug report or feature request.

**Auth Required**: Optional (attaches userId if authenticated)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "type": "bug",
  "title": "Level not loading",
  "description": "When I click on level 5, nothing happens",
  "priority": "high",
  "steps": "1. Click level 5\n2. See blank screen"
}
```

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `name` | string | Yes | — |
| `email` | string | Yes (valid email) | — |
| `type` | string | Yes | — |
| `title` | string | Yes | — |
| `description` | string | Yes | — |
| `priority` | string | No | `"medium"` |
| `steps` | string | No | — |

**Response (201)**:
```json
{
  "report": {
    "id": "...",
    "userId": "clxyz...",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "bug",
    "title": "Level not loading",
    "description": "When I click on level 5, nothing happens",
    "priority": "high",
    "steps": "1. Click level 5\n2. See blank screen",
    "status": "open",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "message": "Report submitted successfully"
}
```

---

### Settings

All settings endpoints require authentication.

---

#### `GET /api/settings`

Get the current user's settings. Creates default settings if none exist.

**Auth Required**: Yes

**Response (200)**:
```json
{
  "settings": {
    "id": "...",
    "userId": "...",
    "soundEnabled": true,
    "musicEnabled": true,
    "notifications": true,
    "difficulty": "normal",
    "theme": "light",
    "language": "en"
  }
}
```

---

#### `PUT /api/settings`

Update user settings (partial update supported).

**Auth Required**: Yes

**Request Body** (all fields optional):
```json
{
  "soundEnabled": false,
  "musicEnabled": true,
  "notifications": false,
  "difficulty": "hard",
  "theme": "dark",
  "language": "es"
}
```

| Field | Type | Values |
|-------|------|--------|
| `soundEnabled` | boolean | — |
| `musicEnabled` | boolean | — |
| `notifications` | boolean | — |
| `difficulty` | string | `"easy"`, `"normal"`, `"hard"` |
| `theme` | string | `"light"`, `"dark"`, `"system"` |
| `language` | string | Any string (e.g. `"en"`, `"es"`) |

**Response (200)**:
```json
{
  "settings": {
    "id": "...",
    "userId": "...",
    "soundEnabled": false,
    "musicEnabled": true,
    "notifications": false,
    "difficulty": "hard",
    "theme": "dark",
    "language": "es"
  }
}
```

---

#### `DELETE /api/settings/account`

Permanently delete the current user's account and all associated data.

**Auth Required**: Yes

**Response (200)**:
```json
{
  "message": "Account deleted successfully"
}
```

**Side Effects**: Cascades deletion of all user data (levels, achievements, activities, settings, reports).

---

### Levels

---

#### `GET /api/levels`

Get all levels, optionally filtered by language.

**Auth Required**: No

**Query Parameters**:

| Param | Type | Required |
|-------|------|----------|
| `language` | string | No |

**Response (200)**:
```json
{
  "levels": [
    {
      "id": "...",
      "title": "Git Basics",
      "description": "Learn the fundamentals of Git",
      "language": "git",
      "difficulty": "beginner",
      "order": 1,
      "xpReward": 50,
      "estimatedMinutes": 10,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "grouped": {
    "git": [
      { "id": "...", "title": "Git Basics", "..." : "..." }
    ],
    "javascript": [
      { "id": "...", "title": "JS Fundamentals", "..." : "..." }
    ]
  }
}
```

`levels` is a flat array sorted by `order` ascending. `grouped` is the same data keyed by language.

---

#### `GET /api/levels/:id`

Get a single level by ID.

**Auth Required**: No

**Path Parameters**:

| Param | Type |
|-------|------|
| `id` | string |

**Response (200)**:
```json
{
  "level": {
    "id": "...",
    "title": "Git Basics",
    "description": "Learn the fundamentals of Git",
    "language": "git",
    "difficulty": "beginner",
    "order": 1,
    "xpReward": 50,
    "estimatedMinutes": 10,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `404` — `"Level not found"`

---

### Health

---

#### `GET /api/health`

Server health check endpoint.

**Auth Required**: No

**Response (200)**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

---

## Database Schema Reference

Key models (see `server/prisma/schema.prisma` for full schema):

| Model | Table | Description |
|-------|-------|-------------|
| `User` | `users` | User accounts with XP, level, streak |
| `Level` | `levels` | Learning levels with language, difficulty, XP reward |
| `UserLevel` | `user_levels` | Tracks which levels a user has completed |
| `Achievement` | `achievements` | Achievement definitions with categories and requirements |
| `UserAchievement` | `user_achievements` | Tracks earned achievements per user |
| `Activity` | `activities` | Activity log (level completions, achievements, etc.) |
| `UserSettings` | `user_settings` | Per-user preferences (theme, sound, difficulty) |
| `Report` | `reports` | Bug reports and feature requests |

**Relationships**:
- `User` 1→N `UserLevel` (cascade delete)
- `User` 1→N `UserAchievement` (cascade delete)
- `User` 1→N `Activity` (cascade delete)
- `User` 1→1 `UserSettings` (cascade delete)
- `User` 1→N `Report` (set null on delete)
- `Level` 1→N `UserLevel` (cascade delete)
- `Achievement` 1→N `UserAchievement` (cascade delete)

**XP Progression**: User level = `floor(totalXP / 500) + 1`

**Achievement Categories**:
- `levels` — Earned by completing N levels
- `xp` — Earned by reaching N total XP
- `streak` — Earned by maintaining an N-day streak

---

## File Structure

```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── index.ts               # Server entry point, middleware, routes
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middleware/
│   │   └── auth.ts            # JWT auth middleware
│   └── routes/
│       ├── auth.ts            # Auth endpoints (8 routes)
│       ├── progress.ts        # Progress endpoints (4 routes)
│       ├── leaderboard.ts     # Leaderboard endpoints (2 routes)
│       ├── achievements.ts    # Achievement endpoints (3 routes)
│       ├── settings.ts        # Settings endpoints (3 routes)
│       └── levels.ts          # Levels endpoints (2 routes)
└── API.md                     # This file
```

**Total Endpoints**: 22
