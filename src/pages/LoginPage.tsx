import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GitBranch,
  ArrowRight,
  Play,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../lib/api';
import { ThemeToggle } from '../components/ui/theme-toggle';

/* ─── animations ────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

/* ─── floating particle component ───────────────────────────────────────── */

function Particle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  // eslint-disable-next-line react-hooks/refs, react-hooks/purity
  const duration = useRef(4 + Math.random() * 3).current;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [0, -40, -80],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.35)',
        pointerEvents: 'none',
      }}
    />
  );
}

/* ─── animated git branch SVG ───────────────────────────────────────────── */

function GitBranchAnimation() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      style={{ opacity: 0.15 }}
    >
      {/* main branch line */}
      <motion.path
        d="M80 40 L80 280"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      {/* branch A */}
      <motion.path
        d="M80 100 Q160 100 200 160"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
      />
      {/* branch B */}
      <motion.path
        d="M80 180 Q180 180 220 220"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.4, ease: 'easeInOut' }}
      />
      {/* nodes */}
      {[
        { cx: 80, cy: 40, r: 8, delay: 0.3 },
        { cx: 80, cy: 100, r: 8, delay: 0.7 },
        { cx: 200, cy: 160, r: 10, delay: 1.6 },
        { cx: 80, cy: 180, r: 8, delay: 1.2 },
        { cx: 220, cy: 220, r: 10, delay: 2.0 },
        { cx: 80, cy: 280, r: 8, delay: 1.8 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          fill="#fff"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: node.delay, }}
        />
      ))}
    </svg>
  );
}

/* ─── providers ──────────────────────────────────────────────────────────── */

const providers = [
  { name: 'GitHub', svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>, bg: '#24292e', color: '#fff' },
  { name: 'Google', svg: <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>, bg: '#fff', color: '#1A1A1A', border: '#E8E4DD' },
  { name: 'Microsoft', svg: <svg viewBox="0 0 24 24" width="16" height="16"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>, bg: '#fff', color: '#1A1A1A', border: '#E8E4DD' },
  { name: 'LinkedIn', svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, bg: '#0077B5', color: '#fff' },
];

