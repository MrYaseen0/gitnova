import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Calendar, Zap, Star, Flame, Target, TrendingUp } from 'lucide-react';
import { TRACK_INFO } from '../data/levels';
import LanguageIcon from '../components/LanguageIcon';
import type { Language } from '../types';
import Header from '../components/Header';
import { leaderboardApi } from '../lib/api';
import type { UserProfile, CompletedLevel } from '../lib/api';

const heatColors = ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'];

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [, setRankNum] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    leaderboardApi.getProfile(username)
      .then((res) => { setProfile(res.profile); setRankNum(res.rank); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
        <Header />
        <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #2D6A4F', borderTopColor: 'transparent', borderRadius: 9999, animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#6B7280', fontSize: 14 }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
        <Header />
        <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px' }}>
          <h1 style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>
            User Not Found
          </h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
            The user @{username} doesn't exist on GitNova.
          </p>
        </div>
      </div>
    );
  }

  const rank = profile.xp >= 10000 ? 'Git Legend' : profile.xp >= 5000 ? 'Git Master' : profile.xp >= 2000 ? 'Code Architect' : profile.xp >= 500 ? 'Git Apprentice' : 'Newbie';
  const completedLevels = profile.completedLevels || [];
  const achievements = profile.achievements || [];
  const totalLevelsCompleted = completedLevels.length;

  // Convert heatmap Record<string, number> to number[][] for rendering
  const heatData: number[][] = (() => {
    const hm = profile.heatmap || {};
    const entries = Object.entries(hm).sort(([a], [b]) => a.localeCompare(b));
    const weeks: number[][] = [];
    for (let i = 0; i < entries.length; i += 7) {
      weeks.push(entries.slice(i, i + 7).map(([, count]) => Math.min(4, count)));
    }
    while (weeks.length < 20) weeks.push(Array(7).fill(0));
    return weeks;
  })();

  const langProgress = (Object.keys(TRACK_INFO) as Language[]).map(lang => {
    const langLevels = completedLevels.filter((l: CompletedLevel) => l.level?.language === lang);
    return {
      lang,
      completed: langLevels.length,
      total: lang === 'git' ? 50 : 10,
      color: TRACK_INFO[lang].color,
      name: TRACK_INFO[lang].name,
    };
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', fontFamily: 'Inter' }}>
      <Header />

      <div style={{ paddingTop: 80 }}>
        {/* Gradient Banner */}
        <div style={{ height: 200, background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #52B788 70%, #95D5B2 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 9999, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 60, width: 100, height: 100, borderRadius: 9999, background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'absolute', bottom: -52, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{
              width: 104, height: 104, borderRadius: 9999, background: '#fff',
              border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}>
              {profile.avatar}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '68px 24px 40px' }}>
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <h1 style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, margin: 0 }}>
              {profile.name}
            </h1>
            <div style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>              @{profile.username}</div>
            <p style={{ color: '#374151', fontSize: 14, marginTop: 12, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.6 }}>
              {profile.bio}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#6B7280' }}>
                <Calendar size={14} />
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 12px',
                borderRadius: 9999, background: '#2D6A4F18', fontSize: 12, fontWeight: 700, color: '#2D6A4F',
              }}>
                <Star size={12} fill="#2D6A4F" /> {rank}
              </div>
            </div>

          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}
          >
            {[
              { icon: <Zap size={20} color="#E9C46A" />, label: 'Total XP', value: profile.xp.toLocaleString(), color: '#E9C46A' },
              { icon: <Target size={20} color="#2D6A4F" />, label: 'Levels Done', value: totalLevelsCompleted, color: '#2D6A4F' },
              { icon: <Flame size={20} color="#F4845F" />, label: 'Streak', value: `${profile.streak}d`, color: '#F4845F' },
              { icon: <TrendingUp size={20} color="#52B788" />, label: 'Rank', value: rank, color: '#52B788' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28, marginBottom: 24 }}
          >
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, marginBottom: 24, margin: '0 0 24px' }}>
              Language Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {langProgress.map(lp => (
                <div key={lp.lang} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
              ))}
            </div>
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28, marginBottom: 24 }}
          >
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, marginBottom: 20, margin: '0 0 20px' }}>
              Activity
            </h3>
            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {heatData.map((week: number[], wi: number) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {week.map((level: number, di: number) => (
                      <motion.div
                        key={`${wi}-${di}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (wi * 7 + di) * 0.003, duration: 0.15 }}
                        style={{
                          width: 14, height: 14, borderRadius: 3,
                          background: heatColors[level],
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

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28 }}
          >
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, marginBottom: 20, margin: '0 0 20px' }}>
              Achievements ({achievements.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {achievements.map((a) => (
                <div key={a.id} style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: 'rgba(45,106,79,0.04)', border: '1px solid rgba(45,106,79,0.08)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 18 }}>{a.achievement.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#1A1A1A' }}>
                    {a.achievement.title}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
