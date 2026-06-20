# GitNova

> A gamified learning platform for Git, GitHub, and programming languages — learn through interactive levels, earn achievements, and track your progress.

![License](https://img.shields.io/badge/license-MIT-blue)
![Tests](https://img.shields.io/badge/tests-75%20passing-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)

---

## Overview

GitNova is a full-stack web application that teaches Git, Python, C, C++, and Java through progressive, hands-on levels. Users interact with a simulated Git terminal, unlock achievements, compete on leaderboards, and track their learning analytics.

### Key Features

| Feature | Description |
|---------|-------------|
| **70 Interactive Levels** | Progressive content across Git (40), Python (10), C (10), C++ (10) |
| **In-Browser Terminal** | Practice Git commands with instant feedback |
| **Visual Git Graph** | Real-time commit history visualization using ReactFlow + dagre |
| **Spaced Repetition** | SM-2 algorithm schedules command reviews for long-term retention |
| **Analytics Dashboard** | XP tracking, language breakdown, difficulty distribution, weekly trends |
| **18 Achievements** | Unlockable milestones across levels, XP, streaks, and special challenges |
| **Leaderboard** | Global rankings with public profiles |
| **PDF Certificates** | Downloadable, verifiable completion certificates |
| **Dark Mode** | Full dark theme with custom Prism code highlighting |
| **Keyboard Shortcuts** | ⌘K command palette, `?` shortcut reference |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 8 |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **State** | Zustand (persisted to localStorage) |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL (Neon serverless) |
| **Auth** | JWT + bcrypt (7-day tokens) |
| **Testing** | Vitest + React Testing Library |
| **CI/CD** | GitHub Actions |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  React 19 + Vite + Zustand + Framer Motion  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  Pages   │ │ Stores   │ │ Components   │ │
│  │ (17 lazy)│ │ (auth,   │ │ (Header,     │ │
│  │          │ │  git,    │ │  Skeleton,   │ │
│  │          │ │  srs)    │ │  Toast, etc) │ │
│  └────┬─────┘ └────┬─────┘ └──────────────┘ │
│       │             │                        │
│  ┌────▼─────────────▼────┐                   │
│  │    API Client (lib/)  │                   │
│  └────────────┬──────────┘                   │
└───────────────┼─────────────────────────────┘
                │ HTTP/JSON
┌───────────────▼─────────────────────────────┐
│               Backend (Express)              │
│  ┌──────┐ ┌──────────┐ ┌────────────────┐   │
│  │ Auth │ │ Progress │ │ Leaderboard    │   │
│  │ Routes│ │ Routes   │ │ Routes         │   │
│  └──┬───┘ └────┬─────┘ └───────┬────────┘   │
│     │           │               │            │
│  ┌──▼───────────▼───────────────▼──┐         │
│  │     Prisma ORM + PostgreSQL     │         │
│  └─────────────────────────────────┘         │
└──────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- PostgreSQL (or Neon account)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Push schema to database
npx prisma db push

# Seed levels and achievements
npx tsx prisma/seed.ts

# Start server
npm run dev
```

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:3001/api
```

**Backend** (`server/.env`):
```
DATABASE_URL=postgresql://user:pass@host:5432/gitnova
JWT_SECRET=your-secret-key-min-32-chars
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

---

## Project Structure

```
gitmastery-pro/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnimatedCounter.tsx
│   │   ├── Certificate.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GitGraph.tsx      # ReactFlow + dagre visualization
│   │   ├── Header.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── ui/               # shadcn-style primitives
│   ├── pages/               # Route-level components (17 pages)
│   ├── stores/              # Zustand state management
│   │   ├── authStore.ts     # Authentication + user data
│   │   ├── gitEngineStore.ts # Git command simulation
│   │   └── srsStore.ts      # Spaced repetition (SM-2)
│   ├── lib/
│   │   ├── api.ts           # Typed API client
│   │   └── codeHighlighter.tsx # PrismLight (11 languages)
│   ├── data/                # Level definitions & achievements
│   ├── types/               # TypeScript interfaces
│   └── index.css            # Global styles + dark mode
├── server/
│   ├── src/
│   │   ├── routes/          # Express route handlers
│   │   ├── middleware/      # Auth, rate limiting
│   │   └── lib/             # Prisma client
│   └── prisma/
│       ├── schema.prisma    # Database schema (7 models)
│       └── seed.ts          # Seed 70 levels + 18 achievements
├── .github/workflows/ci.yml # GitHub Actions CI
└── UPGRADE.md               # Development roadmap
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login with credentials |
| POST | `/api/auth/demo` | No | Create demo user |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update name/bio/avatar |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| POST | `/api/auth/avatar` | Yes | Upload avatar (base64) |
| POST | `/api/progress/complete` | Yes | Mark level complete |
| GET | `/api/progress` | Yes | Get completed levels |
| GET | `/api/progress/heatmap` | Yes | Activity heatmap data |
| GET | `/api/progress/analytics` | Yes | Charts & trends data |
| GET | `/api/leaderboard` | Yes | Paginated leaderboard |
| GET | `/api/leaderboard/:username` | Yes | Public user profile |
| GET | `/api/achievements` | Yes | All achievements |
| GET | `/api/achievements/mine` | Yes | User's achievements |
| POST | `/api/achievements/report` | No | Submit bug/feedback |
| GET | `/api/levels` | No | All levels |
| GET | `/api/levels/:id` | No | Single level details |
| GET | `/api/settings` | Yes | User settings |
| PUT | `/api/settings` | Yes | Update settings |
| DELETE | `/api/settings/account` | Yes | Delete account |
| GET | `/api/health` | No | Health check |

---

## Database Schema

```prisma
model User {
  id, email, name, username, password, avatar, bio
  xp, level, streak, isDemo, createdAt, updatedAt
  completedLevels  UserLevel[]
  achievements     UserAchievement[]
  activities       Activity[]
  settings         UserSettings?
}

model Level {
  id, title, description, language, difficulty
  order, xpReward, steps (JSON)
}

model UserLevel {
  userId, levelId, completed, score, completedAt
}

model Achievement {
  id, title, description, icon, category, requirement
}

model UserAchievement {
  userId, achievementId, earnedAt
}

model Activity {
  id, userId, type, description, metadata (JSON), createdAt
}
```

---

## Testing

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch
```

**Test Coverage:**
- `authStore` — 22 tests (login, register, demo, profile)
- `gitEngineStore` — 30 tests (commit, branch, merge, rebase)
- `Header` — 6 tests (navigation, dark mode, mobile)
- `LoginPage` — 7 tests (form, social login, demo mode)
- `RegisterPage` — 5 tests (multi-step form, validation)
- `ContactPage` — 5 tests (form fields, submission)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Production build (TypeScript + Vite) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |
| `npm run server` | Start backend server |
| `npm run db:seed` | Seed database with levels |

---

## Performance

Bundle sizes after optimization:
- **LevelPage**: 36KB (was 680KB — lazy-loaded PrismLight)
- **GitGraph**: 264KB (lazy-loaded ReactFlow + dagre)
- **Main bundle**: 442KB (React, Router, Framer Motion)
- **Code highlighter**: 89KB (11 languages only, not 300+)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
