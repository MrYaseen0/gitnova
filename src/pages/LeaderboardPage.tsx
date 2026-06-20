import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Flame, TrendingUp, TrendingDown, Minus, Users, Globe, Calendar } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { leaderboardApi } from '../lib/api';
import Header from '../components/Header';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  rankChange: number;
}

const tabs = [
  { key: 'global' as const, label: 'Global', icon: Globe },
  { key: 'weekly' as const, label: 'Weekly', icon: Calendar },
  { key: 'friends' as const, label: 'Friends', icon: Users },
];

const rankColors: Record<number, string> = { 1: '#E9C46A', 2: '#C0C0C0', 3: '#CD7F32' };
const podiumGradients: Record<number, string> = {
  1: 'linear-gradient(180deg, #E9C46A 0%, #D4A843 100%)',
  2: 'linear-gradient(180deg, #C0C0C0 0%, #A8A8A8 100%)',
  3: 'linear-gradient(180deg, #CD7F32 0%, #B8722D 100%)',
};

function RankChangeIcon({ change }: { change: number }) {
  if (change > 0) return <TrendingUp size={13} color="#2D6A4F" />;
  if (change < 0) return <TrendingDown size={13} color="#F4845F" />;
  return <Minus size={13} color="#9CA3AF" />;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'global' | 'weekly' | 'friends'>('global');
  const user = useAuthStore(s => s.user);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    leaderboardApi.get(1, 50)
      .then((res) => {
        const entries = res.leaderboard.map((e) => ({
          rank: e.rank,
          name: e.name,
          avatar: e.avatar || '🦊',
          xp: e.xp,
          level: e.level,
          streak: e.streak || 0,
          rankChange: 0,
        }));
        setLeaderboard(entries);
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, []);

  const data = leaderboard;

  const podium = data.slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', fontFamily: 'Inter' }}>
      <Header />

      <div style={{ paddingTop: 80 }}>
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
          {/* Header */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: 'linear-gradient(135deg, #E9C46A, #F4845F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, margin: 0 }}>Leaderboard</h1>
              <p style={{ color: '#6B7280', marginTop: 2, fontSize: 14, margin: '2px 0 0' }}>
                Compete with learners worldwide
              </p>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 4, background: '#E8E4DD', borderRadius: 14, padding: 4, marginBottom: 32, width: 'fit-content' }}>
            {tabs.map(t => (
              <motion.button
                key={t.key}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10,
                  border: 'none', background: tab === t.key ? '#fff' : 'transparent',
                  color: tab === t.key ? '#1A1A1A' : '#6B7280',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all .2s',
                }}
              >
                <t.icon size={16} /> {t.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Top 3 Podium */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 40, paddingBottom: 12 }}>
            {podium.length >= 2 && [podium[1], podium[0], podium[2]].map((p, i) => {
              const order = [2, 1, 3]; // display: 2nd, 1st, 3rd
              const r = order[i];
              const heights = { 1: 160, 2: 130, 3: 110 };
              const sizes = { 1: 72, 2: 60, 3: 54 };
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                  style={{ textAlign: 'center', flex: '0 0 120px' }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: sizes[r as keyof typeof sizes], height: sizes[r as keyof typeof sizes],
                    borderRadius: 9999, background: '#fff',
                    border: `3px solid ${rankColors[r]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: r === 1 ? 36 : 28, margin: '0 auto 10px',
                    boxShadow: `0 4px 16px ${rankColors[r]}30`,
                  }}>
                    {p.avatar}
                  </div>

                  {/* Name & XP */}
                  <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: r === 1 ? 15 : 13, marginBottom: 2, color: '#1A1A1A' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>{p.xp.toLocaleString()} XP</div>

                  {/* Podium block */}
                  <div style={{
                    width: '100%', height: heights[r as keyof typeof heights],
                    background: podiumGradients[r],
                    borderRadius: '14px 14px 0 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <Crown size={r === 1 ? 32 : 24} color="#fff" style={{ opacity: 0.9 }} />
                    <div style={{
                      position: 'absolute', top: 10,
                      fontFamily: 'Sora', fontWeight: 800, fontSize: 18, color: '#fff', opacity: 0.8,
                    }}>
                      #{r}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Table */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 18, overflow: 'hidden' }}>
            {/* Table header */}
            <div className="leaderboard-table-header" style={{
              display: 'grid', gridTemplateColumns: '60px 50px 1fr 100px 100px 80px 110px',
              padding: '12px 20px', borderBottom: '1px solid #E8E4DD',
              background: '#F8F8F6', fontSize: 11, fontWeight: 700, color: '#6B7280',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              <div>Rank</div>
              <div></div>
              <div>Player</div>
              <div style={{ textAlign: 'center' }}>Level</div>
              <div style={{ textAlign: 'center' }}>Streak</div>
              <div style={{ textAlign: 'center' }}>Trend</div>
              <div style={{ textAlign: 'right' }}>XP</div>
            </div>

            {/* Rows */}
            <AnimatePresence mode="wait">
              {data.map((p, i) => {
                const isUser = user && p.name === user.name;
                const isTop3 = p.rank <= 3;
                return (
                  <motion.div
                    key={`${tab}-${p.rank}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.03 }}
                    className="leaderboard-table-row"
                    style={{
                      display: 'grid', gridTemplateColumns: '60px 50px 1fr 100px 100px 80px 110px',
                      padding: '14px 20px', alignItems: 'center',
                      borderBottom: i < data.length - 1 ? '1px solid #F0EEE9' : 'none',
                      background: isUser ? '#2D6A4F0A' : isTop3 ? '#F8F8F6' : 'transparent',
                      transition: 'background .2s',
                    }}
                  >
                    {/* Rank */}
                    <div style={{
                      fontFamily: 'Sora', fontWeight: 800, fontSize: 16,
                      color: rankColors[p.rank] || '#6B7280',
                    }}>
                      #{p.rank}
                    </div>

                    {/* Avatar */}
                    <div style={{ fontSize: 24, textAlign: 'center' }}>{p.avatar}</div>

                    {/* Name */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>
                        {p.name}
                        {isUser && (
                          <span style={{
                            fontSize: 10, background: '#2D6A4F', color: '#fff',
                            borderRadius: 9999, padding: '2px 8px', marginLeft: 8,
                            fontWeight: 700, verticalAlign: 'middle',
                          }}>
                            YOU
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Level */}
                    <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 13, color: '#6B7280' }}>
                      {p.level}
                    </div>

                    {/* Streak */}
                    <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <Flame size={13} color="#F4845F" />
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#F4845F' }}>{p.streak}d</span>
                    </div>

                    {/* Trend */}
                    <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RankChangeIcon change={p.rankChange} />
                      {p.rankChange !== 0 && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, marginLeft: 2,
                          color: p.rankChange > 0 ? '#2D6A4F' : '#F4845F',
                        }}>
                          {Math.abs(p.rankChange)}
                        </span>
                      )}
                    </div>

                    {/* XP */}
                    <div style={{ textAlign: 'right', fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: '#1A1A1A' }}>
                      {p.xp.toLocaleString()}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
