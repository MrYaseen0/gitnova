import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, Trophy, BarChart3, Settings, User, Play, Command, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LanguageIcon from './LanguageIcon';
import { TRACK_INFO } from '../data/levels';
interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const commands: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [
      // Navigation
      { id: 'nav-home', label: 'Dashboard', description: 'Go to your dashboard', icon: <Home size={16} />, action: () => { navigate('/dashboard'); onClose(); }, category: 'Navigation', keywords: ['home', 'dashboard', 'main'] },
      { id: 'nav-playground', label: 'Playground', description: 'Practice Git commands', icon: <Play size={16} />, action: () => { navigate('/playground'); onClose(); }, category: 'Navigation', keywords: ['playground', 'practice', 'sandbox'] },
      { id: 'nav-profile', label: 'Profile', description: 'View your profile', icon: <User size={16} />, action: () => { navigate('/profile'); onClose(); }, category: 'Navigation', keywords: ['profile', 'account', 'me'] },
      { id: 'nav-achievements', label: 'Achievements', description: 'View your badges', icon: <Trophy size={16} />, action: () => { navigate('/achievements'); onClose(); }, category: 'Navigation', keywords: ['achievements', 'badges', 'rewards'] },
      { id: 'nav-leaderboard', label: 'Leaderboard', description: 'See top learners', icon: <BarChart3 size={16} />, action: () => { navigate('/leaderboard'); onClose(); }, category: 'Navigation', keywords: ['leaderboard', 'rankings', 'top'] },
      { id: 'nav-settings', label: 'Settings', description: 'Manage your account', icon: <Settings size={16} />, action: () => { navigate('/settings'); onClose(); }, category: 'Navigation', keywords: ['settings', 'preferences', 'config'] },

      // Language Tracks
      { id: 'learn-git', label: 'Git Track', description: '50 levels of Git mastery', icon: <LanguageIcon lang="git" size={16} color="#2D6A4F" />, action: () => { navigate('/learn/git'); onClose(); }, category: 'Languages', keywords: ['git', 'version', 'control'] },
      { id: 'learn-python', label: 'Python Track', description: '10 levels of Python', icon: <LanguageIcon lang="python" size={16} color="#3776AB" />, action: () => { navigate('/learn/python'); onClose(); }, category: 'Languages', keywords: ['python', 'programming'] },
      { id: 'learn-c', label: 'C Track', description: '10 levels of C', icon: <LanguageIcon lang="c" size={16} color="#A8B9CC" />, action: () => { navigate('/learn/c'); onClose(); }, category: 'Languages', keywords: ['c', 'programming', 'systems'] },
      { id: 'learn-cpp', label: 'C++ Track', description: '10 levels of C++', icon: <LanguageIcon lang="cpp" size={16} color="#00599C" />, action: () => { navigate('/learn/cpp'); onClose(); }, category: 'Languages', keywords: ['cpp', 'c++', 'programming'] },
      { id: 'learn-java', label: 'Java Track', description: '10 levels of Java', icon: <LanguageIcon lang="java" size={16} color="#ED8B00" />, action: () => { navigate('/learn/java'); onClose(); }, category: 'Languages', keywords: ['java', 'programming'] },

      // Quick Actions
      { id: 'action-theme', label: 'Toggle Dark Mode', description: 'Switch between light and dark themes', icon: <Command size={16} />, action: () => { document.documentElement.classList.toggle('dark'); onClose(); }, category: 'Actions', keywords: ['theme', 'dark', 'light', 'mode'] },
      { id: 'action-next-level', label: 'Continue Learning', description: 'Go to your next level', icon: <ArrowRight size={16} />, action: () => { navigate(`/learn/${user?.languagePreference || 'git'}`); onClose(); }, category: 'Actions', keywords: ['continue', 'next', 'learn', 'level'] },
    ];

    // Add user's in-progress level if available
    if (user) {
      const lang = user.languagePreference;
      const completedCount = (user.completedLevels[lang] || []).length;
      const nextLevelId = completedCount + 1;
      items.push({
        id: 'action-resume',
        label: `Resume Level ${nextLevelId}`,
        description: `Continue with ${TRACK_INFO[lang].name} Level ${nextLevelId}`,
        icon: <LanguageIcon lang={lang} size={16} color={TRACK_INFO[lang].color} />,
        action: () => { navigate(`/level/${lang}/${nextLevelId}`); onClose(); },
        category: 'Actions',
        keywords: ['resume', 'continue', 'level', lang],
      });
    }

    return items;
  }, [user, navigate, onClose]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.description?.toLowerCase().includes(lowerQuery) ||
      cmd.keywords.some(k => k.includes(lowerQuery))
    );
  }, [commands, query]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const cmd of filteredCommands) {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filteredCommands]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

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
              zIndex: 9999,
            }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 560,
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              zIndex: 10000,
            }}
          >
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 20px',
              borderBottom: '1px solid #E8E4DD',
            }}>
              <Search size={18} color="#6B7280" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, pages, languages..."
                aria-label="Search commands"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 15,
                  fontFamily: 'Inter, sans-serif',
                  color: '#1A1A1A',
                  background: 'transparent',
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                background: '#F0EEE9',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                color: '#6B7280',
              }}>
                ESC
              </div>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px' }}>
              {filteredCommands.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: '#6B7280' }}>
                  <p style={{ fontSize: 14, margin: 0 }}>No results for "{query}"</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} style={{ marginBottom: 8 }}>
                    <div style={{
                      padding: '6px 12px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      {category}
                    </div>
                    {items.map((cmd) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          whileHover={{ backgroundColor: 'rgba(45,106,79,0.04)' }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            width: '100%',
                            padding: '10px 12px',
                            border: 'none',
                            borderRadius: 10,
                            background: isSelected ? 'rgba(45,106,79,0.06)' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.1s',
                          }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: isSelected ? '#2D6A4F18' : '#F0EEE9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelected ? '#2D6A4F' : '#6B7280',
                            flexShrink: 0,
                          }}>
                            {cmd.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#1A1A1A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {cmd.label}
                            </div>
                            {cmd.description && (
                              <div style={{
                                fontSize: 12,
                                color: '#6B7280',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div style={{
                              fontSize: 11,
                              color: '#2D6A4F',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}>
                              Enter
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid #E8E4DD',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 11,
              color: '#9CA3AF',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ padding: '2px 6px', background: '#F0EEE9', borderRadius: 4, fontWeight: 600 }}>↑↓</span>
                navigate
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ padding: '2px 6px', background: '#F0EEE9', borderRadius: 4, fontWeight: 600 }}>↵</span>
                select
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ padding: '2px 6px', background: '#F0EEE9', borderRadius: 4, fontWeight: 600 }}>esc</span>
                close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