/* ─── main component ────────────────────────────────────────────────────── */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loginAsDemo, loginWithProvider } = useAuthStore();
  const navigate = useNavigate();

  const validate = useCallback(() => {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try demo mode!');
    }
  };

  const handleProvider = async (name: string) => {
    setError('');
    setLoading(true);
    const ok = await loginWithProvider(name);
    setLoading(false);
    if (ok) navigate('/dashboard');
  };

  const handleDemo = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)', position: 'relative' }}>
      {/* Theme toggle */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <ThemeToggle size="sm" />
      </div>

      {/* ─── Left panel: illustration ────────────────────────────────────── */}
      <div
        className="login-left"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #52B788 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
      >
        {/* floating particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <Particle
            key={i}
            delay={i * 0.4}
            x={10 + (i * 37) % 80}
            y={20 + (i * 53) % 60}
            size={3 + (i % 4) * 2}
          />
        ))}

        {/* animated git branch */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <GitBranchAnimation />
        </div>

        {/* brand content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{ position: 'relative', zIndex: 2, color: '#fff', maxWidth: 420, textAlign: 'center' }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <GitBranch size={40} strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}
          >
            Welcome to GitNova Pro
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7, maxWidth: 340, margin: '0 auto' }}>
            Master version control, one commit at a time. Join thousands of developers leveling up their Git skills.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ marginTop: 40, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {[{ n: '50+', l: 'Levels' }, { n: '10K+', l: 'Learners' }, { n: '4.9★', l: 'Rating' }].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 16,
                  padding: '14px 20px',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  minWidth: 90,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800 }}>{s.n}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Right panel: form ───────────────────────────────────────────── */}
      <div
        className="login-right"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          background: 'var(--background)',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ width: '100%', maxWidth: 420 }}>
          {/* heading */}
          <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
              Sign in
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Enter your credentials to continue
            </p>
          </motion.div>

          {/* social login buttons */}
          <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {providers.map((p) => (
              <motion.button
                key={p.name}
                whileHover={{ scale: 1.03, y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleProvider(p.name)}
                disabled={loading}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `1.5px solid ${p.border || 'rgba(0,0,0,0.08)'}`,
                  background: p.bg,
                  color: p.color,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.6 : 1,
                  fontFamily: 'Inter',
                }}
              >
                {p.svg}
                <span>{p.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* divider */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </motion.div>

          {/* error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#DC2626',
                  fontSize: 13,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* form */}
          <form onSubmit={handleLogin}>
            {/* email — floating label */}
            <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--text-placeholder)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 42px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border)',
                    fontSize: 14,
                    outline: 'none',
                    background: 'var(--surface)',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-primary)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2D6A4F';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <label
                  htmlFor="login-email"
                  style={{
                    position: 'absolute',
                    left: 42,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 14,
                    color: 'var(--text-placeholder)',
                    pointerEvents: 'none',
                    transition: 'all 0.2s ease',
                    background: 'var(--background)',
                    padding: '0 4px',
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const input = el.parentElement?.querySelector('input');
                    if (!input) return;
                    const moveLabel = () => {
                      if (input.value || input === document.activeElement) {
                        el.style.top = '0';
                        el.style.fontSize = '11px';
                        el.style.color = '#2D6A4F';
                        el.style.fontWeight = '600';
                      } else {
                        el.style.top = '50%';
                        el.style.fontSize = '14px';
                        el.style.color = 'var(--text-placeholder)';
                        el.style.fontWeight = '400';
                      }
                    };
                    input.addEventListener('focus', moveLabel);
                    input.addEventListener('blur', moveLabel);
                    moveLabel();
                    return () => {
                      input.removeEventListener('focus', moveLabel);
                      input.removeEventListener('blur', moveLabel);
                    };
                  }}
                >
                  Email address
                </label>
              </div>
            </motion.div>

            {/* password — floating label */}
            <motion.div variants={fadeUp} style={{ marginBottom: 12 }}>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--text-placeholder)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  type={showPw ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 42px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border)',
                    fontSize: 14,
                    outline: 'none',
                    background: 'var(--surface)',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-primary)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2D6A4F';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <label
                  htmlFor="login-password"
                  style={{
                    position: 'absolute',
                    left: 42,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 14,
                    color: 'var(--text-placeholder)',
                    pointerEvents: 'none',
                    transition: 'all 0.2s ease',
                    background: 'var(--background)',
                    padding: '0 4px',
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const input = el.parentElement?.querySelector('input');
                    if (!input) return;
                    const moveLabel = () => {
                      if (input.value || input === document.activeElement) {
                        el.style.top = '0';
                        el.style.fontSize = '11px';
                        el.style.color = '#2D6A4F';
                        el.style.fontWeight = '600';
                      } else {
                        el.style.top = '50%';
                        el.style.fontSize = '14px';
                        el.style.color = 'var(--text-placeholder)';
                        el.style.fontWeight = '400';
                      }
                    };
                    input.addEventListener('focus', moveLabel);
                    input.addEventListener('blur', moveLabel);
                    moveLabel();
                    return () => {
                      input.removeEventListener('focus', moveLabel);
                      input.removeEventListener('blur', moveLabel);
                    };
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={18} color="var(--text-placeholder)" /> : <Eye size={18} color="var(--text-placeholder)" />}
                </button>
              </div>
            </motion.div>

            {/* remember me + forgot password */}
            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    accentColor: '#2D6A4F',
                    cursor: 'pointer',
                  }}
                />
                Remember me
              </label>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  if (!email.trim()) {
                    setError('Enter your email above first, then click Forgot password');
                    return;
                  }
                  try {
                    const res = await authApi.forgotPassword(email);
                    alert(res.message);
                  } catch {
                    alert('If an account with that email exists, a reset link has been sent.');
                  }
                }}
                style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600, textDecoration: 'none' }}
              >
                Forgot password?
              </a>
            </motion.div>

            {/* submit button */}
            <motion.div variants={fadeUp}>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 6px 24px rgba(45,106,79,0.3)' }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 15,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: loading ? 0.75 : 1,
                  boxShadow: '0 4px 16px rgba(45,106,79,0.25)',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* demo button */}
          <motion.div variants={fadeUp} style={{ marginTop: 20 }}>
            <motion.button
              whileHover={{ scale: 1.02, borderColor: '#2D6A4F' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemo}
              disabled={loading}
              style={{
                width: '100%',
                padding: 13,
                borderRadius: 12,
                background: 'transparent',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <Play size={16} /> Try Demo — No Sign Up
            </motion.button>
          </motion.div>

          {/* register link */}
          <motion.p variants={fadeUp} style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--text-secondary)' }}>
            New here?{' '}
            <Link to="/register" style={{ color: '#2D6A4F', fontWeight: 700, textDecoration: 'none' }}>
              Create account
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* responsive styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .login-left { display: none !important; }
          .login-right { padding: 24px 20px !important; }
        }
      `}</style>
    </div>
  );
}
