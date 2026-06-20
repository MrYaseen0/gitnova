import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Lock, Zap } from 'lucide-react';
import Header from '../components/Header';
import LanguageIcon from '../components/LanguageIcon';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { TRACK_INFO, getLevelsForLanguage } from '../data/levels';
import { useAuthStore } from '../stores/authStore';
import type { Level, Language } from '../types';

interface NodePos {
  x: number;
  y: number;
  level: Level;
}

const CATEGORY_COLORS: Record<string, string> = {
  concept: '#2D6A4F',
  practice: '#4A90D9',
  challenge: '#F4845F',
  boss: '#E9C46A',
};

const NODE_SIZE = 40;
const BOSS_SIZE = 52;
const COLS = 5;
const ROW_GAP = 90;
const COL_GAP = 80;
const PADDING_X = 60;
const PADDING_Y = 80;

function computeNodePositions(levels: Level[]): NodePos[] {
  const positions: NodePos[] = [];
  levels.forEach((level, i) => {
    const row = Math.floor(i / COLS);
    const colInRow = i % COLS;
    const isReversed = row % 2 === 1;
    const col = isReversed ? COLS - 1 - colInRow : colInRow;

    const baseX = PADDING_X + col * COL_GAP;
    const baseY = PADDING_Y + row * ROW_GAP;

    const jitterX = Math.sin(i * 1.7) * 15;
    const jitterY = Math.cos(i * 2.3) * 8;

    positions.push({
      x: baseX + jitterX,
      y: baseY + jitterY,
      level,
    });
  });
  return positions;
}

