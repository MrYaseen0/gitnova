import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Lock, BookOpen, Code, Terminal, Cpu, Coffee } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import type { Language } from '../types';

interface LearningRoadmapProps {
  roadmap: 'frontend' | 'backend' | 'fullstack' | 'systems' | 'data-science';
  style?: React.CSSProperties;
}

const ROADMAPS = {
  frontend: {
    title: 'Frontend Developer',
    description: 'Build modern web interfaces',
    icon: '🌐',
    nodes: [
      { id: 'git-basics', language: 'git' as Language, title: 'Git Basics', description: 'Version control fundamentals', levelRange: [1, 10] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 50, y: 80 },
      { id: 'git-branching', language: 'git' as Language, title: 'Git Branching', description: 'Branches and merges', levelRange: [11, 25] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 250, y: 80 },
      { id: 'git-collab', language: 'git' as Language, title: 'Git Collaboration', description: 'Pull requests and workflows', levelRange: [26, 40] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 450, y: 80 },
      { id: 'python-basics', language: 'python' as Language, title: 'Python Basics', description: 'Variables, loops, functions', levelRange: [1, 5] as [number, number], icon: <Code size={16} />, color: '#3776AB', x: 350, y: 200 },
      { id: 'python-web', language: 'python' as Language, title: 'Python Web', description: 'Flask/Django fundamentals', levelRange: [6, 10] as [number, number], icon: <Code size={16} />, color: '#3776AB', x: 550, y: 200 },
    ],
  },
  backend: {
    title: 'Backend Developer',
    description: 'Build scalable server systems',
    icon: '⚙️',
    nodes: [
      { id: 'git-basics', language: 'git' as Language, title: 'Git Basics', description: 'Version control fundamentals', levelRange: [1, 10] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 50, y: 80 },
      { id: 'git-advanced', language: 'git' as Language, title: 'Git Advanced', description: 'Rebase, cherry-pick, stash', levelRange: [26, 50] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 250, y: 80 },
      { id: 'c-basics', language: 'c' as Language, title: 'C Basics', description: 'Memory management, pointers', levelRange: [1, 5] as [number, number], icon: <Terminal size={16} />, color: '#A8B9CC', x: 150, y: 200 },
      { id: 'cpp-basics', language: 'cpp' as Language, title: 'C++ Basics', description: 'OOP, templates, STL', levelRange: [1, 5] as [number, number], icon: <Cpu size={16} />, color: '#00599C', x: 350, y: 200 },
      { id: 'java-basics', language: 'java' as Language, title: 'Java Basics', description: 'OOP, collections, threads', levelRange: [1, 5] as [number, number], icon: <Coffee size={16} />, color: '#ED8B00', x: 550, y: 200 },
    ],
  },
  fullstack: {
    title: 'Full Stack Developer',
    description: 'Master both frontend and backend',
    icon: '🚀',
    nodes: [
      { id: 'git-basics', language: 'git' as Language, title: 'Git Basics', description: 'Version control fundamentals', levelRange: [1, 15] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 300, y: 50 },
      { id: 'python-basics', language: 'python' as Language, title: 'Python Basics', description: 'Programming fundamentals', levelRange: [1, 5] as [number, number], icon: <Code size={16} />, color: '#3776AB', x: 150, y: 150 },
      { id: 'java-basics', language: 'java' as Language, title: 'Java Basics', description: 'Enterprise programming', levelRange: [1, 5] as [number, number], icon: <Coffee size={16} />, color: '#ED8B00', x: 450, y: 150 },
      { id: 'git-advanced', language: 'git' as Language, title: 'Git Advanced', description: 'Advanced workflows', levelRange: [16, 35] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 150, y: 250 },
      { id: 'python-web', language: 'python' as Language, title: 'Python Web', description: 'Web frameworks', levelRange: [6, 10] as [number, number], icon: <Code size={16} />, color: '#3776AB', x: 450, y: 250 },
    ],
  },
  systems: {
    title: 'Systems Programmer',
    description: 'Build low-level systems',
    icon: '🔧',
    nodes: [
      { id: 'git-basics', language: 'git' as Language, title: 'Git Basics', description: 'Version control fundamentals', levelRange: [1, 10] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 300, y: 50 },
      { id: 'c-basics', language: 'c' as Language, title: 'C Basics', description: 'Memory, pointers, files', levelRange: [1, 5] as [number, number], icon: <Terminal size={16} />, color: '#A8B9CC', x: 150, y: 150 },
      { id: 'c-advanced', language: 'c' as Language, title: 'C Advanced', description: 'Data structures, algorithms', levelRange: [6, 10] as [number, number], icon: <Terminal size={16} />, color: '#A8B9CC', x: 150, y: 250 },
      { id: 'cpp-basics', language: 'cpp' as Language, title: 'C++ Basics', description: 'OOP, templates', levelRange: [1, 5] as [number, number], icon: <Cpu size={16} />, color: '#00599C', x: 450, y: 150 },
      { id: 'cpp-advanced', language: 'cpp' as Language, title: 'C++ Advanced', description: 'STL, concurrency', levelRange: [6, 10] as [number, number], icon: <Cpu size={16} />, color: '#00599C', x: 450, y: 250 },
    ],
  },
  'data-science': {
    title: 'Data Scientist',
    description: 'Analyze data and build ML models',
    icon: '📊',
    nodes: [
      { id: 'git-basics', language: 'git' as Language, title: 'Git Basics', description: 'Version control fundamentals', levelRange: [1, 10] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 300, y: 50 },
      { id: 'python-basics', language: 'python' as Language, title: 'Python Basics', description: 'Programming fundamentals', levelRange: [1, 5] as [number, number], icon: <Code size={16} />, color: '#3776AB', x: 150, y: 150 },
      { id: 'python-advanced', language: 'python' as Language, title: 'Python Advanced', description: 'Libraries and frameworks', levelRange: [6, 10] as [number, number], icon: <Code size={16} />, color: '#3776AB', x: 150, y: 250 },
      { id: 'git-data', language: 'git' as Language, title: 'Git for Data', description: 'DVC, data versioning', levelRange: [20, 35] as [number, number], icon: <BookOpen size={16} />, color: '#2D6A4F', x: 450, y: 150 },
    ],
  },
};

