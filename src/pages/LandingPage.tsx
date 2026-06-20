import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Zap, Trophy, GitBranch, ArrowRight, ChevronRight, Star, BookOpen, Terminal, Shield, Sparkles, Code2, GitMerge, ExternalLink, Users, Target, Rocket, Heart, CheckCircle2, ChevronLeft, Quote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { TRACK_INFO } from '../data/levels';
import LanguageIcon from '../components/LanguageIcon';
import Header from '../components/Header';
import type { Language } from '../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const features = [
  { icon: BookOpen, title: 'Interactive Lessons', desc: 'Learn by doing with step-by-step guided tutorials that adapt to your pace.', color: '#2D6A4F' },
  { icon: Terminal, title: 'Real Terminal', desc: 'Practice in a simulated Git terminal — no installation required.', color: '#52B788' },
  { icon: Trophy, title: 'Level Up & Earn XP', desc: 'Track your progress, earn XP, and unlock achievements as you master each concept.', color: '#F4845F' },
  { icon: Shield, title: 'Boss Challenges', desc: "Test your skills with real-world projects that combine everything you've learned.", color: '#E9C46A' },
];

const testimonials = [
  { name: 'Early Tester', role: 'Beta User', text: 'GitNova made Git finally click for me. The interactive terminal is a great way to practice!', avatar: '🧑‍💻', rating: 5 },
  { name: 'Student Reviewer', role: 'CS Student', text: 'A creative approach to learning version control. The level system keeps you engaged.', avatar: '👨‍💻', rating: 5 },
];

const stats = [
  { value: 50, suffix: '+', label: 'Levels', icon: Target },
  { value: 5, suffix: '', label: 'Languages', icon: Code2 },
  { value: 18, suffix: '', label: 'Achievements', icon: CheckCircle2 },
  { value: 100, suffix: '%', label: 'Free', icon: Users },
];

const techIcons = [
  { name: 'React', icon: Code2, color: '#61DAFB' },
  { name: 'Node.js', icon: Terminal, color: '#68A063' },
  { name: 'Python', icon: Code2, color: '#3776AB' },
  { name: 'TypeScript', icon: Code2, color: '#3178C6' },
  { name: 'Java', icon: Code2, color: '#ED8B00' },
  { name: 'C++', icon: Code2, color: '#00599C' },
  { name: 'Git', icon: GitMerge, color: '#F05032' },
  { name: 'GitHub', icon: ExternalLink, color: '#1A1A1A' },
];

/* ─── Animated counter hook ────────────────────────────────────────── */
function useCounter(end: number, duration = 2000, inView = true) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration, inView]);

  return count;
}

/* ─── Particle background ──────────────────────────────────────────── */
function ParticleField() {
  /* eslint-disable react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs */
  const particles = useRef(Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 3 + Math.random() * 5,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 10,
    color: ['#2D6A4F', '#52B788', '#F4845F', '#E9C46A'][i % 4],
  }))).current;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0.15,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Decorative SVG path ──────────────────────────────────────────── */
function DecoPath() {
  return (
    <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: '100%', height: 'auto' }}>
      <path d="M0 60 Q300 0 600 60 T1200 60" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="8 8" opacity="0.3" />
      <path d="M0 80 Q300 30 600 80 T1200 80" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.2" />
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="50%" stopColor="#52B788" />
          <stop offset="100%" stopColor="#2D6A4F" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F4845F" />
          <stop offset="50%" stopColor="#E9C46A" />
          <stop offset="100%" stopColor="#F4845F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Animated Git branch tree ─────────────────────────────────────── */
