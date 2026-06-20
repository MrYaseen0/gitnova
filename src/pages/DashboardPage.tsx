import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, User, BookOpen, Code, Terminal, Cpu, Coffee,
  Play, Trophy, BarChart3, Settings, Flame, ArrowRight,
  Star, Zap, ChevronRight, Menu, Lightbulb, TrendingUp, Brain,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { TRACK_INFO, getLevelsForLanguage } from '../data/levels';
import LanguageIcon from '../components/LanguageIcon';
import { ThemeToggle } from '../components/ui/theme-toggle';
import LearningRoadmap from '../components/LearningRoadmap';
import type { Language } from '../types';

const SIDEBAR_WIDTH = 240;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const GIT_TIPS = [
  '"git stash" saves uncommitted changes so you can work on something else.',
  'Use "git log --oneline" for a compact commit history.',
  'Branches are cheap in Git — create them freely!',
  '"git commit -am" stages and commits tracked files in one step.',
  '"git diff --staged" shows what will be in your next commit.',
  'Use .gitignore to keep build artifacts out of your repo.',
  '"git cherry-pick" applies a single commit from another branch.',
  'Write commit messages in imperative mood: "Add feature" not "Added feature".',
  '"git bisect" uses binary search to find the commit that introduced a bug.',
  '"git reflog" can rescue commits you thought were lost forever.',
];

const LANG_ICONS: Record<Language, React.ReactNode> = {
  git: <BookOpen size={16} />,
  python: <Code size={16} />,
  c: <Terminal size={16} />,
  cpp: <Cpu size={16} />,
  java: <Coffee size={16} />,
};

const ACHIEVEMENT_POOL = [
  { id: 'first-commit', icon: '🏆', name: 'First Commit' },
  { id: 'streak-3', icon: '🔥', name: '3-Day Streak' },
  { id: 'git-explorer', icon: '🧭', name: 'Git Explorer' },
  { id: 'code-warrior', icon: '⚔️', name: 'Code Warrior' },
  { id: 'perfectionist', icon: '💎', name: 'Perfectionist' },
  { id: 'speed-demon', icon: '⚡', name: 'Speed Demon' },
  { id: 'merge-master', icon: '🔀', name: 'Merge Master' },
  { id: 'open-source', icon: '🌍', name: 'Open Source Hero' },
];

