/* eslint-disable react-hooks/purity, react-hooks/refs */
import { useRef } from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export function Skeleton({ width, height = 16, borderRadius = 8, style }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #E8E4DD 25%, #F0EEE9 50%, #E8E4DD 75%)',
        backgroundSize: '200% 100%',
        ...style,
      }}
    />
  );
}

export function PageSkeleton() {
  const widthsRef = useRef([0, 1, 2, 3, 4].map(() => ({
    w1: 60 + Math.random() * 30,
    w2: 40 + Math.random() * 20,
  })));
  const randomWidths = widthsRef.current;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', padding: '88px 24px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Skeleton width={44} height={44} borderRadius={14} />
          <div>
            <Skeleton width={160} height={20} />
            <Skeleton width={100} height={14} style={{ marginTop: 6 }} />
          </div>
        </div>

        {/* Stats skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <Skeleton width={40} height={40} borderRadius={12} style={{ margin: '0 auto 10px' }} />
              <Skeleton width={50} height={22} style={{ margin: '0 auto 6px' }} />
              <Skeleton width={60} height={12} style={{ margin: '0 auto' }} />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 20, padding: 28 }}>
          <Skeleton width={180} height={18} style={{ marginBottom: 20 }} />
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Skeleton width={36} height={36} borderRadius={10} />
              <div style={{ flex: 1 }}>
                <Skeleton width={`${randomWidths[i].w1}%`} height={14} />
                <Skeleton width={`${randomWidths[i].w2}%`} height={12} style={{ marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: 16, padding: 20 }}>
          <Skeleton width={40} height={40} borderRadius={12} style={{ marginBottom: 12 }} />
          <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} style={{ marginTop: 4 }} />
        </div>
      ))}
    </div>
  );
}