function getNodeStatus(
  language: Language,
  levelRange: [number, number],
  completedLevels: Record<Language, number[]>
): 'completed' | 'in-progress' | 'locked' {
  const completed = completedLevels[language] || [];
  const [start, end] = levelRange;
  const totalLevels = end - start + 1;
  const completedInRange = completed.filter(id => id >= start && id <= end).length;

  if (completedInRange === totalLevels) return 'completed';
  if (completedInRange > 0) return 'in-progress';
  
  // Check if previous node is completed
  if (start === 1) return 'in-progress'; // First node is always accessible
  return 'locked';
}

export default function LearningRoadmap({ roadmap, style }: LearningRoadmapProps) {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const config = ROADMAPS[roadmap];

  const nodesWithStatus = useMemo(() => {
    if (!user) return config.nodes.map(n => ({ ...n, status: 'locked' as const }));
    return config.nodes.map(node => ({
      ...node,
      status: getNodeStatus(node.language, node.levelRange, user.completedLevels),
    }));
  }, [config.nodes, user]);

  const completedCount = nodesWithStatus.filter(n => n.status === 'completed').length;
  const progress = Math.round((completedCount / nodesWithStatus.length) * 100);

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: '1px solid #E8E4DD',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #E8E4DD',
        background: 'linear-gradient(135deg, #F8F8F6, #fff)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 28 }}>{config.icon}</span>
          <div>
            <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, margin: 0, color: '#1A1A1A' }}>
              {config.title}
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{config.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
              {completedCount}/{nodesWithStatus.length} nodes completed
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2D6A4F' }}>
              {progress}%
            </span>
          </div>
          <div style={{ background: '#F0EEE9', borderRadius: 9999, height: 8, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
                borderRadius: 9999,
              }}
            />
          </div>
        </div>
      </div>

      {/* Roadmap visualization */}
      <div style={{ padding: 24, overflow: 'auto' }}>
        <svg width="100%" height="320" viewBox="0 0 700 320">
          {/* Connection lines */}
          {nodesWithStatus.map((node, i) => {
            if (i === 0) return null;
            const prev = nodesWithStatus[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={prev.x + 60}
                y1={prev.y + 30}
                x2={node.x + 60}
                y2={node.y + 30}
                stroke={node.status === 'locked' ? '#E8E4DD' : '#D1D5DB'}
                strokeWidth={2}
                strokeDasharray={node.status === 'locked' ? '4 4' : 'none'}
              />
            );
          })}

          {/* Nodes */}
          {nodesWithStatus.map((node) => (
            <g
              key={node.id}
              style={{ cursor: node.status !== 'locked' ? 'pointer' : 'default' }}
              onClick={() => {
                if (node.status !== 'locked') {
                  navigate(`/learn/${node.language}`);
                }
              }}
            >
              {/* Node background */}
              <rect
                x={node.x}
                y={node.y}
                width={120}
                height={60}
                rx={12}
                fill={node.status === 'completed' ? node.color : node.status === 'in-progress' ? '#fff' : '#F8F8F6'}
                stroke={node.status === 'locked' ? '#E8E4DD' : node.color}
                strokeWidth={node.status === 'in-progress' ? 2 : 1}
              />

              {/* Status icon */}
              {node.status === 'completed' ? (
                <circle cx={node.x + 105} cy={node.y + 10} r={8} fill="#fff" opacity={0.3} />
              ) : null}

              {/* Icon */}
              <foreignObject x={node.x + 10} y={node.y + 12} width={24} height={24}>
                <div style={{ color: node.status === 'completed' ? '#fff' : node.color }}>
                  {node.icon}
                </div>
              </foreignObject>

              {/* Title */}
              <text
                x={node.x + 40}
                y={node.y + 28}
                fill={node.status === 'completed' ? '#fff' : '#1A1A1A'}
                fontSize="11"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
              >
                {node.title}
              </text>

              {/* Description */}
              <text
                x={node.x + 40}
                y={node.y + 42}
                fill={node.status === 'completed' ? 'rgba(255,255,255,0.8)' : '#6B7280'}
                fontSize="9"
                fontFamily="Inter, sans-serif"
              >
                {node.description}
              </text>

              {/* Status badge */}
              {node.status === 'completed' && (
                <g>
                  <circle cx={node.x + 108} cy={node.y + 12} r={6} fill="#fff" />
                  <circle cx={node.x + 108} cy={node.y + 12} r={4} fill={node.color} />
                </g>
              )}
              {node.status === 'locked' && (
                <g>
                  <circle cx={node.x + 108} cy={node.y + 12} r={6} fill="#E8E4DD" />
                  <text x={node.x + 108} y={node.y + 15} textAnchor="middle" fill="#9CA3AF" fontSize="8">🔒</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        padding: '12px 24px',
        borderTop: '1px solid #E8E4DD',
        background: '#F8F8F6',
        display: 'flex',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280' }}>
          <CheckCircle2 size={12} color="#2D6A4F" /> Completed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280' }}>
          <Circle size={12} color="#E9C46A" fill="#E9C46A20" /> In Progress
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280' }}>
          <Lock size={12} color="#D1D5DB" /> Locked
        </div>
      </div>
    </div>
  );
}