function buildPathD(positions: NodePos[]): string {
  if (positions.length < 2) return '';
  let d = `M ${positions[0].x} ${positions[0].y}`;
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    const midY1 = prev.y + ROW_GAP * 0.35;
    const midY2 = curr.y - ROW_GAP * 0.35;
    d += ` C ${prev.x} ${midY1}, ${curr.x} ${midY2}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export default function LevelMapPage() {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const lang = (language || 'git') as Language;
  const levels = useMemo(() => getLevelsForLanguage(lang), [lang]);
  const track = TRACK_INFO[lang];
  const completedIds = user?.completedLevels[lang] ?? [];

  const nextUnlockedId = useMemo(() => {
    for (const l of levels) {
      if (!completedIds.includes(l.id)) return l.id;
    }
    return levels.length + 1;
  }, [levels, completedIds]);

  const positions = useMemo(() => computeNodePositions(levels), [levels]);
  const pathD = useMemo(() => buildPathD(positions), [positions]);

  const svgWidth = PADDING_X * 2 + (COLS - 1) * COL_GAP + 60;
  const svgHeight = PADDING_Y * 2 + Math.ceil(levels.length / COLS) * ROW_GAP + 40;

  const getStatus = useCallback(
    (id: number): 'completed' | 'current' | 'locked' => {
      if (completedIds.includes(id)) return 'completed';
      if (id === nextUnlockedId) return 'current';
      return 'locked';
    },
    [completedIds, nextUnlockedId]
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
      <Header />
      <div style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: 16 }}
          >
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: '#6B7280',
                transition: 'all .2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(45,106,79,0.06)';
                e.currentTarget.style.color = '#2D6A4F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </motion.div>

          {/* Track info header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '24px 28px',
              marginBottom: 24,
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              border: '1px solid #E8E4DD',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: `${track.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              <LanguageIcon lang={lang} size={30} color={track.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#1A1A1A',
                  fontFamily: 'Sora, sans-serif',
                }}
              >
                {track.name}
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
                {track.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#2D6A4F',
                    background: 'rgba(45,106,79,0.08)',
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}
                >
                  {completedIds.length} / {levels.length} completed
                </span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>
                  {Math.round((completedIds.length / levels.length) * 100)}% progress
                </span>
              </div>
            </div>
            <ThemeToggle size="sm" />
          </motion.div>

          {/* Level map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '16px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              border: '1px solid #E8E4DD',
              overflowX: 'auto',
              marginBottom: 40,
            }}
          >
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ display: 'block', margin: '0 auto' }}
            >
              {/* Path */}
              <path
                d={pathD}
                fill="none"
                stroke="#E8E4DD"
                strokeWidth={4}
                strokeLinecap="round"
              />
              {/* Completed portion */}
              {positions.length > 1 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#2D6A4F"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={`${positions.findIndex((p) => p.level.id === nextUnlockedId) * (svgHeight / positions.length) * 1.5 || 0} ${svgHeight * 3}`}
                />
              )}

              {/* Nodes */}
              {positions.map((pos) => {
                const status = getStatus(pos.level.id);
                const isBoss = pos.level.category === 'boss';
                const size = isBoss ? BOSS_SIZE : NODE_SIZE;
                const isHovered = hoveredId === pos.level.id;
                const catColor = CATEGORY_COLORS[pos.level.category] || '#2D6A4F';

                return (
                  <g key={pos.level.id}>
                    {/* Glow for current level */}
                    {status === 'current' && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={size / 2 + 10}
                        fill="none"
                        stroke="#2D6A4F"
                        strokeWidth={2}
                        opacity={0.3}
                      >
                        <animate
                          attributeName="r"
                          values={`${size / 2 + 6};${size / 2 + 14};${size / 2 + 6}`}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.4;0.15;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Boss hexagon */}
                    {isBoss ? (
                      <polygon
                        points={`${pos.x},${pos.y - size / 2} ${pos.x + size * 0.433},${pos.y - size / 4} ${pos.x + size * 0.433},${pos.y + size / 4} ${pos.x},${pos.y + size / 2} ${pos.x - size * 0.433},${pos.y + size / 4} ${pos.x - size * 0.433},${pos.y - size / 4}`}
                        fill={
                          status === 'completed'
                            ? '#2D6A4F'
                            : status === 'current'
                            ? '#fff'
                            : '#D1D5DB'
                        }
                        stroke={status === 'locked' ? '#D1D5DB' : '#E9C46A'}
                        strokeWidth={3}
                        style={{ cursor: 'pointer', transition: 'all .2s' }}
                        onMouseEnter={() => setHoveredId(pos.level.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => navigate(`/level/${lang}/${pos.level.id}`)}
                      />
                    ) : (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={size / 2}
                        fill={
                          status === 'completed'
                            ? '#2D6A4F'
                            : status === 'current'
                            ? '#fff'
                            : '#D1D5DB'
                        }
                        stroke={
                          status === 'current'
                            ? catColor
                            : status === 'completed'
                            ? '#2D6A4F'
                            : '#D1D5DB'
                        }
                        strokeWidth={status === 'current' ? 3 : 2}
                        style={{ cursor: 'pointer', transition: 'all .2s' }}
                        onMouseEnter={() => setHoveredId(pos.level.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => navigate(`/level/${lang}/${pos.level.id}`)}
                      />
                    )}

                    {/* Icon inside node */}
                    <g
                      style={{ pointerEvents: 'none' }}
                      transform={`translate(${pos.x}, ${pos.y})`}
                    >
                      {status === 'completed' ? (
                        <Check
                          size={isBoss ? 22 : 18}
                          color="#fff"
                          strokeWidth={3}
                          style={{ transform: 'translate(-9px, -9px)' }}
                        />
                      ) : status === 'locked' ? (
                        <Lock
                          size={isBoss ? 20 : 14}
                          color="#9CA3AF"
                          strokeWidth={2.5}
                          style={{ transform: `translate(${isBoss ? -10 : -7}px, ${isBoss ? -10 : -7}px)` }}
                        />
                      ) : (
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={isBoss ? 16 : 13}
                          fontWeight={700}
                          fill={catColor}
                          fontFamily="Sora, sans-serif"
                        >
                          {pos.level.id}
                        </text>
                      )}
                    </g>

                    {/* Tooltip */}
                    {isHovered && (
                      <foreignObject
                        x={pos.x - 80}
                        y={pos.y - 100}
                        width={160}
                        height={80}
                        style={{ pointerEvents: 'none', overflow: 'visible' }}
                      >
                        <div
                          style={{
                            background: '#1A1A1A',
                            color: '#fff',
                            borderRadius: 10,
                            padding: '8px 12px',
                            fontSize: 12,
                            lineHeight: 1.4,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: 2 }}>
                            {isBoss ? '👑 ' : ''}Level {pos.level.id}
                          </div>
                          <div style={{ fontSize: 11, opacity: 0.85 }}>{pos.level.title}</div>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ color: '#E9C46A', fontWeight: 600 }}>
                              <Zap size={10} style={{ verticalAlign: -1 }} /> {pos.level.xpReward} XP
                            </span>
                            <span style={{ color: '#6B7280' }}>{pos.level.estimatedMinutes}m</span>
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              flexWrap: 'wrap',
              marginBottom: 40,
              padding: '12px 0',
            }}
          >
            {[
              { color: CATEGORY_COLORS.concept, label: 'Concept' },
              { color: CATEGORY_COLORS.practice, label: 'Practice' },
              { color: CATEGORY_COLORS.challenge, label: 'Challenge' },
              { color: CATEGORY_COLORS.boss, label: 'Boss' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: item.color,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
                  {item.label}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#D1D5DB',
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
                Locked
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
