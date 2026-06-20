import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AtSign, Mail, Bell, Globe, Save, AlertTriangle, Trash2, RotateCcw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LanguageIcon from '../components/LanguageIcon';
import { TRACK_INFO } from '../data/levels';
import type { Language } from '../types';
import Header from '../components/Header';
import { ThemeToggle } from '../components/ui/theme-toggle';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

interface SettingsForm {
  name: string;
  username: string;
  email: string;
  language: Language;
  emailNotifications: boolean;
  streakReminders: boolean;
}

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const updateProfile = useAuthStore(s => s.updateProfile);
  const resetProgress = useAuthStore(s => s.resetProgress);
  const deleteAccount = useAuthStore(s => s.deleteAccount);
  const nav = useNavigate();
  const [form, setForm] = useState<SettingsForm>({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    language: (user?.languagePreference || 'git') as Language,
    emailNotifications: user?.emailNotifications ?? true,
    streakReminders: user?.streakReminders ?? true,
  });
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [deleteDone, setDeleteDone] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleSave = () => {
    updateProfile({
      name: form.name,
      username: form.username,
      email: form.email,
      language: form.language,
      emailNotifications: form.emailNotifications,
      streakReminders: form.streakReminders,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetProgress = () => {
    setShowResetConfirm(false);
    resetProgress();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  const handleDeleteAccount = () => {
    if (!deletePassword.trim()) return;
    setShowDeleteConfirm(false);
    deleteAccount(deletePassword);
    setDeleteDone(true);
    setTimeout(() => { nav('/'); }, 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px 11px 42px', borderRadius: 12,
    border: '1px solid #E8E4DD', fontSize: 14, outline: 'none',
    background: '#F8F8F6', fontFamily: 'Inter', color: '#1A1A1A',
    transition: 'border-color .2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', fontFamily: 'Inter' }}>
      <Header />

      <div style={{ paddingTop: 80 }}>
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 60px' }}>
          {/* Header */}
          <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, margin: 0 }}>Settings</h1>
            <p style={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}>Manage your account and preferences</p>
          </motion.div>

          {/* Profile Section */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2D6A4F18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="#2D6A4F" />
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, margin: 0 }}>Profile</h3>
            </div>

            {[
              { key: 'name', label: 'Full Name', icon: User, type: 'text' },
              { key: 'username', label: 'Username', icon: AtSign, type: 'text' },
              { key: 'email', label: 'Email', icon: Mail, type: 'email' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#374151' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <f.icon size={17} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={f.type}
                    value={String(form[f.key as keyof SettingsForm])}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#2D6A4F')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8E4DD')}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Language Preference */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#52B78818', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} color="#52B788" />
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, margin: 0 }}>Language Preference</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
              {(Object.keys(TRACK_INFO) as Language[]).map(lang => (
                <motion.button
                  key={lang}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setForm({ ...form, language: lang })}
                  style={{
                    padding: '14px 8px', borderRadius: 14,
                    border: `2px solid ${form.language === lang ? '#2D6A4F' : '#E8E4DD'}`,
                    background: form.language === lang ? '#2D6A4F10' : '#fff',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{ marginBottom: 6 }}><LanguageIcon lang={lang} size={28} color={TRACK_INFO[lang].color} /></div>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: form.language === lang ? '#2D6A4F' : '#6B7280',
                  }}>
                    {TRACK_INFO[lang].name}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E9C46A18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={18} color="#E9C46A" />
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, margin: 0 }}>Preferences</h3>
            </div>

            {/* Theme */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0', borderBottom: '1px solid #F0EEE9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0EEE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={16} color="#6B7280" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Theme</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>Toggle light / dark mode</div>
                </div>
              </div>
              <ThemeToggle size="sm" />
            </div>

            {/* Notification toggles */}
            {[
              {
                key: 'emailNotifications', label: 'Email Notifications',
                desc: 'Receive updates about new levels and achievements',
              },
              {
                key: 'streakReminders', label: 'Streak Reminders',
                desc: 'Get notified to maintain your daily streak',
              },
            ].map(pref => (
              <div key={pref.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', borderBottom: '1px solid #F0EEE9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0EEE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={16} color="#6B7280" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{pref.label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{pref.desc}</div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  role="switch"
                  aria-checked={!!form[pref.key as keyof SettingsForm]}
                  aria-label={pref.label}
                  onClick={() => setForm({ ...form, [pref.key]: !form[pref.key as keyof SettingsForm] as boolean })}
                  style={{
                    width: 48, height: 26, borderRadius: 9999,
                    background: form[pref.key as keyof SettingsForm] as boolean ? '#2D6A4F' : '#D1D5DB',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    transition: 'background .2s', flexShrink: 0,
                  }}
                >
                  <motion.div
                    animate={{ x: form[pref.key as keyof SettingsForm] as boolean ? 24 : 3 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      width: 20, height: 20, borderRadius: 9999,
                      background: '#fff', position: 'absolute', top: 3,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    }}
                  />
                </motion.button>
              </div>
            ))}
          </motion.div>

          {/* Save Button */}
          <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(45,106,79,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: saved ? '#52B788' : '#2D6A4F', color: '#fff',
                border: 'none', borderRadius: 14, padding: '14px 32px',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                transition: 'background .3s',
                boxShadow: '0 2px 12px rgba(45,106,79,0.2)',
              }}
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={18} /> Changes Saved!
                  </motion.span>
                ) : (
                  <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Save size={18} /> Save Changes
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={fadeUp} style={{
            background: '#fff', border: '2px solid #FEE2E2', borderRadius: 20, padding: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} color="#EF4444" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, margin: 0, color: '#EF4444' }}>Danger Zone</h3>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>Irreversible actions</p>
              </div>
            </div>

            {/* Reset Progress */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', borderRadius: 12, border: '1px solid #FEE2E2',
              background: '#FFFBFB', marginBottom: 12,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Reset Progress</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Clear all XP, levels, and achievements</div>
              </div>
              {resetDone ? (
                <span style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600 }}>Done!</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowResetConfirm(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    borderRadius: 10, border: '1px solid #FCA5A5', background: '#fff',
                    color: '#EF4444', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={14} /> Reset
                </motion.button>
              )}
            </div>

            {/* Delete Account */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', borderRadius: 12, border: '1px solid #FEE2E2',
              background: '#FFFBFB',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Delete Account</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Permanently delete your account and all data</div>
              </div>
              {deleteDone ? (
                <span style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600 }}>Deleted!</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    borderRadius: 10, border: '1px solid #FCA5A5', background: '#EF4444',
                    color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} /> Delete
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10000, padding: 20,
            }}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Reset progress confirmation"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 20, padding: 32, maxWidth: 400,
                width: '100%', textAlign: 'center',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 9999, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <RotateCcw size={28} color="#EF4444" />
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, marginBottom: 8, margin: '0 0 8px' }}>Reset Progress?</h3>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
                This will permanently erase all your XP, completed levels, and achievements. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #E8E4DD',
                    background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#6B7280',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleResetProgress}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12, border: 'none',
                    background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Reset Everything
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10000, padding: 20,
            }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Delete account confirmation"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 20, padding: 32, maxWidth: 400,
                width: '100%', textAlign: 'center',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 9999, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Trash2 size={28} color="#EF4444" />
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, marginBottom: 8, margin: '0 0 8px' }}>Delete Account?</h3>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>
                This will permanently delete your account, all progress, and personal data. This action is irreversible.
              </p>
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1px solid #E8E4DD', fontSize: 14, outline: 'none',
                  background: '#F8F8F6', fontFamily: 'Inter', color: '#1A1A1A',
                  marginBottom: 16, boxSizing: 'border-box',
                }}
                aria-label="Password to confirm deletion"
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #E8E4DD',
                    background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#6B7280',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeleteAccount}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12, border: 'none',
                    background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
