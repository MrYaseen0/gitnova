import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIMER_KEY = 'gitnova_demo_start';
const DISMISSED_KEY = 'gitnova_save_dismissed';
const PROMPT_INTERVAL = 15 * 60 * 1000;
const SHOW_AFTER = 10 * 60 * 1000;

export default function SaveProgressPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    const now = Date.now();
    if (dismissedAt && now - parseInt(dismissedAt) < PROMPT_INTERVAL) return;

    let start = localStorage.getItem(TIMER_KEY);
    if (!start) {
      start = String(now);
      localStorage.setItem(TIMER_KEY, start);
    }

    const elapsed = now - parseInt(start);
    if (elapsed >= SHOW_AFTER) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      return;
    }

    const remaining = SHOW_AFTER - elapsed;
    const timer = setTimeout(() => setShow(true), remaining);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Save your progress"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{
              background: '#fff', borderRadius: 24, padding: 40,
              maxWidth: 440, width: '100%', position: 'relative',
              boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
            }}
          >
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              style={{
                position: 'absolute', top: 16, right: 16,
                background: '#F8F8F6', border: 'none', borderRadius: 10,
                width: 36, height: 36, display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X size={18} color="#6B7280" />
            </button>

            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Save size={28} color="#fff" />
            </div>

            <h3 style={{
              fontFamily: 'Sora', fontSize: 22, fontWeight: 800,
              textAlign: 'center', marginBottom: 8,
            }}>
              enjoying the ride?
            </h3>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, marginBottom: 16,
            }}>
              <Clock size={14} color="#F4845F" />
              <span style={{ fontSize: 14, color: '#6B7280' }}>
                You've been learning for 10+ minutes
              </span>
            </div>

            <p style={{
              fontSize: 15, color: '#6B7280', textAlign: 'center',
              lineHeight: 1.6, marginBottom: 28,
            }}>
              Your progress is saved in demo mode on this device. 
              Create a free account to sync your XP, achievements, and levels across all your devices.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                to="/register"
                onClick={() => { localStorage.removeItem(TIMER_KEY); localStorage.removeItem(DISMISSED_KEY); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 24px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                  color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(45,106,79,0.25)',
                }}
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                onClick={() => { localStorage.removeItem(TIMER_KEY); localStorage.removeItem(DISMISSED_KEY); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 14,
                  background: '#F8F8F6', border: '1px solid #E8E4DD',
                  color: '#1A1A1A', fontWeight: 600, fontSize: 14, textDecoration: 'none',
                }}
              >
                I already have an account
              </Link>
              <button
                onClick={dismiss}
                style={{
                  background: 'transparent', border: 'none', color: '#6B7280',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 8,
                }}
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