function GitBranchSVG() {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
      <defs>
        <linearGradient id="branchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#52B788" />
        </linearGradient>
        <linearGradient id="nodeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#52B788" />
        </linearGradient>
        <linearGradient id="nodeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4845F" />
          <stop offset="100%" stopColor="#E9C46A" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d="M80 200 L200 200 Q220 200 230 190 L280 140 Q290 130 310 130 L350 130"
        stroke="url(#branchGrad)" strokeWidth="3" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, }}
      />
      <motion.path
        d="M230 190 Q240 200 250 210 L280 260 Q290 270 310 270 L350 270"
        stroke="url(#nodeGrad2)" strokeWidth="3" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.8, }}
      />
      <motion.path
        d="M310 270 L350 270"
        stroke="#F4845F" strokeWidth="2" strokeDasharray="4 4" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      />
      <motion.circle cx="80" cy="200" r="10" fill="url(#nodeGrad1)" filter="url(#glow)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <motion.circle cx="200" cy="200" r="10" fill="url(#nodeGrad1)" filter="url(#glow)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} />
      <motion.circle cx="280" cy="140" r="8" fill="url(#nodeGrad1)" filter="url(#glow)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} />
      <motion.circle cx="350" cy="130" r="12" fill="#2D6A4F" filter="url(#glow)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
      <motion.circle cx="280" cy="260" r="8" fill="url(#nodeGrad2)" filter="url(#glow)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} />
      <motion.circle cx="350" cy="270" r="12" fill="#F4845F" filter="url(#glow)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2 }} />
      <motion.text x="60" y="230" fill="#2D6A4F" fontSize="12" fontFamily="Sora" fontWeight="600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>main</motion.text>
      <motion.text x="265" y="115" fill="#52B788" fontSize="11" fontFamily="Sora" fontWeight="600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>feature</motion.text>
      <motion.text x="265" y="290" fill="#F4845F" fontSize="11" fontFamily="Sora" fontWeight="600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>bugfix</motion.text>
    </svg>
  );
}

