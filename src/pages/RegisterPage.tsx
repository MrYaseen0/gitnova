import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  AtSign,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LanguageIcon from '../components/LanguageIcon';
import { ThemeToggle } from '../components/ui/theme-toggle';
import type { Language } from '../types';
import { TRACK_INFO } from '../data/levels';

/* ─── animations ────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const cardPop = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, } },
};

/* ─── particle ───────────────────────────────────────────────────────────── */

function Particle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  // eslint-disable-next-line react-hooks/refs, react-hooks/purity
  const duration = useRef(4 + Math.random() * 3).current;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0], y: [0, -35, -70] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: size, height: size, borderRadius: '50%',
        background: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
      }}
    />
  );
}

/* ─── growing git branch ────────────────────────────────────────────────── */

function GrowingBranch() {
  return (
    <svg width="300" height="360" viewBox="0 0 300 360" fill="none" style={{ opacity: 0.18 }}>
      {/* main trunk */}
      <motion.path
        d="M60 320 L60 40"
        stroke="#fff" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />
      {/* branch right */}
      <motion.path
        d="M60 240 Q140 240 180 180 Q210 140 260 140"
        stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 1.0, ease: 'easeInOut' }}
      />
      {/* branch left */}
      <motion.path
        d="M60 160 Q120 160 160 100 Q190 60 240 60"
        stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 1.6, ease: 'easeInOut' }}
      />
      {/* merge back */}
      <motion.path
        d="M260 140 Q280 200 200 240 Q140 260 60 260"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="6 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 2.8, ease: 'easeInOut' }}
      />
      {/* nodes */}
      {[
        { cx: 60, cy: 320, r: 7, d: 0.2 },
        { cx: 60, cy: 240, r: 7, d: 0.9 },
        { cx: 180, cy: 180, r: 9, d: 2.0 },
        { cx: 260, cy: 140, r: 9, d: 2.4 },
        { cx: 60, cy: 160, r: 7, d: 1.5 },
        { cx: 240, cy: 60, r: 9, d: 2.6 },
        { cx: 60, cy: 40, r: 7, d: 2.0 },
      ].map((n, i) => (
        <motion.circle
          key={i} cx={n.cx} cy={n.cy} r={n.r} fill="#fff"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: n.d, }}
        />
      ))}
      {/* floating leaf nodes */}
      {[
        { cx: 200, cy: 240, r: 4, d: 3.2 },
        { cx: 160, cy: 100, r: 4, d: 3.0 },
      ].map((n, i) => (
        <motion.circle
          key={`leaf-${i}`} cx={n.cx} cy={n.cy} r={n.r} fill="rgba(255,255,255,0.5)"
          initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: 0.6, delay: n.d, }}
        />
      ))}
    </svg>
  );
}

/* ─── avatar options ─────────────────────────────────────────────────────── */

const AVATARS = ['🦊', '🐱', '🐼', '🦁', '🐧', '🦉'];

/* ─── validation ─────────────────────────────────────────────────────────── */