const LEADERBOARD_MOCK = [
  { rank: 1, name: 'Sarah Chen', avatar: '👩‍💻', xp: 4820, level: 14 },
  { rank: 2, name: 'Marcus Lee', avatar: '🧑‍💻', xp: 4350, level: 12 },
  { rank: 3, name: 'Aisha Patel', avatar: '👩‍🔬', xp: 3980, level: 11 },
  { rank: 4, name: 'You', avatar: '', xp: 0, level: 0 },
  { rank: 5, name: 'James Wilson', avatar: '🧑‍🎓', xp: 3200, level: 10 },
];

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const xpPercent = useMemo(() => user ? Math.round((user.xp / user.xpToNext) * 100) : 0, [user]);
  // eslint-disable-next-line react-hooks/refs, react-hooks/purity
  const randomTip = useRef(GIT_TIPS[Math.floor(Math.random() * GIT_TIPS.length)]).current;

  const recentActivity = useMemo(() => {
    if (!user) return [] as { icon: React.ReactNode; text: string; xp: number; time: string }[];
    const items: { icon: React.ReactNode; text: string; xp: number; time: string }[] = [];
    const langs = Object.keys(user.completedLevels) as Language[];
    for (const lang of langs) {
      const ids = user.completedLevels[lang];
      for (const id of ids) {
        const levels = getLevelsForLanguage(lang);
        const level = levels.find(l => l.id === id);
        if (level) {
          items.push({ icon: LANG_ICONS[lang], text: level.title, xp: level.xpReward, time: '2h ago' });
          if (items.length >= 3) return items;
        }
      }
    }
    if (items.length === 0) {
      items.push({ icon: <BookOpen size={16} color="#2D6A4F" />, text: 'Start your first lesson', xp: 0, time: 'Now' });
    }
    return items;
  }, [user?.completedLevels]);

  const unlockedAchievements = useMemo(() =>
    user ? ACHIEVEMENT_POOL.filter(a => user.achievements.includes(a.id)).slice(0, 3) : [],
    [user?.achievements]
  );

  const lbWithUser = useMemo(() => {
    if (!user) return LEADERBOARD_MOCK;
    return LEADERBOARD_MOCK.map(e => {
      if (e.name === 'You') return { ...e, name: user.name.split(' ')[0], avatar: user.avatar, xp: user.xp, level: user.level };
      return e;
    });
  }, [user]);

  if (!user) return null;

  const prefLang = user.languagePreference;
  const completedCount = (user.completedLevels[prefLang] || []).length;
  const totalLevels = getLevelsForLanguage(prefLang).length;
  const nextLevelId = completedCount < totalLevels ? completedCount + 1 : totalLevels;

  const langProgress = (Object.keys(TRACK_INFO) as Language[]).map(lang => {
    const levels = getLevelsForLanguage(lang);
    const completed = (user.completedLevels[lang] || []).length;
    return { lang, completed, total: levels.length, color: TRACK_INFO[lang].color, name: TRACK_INFO[lang].name };
  });

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/learn/git', label: 'Git Track', icon: BookOpen },
    { to: '/learn/python', label: 'Python', icon: Code },
    { to: '/learn/c', label: 'C', icon: Terminal },
    { to: '/learn/cpp', label: 'C++', icon: Cpu },
    { to: '/learn/java', label: 'Java', icon: Coffee },
    { to: '/playground', label: 'Playground', icon: Play },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/analytics', label: 'Analytics', icon: TrendingUp },
    { to: '/review', label: 'Review', icon: Brain },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  /* ── SIDEBAR ──────────────────────────────────────── */
  const sidebarContent = (
    <div style={{
      width: SIDEBAR_WIDTH,
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#fff',
      borderRight: '1px solid #E8E4DD',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9998,
      overflowY: 'auto',
    }}>
      {/* User Profile */}
      <div style={{ padding: '28px 20px 16px', borderBottom: '1px solid #F0EEE9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 2px 12px rgba(45,106,79,0.25)',
          }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name.split(' ')[0]}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              marginTop: 3, padding: '2px 8px', borderRadius: 6,
              background: 'rgba(45,106,79,0.08)', fontSize: 11, fontWeight: 600, color: '#2D6A4F',
            }}>
              <Star size={10} fill="#E9C46A" color="#E9C46A" />
              Level {user.level} — {user.rank}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ background: '#F0EEE9', borderRadius: 9999, height: 8, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: 9999,
                background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 5, textAlign: 'right' }}>
            {user.xp.toLocaleString()} / {user.xpToNext.toLocaleString()} XP to Level {user.level + 1}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px',
                textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                color: active ? '#2D6A4F' : '#6B7280',
                background: active ? 'rgba(45,106,79,0.06)' : 'transparent',
                borderLeft: active ? '3px solid #2D6A4F' : '3px solid transparent',
                transition: 'all .15s',
              }}
            >
              <item.icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontWeight: active ? 700 : 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Git Tip Bubble */}
      <div style={{ margin: '0 14px 18px', padding: 14, background: 'linear-gradient(135deg, rgba(45,106,79,0.06), rgba(82,183,136,0.06))', borderRadius: 14, border: '1px solid rgba(45,106,79,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Lightbulb size={13} color="#2D6A4F" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2D6A4F', textTransform: 'uppercase', letterSpacing: 0.5 }}>Git Tip</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#4A5568' }}>{randomTip}</p>
      </div>
    </div>
  );

  /* ── MAIN CONTENT ────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', fontFamily: 'Inter' }}>
      {/* Desktop sidebar */}
      <div className="dashboard-sidebar">{sidebarContent}</div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9997 }}
            />
            <motion.div
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, left: 0, zIndex: 9998 }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top bar (mobile) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8E4DD',
        display: 'none', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 9990,
      }} className="dashboard-topbar">
        <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
          <Menu size={24} color="#1A1A1A" />
        </button>
        <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 16, color: '#1A1A1A' }}>
          Git<span style={{ color: '#2D6A4F' }}>Nova</span>
        </span>
        <ThemeToggle size="sm" />
      </div>

      {/* Main scrollable area */}
      <div style={{ marginLeft: 0 }} className="dashboard-main">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            {/* Welcome Header */}
            <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
                {getGreeting()}, {user.name.split(' ')[0]} 👋
              </h1>
              <p style={{ color: '#6B7280', marginTop: 4, fontSize: 15 }}>Here's your learning dashboard</p>
            </motion.div>

            {/* Streak Card */}
            <motion.div variants={fadeUp}>
              <motion.div
                whileHover={{ y: -2 }}
                style={{
                  background: 'linear-gradient(135deg, #F4845F 0%, #FF6B35 40%, #F4845F 100%)',
                  borderRadius: 20, padding: '24px 28px', marginBottom: 20,
                  position: 'relative', overflow: 'hidden', color: '#fff',
                }}
              >
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], boxShadow: ['0 0 0 0 rgba(255,255,255,0.3)', '0 0 0 10px rgba(255,255,255,0)', '0 0 0 0 rgba(255,255,255,0)'] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Flame size={26} color="#fff" />
                    </motion.div>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Sora', lineHeight: 1 }}>{user.streak}-day streak!</div>
                      <div style={{ opacity: 0.9, fontSize: 14, marginTop: 4 }}>Keep it going! Longest: {user.longestStreak} days</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Continue Learning + Progress Ring */}
            <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, marginBottom: 20 }} className="dashboard-two-col">
              <Link to={`/level/${prefLang}/${nextLevelId}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(45,106,79,0.15)' }}
                  style={{
                    background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: '24px 28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                    transition: 'box-shadow .2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: TRACK_INFO[prefLang].color + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <LanguageIcon lang={prefLang} size={28} color={TRACK_INFO[prefLang].color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: '#1A1A1A' }}>Continue Learning</div>
                      <div style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Level {nextLevelId} in {TRACK_INFO[prefLang].name}</div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                    borderRadius: 9999, padding: '10px 20px', color: '#fff', fontWeight: 700, fontSize: 14,
                  }}>
                    Resume <ArrowRight size={15} />
                  </div>
                </motion.div>
              </Link>

              {/* Circular Progress Ring */}
              <motion.div
                variants={fadeUp}
                style={{
                  background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 16,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="110" height="110" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#F0EEE9" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="url(#progressGrad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - xpPercent / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2D6A4F" />
                      <stop offset="100%" stopColor="#52B788" />
                    </linearGradient>
                  </defs>
                  <text x="60" y="55" textAnchor="middle" style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 800, fill: '#1A1A1A' }}>
                    {xpPercent}%
                  </text>
                  <text x="60" y="72" textAnchor="middle" style={{ fontSize: 11, fill: '#6B7280' }}>
                    XP Progress
                  </text>
                </svg>
              </motion.div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: '0 0 14px', color: '#1A1A1A' }}>Recent Activity</h3>
              {recentActivity.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < recentActivity.length - 1 ? '1px solid #F0EEE9' : 'none',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, background: '#F8F8F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {a.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{a.time}</div>
                  </div>
                  {a.xp > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: '#E9C46A' }}>
                      <Zap size={12} />+{a.xp}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Language Tracks */}
            <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: '0 0 16px', color: '#1A1A1A' }}>Language Tracks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {langProgress.map(lp => {
                  const pct = lp.total > 0 ? Math.round((lp.completed / lp.total) * 100) : 0;
                  const started = lp.completed > 0;
                  return (
                    <div key={lp.lang} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: lp.color + '18',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}><LanguageIcon lang={lp.lang} size={22} color={lp.color} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{lp.name}</span>
                          <span style={{ fontSize: 12, color: '#6B7280' }}>{lp.completed}/{lp.total} levels</span>
                        </div>
                        <div style={{ background: '#F0EEE9', borderRadius: 9999, height: 6, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            style={{ height: '100%', background: lp.color, borderRadius: 9999 }}
                          />
                        </div>
                      </div>
                      <Link
                        to={started ? `/level/${lp.lang}/${lp.completed + 1}` : `/learn/${lp.lang}`}
                        style={{
                          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                          background: started ? 'linear-gradient(135deg, #2D6A4F, #52B788)' : '#F0EEE9',
                          color: started ? '#fff' : '#6B7280',
                          transition: 'all .15s',
                        }}
                      >
                        {started ? 'Continue' : 'Start'}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Achievement Teasers + Leaderboard */}
            <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="dashboard-two-col">
              {/* Achievements */}
              <div style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: 0, color: '#1A1A1A' }}>Achievements</h3>
                  <Link to="/achievements" style={{ fontSize: 12, color: '#2D6A4F', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                    View all <ChevronRight size={13} />
                  </Link>
                </div>
                {unlockedAchievements.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {unlockedAchievements.map(a => (
                      <div key={a.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 12,
                        background: 'rgba(45,106,79,0.04)', border: '1px solid rgba(45,106,79,0.08)',
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: '#F8F8F6', border: '1px solid #E8E4DD',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        }}>{a.icon}</div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#1A1A1A' }}>{a.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Complete levels to unlock achievements!</p>
                )}
              </div>

              {/* Leaderboard Preview */}
              <div style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: 0, color: '#1A1A1A' }}>Leaderboard</h3>
                  <Link to="/leaderboard" style={{ fontSize: 12, color: '#2D6A4F', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                    View all <ChevronRight size={13} />
                  </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {lbWithUser.map((entry, i) => {
                    const isYou = entry.name === user.name.split(' ')[0];
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 10px', borderRadius: 10,
                        background: isYou ? 'rgba(45,106,79,0.06)' : 'transparent',
                        borderBottom: i < lbWithUser.length - 1 ? '1px solid #F0EEE9' : 'none',
                      }}>
                        <span style={{
                          width: 22, textAlign: 'center', fontWeight: 800, fontSize: 13,
                          color: entry.rank <= 3 ? ['#E9C46A', '#C0C0C0', '#CD7F32'][entry.rank - 1] : '#6B7280',
                        }}>
                          {entry.rank}
                        </span>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9,
                          background: isYou ? 'linear-gradient(135deg, #2D6A4F, #52B788)' : '#F0EEE9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                          color: isYou ? '#fff' : undefined,
                        }}>
                          {isYou ? user.avatar : entry.avatar}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: isYou ? 700 : 500, fontSize: 13, color: '#1A1A1A' }}>{entry.name}{isYou && ' (You)'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A1A' }}>{entry.xp.toLocaleString()}</div>
                          <div style={{ fontSize: 10, color: '#6B7280' }}>Lvl {entry.level}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Learning Roadmaps */}
            <motion.div variants={fadeUp}>
              <LearningRoadmap roadmap="frontend" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .dashboard-sidebar { display: block !important; }
          .dashboard-main { margin-left: ${SIDEBAR_WIDTH}px !important; }
          .dashboard-topbar { display: none !important; }
        }
        @media (max-width: 768px) {
          .dashboard-sidebar { display: none !important; }
          .dashboard-main { margin-left: 0 !important; }
          .dashboard-topbar { display: flex !important; }
          .dashboard-main { padding-top: 56px !important; }
          .dashboard-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
