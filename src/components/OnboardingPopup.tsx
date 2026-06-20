import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { TRACK_INFO } from '../data/levels';
import LanguageIcon from './LanguageIcon';
import type { Language } from '../types';

const interests: { key: Language; label: string; desc: string }[] = [
  { key: 'git', label: 'Git & GitHub', desc: 'Version control & collaboration' },
  { key: 'python', label: 'Python', desc: 'Data science, AI & automation' },
  { key: 'c', label: 'C', desc: 'Systems & embedded programming' },
  { key: 'cpp', label: 'C++', desc: 'Performance, games & OOP' },
  { key: 'java', label: 'Java', desc: 'Enterprise & Android apps' },
];

export default function OnboardingPopup() {
  const { user, updateProfile } = useAuthStore();
  const [step, setStep] = useState<'name' | 'interest'>('name');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Language | null>(null);

  if (!user?.isDemo) return null;
  if (user.username !== 'explorer') return null;

  const handleNameNext = () => {
    if (name.trim().length < 2) return;
    updateProfile({ name: name.trim(), username: name.trim().toLowerCase().replace(/\s+/g, '_') });
    setStep('interest');
  };

  const handleInterestNext = () => {
    if (!selected) return;
    updateProfile({ language: selected });
    localStorage.removeItem('gitnova_onboarded_' + user.id);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 10001,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome setup"
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            background: '#fff', borderRadius: 28, padding: '44px 40px',
            maxWidth: 480, width: '100%', position: 'relative',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          }}
        >
          <AnimatePresence mode="wait">
            {step === 'name' ? (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <User size={28} color="#fff" />
                </div>

                <h2 style={{
                  fontFamily: 'Sora', fontSize: 24, fontWeight: 800,
                  textAlign: 'center', marginBottom: 8,
                }}>
                  Welcome to GitNova!
                </h2>
                <p style={{
                  fontSize: 15, color: '#6B7280', textAlign: 'center',
                  lineHeight: 1.6, marginBottom: 32,
                }}>
                  Let's set up your experience. What should we call you?
                </p>

                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
                    placeholder="Enter your name"
                    style={{
                      width: '100%', padding: '14px 16px 14px 46px',
                      borderRadius: 14, border: '1.5px solid #E8E4DD',
                      fontSize: 15, outline: 'none', fontFamily: 'Inter',
                      transition: 'border-color .2s',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2D6A4F'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E8E4DD'}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: name.trim().length >= 2 ? 1.02 : 1 }}
                  whileTap={{ scale: name.trim().length >= 2 ? 0.98 : 1 }}
                  onClick={handleNameNext}
                  disabled={name.trim().length < 2}
                  style={{
                    width: '100%', padding: '14px 24px', borderRadius: 14,
                    background: name.trim().length >= 2 ? 'linear-gradient(135deg, #2D6A4F, #52B788)' : '#D1D5DB',
                    color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
                    cursor: name.trim().length >= 2 ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: name.trim().length >= 2 ? '0 4px 16px rgba(45,106,79,0.25)' : 'none',
                  }}
                >
                  Continue <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="interest"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: 'linear-gradient(135deg, #F4845F, #E9C46A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <Sparkles size={28} color="#fff" />
                </div>

                <h2 style={{
                  fontFamily: 'Sora', fontSize: 24, fontWeight: 800,
                  textAlign: 'center', marginBottom: 8,
                }}>
                  What do you want to learn?
                </h2>
                <p style={{
                  fontSize: 15, color: '#6B7280', textAlign: 'center',
                  lineHeight: 1.6, marginBottom: 28,
                }}>
                  Pick your focus. We'll customize your learning path, {name}.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {interests.map((item) => {
                    const isActive = selected === item.key;
                    return (
                      <motion.button
                        key={item.key}
                        whileHover={{ scale: 1.01, borderColor: TRACK_INFO[item.key].color }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelected(item.key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px', borderRadius: 14,
                          border: `2px solid ${isActive ? TRACK_INFO[item.key].color : '#E8E4DD'}`,
                          background: isActive ? TRACK_INFO[item.key].color + '0A' : '#fff',
                          cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
                        }}
                      >
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: TRACK_INFO[item.key].color + '15',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <LanguageIcon lang={item.key} size={24} color={TRACK_INFO[item.key].color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A' }}>{item.label}</div>
                          <div style={{ fontSize: 13, color: '#6B7280' }}>{item.desc}</div>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              width: 24, height: 24, borderRadius: '50%',
                              background: TRACK_INFO[item.key].color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <Check size={14} color="#fff" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: selected ? 1.02 : 1 }}
                  whileTap={{ scale: selected ? 0.98 : 1 }}
                  onClick={handleInterestNext}
                  disabled={!selected}
                  style={{
                    width: '100%', padding: '14px 24px', borderRadius: 14,
                    background: selected ? 'linear-gradient(135deg, #2D6A4F, #52B788)' : '#D1D5DB',
                    color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
                    cursor: selected ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: selected ? '0 4px 16px rgba(45,106,79,0.25)' : 'none',
                  }}
                >
                  Start Learning <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
