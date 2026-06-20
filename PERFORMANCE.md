# GitNova Performance Audit

Generated: Sat Jun 20 2026
Build tool: Vite 8.0.16
React: 19.2.7 | react-router-dom: 7.17.0 | framer-motion: 12.40.0

---

## 1. Current Bundle Sizes (Production Build)

### JavaScript Chunks

| Chunk | Raw Size | Gzip Size | Category |
|---|---|---|---|
| `index-*.js` (main) | 445.17 kB | 139.85 kB | Core vendor + framework |
| `GitGraph-*.js` | 263.97 kB | 84.23 kB | @xyflow/react (ReactFlow) |
| `codeHighlighter-*.js` | 101.32 kB | 29.05 kB | react-syntax-highlighter |
| `LandingPage-*.js` | 39.42 kB | 11.16 kB | Page chunk |
| `LevelPage-*.js` | 35.91 kB | 9.63 kB | Page chunk |
| `ContactPage-*.js` | 31.14 kB | 9.73 kB | Page chunk |
| `theme-toggle-*.js` | 30.15 kB | 9.86 kB | UI component |
| `DashboardPage-*.js` | 28.65 kB | 7.52 kB | Page chunk |
| `ProfilePage-*.js` | 22.61 kB | 6.20 kB | Page chunk |
| `RegisterPage-*.js` | 18.75 kB | 5.99 kB | Page chunk |
| `LoginPage-*.js` | 16.43 kB | 5.26 kB | Page chunk |
| `SettingsPage-*.js` | 14.19 kB | 3.35 kB | Page chunk |
| `PlaygroundPage-*.js` | 14.10 kB | 4.64 kB | Page chunk |
| `ReportIssuePage-*.js` | 14.01 kB | 4.35 kB | Page chunk |
| `Header-*.js` | 8.79 kB | 2.84 kB | Shared component |
| `PublicProfilePage-*.js` | 8.78 kB | 2.67 kB | Page chunk |
| `react-*.js` | 8.68 kB | 3.39 kB | React runtime |
| `AnalyticsPage-*.js` | 8.57 kB | 2.52 kB | Page chunk |
| `LevelMapPage-*.js` | 7.47 kB | 2.66 kB | Page chunk |
| `ReviewPage-*.js` | 7.52 kB | 2.31 kB | Page chunk |
| `LeaderboardPage-*.js` | 7.22 kB | 2.57 kB | Page chunk |
| `AchievementsPage-*.js` | 5.80 kB | 2.20 kB | Page chunk |
| `gitEngineStore-*.js` | 4.40 kB | 1.56 kB | Zustand store |
| `srsStore-*.js` | 3.13 kB | 1.42 kB | Zustand store |
| 22x Lucide icon chunks | ~8 kB total | ~5 kB total | Tree-shaken icons |

### Totals

| Metric | Raw | Gzip |
|---|---|---|
| **Total JS** | ~1,153 kB | ~373 kB |
| **Total CSS** | 43.28 kB | 9.13 kB |
| **HTML** | 3.58 kB | 1.21 kB |
| **Grand Total Transfer** | ~1,200 kB | **~383 kB** |

### CSS Chunks

| Chunk | Raw | Gzip |
|---|---|---|
| `index-*.css` | 27.87 kB | 6.57 kB |
| `GitGraph-*.css` | 15.41 kB | 2.56 kB |

---

## 2. Code Splitting Analysis

### Route-Level Splitting (16 lazy-loaded routes)

All page components use `React.lazy()` + `<Suspense>`:

| Route | Chunk | Lazy Loaded |
|---|---|---|
| `/` | LandingPage | Yes |
| `/login` | LoginPage | Yes |
| `/register` | RegisterPage | Yes |
| `/contact` | ContactPage | Yes |
| `/report` | ReportIssuePage | Yes |
| `/u/:username` | PublicProfilePage | Yes |
| `/dashboard` | DashboardPage | Yes |
| `/learn/:language` | LevelMapPage | Yes |
| `/level/:language/:id` | LevelPage | Yes |
| `/playground` | PlaygroundPage | Yes |
| `/profile` | ProfilePage | Yes |
| `/achievements` | AchievementsPage | Yes |
| `/leaderboard` | LeaderboardPage | Yes |
| `/settings` | SettingsPage | Yes |
| `/analytics` | AnalyticsPage | Yes |
| `/review` | ReviewPage | Yes |

### Component-Level Splitting

- `PlaygroundPage` uses its own internal `lazy()` for sub-components
- `LevelPage` uses its own internal `lazy()` for sub-components
- `GitGraph` is a separate 264 kB chunk (good — isolated from main bundle)
- `codeHighlighter` is a separate 101 kB chunk (good — only loaded on code display pages)
- Zustand stores (`authStore`, `srsStore`, `gitEngineStore`) are separate small chunks

### Non-Split Components (eagerly loaded with main bundle)

- `DemoBanner`, `SaveProgressPrompt`, `OnboardingPopup` — loaded for all authenticated users
- `CommandPalette`, `KeyboardShortcuts` — loaded for all authenticated users
- `Header` — separate chunk (8.79 kB), loaded with authenticated layout
- `Toast`, `ErrorBoundary` — loaded globally

---

## 3. Optimization Techniques Already In Place

### Code Splitting & Lazy Loading
- All 16 routes use `React.lazy()` + `<Suspense>` with a branded `<PageLoader />` fallback
- `AnimatePresence` wraps routes for smooth page transitions
- Internal lazy loading in `PlaygroundPage` and `LevelPage`

### Memoization
- `useMemo` used in 10+ components for expensive computations (sorting, filtering, position calculations)
- `useCallback` used for stable function references (event handlers, form validation)
- `React.memo` applied to `GitGraph` component (heaviest rendered component)

### State Management
- Zustand (lightweight ~1.4 kB gzipped) instead of Redux (~10+ kB)
- Store selectors use granular subscriptions: `useAuthStore(s => s.user)` — avoids unnecessary re-renders

### Styling
- Tailwind CSS v4 (utility-first, zero-runtime CSS)
- CSS custom properties for theming
- Inline styles for one-off animations (avoiding CSS-in-JS overhead)

### Syntax Highlighting
- `PrismLight` (lightweight PrismJS build) instead of full `Prism`
- 12 languages registered (bash, python, c, cpp, java, js, ts, json, css, markdown, yaml, gitignore)
- Two themes loaded: `oneLight` and `oneDark`

### Icons
- `lucide-react` — tree-shakeable icon library
- Icons imported individually per component (only used icons are bundled)

### Build Tooling
- Vite 8 with esbuild for fast builds
- `@vitejs/plugin-react` for JSX transform
- Path alias `@` for clean imports
- TypeScript strict mode

### Accessibility
- Skip-to-content link
- Focus-visible outlines
- Semantic HTML structure

---

## 4. Dependencies Analysis

### Large Dependencies (by estimated gzipped size)

| Dependency | Version | Est. Gzip | Notes |
|---|---|---|---|
| `@xyflow/react` (ReactFlow) | 12.11.0 | ~80 kB | Graph visualization — largest single dep |
| `framer-motion` | 12.40.0 | ~30 kB | Animation library — used in 31 files |
| `react-syntax-highlighter` | 16.1.1 | ~29 kB | Code blocks — PrismLight subset |
| `react-dom` | 19.2.7 | ~40 kB | React DOM renderer |
| `react-router-dom` | 7.17.0 | ~15 kB | Client-side routing |
| `dagre` | 0.8.5 | ~8 kB | Graph layout algorithm |
| `react-confetti` | 6.4.0 | ~5 kB | Celebration effects |
| `zustand` | 5.0.14 | ~1.4 kB | State management |
| `tailwindcss` | 4.3.1 | 0 kB (CSS) | Build-time CSS framework |
| `clsx` + `tailwind-merge` | — | ~2 kB | Utility class helpers |