interface FormErrors {
  [key: string]: string | undefined;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateStep1(form: { name: string; username: string; email: string; password: string; confirmPassword: string }): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Full name is required';
  if (!form.username.trim()) errors.username = 'Username is required';
  else if (form.username.length < 3) errors.username = 'At least 3 characters';
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errors.username = 'Letters, numbers, underscore only';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'At least 6 characters';
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm password';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

/* ─── main component ────────────────────────────────────────────────────── */

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [language, setLanguage] = useState<Language>('git');
  const [avatar, setAvatar] = useState('🦊');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const { register, loginWithProvider } = useAuthStore();
  const navigate = useNavigate();

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const goNext = () => {
    if (step === 1) {
      const errors = validateStep1(form);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const ok = await register({
      name: form.name,
      username: form.username,
      email: form.email,
      password: form.password,
      language,
    });
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Registration failed. Please try again.');
  };

  const progress = (step / 3) * 100;

  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    1: { title: 'Create account', subtitle: 'Fill in your details to get started' },
    2: { title: 'Pick your track', subtitle: 'Choose a language to focus on first' },
    3: { title: 'Choose your avatar', subtitle: 'Pick a character to represent you' },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)', position: 'relative' }}>
      {/* Theme toggle */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <ThemeToggle size="sm" />
      </div>

      {/* ─── Left panel ──────────────────────────────────────────────────── */}
      <div
        className="reg-left"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #52B788 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 48, position: 'relative', overflow: 'hidden', minHeight: '100vh',
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <Particle key={i} delay={i * 0.5} x={8 + (i * 41) % 84} y={15 + (i * 47) % 65} size={3 + (i % 3) * 2} />
        ))}

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <GrowingBranch />
        </div>

        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ position: 'relative', zIndex: 2, color: '#fff', maxWidth: 420, textAlign: 'center' }}>
          <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <GitBranch size={40} strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Start your journey
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7, maxWidth: 340, margin: '0 auto' }}>
            Create an account to track your progress, earn XP, and unlock achievements on your path to Git mastery.
          </motion.p>
        </motion.div>
      </div>

      {/* ─── Right panel ─────────────────────────────────────────────────── */}
      <div
        className="reg-right"
        style={{
          flex: 1.15, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 48, background: 'var(--background)', minHeight: '100vh', overflow: 'auto',
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ width: '100%', maxWidth: 460 }}>
          {/* progress bar */}
          <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    fontSize: 12, fontWeight: 700,
                    color: step >= s ? '#2D6A4F' : 'var(--text-placeholder)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: step > s ? '#2D6A4F' : step === s ? 'linear-gradient(135deg, #2D6A4F, #52B788)' : 'var(--surface-alt)',
                    color: step >= s ? '#fff' : 'var(--text-placeholder)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                    transition: 'all 0.3s',
                  }}>
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  <span style={{ display: s === 1 ? 'none' : undefined }} className="step-label">
                    {s === 1 ? 'Info' : s === 2 ? 'Track' : 'Avatar'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 4, borderRadius: 4, background: 'var(--surface-alt)', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, }}
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(135deg, #2D6A4F, #52B788)' }}
              />
            </div>
          </motion.div>

          {/* step title */}
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
                {stepTitles[step].title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 15 }}>
                {stepTitles[step].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12,
                  padding: '12px 14px', color: '#DC2626', fontSize: 13, marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* step content */}
          <AnimatePresence mode="wait">
            {/* ─── Step 1: Personal info ──────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                {/* Social signup buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                  {[
                    { name: 'GitHub', svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>, bg: '#24292e', color: '#fff', border: 'none' },
                    { name: 'Google', svg: <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>, bg: '#fff', color: '#1A1A1A', border: '#E8E4DD' },
                    { name: 'Microsoft', svg: <svg viewBox="0 0 24 24" width="16" height="16"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>, bg: '#fff', color: '#1A1A1A', border: '#E8E4DD' },
                    { name: 'LinkedIn', svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, bg: '#0077B5', color: '#fff', border: 'none' },
                  ].map((p) => (
                    <motion.button
                      key={p.name}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={async () => { setLoading(true); const ok = await loginWithProvider(p.name); setLoading(false); if (ok) navigate('/dashboard'); }}
                      style={{
                        padding: '11px 14px', borderRadius: 12,
                        border: `1.5px solid ${p.border}`, background: p.bg, color: p.color,
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontFamily: 'Inter',
                      }}
                    >
                      {p.svg}
                      <span>{p.name}</span>
                    </motion.button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>or continue with email</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                {[
                  { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
                  { key: 'username', label: 'Username', icon: AtSign, type: 'text', placeholder: 'johndoe' },
                  { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'john@example.com' },
                  { key: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
                  { key: 'confirmPassword', label: 'Confirm Password', icon: Lock, type: 'password', placeholder: '••••••••' },
                ].map((field) => (
                  <div key={field.key} style={{ marginBottom: 18 }}>
                    <div style={{ position: 'relative' }}>
                      <field.icon
                        size={18}
                        color={fieldErrors[field.key] ? '#DC2626' : 'var(--text-placeholder)'}
                        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                      />
                      <input
                        type={field.type}
                        value={(form as Record<string, string>)[field.key]}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder=" "
                        required
                        style={{
                          width: '100%',
                          padding: '14px 14px 14px 42px',
                          borderRadius: 12,
                          border: `1.5px solid ${fieldErrors[field.key] ? '#FECACA' : 'var(--border)'}`,
                          fontSize: 14, outline: 'none',
                          background: 'var(--surface)',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--text-primary)',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        onFocus={(e) => {
                          if (!fieldErrors[field.key]) {
                            e.currentTarget.style.borderColor = '#2D6A4F';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.12)';
                          }
                        }}
                        onBlur={(e) => {
                          if (!fieldErrors[field.key]) {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      />
                      <label
                        style={{
                          position: 'absolute', left: 42, top: '50%', transform: 'translateY(-50%)',
                          fontSize: 14, color: 'var(--text-placeholder)', pointerEvents: 'none',
                          transition: 'all 0.2s ease',
                          background: 'var(--background)', padding: '0 4px',
                        }}
                        ref={(el) => {
                          if (!el) return;
                          const input = el.parentElement?.querySelector('input');
                          if (!input) return;
                          const move = () => {
                            if (input.value || input === document.activeElement) {
                              el.style.top = '0'; el.style.fontSize = '11px';
                              el.style.color = '#2D6A4F'; el.style.fontWeight = '600';
                            } else {
                              el.style.top = '50%'; el.style.fontSize = '14px';
                              el.style.color = 'var(--text-placeholder)'; el.style.fontWeight = '400';
                            }
                          };
                          input.addEventListener('focus', move);
                          input.addEventListener('blur', move);
                          move();
                          return () => {
                            input.removeEventListener('focus', move);
                            input.removeEventListener('blur', move);
                          };
                        }}
                      >
                        {field.label}
                      </label>
                    </div>
                    {fieldErrors[field.key] && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: '#DC2626', fontSize: 12, marginTop: 4, paddingLeft: 4 }}
                      >
                        {fieldErrors[field.key]}
                      </motion.p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* ─── Step 2: Language preference ────────────────────────────── */}
            {step === 2 && (
              <motion.div key="step2" variants={stagger} initial="hidden" animate="visible" exit="exit">
                <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                  {(Object.keys(TRACK_INFO) as Language[]).map((lang) => (
                    <motion.button
                      key={lang}
                      type="button"
                      variants={cardPop}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setLanguage(lang)}
                      style={{
                        padding: '20px 12px',
                        borderRadius: 16,
                        border: `2px solid ${language === lang ? '#2D6A4F' : 'var(--border)'}`,
                        background: language === lang
                          ? 'linear-gradient(135deg, rgba(45,106,79,0.08), rgba(82,183,136,0.12))'
                          : 'var(--surface)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        position: 'relative',
                        boxShadow: language === lang ? '0 4px 16px rgba(45,106,79,0.15)' : 'none',
                      }}
                    >
                      {language === lang && (
                        <div style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 20, height: 20, borderRadius: '50%',
                          background: '#2D6A4F', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                      <div style={{ marginBottom: 8 }}><LanguageIcon lang={lang} size={36} color={TRACK_INFO[lang].color} /></div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: language === lang ? '#2D6A4F' : 'var(--text-primary)' }}>
                        {TRACK_INFO[lang].name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                        {TRACK_INFO[lang].description}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ─── Step 3: Avatar picker ──────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="step3" variants={stagger} initial="hidden" animate="visible" exit="exit">
                <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {AVATARS.map((a) => (
                    <motion.button
                      key={a}
                      type="button"
                      whileHover={{ scale: 1.08, y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setAvatar(a)}
                      style={{
                        padding: '24px 0',
                        borderRadius: 18,
                        border: `2.5px solid ${avatar === a ? '#2D6A4F' : 'var(--border)'}`,
                        background: avatar === a
                          ? 'linear-gradient(135deg, rgba(45,106,79,0.08), rgba(82,183,136,0.12))'
                          : 'var(--surface)',
                        cursor: 'pointer',
                        fontSize: 40,
                        transition: 'all 0.2s',
                        boxShadow: avatar === a ? '0 4px 20px rgba(45,106,79,0.18)' : 'none',
                        position: 'relative',
                      }}
                    >
                      {avatar === a && (
                        <div style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 22, height: 22, borderRadius: '50%',
                          background: '#2D6A4F', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={13} color="#fff" />
                        </div>
                      )}
                      {a}
                    </motion.button>
                  ))}
                </motion.div>
                <motion.p variants={fadeUp} style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
                  You can change this later in settings
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Navigation buttons ─────────────────────────────────────────── */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={goBack}
                disabled={loading}
                style={{
                  flex: '0 0 auto',
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: '1.5px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'border-color 0.2s',
                }}
              >
                <ArrowLeft size={16} /> Back
              </motion.button>
            )}

            {step < 3 ? (
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 6px 24px rgba(45,106,79,0.3)' }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                onClick={goNext}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 14,
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
                  gap: 8,
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 16px rgba(45,106,79,0.25)',
                }}
              >
                Next <ArrowRight size={18} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 6px 24px rgba(45,106,79,0.3)' }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 14,
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
                  gap: 8,
                  opacity: loading ? 0.75 : 1,
                  boxShadow: '0 4px 16px rgba(45,106,79,0.25)',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* login link */}
          <motion.p variants={fadeUp} style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2D6A4F', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* responsive styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .reg-left { display: none !important; }
          .reg-right { padding: 24px 20px !important; }
        }
        @media (max-width: 400px) {
          .step-label { display: none !important; }
        }
      `}</style>
    </div>
  );
}
