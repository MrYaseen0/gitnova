import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 36, showText = true, className }: LogoProps) {
  const s = size;
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: s * 0.25 }}>
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          width: s,
          height: s,
          borderRadius: s * 0.22,
          background: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top-left highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
          borderRadius: `${s * 0.22}px ${s * 0.22}px 0 0`,
        }} />
        <svg width={s * 0.62} height={s * 0.62} viewBox="0 0 64 64" fill="none">
          {/* Outer nova rays */}
          <path d="M32 4L34 14L30 14Z" fill="#C9A84C" />
          <path d="M32 60L34 50L30 50Z" fill="#C9A84C" />
          <path d="M4 32L14 30L14 34Z" fill="#C9A84C" />
          <path d="M60 32L50 30L50 34Z" fill="#C9A84C" />
          <path d="M11.5 11.5L18 16L16 18Z" fill="#C9A84C" opacity="0.7" />
          <path d="M52.5 11.5L46 16L48 18Z" fill="#C9A84C" opacity="0.7" />
          <path d="M11.5 52.5L18 48L16 46Z" fill="#C9A84C" opacity="0.7" />
          <path d="M52.5 52.5L46 48L48 46Z" fill="#C9A84C" opacity="0.7" />

          {/* Core circle */}
          <circle cx="32" cy="32" r="14" fill="#0D1117" stroke="#C9A84C" strokeWidth="2" />

          {/* Inner star */}
          <path d="M32 22 L34.5 28.5 L41 29 L36 33 L37.5 39.5 L32 36 L26.5 39.5 L28 33 L23 29 L29.5 28.5 Z" fill="#C9A84C" />

          {/* Git dot */}
          <circle cx="32" cy="30.5" r="2" fill="#0D1117" />
        </svg>
      </motion.div>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: s * 0.48,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            display: 'flex',
          }}>
            <span style={{ color: '#E5E7EB' }}>Git</span>
            <span style={{ color: '#C9A84C' }}>Nova</span>
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: s * 0.17,
            color: '#6B7280',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: s * 0.04,
          }}>
            Master Git Through Play
          </div>
        </div>
      )}
    </div>
  );
}