### Dependency Health
- All dependencies are on recent major versions
- React 19.2.7 (latest stable)
- No deprecated packages detected

### Potential Dependency Concerns
1. **framer-motion** — imported in 31 files (88% of components). Deeply coupled to UI layer.
2. **@xyflow/react** — 264 kB chunk is large. Only used on `GitGraph` component.
3. **react-confetti** — loaded for demo users only but bundled in main chunk
4. **dagre** — graph layout algorithm, bundled in main chunk despite only being used by GitGraph

---

## 5. Issues & Recommendations

### Critical Issues

#### 1. Main Bundle Contains Too Much Vendor Code (445 kB)
**Problem:** The main `index-*.js` chunk contains React, react-dom, react-router-dom, framer-motion, zustand, dagre, react-confetti, and shared components all in one 445 kB file.

**Recommendation:**
```js
// vite.config.ts — manual chunks
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-flow': ['@xyflow/react', 'dagre'],
        }
      }
    }
  }
})
```
This would split the main chunk into ~40 kB (React) + ~15 kB (Router) + ~30 kB (Framer) + ~90 kB (Flow) = smaller, cacheable pieces.

#### 2. framer-motion Bundled in Main Chunk Despite Being Used Lazily
**Problem:** framer-motion (30 kB gzip) is in the main bundle because `App.tsx` imports `AnimatePresence` and `motion` for page transitions. This means every visitor downloads framer-motion even on the landing page.

**Recommendation:** Consider using CSS transitions/animations for route transitions, or lazy-load the animation wrapper. Alternatively, accept this cost since animations are core UX.

#### 3. dagre in Main Chunk Despite Only Being Used by GitGraph
**Problem:** `dagre` (8 kB gzip) is in the main bundle but only used by `GitGraph.tsx` (which is already a separate 264 kB chunk).

**Recommendation:** Move dagre import into `GitGraph.tsx` or create a shared chunk with `@xyflow/react`.

#### 4. No Compression Plugin in Vite Config
**Problem:** Vite config has no `vite-plugin-compression` for gzip/brotli pre-compression.

**Recommendation:**
```bash
npm install -D vite-plugin-compression
```
```js
// vite.config.ts
import compression from 'vite-plugin-compression'
export default defineConfig({
  plugins: [react(), tailwindcss(), compression({ algorithm: 'brotliCompress' })]
})
```
This would produce `.br` files for static hosting (Nginx/Cloudflare can serve pre-compressed files).

### Performance Issues

#### 5. GitGraph Chunk Too Large (264 kB)
**Problem:** `@xyflow/react` + its dependencies produce a 264 kB chunk. This is loaded when any user navigates to a level that shows the git graph.

**Recommendations:**
- Use dynamic import for ReactFlow: `const ReactFlow = lazy(() => import('@xyflow/react'))`
- Consider lighter alternatives if only simple graph rendering is needed (e.g., custom SVG rendering with dagre directly)

#### 6. react-syntax-highlighter Loads 12 Languages (101 kB)
**Problem:** Even with PrismLight, registering 12 languages adds significant weight.

**Recommendation:** Only register languages that are actually used per page:
```ts
// Only register what LevelPage needs for its specific level
const langMap = { bash, python, c, cpp, java, javascript, typescript, json, css, markdown, yaml };
const needed = level.languages.map(l => langMap[l]).filter(Boolean);
needed.forEach(([name, grammar]) => Prism.registerLanguage(name, grammar));
```

#### 7. theme-toggle Component at 30 kB
**Problem:** The `theme-toggle` component is 30 kB gzipped — unusually large for a toggle.

**Recommendation:** Review `src/components/ui/theme-toggle.tsx` for unnecessary dependencies. This may be pulling in a full theme library.

