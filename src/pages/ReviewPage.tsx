import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, XCircle, Brain, Clock, Zap, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { useSRSStore } from '../stores/srsStore';
import { TRACK_INFO } from '../data/levels';
import type { Language } from '../types';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const QUALITY_OPTIONS = [
  { key: 'forgot' as const, label: 'Forgot', color: '#EF4444', icon: XCircle, desc: 'Couldn\'t recall' },
  { key: 'hard' as const, label: 'Hard', color: '#F59E0B', icon: RotateCcw, desc: 'Recalled with difficulty' },
  { key: 'good' as const, label: 'Good', color: '#2D6A4F', icon: CheckCircle2, desc: 'Recalled correctly' },
  { key: 'easy' as const, label: 'Easy', color: '#52B788', icon: Zap, desc: 'Instant recall' },
];

export default function ReviewPage() {
  const { cards, reviewCard, getDueCards } = useSRSStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);

  const dueCards = useMemo(() => getDueCards(), [cards]);
  const currentCard = dueCards[currentIndex];

  const handleReview = (quality: 'easy' | 'good' | 'hard' | 'forgot') => {
    if (!currentCard) return;
    reviewCard(currentCard.command, quality);
    setSessionReviewed(prev => prev + 1);
    setShowAnswer(false);
    if (currentIndex >= dueCards.length - 1) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const allCards = Object.values(cards);
  const totalCards = allCards.length;
  const masteredCount = allCards.filter(c => c.interval >= 21).length;
  const learningCount = allCards.filter(c => c.interval < 21 && c.reviewCount > 0).length;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
      <Header />
      <div style={{ paddingTop: 88, maxWidth: 700, margin: '0 auto', padding: '88px 24px 40px' }}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 800, margin: 0 }}>Spaced Review</h1>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{dueCards.length} commands due for review</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total', value: totalCards, color: '#6B7280' },
            { label: 'Due', value: dueCards.length, color: '#F4845F' },
            { label: 'Learning', value: learningCount, color: '#E9C46A' },
            { label: 'Mastered', value: masteredCount, color: '#52B788' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 14, padding: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 20, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {totalCards === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 48, textAlign: 'center' }}>
            <Brain size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No Commands Yet</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 16 }}>Complete Git levels to add commands to your review deck.</p>
            <a href="/learn/git" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', background: '#2D6A4F', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Start Learning <ChevronRight size={16} />
            </a>
          </motion.div>
        ) : sessionComplete ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 48, textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#52B788" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Session Complete!</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 8 }}>You reviewed {sessionReviewed} commands.</p>
            <p style={{ color: '#9CA3AF', fontSize: 13 }}>Come back tomorrow for more reviews.</p>
          </motion.div>
        ) : currentCard ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, overflow: 'hidden' }}>
            {/* Progress bar */}
            <div style={{ height: 4, background: '#F0EEE9' }}>
              <motion.div
                animate={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
                style={{ height: '100%', background: '#2D6A4F', borderRadius: 2 }}
              />
            </div>

            <div style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }}>
                {currentIndex + 1} / {dueCards.length}
              </div>

              {/* Language tag */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                borderRadius: 9999, background: (TRACK_INFO[currentCard.language as Language]?.color || '#6B7280') + '18',
                fontSize: 12, fontWeight: 600, color: TRACK_INFO[currentCard.language as Language]?.color || '#6B7280',
                marginBottom: 16,
              }}>
                {TRACK_INFO[currentCard.language as Language]?.name || currentCard.language}
              </div>

              {/* Command */}
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700,
                color: '#1A1A1A', padding: '24px 0',
              }}>
                {currentCard.command}
              </div>

              {!showAnswer ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAnswer(true)}
                  style={{
                    padding: '14px 40px', background: '#2D6A4F', color: '#fff', border: 'none',
                    borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Show Answer
                </motion.button>
              ) : (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                  {QUALITY_OPTIONS.map(q => (
                    <motion.button
                      key={q.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReview(q.key)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        padding: '12px 20px', background: q.color + '12', border: `1.5px solid ${q.color}30`,
                        borderRadius: 12, cursor: 'pointer', minWidth: 90,
                      }}
                    >
                      <q.icon size={20} color={q.color} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: q.color }}>{q.label}</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF' }}>{q.desc}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Card info */}
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16, fontSize: 11, color: '#9CA3AF' }}>
                <span><Clock size={12} /> Interval: {currentCard.interval}d</span>
                <span><Zap size={12} /> Reviews: {currentCard.reviewCount}</span>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* All cards list */}
        {allCards.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
            style={{ marginTop: 24, background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>All Commands ({allCards.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {allCards.slice(0, 20).map((card) => (
                <div key={`${card.language}:${card.command}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 10, background: '#FAFAF8',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }}>{card.command}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF', padding: '2px 8px', background: '#F0EEE9', borderRadius: 6 }}>{card.language}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#9CA3AF' }}>
                    {card.interval >= 21 && <span style={{ color: '#52B788', fontWeight: 600 }}>Mastered</span>}
                    {card.interval < 21 && card.reviewCount > 0 && <span style={{ color: '#E9C46A', fontWeight: 600 }}>Learning</span>}
                    {card.reviewCount === 0 && <span style={{ color: '#6B7280', fontWeight: 600 }}>New</span>}
                    <span>{card.interval}d</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
