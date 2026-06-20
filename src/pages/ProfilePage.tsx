import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Zap, Trophy, Star, Flame, Target, TrendingUp, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { TRACK_INFO } from '../data/levels';
import LanguageIcon from '../components/LanguageIcon';
import { CertificateGallery } from '../components/Certificate';
import type { Language } from '../types';
import Header from '../components/Header';
import { progressApi } from '../lib/api';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const heatColors = ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'];

const allAchievements = [
  { id: 'first-commit', icon: '🎯', title: 'First Commit' },
  { id: 'streak-3', icon: '🔥', title: 'On Fire' },
  { id: 'streak-7', icon: '🔥', title: 'Week Warrior' },
  { id: 'speed-run', icon: '⚡', title: 'Speed Runner' },
  { id: 'perfect', icon: '🌟', title: 'Perfectionist' },
  { id: 'boss-slayer', icon: '🏆', title: 'Boss Slayer' },
  { id: 'branch-master', icon: '🌿', title: 'Branch Master' },
  { id: 'merge-pro', icon: '🔀', title: 'Merge Pro' },
  { id: 'xp-100', icon: '💎', title: 'Diamond' },
  { id: 'xp-500', icon: '👑', title: 'Crown' },
  { id: 'all-git', icon: '🎓', title: 'Git Graduate' },
  { id: 'polyglot', icon: '🌍', title: 'Polyglot' },
  { id: 'night-owl', icon: '🦉', title: 'Night Owl' },
  { id: 'early-bird', icon: '🐦', title: 'Early Bird' },
  { id: 'explorer', icon: '🗺️', title: 'Explorer' },
  { id: 'social', icon: '🤝', title: 'Team Player' },
];

export default function ProfilePage() {
  const user = useAuthStore(s => s.user);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);

  useEffect(() => {
    progressApi.heatmap().then(res => {
      const entries = Object.entries(res.heatmap || {}).map(([date, count]) => ({ date, count }));
      entries.sort((a, b) => a.date.localeCompare(b.date));
      const weeks: number[][] = [];
      for (let i = 0; i < entries.length; i += 7) {
        weeks.push(entries.slice(i, i + 7).map(e => Math.min(4, e.count)));
      }
      while (weeks.length < 20) weeks.push(Array(7).fill(0));
      setHeatmapData(weeks);
    }).catch(() => {
      setHeatmapData(Array.from({ length: 20 }, () => Array(7).fill(0)));
    });
  }, []);

  const totalLevelsCompleted = useMemo(() => {
    if (!user) return 0;
    return Object.values(user.completedLevels).reduce((sum, arr) => sum + arr.length, 0);
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <p style={{ color: '#6B7280', fontSize: 16 }}>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const langProgress = (Object.keys(TRACK_INFO) as Language[]).map(lang => ({
    lang,
    completed: (user.completedLevels[lang] || []).length,
    total: lang === 'git' ? 50 : 10,
    color: TRACK_INFO[lang].color,
    name: TRACK_INFO[lang].name,
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', fontFamily: 'Inter' }}>
      <Header />

      <div style={{ paddingTop: 80 }}>
        {/* Gradient Banner */}
        <div style={{ height: 200, background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #52B788 70%, #95D5B2 100%)', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 9999, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 60, width: 100, height: 100, borderRadius: 9999, background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', top: 30, left: '40%', width: 60, height: 60, borderRadius: 9999, background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ position: 'absolute', bottom: -52, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{
              width: 104, height: 104, borderRadius: 9999, background: '#fff',
              border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', position: 'relative',
            }}>
              {user.avatar}
              <div style={{
                position: 'absolute', bottom: 2, right: 2, width: 24, height: 24,
                borderRadius: 9999, background: '#2D6A4F', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trophy size={12} color="#fff" />
              </div>
            </div>
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 900, margin: '0 auto', padding: '68px 24px 40px' }}>
          {/* User Info */}
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Sora', fontSize: 30, fontWeight: 800, margin: 0 }}>{user.name}</h1>
            <div style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>@{user.username}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#6B7280' }}>
                <Calendar size={14} />
                Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 12px',
                borderRadius: 9999, background: '#2D6A4F18', fontSize: 12, fontWeight: 700, color: '#2D6A4F',
              }}>
                <Star size={12} fill="#2D6A4F" /> {user.rank}
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={fadeUp} className="profile-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { icon: <Zap size={20} color="#E9C46A" />, label: 'Total XP', value: user.xp.toLocaleString(), color: '#E9C46A' },
              { icon: <Target size={20} color="#2D6A4F" />, label: 'Levels Done', value: totalLevelsCompleted, color: '#2D6A4F' },
              { icon: <Flame size={20} color="#F4845F" />, label: 'Streak', value: `${user.streak}d`, color: '#F4845F' },
              { icon: <TrendingUp size={20} color="#52B788" />, label: 'Rank', value: user.rank, color: '#52B788' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(45,106,79,0.1)' }}
                style={{
                  background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20,
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: s.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
                }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: '#1A1A1A' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Language Progress */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, marginBottom: 24, margin: '0 0 24px' }}>Language Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {langProgress.map(lp => (
                <Link key={lp.lang} to={`/learn/${lp.lang}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14, background: lp.color + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <LanguageIcon lang={lp.lang} size={24} color={lp.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{lp.name}</span>
                        <span style={{ fontSize: 12, color: '#6B7280' }}>{lp.completed}/{lp.total} levels</span>
                      </div>
                      <div style={{ background: '#F0EEE9', borderRadius: 9999, height: 8, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((lp.completed / lp.total) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          style={{ height: '100%', background: lp.color, borderRadius: 9999 }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Achievement Gallery */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, margin: 0 }}>Achievements</h3>
              <Link to="/achievements" style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
            </div>
            <div className="profile-achievements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12 }}>
              {allAchievements.slice(0, 16).map(a => {
                const isEarned = user.achievements.includes(a.id);
                return (
                  <motion.div
                    key={a.id}
                    whileHover={{ scale: 1.1, y: -2 }}
                    style={{
                      textAlign: 'center', opacity: isEarned ? 1 : 0.35,
                      transition: 'opacity .2s',
                    }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: isEarned ? '#F0EEE9' : '#F8F8F6',
                      border: isEarned ? '2px solid #2D6A4F40' : '1px solid #E8E4DD',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, margin: '0 auto 6px',
                      boxShadow: isEarned ? '0 2px 8px rgba(45,106,79,0.12)' : 'none',
                    }}>
                      {a.icon}
                    </div>
                    <div style={{ fontSize: 10, color: isEarned ? '#1A1A1A' : '#9CA3AF', fontWeight: 500 }}>{a.title}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Certificates */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28 }}>
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, marginBottom: 20, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={20} color="#C9A84C" />
              Certificates
            </h3>
            <CertificateGallery />
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28 }}>
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, marginBottom: 20, margin: '0 0 20px' }}>Activity</h3>
            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {heatmapData.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {week.map((level, di) => (
                      <motion.div
                        key={`${wi}-${di}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (wi * 7 + di) * 0.003, duration: 0.15 }}
                        style={{
                          width: 14, height: 14, borderRadius: 3,
                          background: heatColors[level],
                          cursor: 'pointer',
                        }}
                        title={`${level > 0 ? level + ' contribution' + (level > 1 ? 's' : '') : 'No contributions'}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 11, color: '#6B7280', marginRight: 4 }}>Less</span>
              {heatColors.map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
              ))}
              <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 4 }}>More</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
