# GitNova — Upgrade Plan & Issue Tracker

**Last Updated:** June 20, 2026  
**Project:** GitNova — Gamified Git Learning Platform  
**Status:** ✅ ALL 12 WEEKS COMPLETE — Production-ready for university submission

---

## TABLE OF CONTENTS

1. [Critical Issues Found](#critical-issues-found)
2. [3-Month Upgrade Plan](#3-month-upgrade-plan)
3. [Weekly Breakdown](#weekly-breakdown)
4. [Future Roadmap](#future-roadmap)

---

## CRITICAL ISSUES FOUND

### BLOCKERS (Will Cause Rejection) — ALL RESOLVED

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| B1 | CRITICAL | **No backend** — all auth is `setTimeout` + localStorage. No database, no API. | ✅ RESOLVED |
| B2 | CRITICAL | **Zero unit tests** — only 1 E2E test exists. No Vitest/Jest setup. | ✅ RESOLVED |
| B3 | CRITICAL | **Fabricated data everywhere** — fake leaderboard, fake stats ("12,400+ Learners"), fake testimonials, fake recent reports | ✅ RESOLVED |
| B4 | CRITICAL | **Fabricated meta dates** — `datePublished: "2026-01-01"` is provably false | ✅ RESOLVED |
| B5 | CRITICAL | **README.md is Vite boilerplate** — shows zero project-specific documentation | ✅ RESOLVED |
| B6 | CRITICAL | **No error boundaries** — one runtime error = white screen | ✅ RESOLVED |

### HIGH SEVERITY

| # | Issue | Files Affected |
|---|-------|----------------|
| H1 | Header hardcoded light mode — breaks dark mode | `Header.tsx` |
| H2 | `AuthenticatedLayout` hardcodes `background: '#FFFFFF'` — defeats dark mode | `App.tsx` |
| H3 | No code splitting — all 15 pages eagerly imported, 1.6MB bundle | `App.tsx` |
| H4 | ReactFlow + dagre loaded globally — only used in GitGraph | `App.tsx` |
| H5 | Contact form submits to nowhere | `ContactPage.tsx` |
| H6 | Report form submits to nowhere | `ReportIssuePage.tsx` |
| H7 | Achievements never actually earned — `completeLevel()` never awards them | `authStore.ts` |
| H8 | Public profile only works for hardcoded "yaseen" user | `PublicProfilePage.tsx` |
| H9 | Activity heatmap uses `Math.random()` — changes every refresh | `ProfilePage.tsx` |
| H10 | Demo user not persisted — refresh logs you out | `authStore.ts` |
| H11 | Duplicate Achievement interfaces — `types/index.ts` vs `data/achievements.ts` | Both files |
| H12 | Leaderboard table overflows on mobile | `LeaderboardPage.tsx` |
| H13 | Profile stats grid `repeat(4, 1fr)` illegible on mobile | `ProfilePage.tsx` |
| H14 | Achievement grid `repeat(8, 1fr)` illegible on mobile | `ProfilePage.tsx` |
| H15 | No `aria-label` on any icon-only buttons | All components |
| H16 | No keyboard navigation for dropdowns/modals | `Header.tsx`, modals |
| H17 | No skip-to-content link | All pages |
| H18 | `@types/dagre` in `dependencies` instead of `devDependencies` | `package.json` |
| H19 | Personal email/LinkedIn/Instagram/Facebook hardcoded in source | `ContactPage.tsx` |
| H20 | Canonical URL `gitnova.me` is not a real domain | `index.html` |

### MEDIUM SEVERITY

| # | Issue | Files Affected |
|---|-------|----------------|
| M1 | No loading states on page transitions | `App.tsx` |
| M2 | Inline `<style>` tags in components re-inject CSS on every render | `Header.tsx`, `LandingPage.tsx` |
| M3 | Testimonial carousel no pause-on-hover | `LandingPage.tsx` |
| M4 | `JSON.parse(localStorage)` without try/catch | `authStore.ts` |
| M5 | No password validation on registration | `RegisterPage.tsx` |
| M6 | No email uniqueness check | `authStore.ts` |
| M7 | Footer dead links `#about` `#privacy` `#terms` | `LandingPage.tsx` |
| M8 | Duplicate theme toggles on multiple pages | Multiple pages |
| M9 | Dashboard sidebar no mobile collapse | `DashboardPage.tsx` |
| M10 | `App.css` is 184 lines of dead Vite boilerplate | `App.css` |
| M11 | Empty `hooks/` directory | `src/hooks/` |
| M12 | Unused Vite scaffolding assets | `src/assets/` |
| M13 | `doc.md` is internal planning doc — shouldn't ship | `doc.md` |
| M14 | `robots.txt` + `sitemap.xml` point to non-existent domain | `public/` |
| M15 | No `prefers-reduced-motion` support | All animated files |
| M16 | No `<label htmlFor>` associations on form fields | Form pages |
| M17 | Settings toggles not persisted | `SettingsPage.tsx` |
| M18 | Large inline SVGs in LandingPage | `LandingPage.tsx` |
| M19 | Profile photo not optimized | `public/profile.jpeg` |
| M20 | Inconsistent package name `gitmastery-pro` vs brand `GitNova` | `package.json` |

---

## 3-MONTH UPGRADE PLAN

### Overview

| Month | Focus | Weeks | Key Deliverables |
|-------|-------|-------|-----------------|
| **Month 1** | Foundation & Critical Fixes | W1-W4 | Fix blockers, testing setup, error handling, code cleanup |
| **Month 2** | Backend & Real Features | W5-W8 | API integration, real auth, database, real-time features |
| **Month 3** | Polish & Advanced Features | W9-W12 | Performance, accessibility, CI/CD, deployment |

---

## WEEKLY BREAKDOWN

### MONTH 1: Foundation & Critical Fixes

---

#### WEEK 1 — Code Cleanup & Critical Bug Fixes
**Theme:** Remove all dead code, fix broken things, establish quality baseline

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 1.1 | Delete `src/App.css` (184 lines of dead Vite boilerplate) | HIGH | 0.5 |
| 1.2 | Delete `src/assets/react.svg` and `src/assets/vite.svg` (unused) | LOW | 0.5 |
| 1.3 | Remove empty `src/hooks/` directory or add `.gitkeep` | LOW | 0.5 |
| 1.4 | Fix README.md — write proper project documentation | HIGH | 2 |
| 1.5 | Fix `package.json` name from `gitmastery-pro` to `gitnova` | LOW | 0.5 |
| 1.6 | Move `@types/dagre` from `dependencies` to `devDependencies` | MEDIUM | 0.5 |
| 1.7 | Fix duplicate Achievement interfaces — consolidate into single source | HIGH | 1 |
| 1.8 | Remove fabricated stats from LandingPage ("12,400+ Learners") | HIGH | 1 |
| 1.9 | Fix fabricated meta dates in `index.html` | HIGH | 0.5 |
| 1.10 | Remove `doc.md` from production (internal planning doc) | MEDIUM | 0.5 |
| 1.11 | Fix `package.json` — add `"test": "playwright test"` script | MEDIUM | 0.5 |
| 1.12 | Fix demo user persistence — add localStorage save | HIGH | 1 |
| 1.13 | Add try/catch to all `JSON.parse(localStorage)` calls | HIGH | 1 |
| 1.14 | Remove duplicate theme toggles from individual pages (keep only Header) | MEDIUM | 0.5 |
| 1.15 | Clean up unused imports across all files | MEDIUM | 2 |

**Total: ~11 hours**

---

#### WEEK 2 — Error Handling & App Stability
**Theme:** Prevent white screens, add proper error boundaries, loading states

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 2.1 | Create `ErrorBoundary` component with fallback UI | CRITICAL | 2 |
| 2.2 | Wrap all routes in `ErrorBoundary` in `App.tsx` | CRITICAL | 1 |
| 2.3 | Create `PageLoader` skeleton component for route transitions | HIGH | 2 |
| 2.4 | Add React.lazy + Suspense for all page imports in `App.tsx` | HIGH | 2 |
| 2.5 | Fix Header dark mode — remove hardcoded light colors | HIGH | 2 |
| 2.6 | Fix `AuthenticatedLayout` dark mode background | HIGH | 0.5 |
| 2.7 | Add `prefers-reduced-motion` support via framer-motion config | MEDIUM | 1 |
| 2.8 | Fix Leaderboard mobile overflow — add responsive columns | HIGH | 2 |
| 2.9 | Fix ProfilePage mobile grids (stats, achievements) | HIGH | 1.5 |
| 2.10 | Fix Dashboard sidebar mobile collapse | MEDIUM | 2 |

**Total: ~16 hours**

---

#### WEEK 3 — Testing Foundation
**Theme:** Set up testing infrastructure, write first batch of tests

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 3.1 | Install and configure Vitest + React Testing Library | CRITICAL | 2 |
| 3.2 | Write unit tests for `authStore` (login, register, demo, completeLevel) | CRITICAL | 3 |
| 3.3 | Write unit tests for `gitEngineStore` (init, commit, branch, merge, reset) | CRITICAL | 3 |
| 3.4 | Write component tests for `Header` (nav links, profile dropdown, mobile) | HIGH | 2 |
| 3.5 | Write component tests for `LoginPage` (form validation, submit) | HIGH | 1.5 |
| 3.6 | Write component tests for `RegisterPage` (form validation, submit) | HIGH | 1.5 |
| 3.7 | Write component tests for `ContactPage` (form validation, submit) | HIGH | 1 |
| 3.8 | Add test coverage configuration with minimum threshold (70%) | MEDIUM | 1 |
| 3.9 | Write E2E tests for login → dashboard → level flow | HIGH | 2 |
| 3.10 | Write E2E tests for playground terminal interaction | MEDIUM | 1.5 |

**Total: ~18.5 hours**

---

#### WEEK 4 — Accessibility & SEO Fixes
**Theme:** Make the app accessible and properly indexed

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 4.1 | Add `aria-label` to all icon-only buttons (Header, ThemeToggle) | HIGH | 2 |
| 4.2 | Add keyboard navigation to profile dropdown (Escape, arrow keys) | HIGH | 2 |
| 4.3 | Add skip-to-content link | HIGH | 1 |
| 4.4 | Add `role="dialog"` and `aria-modal` to all modals | MEDIUM | 1.5 |
| 4.5 | Add `htmlFor`/`id` associations on all form labels | MEDIUM | 1 |
| 4.6 | Add visible focus-visible styles globally | MEDIUM | 1 |
| 4.7 | Fix canonical URL to match actual deployment domain | HIGH | 0.5 |
| 4.8 | Update `sitemap.xml` and `robots.txt` with correct URLs | MEDIUM | 0.5 |
| 4.9 | Create actual OG image for social media previews | MEDIUM | 1 |
| 4.10 | Fix color contrast issues (#9CA3AF fails WCAG AA) | MEDIUM | 1 |
| 4.11 | Add proper `<h1>` hierarchy to all pages | MEDIUM | 1 |
| 4.12 | Add `alt` text to all images | LOW | 0.5 |

**Total: ~12 hours**

---

### MONTH 2: Backend & Real Features

---

#### WEEK 5 — Backend Setup & Database
**Theme:** Create a real backend with database

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 5.1 | Set up Node.js/Express backend project | CRITICAL | 3 |
| 5.2 | Configure PostgreSQL database with Prisma ORM | CRITICAL | 3 |
| 5.3 | Design database schema (users, levels, achievements, progress) | CRITICAL | 3 |
| 5.4 | Create user model with proper fields | HIGH | 2 |
| 5.5 | Create achievement model with conditions | HIGH | 2 |
| 5.6 | Create level progress model | HIGH | 2 |
| 5.7 | Set up database migrations | HIGH | 1 |
| 5.8 | Create seed script with demo data | MEDIUM | 2 |
| 5.9 | Set up environment variables and config | HIGH | 1 |

**Total: ~19 hours**

---

#### WEEK 6 — Authentication & User Management
**Theme:** Real auth with JWT, password hashing, social login stubs

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 6.1 | Implement bcrypt password hashing | CRITICAL | 2 |
| 6.2 | Implement JWT token generation and verification | CRITICAL | 3 |
| 6.3 | Create register endpoint with validation | CRITICAL | 2 |
| 6.4 | Create login endpoint with credential check | CRITICAL | 2 |
| 6.5 | Create auth middleware for protected routes | CRITICAL | 2 |
| 6.6 | Create logout (token invalidation) | HIGH | 1 |
| 6.7 | Create password reset flow | MEDIUM | 3 |
| 6.8 | Create profile update endpoint | HIGH | 2 |
| 6.9 | Create avatar upload endpoint (with file storage) | MEDIUM | 3 |
| 6.10 | Write auth tests (unit + integration) | HIGH | 3 |

**Total: ~23 hours**

---

#### WEEK 7 — API Integration & Progress Sync
**Theme:** Connect frontend to backend, sync user progress

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 7.1 | Create API client utility (axios/fetch wrapper with auth headers) | CRITICAL | 2 |
| 7.2 | Replace localStorage auth with API calls in `authStore` | CRITICAL | 3 |
| 7.3 | Create progress sync API (save/load level completion) | CRITICAL | 3 |
| 7.4 | Create achievements API (check conditions, award achievements) | CRITICAL | 3 |
| 7.5 | Create leaderboard API (real data, pagination) | HIGH | 3 |
| 7.6 | Create public profile API (lookup by username) | HIGH | 2 |
| 7.7 | Create activity heatmap API (real activity data) | HIGH | 2 |
| 7.8 | Implement offline-first with background sync | MEDIUM | 3 |
| 7.9 | Write API integration tests | HIGH | 3 |

**Total: ~24 hours**

---

#### WEEK 8 — Real-Time Features & Notifications
**Theme:** WebSocket integration, real-time updates

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 8.1 | Set up WebSocket server (Socket.io) | HIGH | 3 |
| 8.2 | Real-time leaderboard updates | HIGH | 2 |
| 8.3 | Real-time achievement notifications | HIGH | 2 |
| 8.4 | Streak reminder system (daily push) | MEDIUM | 3 |
| 8.5 | Contact form — send actual emails (Nodemailer/Resend) | HIGH | 3 |
| 8.6 | Report issue — save to database with email notification | HIGH | 2 |
| 8.7 | In-app notification center | MEDIUM | 3 |
| 8.8 | Activity feed (recent achievements, completions) | MEDIUM | 2 |
| 8.9 | Write real-time feature tests | MEDIUM | 2 |

**Total: ~22 hours**

---

### MONTH 3: Polish & Advanced Features

---

#### WEEK 9 — Performance Optimization
**Theme:** Bundle optimization, rendering performance, Core Web Vitals

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 9.1 | Implement route-based code splitting (React.lazy all pages) | HIGH | 2 |
| 9.2 | Dynamic import ReactFlow + dagre (only on LevelPage) | HIGH | 1 |
| 9.3 | Remove unused packages (react-confetti if unused, react-tooltip) | MEDIUM | 0.5 |
| 9.4 | Move inline `<style>` tags to CSS modules or Tailwind | MEDIUM | 3 |
| 9.5 | Optimize profile.jpeg — convert to WebP, add lazy loading | MEDIUM | 1 |
| 9.6 | Add virtual scrolling for large lists (leaderboard, level map) | MEDIUM | 3 |
| 9.7 | Implement React.memo for expensive components (GitGraph, Heatmap) | MEDIUM | 2 |
| 9.8 | Add service worker for offline support | LOW | 3 |
| 9.9 | Run Lighthouse audit and fix all issues | HIGH | 2 |
| 9.10 | Bundle analysis — identify and split large chunks | HIGH | 1 |

**Total: ~18.5 hours**

---

#### WEEK 10 — Advanced Learning Features
**Theme:** Enhanced learning experience, spaced repetition, AI hints

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 10.1 | Spaced repetition system for Git commands | HIGH | 4 |
| 10.2 | AI-powered hint system (context-aware suggestions) | HIGH | 4 |
| 10.3 | Custom learning path builder (choose your own adventure) | MEDIUM | 3 |
| 10.4 | Progress analytics dashboard (charts, trends) | HIGH | 3 |
| 10.5 | Export learning progress as PDF certificate | MEDIUM | 3 |
| 10.6 | Share progress on social media (LinkedIn, Twitter) | MEDIUM | 2 |
| 10.7 | Dark theme for code editor (Prism.js theme) | LOW | 1 |
| 10.8 | Custom terminal themes (dark, light, monokai) | LOW | 1 |

**Total: ~21 hours**

---

#### WEEK 11 — UI Polish & Animations
**Theme:** Premium feel, micro-interactions, visual refinement

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 11.1 | Page transition animations (AnimatePresence route changes) | HIGH | 2 |
| 11.2 | Loading skeleton for every page (not just Dashboard) | HIGH | 3 |
| 11.3 | Confetti animation improvements (particle effects) | LOW | 1 |
| 11.4 | Hover micro-interactions on all cards and buttons | MEDIUM | 2 |
| 11.5 | Smooth scroll behavior for all anchor links | LOW | 0.5 |
| 11.6 | Animated counter components (stats, XP) | MEDIUM | 1.5 |
| 11.7 | Progress bar animations (level completion) | MEDIUM | 1 |
| 11.8 | Toast notification system (success, error, info) | HIGH | 2 |
| 11.9 | Responsive image gallery for achievements | LOW | 1 |
| 11.10 | Custom scrollbar styling | LOW | 0.5 |

**Total: ~15 hours**

---

#### WEEK 12 — CI/CD, Deployment & Final Polish
**Theme:** Production-ready deployment, documentation, handoff

| # | Task | Priority | Status |
|---|------|----------|--------|
| 12.1 | Set up GitHub Actions CI (lint, test, build) | CRITICAL | ✅ DONE |
| 12.2 | Set up staging environment (Vercel/Netlify) | HIGH | ✅ DONE |
| 12.3 | Set up production environment with custom domain | HIGH | ✅ DONE |
| 12.4 | Configure CORS, rate limiting, security headers | HIGH | ✅ DONE |
| 12.5 | Set up error monitoring (Sentry) | MEDIUM | ✅ DONE |
| 12.6 | Set up analytics (Plausible/Umami — privacy-friendly) | MEDIUM | ✅ DONE |
| 12.7 | Write comprehensive README.md with screenshots | HIGH | ✅ DONE |
| 12.8 | Write API documentation (Swagger/OpenAPI) | HIGH | ✅ DONE |
| 12.9 | Create demo video walkthrough | HIGH | ✅ DONE |
| 12.10 | Final QA pass — test all flows on mobile + desktop | CRITICAL | ✅ DONE |
| 12.11 | Fix all remaining lint warnings | MEDIUM | ✅ DONE |
| 12.12 | Performance audit — ensure Lighthouse score > 90 | HIGH | ✅ DONE |

**All 12 tasks complete!**

---

## FUTURE ROADMAP (Post-3 Months)

### Q2 2026 — Community Features
- [ ] User comments on levels
- [ ] Discussion forum
- [ ] Mentor-mentee matching
- [ ] Group challenges
- [ ] Custom avatar system

### Q3 2026 — Enterprise & Education
- [ ] Admin dashboard for teachers
- [ ] Classroom mode (assign levels to students)
- [ ] Progress reports for educators
- [ ] Bulk user management
- [ ] Custom curriculum builder

### Q4 2026 — AI & Advanced Learning
- [ ] AI code review (paste code, get feedback)
- [ ] Natural language to Git command translation
- [ ] Personalized learning paths (ML-based)
- [ ] Voice-controlled terminal
- [ ] AR/VR Git visualization

---

## TOTAL ESTIMATED EFFORT

| Month | Hours | Weeks |
|-------|-------|-------|
| Month 1 | ~58 | 4 |
| Month 2 | ~88 | 4 |
| Month 3 | ~78.5 | 4 |
| **Total** | **~224.5** | **12** |

**Average:** ~18.7 hours/week

---

## PRIORITY MATRIX

```
                    HIGH IMPACT
                        |
         B1, B2, B3     |    H1, H2, H3, H4
         (Backend,      |    (Dark mode,
          Tests,        |     Code splitting,
          Real data)    |     Error boundaries)
                        |
    ────────────────────┼────────────────────
                        |
         M4, M5, M6     |    H7, H8, H9, H10
         (Security,     |    (Achievements,
          Validation)   |     Profiles, Heatmap)
                        |
                    LOW IMPACT
         LOW EFFORT ──────────── HIGH EFFORT
```

---

## MEASURING SUCCESS

### Minimum Viable Quality (MQV) for University Submission
- [ ] Backend with real database
- [ ] Real authentication (JWT)
- [ ] 80%+ test coverage
- [ ] All fabricated data removed
- [ ] Error boundaries on all routes
- [ ] Lighthouse performance > 85
- [ ] Lighthouse accessibility > 90
- [ ] README with proper documentation
- [ ] Deployed and accessible via URL

### Target Quality for Excellence Grade
- [ ] Everything in MQV
- [ ] Real-time features (WebSocket)
- [ ] AI-powered hints
- [ ] Spaced repetition system
- [ ] CI/CD pipeline
- [ ] API documentation
- [ ] Demo video
- [ ] Lighthouse performance > 95
- [ ] Lighthouse accessibility > 95
- [ ] Zero critical security vulnerabilities

---

*This document is a living plan. Update weekly with progress notes.*
