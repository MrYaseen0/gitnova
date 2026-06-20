import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Flame, Zap, Calendar, Award, Target, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import { progressApi } from '../lib/api';
import { TRACK_INFO } from '../data/levels';
import type { Language } from '../types';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LANG_COLORS: Record<string, string> = {
  git: '#2D6A4F',
  python: '#3776AB',
  c: '#A8B9CC',
  cpp: '#00599C',
  java: '#ED8B00',
};

interface AnalyticsData {
  xpOverTime: Record<string, number>;
  byLanguage: Record<string, number>;
  byDifficulty: Record<string, number>;
  activityByDate: Record<string, number>;
  weeklyTrend: { week: string; count: number }[];
  totals: { xp: number; level: number; streak: number; completedCount: number; joinedAt: string };
}

function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140, padding: '0 8px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{d.value}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: maxVal > 0 ? `${(d.value / maxVal) * 100}%` : 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              width: '100%',
              maxWidth: 48,
              background: d.color,
              borderRadius: '6px 6px 0 0',
              minHeight: d.value > 0 ? 4 : 0,
            }}
          />
          <span style={{ fontSize: 11, color: '#6B7280', textAlign: 'center', lineHeight: 1.2 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const width = 300;
  const height = 100;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1 || 1)) * width,
    y: height - (d.value / maxVal) * (height - 10),
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={width} height={height + 20} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#2D6A4F" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#2D6A4F" strokeWidth={2} strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#2D6A4F" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressApi.analytics()
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
        <Header />
        <div style={{ paddingTop: 120, textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #2D6A4F', borderTopColor: 'transparent', borderRadius: 9999, animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#6B7280', fontSize: 14 }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
        <Header />
        <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px' }}>
          <BarChart3 size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>No Data Yet</h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Complete some levels to see your analytics.</p>
        </div>
      </div>
    );
  }

  const langData = Object.entries(data.byLanguage).map(([lang, count]) => ({
    label: (TRACK_INFO[lang as Language]?.name || lang).slice(0, 6),
    value: count,
    color: LANG_COLORS[lang] || '#6B7280',
  }));

  const diffData = Object.entries(data.byDifficulty).map(([diff, count]) => ({
    label: diff,
    value: count,
    color: diff === 'easy' ? '#52B788' : diff === 'medium' ? '#E9C46A' : '#F4845F',
  }));

  const xpEntries = Object.entries(data.xpOverTime);
  const xpLineData = xpEntries.map(([date, xp]) => ({
    label: date.slice(5),
    value: xp,
  }));

  const maxLang = Math.max(...langData.map(d => d.value), 1);
  const maxDiff = Math.max(...diffData.map(d => d.value), 1);

  const stats = [
    { icon: <Zap size={20} color="#E9C46A" />, label: 'Total XP', value: data.totals.xp.toLocaleString(), color: '#E9C46A' },
    { icon: <Target size={20} color="#2D6A4F" />, label: 'Levels Done', value: data.totals.completedCount, color: '#2D6A4F' },
    { icon: <Flame size={20} color="#F4845F" />, label: 'Day Streak', value: `${data.totals.streak}d`, color: '#F4845F' },
    { icon: <Award size={20} color="#52B788" />, label: 'Level', value: data.totals.level, color: '#52B788' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
      <Header />
      <div style={{ paddingTop: 88, maxWidth: 900, margin: '0 auto', padding: '88px 24px 40px' }}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #2D6A4F, #52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 800, margin: 0 }}>Analytics</h1>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Your learning progress at a glance</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20, textAlign: 'center' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                {s.icon}
              </div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: '#1A1A1A' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* XP Over Time */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 24, gridColumn: xpLineData.length > 0 ? 'span 2' : 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <TrendingUp size={18} color="#2D6A4F" />
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: 0 }}>XP Over Time</h3>
            </div>
            {xpLineData.length > 0 ? (
              <LineChart data={xpLineData} />
            ) : (
              <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: 20 }}>Complete levels to see XP growth</p>
            )}
          </motion.div>

          {/* Language Breakdown */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <BookOpen size={18} color="#2D6A4F" />
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: 0 }}>By Language</h3>
            </div>
            {langData.length > 0 ? (
              <BarChart data={langData} maxVal={maxLang} />
            ) : (
              <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: 20 }}>No levels completed yet</p>
            )}
          </motion.div>

          {/* Difficulty Distribution */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Target size={18} color="#2D6A4F" />
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: 0 }}>By Difficulty</h3>
            </div>
            {diffData.length > 0 ? (
              <BarChart data={diffData} maxVal={maxDiff} />
            ) : (
              <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: 20 }}>No levels completed yet</p>
            )}
          </motion.div>

          {/* Weekly Trend */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 24, gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Calendar size={18} color="#2D6A4F" />
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, margin: 0 }}>Weekly Completion Trend</h3>
            </div>
            <BarChart
              data={data.weeklyTrend.map(w => ({ label: w.week, value: w.count, color: '#52B788' }))}
              maxVal={Math.max(...data.weeklyTrend.map(w => w.count), 1)}
            />
          </motion.div>
        </div>

        {/* Member Since */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6 }}
          style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#9CA3AF' }}>
          Member since {new Date(data.totals.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </motion.div>
      </div>
    </div>
  );
}