#### 8. Dev/Prod Build Sizes Are Identical
**Problem:** `vite build --mode development` produces the same chunk sizes as production. This suggests minification may not be running, or the build mode isn't being applied correctly.

**Recommendation:** Verify that `vite build` is actually minifying (check for `terser` or `esbuild` minify option). In Vite 8, ensure `build.minify` is not set to `false`.

### Minor Improvements

#### 9. Lazy Load react-confetti
**Problem:** `react-confetti` (5 kB gzip) is imported in components used only by demo users.

**Recommendation:** Lazy-load the confetti component to avoid downloading it for non-demo users.

#### 10. No Virtualization for Long Lists
**Problem:** `LeaderboardPage` and `AchievementsPage` render full lists without virtualization.

**Recommendation:** Use `@tanstack/react-virtual` or `react-window` for lists >50 items.

#### 11. No Service Worker / Caching Strategy
**Problem:** No offline support or cache-first strategy for static assets.

**Recommendation:** Add a service worker with workbox for cache-first loading of JS/CSS chunks.

#### 12. Public Assets Not Optimized
**Problem:** `public/profile.jpeg` is 105 kB (uncompressed). No responsive image formats (WebP/AVIF).

**Recommendation:** Convert to WebP, add responsive `srcset`, consider using `<picture>` element.

---

## 6. Load Time Estimates

### Transfer Size (Gzip)
- Initial HTML: 1.21 kB
- Main JS chunk: 139.85 kB (must load for任何交互)
- Main CSS: 6.57 kB
- **Critical path total: ~147.63 kB gzip**

### Estimated Load Times by Network

| Network | Speed | Critical Path (~148 kB) | Full JS (~373 kB) | Total Page |
|---|---|---|---|---|
| **3G** | 1.6 Mbps | ~0.74s | ~1.87s | ~2.5s |
| **4G** | 9 Mbps | ~0.13s | ~0.33s | ~0.5s |
| **Broadband** | 50 Mbps | ~0.02s | ~0.06s | ~0.1s |
| **WiFi** | 30 Mbps | ~0.04s | ~0.10s | ~0.15s |

### Perceived Performance
- **FCP (First Contentful Paint):** ~0.3-0.5s on 4G (HTML + CSS render)
- **LCP (Largest Contentful Paint):** ~0.5-1.0s on 4G (hero section rendered)
- **TTI (Time to Interactive):** ~1.0-1.5s on 4G (main JS parsed + hydration)
- **Route transition:** ~0.25s (framer-motion animation duration)

### Notes
- Estimates assume no server-side rendering (CSR only)
- Additional latency from API calls not included
- Cold cache scenario; repeat visits benefit from browser caching
- Gzip decompression adds ~5-10ms overhead on mobile

---

## 7. Summary

### What's Working Well
- Route-level code splitting is comprehensive (16/16 routes lazy loaded)
- Zustand keeps state management lightweight
- Lucide-react icons are tree-shaken properly
- PrismLight reduces syntax highlighter weight
- useMemo/useCallback prevent unnecessary re-renders
- GitGraph and codeHighlighter are isolated in separate chunks

### Priority Fixes (Ordered by Impact)
1. **Manual chunks** in Vite config — splits 445 kB main bundle into cacheable vendor pieces
2. **Compression plugin** — reduces transfer by ~60-70% with brotli
3. **Move dagre to GitGraph chunk** — removes 8 kB from main bundle
4. **Lazy load react-confetti** — saves 5 kB for non-demo users
5. **Virtualize long lists** — prevents jank on leaderboard/achievements pages

### Overall Assessment
**Good.** The codebase demonstrates solid performance fundamentals: comprehensive code splitting, proper memoization, lightweight state management, and tree-shakeable dependencies. The main area for improvement is the 445 kB main bundle, which could be split into smaller vendor chunks for better caching. With manual chunk splitting and compression, the critical path could drop from ~148 kB to ~60-80 kB gzip.
