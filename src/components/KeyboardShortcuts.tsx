import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface ShortcutCategory {
  name: string;
  shortcuts: { keys: string[]; description: string }[];
}

const SHORTCUTS: ShortcutCategory[] = [
  {
    name: 'Navigation',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['⌘', 'Shift', 'P'], description: 'Open profile' },
      { keys: ['⌘', 'L'], description: 'Go to leaderboard' },
      { keys: ['⌘', 'H'], description: 'Go to dashboard' },
      { keys: ['⌘', '/'], description: 'Go to playground' },
    ],
  },
  {
    name: 'Level Page',
    shortcuts: [
      { keys: ['Enter'], description: 'Run command / Check answer' },
      { keys: ['⌘', 'Enter'], description: 'Submit and continue' },
      { keys: ['⌘', 'R'], description: 'Reset current step' },
      { keys: ['⌘', '→'], description: 'Next step' },
      { keys: ['⌘', '←'], description: 'Previous step' },
      { keys: ['1'], description: 'Switch to Theory tab (mobile)' },
      { keys: ['2'], description: 'Switch to Code tab (mobile)' },
      { keys: ['3'], description: 'Switch to Terminal tab (mobile)' },
    ],
  },
  {
    name: 'Playground',
    shortcuts: [
      { keys: ['Enter'], description: 'Run command' },
      { keys: ['↑'], description: 'Previous command in history' },
      { keys: ['↓'], description: 'Next command in history' },
      { keys: ['⌘', 'K'], description: 'Clear terminal' },
      { keys: ['Tab'], description: 'Auto-complete command' },
    ],
  },
  {
    name: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show this shortcuts panel' },
      { keys: ['Esc'], description: 'Close modal / palette' },
      { keys: ['⌘', 'D'], description: 'Toggle dark mode' },
      { keys: ['⌘', ','], description: 'Open settings' },
    ],
  },
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 10001,
            }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: 640,
              maxHeight: '80vh',
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              zIndex: 10002,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #E8E4DD',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: '#2D6A4F18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Keyboard size={20} color="#2D6A4F" />
                </div>
                <div>
                  <h2 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 18,
                    fontWeight: 700,
                    margin: 0,
                    color: '#1A1A1A',
                  }}>
                    Keyboard Shortcuts
                  </h2>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                    Navigate faster with shortcuts
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close keyboard shortcuts"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  background: '#F0EEE9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} color="#6B7280" />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                {SHORTCUTS.map((category) => (
                  <div key={category.name}>
                    <h3 style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      margin: '0 0 12px',
                    }}>
                      {category.name}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {category.shortcuts.map((shortcut, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                          }}
                        >
                          <span style={{ fontSize: 13, color: '#374151' }}>
                            {shortcut.description}
                          </span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {shortcut.keys.map((key, j) => (
                              <span key={j}>
                                <kbd style={{
                                  display: 'inline-block',
                                  padding: '4px 8px',
                                  background: '#F0EEE9',
                                  border: '1px solid #E8E4DD',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  fontFamily: 'Inter, sans-serif',
                                  color: '#374151',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                }}>
                                  {key}
                                </kbd>
                                {j < shortcut.keys.length - 1 && (
                                  <span style={{ color: '#9CA3AF', margin: '0 2px' }}>+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 24px',
              borderTop: '1px solid #E8E4DD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 12,
              color: '#6B7280',
            }}>
              Press <kbd style={{
                padding: '2px 6px',
                background: '#F0EEE9',
                border: '1px solid #E8E4DD',
                borderRadius: 4,
                fontWeight: 600,
              }}>?</kbd> anywhere to open this panel
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to use keyboard shortcuts
// eslint-disable-next-line react-refresh/only-export-components
export function useKeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}
