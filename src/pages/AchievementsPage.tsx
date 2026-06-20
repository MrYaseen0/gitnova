import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Filter } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { achievementsApi, type Achievement } from '../lib/api';
import Header from '../components/Header';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.04 } } };
const cardAnim = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };

interface ApiAchievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  requirement: number;
  xpReward: number;
  earned?: boolean;
  earnedAt?: string | null;
}

const filters = ['All', 'Unlocked', 'Locked'] as const;
type FilterType = typeof filters[number];

export default function AchievementsPage() {
  const user = useAuthStore(s => s.user);
  const [filter, setFilter] = useState<FilterType>('All');
  const [achievements, setAchievements] = useState<ApiAchievement[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    achievementsApi.getAll()
      .then((res) => {
        const earnedIds = new Set<string>();
        if (user && !user.isDemo) {
          achievementsApi.getMine()
            .then((mine) => {
              mine.achievements.forEach((a: Achievement) => {
                if (a.earned) earnedIds.add(a.id);
              });
              setAchievements(res.achievements.map((a: Achievement) => ({
                ...a,
                earned: earnedIds.has(a.id),
              })));
            })
            .catch(() => setAchievements(res.achievements));
        } else {
          setAchievements(res.achievements);
        }
      })
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = achievements.filter(a => {
    if (filter === 'Unlocked') return a.earned;
    if (filter === 'Locked') return !a.earned;
    return true;
  });

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', fontFamily: 'Inter' }}>
      <Header />

      <div style={{ paddingTop: 80 }}>
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 60px' }}>
          {/* Header */}
          <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 16,
                background: 'linear-gradient(135deg, #E9C46A, #F4845F)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trophy size={24} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, margin: 0 }}>Achievements</h1>
                <p style={{ color: '#6B7280', marginTop: 2, fontSize: 14, margin: '2px 0 0' }}>
                  {earnedCount} / {achievements.length} unlocked
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: '#E8E4DD', borderRadius: 9999, height: 10, overflow: 'hidden', maxWidth: 500, marginTop: 16 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${achievements.length > 0 ? (earnedCount / achievements.length) * 100 : 0}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #2D6A4F, #52B788, #E9C46A)', borderRadius: 9999 }}
              />
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 4, background: '#E8E4DD', borderRadius: 14, padding: 4, marginBottom: 28, width: 'fit-content' }}>
            {filters.map(f => {
              const count = f === 'All' ? achievements.length : f === 'Unlocked' ? earnedCount : achievements.length - earnedCount;
              return (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFilter(f)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10,
                    border: 'none', background: filter === f ? '#fff' : 'transparent',
                    color: filter === f ? '#1A1A1A' : '#6B7280',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    boxShadow: filter === f ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all .2s',
                  }}
                >
                  {f} <span style={{
                    fontSize: 11, padding: '1px 7px', borderRadius: 9999,
                    background: filter === f ? '#2D6A4F18' : '#F0EEE9',
                    color: filter === f ? '#2D6A4F' : '#9CA3AF',
                    fontWeight: 700,
                  }}>{count}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Achievement Grid */}
          <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((a, idx) => {
                const isEarned = a.earned;
                const earnedDate = a.earnedAt
                  ? new Date(a.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : null;

                return (
                  <motion.div
                    key={a.id}
                    layout
                    variants={cardAnim}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    whileHover={{ y: -4, boxShadow: isEarned ? '0 8px 32px rgba(45,106,79,0.15)' : '0 4px 16px rgba(0,0,0,0.06)' }}
                    style={{
                      background: '#fff', borderRadius: 18, padding: 24, position: 'relative',
                      overflow: 'hidden', cursor: 'default',
                      border: isEarned ? '2px solid #2D6A4F40' : '1px solid #E8E4DD',
                      opacity: isEarned ? 1 : 0.55,
                      transition: 'box-shadow .2s',
                    }}
                  >
                    {/* Glow for unlocked */}
                    {isEarned && (
                      <div style={{
                        position: 'absolute', top: -30, right: -30, width: 80, height: 80,
                        borderRadius: 9999, background: 'radial-gradient(circle, #52B78820, transparent)',
                        pointerEvents: 'none',
                      }} />
                    )}

                    {/* Lock overlay for locked */}
                    {!isEarned && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12,
                        width: 28, height: 28, borderRadius: 9999,
                        background: '#F0EEE9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Lock size={13} color="#9CA3AF" />
                      </div>
                    )}

                    {/* Icon */}
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: isEarned ? '#F0EEE9' : '#F8F8F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 30, marginBottom: 14,
                      border: isEarned ? '1px solid #52B78830' : '1px solid #E8E4DD',
                    }}>
                      {a.icon}
                    </div>

                    {/* Title & Desc */}
                    <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: '0 0 4px', color: isEarned ? '#1A1A1A' : '#6B7280' }}>
                      {a.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px', lineHeight: 1.5 }}>{a.description}</p>

                    {/* Requirement */}
                    <div style={{
                      fontSize: 11, color: '#9CA3AF', padding: '6px 10px', borderRadius: 8,
                      background: '#F8F8F6', marginBottom: 12, lineHeight: 1.5,
                    }}>
                      {a.requirement}
                    </div>

                    {/* Bottom: XP + date */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: isEarned ? '#2D6A4F18' : '#F0EEE9',
                        borderRadius: 9999, padding: '4px 12px',
                        fontSize: 12, fontWeight: 700,
                        color: isEarned ? '#2D6A4F' : '#9CA3AF',
                      }}>
                        +{a.xpReward} XP
                      </div>
                      {earnedDate && (
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{earnedDate}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
              <Filter size={40} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 600, fontSize: 16 }}>No achievements found</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Try a different filter</div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
