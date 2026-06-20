import { motion } from 'framer-motion';
import { BookOpen, Trophy, Target, Flame, ArrowRight, Terminal, Code, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  type: 'no-achievements' | 'no-activity' | 'no-levels' | 'no-streak' | 'first-visit' | 'playground-empty';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
}

const EMPTY_CONFIGS = {
  'no-achievements': {
    icon: <Trophy size={48} color="#D1D5DB" />,
    title: 'No Achievements Yet',
    description: 'Complete levels to unlock badges and achievements. Your first badge is just one lesson away!',
    actionLabel: 'Start Learning',
    actionPath: '/dashboard',
    color: '#E9C46A',
  },
  'no-activity': {
    icon: <Target size={48} color="#D1D5DB" />,
    title: 'No Activity Yet',
    description: 'Your learning journey starts here. Complete your first level to see your progress on the heatmap.',
    actionLabel: 'Begin Your Journey',
    actionPath: '/dashboard',
    color: '#2D6A4F',
  },
  'no-levels': {
    icon: <BookOpen size={48} color="#D1D5DB" />,
    title: 'No Levels Completed',
    description: 'Start with the basics and work your way up. Each level takes just 5-10 minutes.',
    actionLabel: 'Start Level 1',
    actionPath: '/learn/git',
    color: '#52B788',
  },
  'no-streak': {
    icon: <Flame size={48} color="#D1D5DB" />,
    title: 'Start Your Streak',
    description: 'Practice daily to build your streak. Even 5 minutes a day makes a difference!',
    actionLabel: 'Practice Now',
    actionPath: '/playground',
    color: '#F4845F',
  },
  'first-visit': {
    icon: <GitBranch size={48} color="#D1D5DB" />,
    title: 'Welcome to GitNova',
    description: 'Ready to master Git? Start with the fundamentals and progress to advanced concepts. Each level is interactive and hands-on.',
    actionLabel: 'Start Learning Git',
    actionPath: '/learn/git',
    color: '#2D6A4F',
  },
  'playground-empty': {
    icon: <Terminal size={48} color="#D1D5DB" />,
    title: 'Ready to Practice?',
    description: 'Type Git commands in the terminal to the left. Try "git init" to get started!',
    actionLabel: 'Load a Scenario',
    actionPath: '#',
    color: '#52B788',
  },
};

export default function EmptyState({ type, title, description, actionLabel, actionPath }: EmptyStateProps) {
  const navigate = useNavigate();
  const config = EMPTY_CONFIGS[type];

  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionLabel = actionLabel || config.actionLabel;
  const finalActionPath = actionPath || config.actionPath;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        textAlign: 'center',
      }}
    >
      {/* Icon container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{
          width: 96,
          height: 96,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${config.color}10, ${config.color}05)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        {config.icon}
      </motion.div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: 20,
        fontWeight: 700,
        color: '#1A1A1A',
        margin: '0 0 8px',
      }}>
        {finalTitle}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 1.6,
        maxWidth: 360,
        margin: '0 0 24px',
      }}>
        {finalDescription}
      </p>

      {/* Action button */}
      {finalActionPath && finalActionPath !== '#' && (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(45,106,79,0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(finalActionPath)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(45,106,79,0.2)',
          }}
        >
          {finalActionLabel}
          <ArrowRight size={16} />
        </motion.button>
      )}
    </motion.div>
  );
}

// Smaller inline empty state for cards
export function EmptyStateInline({ message, actionLabel, actionPath }: { message: string; actionLabel?: string; actionPath?: string }) {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '20px 16px',
      textAlign: 'center',
      color: '#9CA3AF',
      fontSize: 13,
    }}>
      <p style={{ margin: '0 0 12px' }}>{message}</p>
      {actionLabel && actionPath && (
        <button
          onClick={() => navigate(actionPath)}
          style={{
            padding: '6px 16px',
            background: 'transparent',
            border: '1px solid #E8E4DD',
            borderRadius: 8,
            color: '#2D6A4F',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Empty state for leaderboard
export function EmptyStateLeaderboard() {
  return (
    <div style={{
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: '#F0EEE9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Trophy size={28} color="#D1D5DB" />
      </div>
      <h4 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#1A1A1A' }}>
        No Rankings Yet
      </h4>
      <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
        Complete levels to earn XP and climb the leaderboard!
      </p>
    </div>
  );
}

// Empty state for search results
export function EmptyStateSearch({ query }: { query: string }) {
  return (
    <div style={{
      padding: '32px 20px',
      textAlign: 'center',
    }}>
      <Code size={32} color="#D1D5DB" style={{ margin: '0 auto 12px' }} />
      <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
        No results for "<strong>{query}</strong>"
      </p>
    </div>
  );
}
