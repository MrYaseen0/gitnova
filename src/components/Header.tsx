import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User, Settings, Trophy, Star, Flame } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ThemeToggle } from './ui/theme-toggle';
import Logo from './Logo';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/learn/git', label: 'Learn' },
        { to: '/playground', label: 'Playground' },
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/analytics', label: 'Analytics' },
        { to: '/contact', label: 'Contact' },
        { to: '/report', label: 'Report' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/report', label: 'Report' },
        { to: '/login', label: 'Sign In' },
      ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid rgba(232,228,221,0.5)',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      className="header-glass"
    >
      <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Logo size={32} />
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: location.pathname === link.to ? '#2D6A4F' : '#6B7280',
              background: location.pathname === link.to ? 'rgba(45,106,79,0.08)' : 'transparent',
              textDecoration: 'none',
              transition: 'all .2s',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Cmd+K hint */}
        {isAuthenticated && (
          <button
            onClick={() => {
              // Dispatch Cmd+K event to open command palette
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: '#F0EEE9',
              border: '1px solid #E8E4DD',
              cursor: 'pointer',
              fontSize: 12,
              color: '#9CA3AF',
              fontWeight: 500,
            }}
            className="cmd-k-hint"
          >
            <span style={{ fontSize: 11 }}>⌘K</span>
          </button>
        )}

        <ThemeToggle size="sm" />
        
        {isAuthenticated && user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 12,
                background: 'rgba(248,248,246,0.8)',
                border: '1px solid rgba(232,228,221,0.5)',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}>
                {user.avatar}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{user.name.split(' ')[0]}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flame size={12} color="#F4845F" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#F4845F' }}>{user.streak}</span>
              </div>
              <ChevronDown size={14} color="#6B7280" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    width: 220,
                    background: '#fff',
                    border: '1px solid #E8E4DD',
                    borderRadius: 16,
                    padding: 8,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #E8E4DD', marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>@{user.username}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Star size={12} color="#E9C46A" fill="#E9C46A" />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Level {user.level} — {user.rank}</span>
                    </div>
                  </div>
                  {[
                    { icon: User, label: 'Profile', to: '/profile' },
                    { icon: Trophy, label: 'Achievements', to: '/achievements' },
                    { icon: Settings, label: 'Settings', to: '/settings' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#1A1A1A',
                        textDecoration: 'none',
                        transition: 'background .15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8F8F6')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <item.icon size={16} color="#6B7280" />
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: '#E8E4DD', margin: '4px 0' }} />
                  <button
                    onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#EF4444',
                      width: '100%',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(45,106,79,0.25)',
              transition: 'transform .2s, box-shadow .2s',
            }}
          >
            Get Started
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-menu-btn"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        style={{ display: 'none', background: 'transparent', border: 'none', padding: 8 }}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-menu"
            style={{
              position: 'absolute',
              top: 64,
              left: 0,
              right: 0,
              background: '#fff',
              borderBottom: '1px solid #E8E4DD',
              padding: 16,
              display: 'none',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: location.pathname === link.to ? '#2D6A4F' : '#1A1A1A',
                  background: location.pathname === link.to ? 'rgba(45,106,79,0.08)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </motion.header>
  );
}
