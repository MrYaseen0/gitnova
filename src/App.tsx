import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import DemoBanner from './pages/DemoBanner';
import SaveProgressPrompt from './components/SaveProgressPrompt';
import OnboardingPopup from './components/OnboardingPopup';
import CommandPalette from './components/CommandPalette';
import KeyboardShortcuts, { useKeyboardShortcuts } from './components/KeyboardShortcuts';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ReportIssuePage = lazy(() => import('./pages/ReportIssuePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LevelMapPage = lazy(() => import('./pages/LevelMapPage'));
const LevelPage = lazy(() => import('./pages/LevelPage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAF8',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Inter' }}>Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { isOpen: shortcutsOpen, setIsOpen: setShortcutsOpen } = useKeyboardShortcuts();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: -9999,
          top: 'auto',
          width: 1,
          height: 1,
          overflow: 'hidden',
          zIndex: 99999,
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = 'fixed';
          e.currentTarget.style.left = '16px';
          e.currentTarget.style.top = '16px';
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.padding = '12px 24px';
          e.currentTarget.style.background = '#2D6A4F';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.fontWeight = '700';
          e.currentTarget.style.textDecoration = 'none';
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = 'absolute';
          e.currentTarget.style.left = '-9999px';
          e.currentTarget.style.width = '1px';
          e.currentTarget.style.height = '1px';
        }}
      >
        Skip to main content
      </a>
      {user?.isDemo && <DemoBanner />}
      {user?.isDemo && <SaveProgressPrompt />}
      {user?.isDemo && <OnboardingPopup />}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <KeyboardShortcuts isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      {children}
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/report" element={<PageTransition><ReportIssuePage /></PageTransition>} />
            <Route path="/u/:username" element={<PageTransition><PublicProfilePage /></PageTransition>} />
            <Route path="/dashboard" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><DashboardPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/learn/:language" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><LevelMapPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/level/:language/:id" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><LevelPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/playground" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><PlaygroundPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><ProfilePage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><AchievementsPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><LeaderboardPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><SettingsPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><AnalyticsPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><AuthenticatedLayout><PageTransition><ReviewPage /></PageTransition></AuthenticatedLayout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
}
