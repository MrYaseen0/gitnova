import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function DemoBanner() {
  const { user, logout } = useAuthStore();
  if (!user?.isDemo) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'linear-gradient(90deg, #F4845F 0%, #E9C46A 100%)', color: '#fff', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'Inter', fontSize: 14, fontWeight: 600 }}>
        <Play size={16} />
        <span>You're in <strong>Demo Mode</strong> — progress won't be saved</span>
        <Link to="/register" style={{ color: '#fff', background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '4px 14px', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>Sign Up Free</Link>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={logout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, position: 'absolute', right: 20 }}>
          <X size={18} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