/* ─── Animated stat card ───────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const count = useCounter(stat.value, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      style={{ textAlign: 'center', minWidth: 140 }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(45,106,79,0.1), rgba(82,183,136,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <stat.icon size={22} color="#2D6A4F" />
      </div>
      <div style={{ fontFamily: 'Sora', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>{stat.label}</div>
    </motion.div>
  );
}

/* ─── Testimonial carousel ─────────────────────────────────────────── */
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => { if (timeoutRef.current) clearInterval(timeoutRef.current); };
  }, []);

  const goTo = (i: number) => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    setCurrent(i);
    timeoutRef.current = setInterval(() => setCurrent((prev) => (prev + 1) % testimonials.length), 5000);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -60 }}
        transition={{ duration: 0.4 }}
        style={{
          background: '#fff',
          border: '1px solid #E8E4DD',
          borderRadius: 24,
          padding: '40px 48px',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'linear-gradient(180deg, #2D6A4F, #52B788)' }} />
        <Quote size={40} color="rgba(45,106,79,0.1)" style={{ position: 'absolute', top: 20, right: 24 }} />
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#1A1A1A', marginBottom: 24, paddingLeft: 8, position: 'relative', zIndex: 1 }}>
          "{testimonials[current].text}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: 'linear-gradient(135deg, #F0EEE9, #E8E4DD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            {testimonials[current].avatar}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{testimonials[current].name}</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{testimonials[current].role}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
            {Array.from({ length: testimonials[current].rating }, (_, i) => (
              <Star key={i} size={14} color="#E9C46A" fill="#E9C46A" />
            ))}
          </div>
        </div>
      </motion.div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        <button onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #E8E4DD', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
          <ChevronLeft size={16} color="#6B7280" />
        </button>
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ width: 10, height: 10, borderRadius: 9999, border: 'none', cursor: 'pointer', transition: 'all .3s', background: i === current ? '#2D6A4F' : '#E8E4DD' }} />
        ))}
        <button onClick={() => goTo((current + 1) % testimonials.length)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #E8E4DD', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
          <ChevronRight size={16} color="#6B7280" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const navigate = useNavigate();
  const { loginAsDemo, isAuthenticated } = useAuthStore();

  const handleStartFree = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      loginAsDemo();
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'var(--bg)', color: 'var(--text)', overflow: 'hidden', position: 'relative' }}>
      <Header />
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.12; }
          25% { transform: translateY(-30px) translateX(15px); opacity: 0.2; }
          50% { transform: translateY(-15px) translateX(-10px); opacity: 0.08; }
          75% { transform: translateY(-40px) translateX(8px); opacity: 0.18; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .hero-gradient-text {
          background: linear-gradient(135deg, #2D6A4F 0%, #52B788 35%, #E9C46A 70%, #F4845F 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .card-tilt {
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s ease;
          transform-style: preserve-3d;
          perspective: 800px;
        }
        .card-tilt:hover {
          transform: translateY(-10px) rotateX(4deg) rotateY(-3deg) scale(1.02);
          box-shadow: 0 20px 60px rgba(45,106,79,0.15), 0 8px 24px rgba(0,0,0,0.06);
        }
        .glass-badge {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px) saturate(160%);
          border: 1px solid rgba(232,228,221,0.6);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(45,106,79,0.3); }
        .btn-outline:hover { border-color: #2D6A4F; color: #2D6A4F; background: rgba(45,106,79,0.04); }
        .feature-icon-ring { position: relative; }
        .feature-icon-ring::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          border: 2px solid currentColor;
          opacity: 0;
          animation: pulse-ring 2s ease-out infinite;
        }
        .cta-glow {
          position: relative;
        }
        .cta-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #2D6A4F, #52B788, #E9C46A, #F4845F);
          z-index: -1;
          filter: blur(12px);
          opacity: 0.4;
        }
        .footer-gradient {
          background: linear-gradient(135deg, #1A1A1A 0%, #2D3A30 50%, #1A1A1A 100%);
        }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '2rem' }}>
        <ParticleField />

        {/* Gradient blobs */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(45,106,79,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(244,132,95,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(233,196,106,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />

        {/* Floating glass badges */}
        <motion.div style={{ position: 'absolute', top: '18%', left: '4%', zIndex: 2, y: parallaxY }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}>
          <div className="glass-badge" style={{ borderRadius: 18, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(45,106,79,0.08)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>50+ Levels</span>
          </div>
        </motion.div>

        <motion.div style={{ position: 'absolute', bottom: '18%', left: '4%', zIndex: 2, y: parallaxY }} animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1, ease: 'easeInOut' }}>
          <div className="glass-badge" style={{ borderRadius: 18, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(82,183,136,0.08)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #52B788, #E9C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>1M+ Commands</span>
          </div>
        </motion.div>

        <motion.div style={{ position: 'absolute', bottom: '12%', right: '4%', zIndex: 2, y: parallaxY }} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.8, delay: 0.5, ease: 'easeInOut' }}>
          <div className="glass-badge" style={{ borderRadius: 18, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(244,132,95,0.08)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #F4845F, #E9C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Free to Play</span>
          </div>
        </motion.div>

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, maxWidth: 1200, width: '100%', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger} style={{ flex: '1 1 400px', maxWidth: 560 }}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, rgba(45,106,79,0.1), rgba(82,183,136,0.1))', border: '1px solid rgba(45,106,79,0.15)', borderRadius: 9999, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#2D6A4F', marginBottom: 24 }}>
              <Sparkles size={14} /> Learn Git through play
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2.5rem, 5.5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
              Learn Git the way it<br />
              should be{' '}
              <span className="hero-gradient-text">taught.</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: '#6B7280', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Master Git through interactive challenges, earn XP, level up, and become a Git pro — all in the browser.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 6px 32px rgba(45,106,79,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartFree}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: '#fff', padding: '14px 32px', borderRadius: 9999, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(45,106,79,0.2)', transition: 'transform .2s, box-shadow .2s' }}>
                Start Learning Free <ArrowRight size={18} />
              </motion.button>
              <Link to="/login" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #E8E4DD', color: '#1A1A1A', padding: '14px 32px', borderRadius: 9999, fontWeight: 700, fontSize: 16, textDecoration: 'none', transition: 'all .2s' }}>
                Sign In <Play size={18} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ flex: '1 1 300px', maxWidth: 420, display: 'flex', justifyContent: 'center' }}>
            <GitBranchSVG />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────── */}
      <section style={{ padding: '3.5rem 2rem', background: 'linear-gradient(135deg, #F8F8F6, #F0EEE9)', position: 'relative' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32 }}>
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} index={i} />
          ))}
        </div>
      </section>

      {/* ─── LANGUAGE TRACKS ─────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--background)', position: 'relative' }}>
        <DecoPath />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(45,106,79,0.1), rgba(82,183,136,0.1))', borderRadius: 9999, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#2D6A4F', marginBottom: 16 }}>Choose Your Path</span>
            <h2 style={{ fontFamily: 'Sora', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 12 }}>
              Five tracks.{' '}
              <span className="hero-gradient-text">Infinite growth.</span>
            </h2>
            <p style={{ color: '#6B7280', fontSize: 17 }}>Start with Git fundamentals, then branch out into programming languages.</p>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 20 }}>
            {(Object.keys(TRACK_INFO) as Language[]).map((lang, idx) => (
              <Link key={lang} to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div
                  whileHover={{ y: -10, boxShadow: '0 16px 48px rgba(45,106,79,0.18)' }}
                  className="card-tilt"
                  style={{
                    background: idx === 0 ? 'linear-gradient(135deg, #2D6A4F, #52B788)' : '#fff',
                    border: idx === 0 ? 'none' : '1px solid #E8E4DD',
                    borderRadius: 20,
                    padding: '32px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all .35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {idx === 0 && <div style={{ position: 'absolute', top: 0, right: 0, background: '#E9C46A', color: '#1A1A1A', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: '0 0 0 12px' }}>POPULAR</div>}
                  <div style={{ marginBottom: 14 }}><LanguageIcon lang={lang} size={40} color={TRACK_INFO[lang].color} /></div>
                  <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 6, color: idx === 0 ? '#fff' : '#1A1A1A' }}>{TRACK_INFO[lang].name}</h3>
                  <p style={{ fontSize: 13, color: idx === 0 ? 'rgba(255,255,255,0.85)' : '#6B7280', lineHeight: 1.5 }}>{TRACK_INFO[lang].description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(180deg, #F8F8F6 0%, #FFFFFF 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Sora', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 12 }}>
              Why developers{' '}
              <span className="hero-gradient-text">love it</span>
            </h2>
          </motion.div>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              style={{ display: 'flex', alignItems: 'center', gap: 48, marginBottom: 80, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', flexWrap: 'wrap' }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div className="feature-icon-ring" style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${f.color}18, ${f.color}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: `1px solid ${f.color}20`, color: f.color }}>
                  <f.icon size={28} color={f.color} />
                </div>
                <h3 style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: '#6B7280', fontSize: 16, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.03, rotateY: 5 }}
                style={{ flex: '1 1 300px', background: `linear-gradient(135deg, ${f.color}08, ${f.color}03)`, borderRadius: 24, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${f.color}15`, position: 'relative', overflow: 'hidden', perspective: 600 }}
              >
                <div style={{ position: 'absolute', width: 200, height: 200, background: `radial-gradient(circle, ${f.color}15, transparent)`, borderRadius: '50%', top: -40, right: -40 }} />
                <f.icon size={72} color={f.color} strokeWidth={1} style={{ position: 'relative', zIndex: 1 }} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TECH STACK ───────────────────────────────────────────── */}
      <section style={{ padding: '4rem 2rem', background: '#fff', borderTop: '1px solid #E8E4DD', borderBottom: '1px solid #E8E4DD' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 }}>Built with modern technologies</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {techIcons.map((t, i) => (
              <motion.div key={i} whileHover={{ y: -6, scale: 1.12 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.5, transition: 'opacity .2s', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F8F8F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E8E4DD' }}>
                  <t.icon size={24} color={t.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>{t.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(180deg, #F8F8F6, #FFFFFF)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.h2 variants={fadeUp} style={{ fontFamily: 'Sora', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>
            Loved by{' '}
            <span className="hero-gradient-text">thousands</span>
          </motion.h2>
          <motion.div variants={fadeUp}>
            <TestimonialCarousel />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(45,106,79,0.04), rgba(82,183,136,0.04), rgba(244,132,95,0.03))' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(45,106,79,0.06), transparent)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 8px 32px rgba(45,106,79,0.25)' }}
          >
            <Rocket size={32} color="#fff" />
          </motion.div>
          <h2 style={{ fontFamily: 'Sora', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
            Ready to master{' '}
            <span className="hero-gradient-text">Git?</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: 17, marginBottom: 36 }}>Join thousands of developers learning Git the fun way.</p>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 6px 32px rgba(45,106,79,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStartFree}
            className="cta-glow btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: '#fff', padding: '16px 40px', borderRadius: 9999, fontWeight: 700, fontSize: 17, border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(45,106,79,0.25)', transition: 'transform .2s, box-shadow .2s', position: 'relative' }}>
            Get Started Free <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="footer-gradient" style={{ padding: '3.5rem 2rem', borderTop: '1px solid rgba(82,183,136,0.2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(45,106,79,0.4)' }}>
                <GitBranch size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'Sora', fontWeight: 800, color: '#fff', fontSize: 18 }}>Git<span style={{ color: '#52B788' }}>Nova</span></span>
            </div>
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { label: 'About', href: '#about' },
                { label: 'Privacy', href: '#privacy' },
                { label: 'Terms', href: '#terms' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link key={item.label} to={item.href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color .2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#52B788')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>{item.label}</Link>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <a href="https://github.com/MrYaseen0" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color .2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#52B788')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}><ExternalLink size={18} /></a>
              <a href="https://www.linkedin.com/in/yaseen-ahmad-489967280" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color .2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#52B788')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}><Star size={18} /></a>
            </div>
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.3), transparent)', marginBottom: 20 }} />
          <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Built with <Heart size={12} color="#F4845F" fill="#F4845F" /> by <Link to="/contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 600, transition: 'color .2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#52B788')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>Yaseen Ahmad</Link> for developers who are just starting.
          </div>
        </div>
      </footer>
    </div>
  );
}
