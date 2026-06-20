import { useMemo, useEffect, useRef, useState, memo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { GitBranch } from 'lucide-react';
import { useGitEngineStore } from '../stores/gitEngineStore';

const BRANCH_COLORS: Record<string, string> = {
  main: '#2D6A4F',
  feature: '#52B788',
  dev: '#E9C46A',
  hotfix: '#F4845F',
  release: '#9B5DE5',
  test: '#00BBF9',
  staging: '#F15BB5',
};

function getBranchColor(branch: string): string {
  if (BRANCH_COLORS[branch]) return BRANCH_COLORS[branch];
  let hash = 0;
  for (let i = 0; i < branch.length; i++) {
    hash = branch.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 50%)`;
}

interface CommitNodeData {
  hash: string;
  message: string;
  branch: string;
  timestamp: string;
  isHead: boolean;
  isLatestOnBranch: boolean;
  isNew?: boolean;
  [key: string]: unknown;
}

const NODE_SIZE = 40;
const BRANCH_LABEL_WIDTH = 70;

function getLayoutedElements(
  commits: Array<{ id: string; parentIds: string[] }>,
  branchColors: Record<string, string>
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 80, marginx: 40, marginy: 40 });

  commits.forEach((commit) => {
    g.setNode(commit.id, { width: NODE_SIZE + BRANCH_LABEL_WIDTH, height: NODE_SIZE + 30 });
  });

  commits.forEach((commit) => {
    for (const parentId of commit.parentIds) {
      g.setEdge(parentId, commit.id);
    }
  });

  dagre.layout(g);

  const nodes: Node<CommitNodeData>[] = [];
  const edges: Edge[] = [];

  commits.forEach((commit) => {
    const pos = g.node(commit.id);
    nodes.push({
      id: commit.id,
      type: 'commitNode',
      position: { x: pos.x - (NODE_SIZE + BRANCH_LABEL_WIDTH) / 2, y: pos.y - (NODE_SIZE + 30) / 2 },
      data: {
        hash: commit.id,
        message: '',
        branch: '',
        timestamp: '',
        isHead: false,
        isLatestOnBranch: false,
        isNew: false,
      },
    });
  });

  commits.forEach((commit) => {
    for (const parentId of commit.parentIds) {
      const parentExists = commits.some(c => c.id === parentId);
      if (parentExists) {
        const color = branchColors[commit.id] || '#6B7280';
        edges.push({
          id: `${parentId}-${commit.id}`,
          source: parentId,
          target: commit.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: color, strokeWidth: 2.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
            width: 14,
            height: 14,
          },
        });
      }
    }
  });

  return { nodes, edges };
}

function CommitNode({ data }: { data: CommitNodeData }) {
  const { hash, branch, isHead, isLatestOnBranch, isNew } = data;
  const color = getBranchColor(branch);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isNew && nodeRef.current) {
      nodeRef.current.style.animation = 'nodeAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }, [isNew]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const commitMessage = data.message || 'Initial commit';
  const commitTime = data.timestamp ? new Date(data.timestamp).toLocaleString() : '';

  return (
    <div 
      ref={nodeRef} 
      style={{ position: 'relative', display: 'flex', alignItems: 'center', transformOrigin: 'center' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'transparent',
          border: 'none',
          width: 1,
          height: 1,
          top: -4,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'transparent',
          border: 'none',
          width: 1,
          height: 1,
          bottom: -4,
        }}
      />

      {/* Outer glow ring for HEAD */}
      {isHead && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 4,
            width: NODE_SIZE,
            height: NODE_SIZE,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: `0 0 0 3px ${color}30, 0 0 16px ${color}50, 0 0 32px ${color}20`,
            animation: 'headPulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Main commit dot */}
      <div
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}DD, ${color})`,
          border: isHead ? `3px solid #fff` : `2px solid ${color}40`,
          boxShadow: isHead
            ? `0 0 8px ${color}60, 0 2px 8px rgba(0,0,0,0.15)`
            : `0 2px 6px rgba(0,0,0,0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Inner highlight */}
        <div
          style={{
            width: NODE_SIZE * 0.4,
            height: NODE_SIZE * 0.4,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
          }}
        />
      </div>

      {/* Branch label floating to the right */}
      {isLatestOnBranch && (
        <div
          style={{
            position: 'absolute',
            left: NODE_SIZE + 8,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 4px ${color}`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: color,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: 0.3,
            }}
          >
            {branch}
          </span>
          {isHead && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: '#fff',
                background: color,
                padding: '1px 5px',
                borderRadius: 3,
                marginLeft: 2,
              }}
            >
              HEAD
            </span>
          )}
        </div>
      )}

      {/* Commit hash below */}
      <div
        style={{
          position: 'absolute',
          top: NODE_SIZE + 6,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9,
          fontFamily: 'JetBrains Mono, monospace',
          color: '#9CA3AF',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {hash.slice(0, 7)}
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
            background: '#1A1A1A',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.5,
            maxWidth: 280,
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4, color: color }}>
            {commitMessage}
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>
            {hash.slice(0, 7)}
          </div>
          {commitTime && (
            <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
              {commitTime}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 12,
              height: 12,
              background: '#1A1A1A',
            }}
          />
        </div>
      )}
    </div>
  );
}

const nodeTypes = { commitNode: CommitNode };

interface GitGraphProps {
  commits?: Array<{ id?: string; hash?: string; message: string; branch: string; parentId?: string | null; parentIds?: string[]; parent?: string; timestamp?: string }>;
  branches?: string[];
  currentBranch?: string;
  style?: React.CSSProperties;
}

function GitGraph({ commits: propCommits, branches: propBranches, currentBranch: propCurrentBranch, style }: GitGraphProps) {
  const storeCommits = useGitEngineStore((s) => s.commits);
  const storeBranches = useGitEngineStore((s) => s.branches);
  const storeCurrentBranch = useGitEngineStore((s) => s.currentBranch);
  const storeHeadCommitId = useGitEngineStore((s) => s.headCommitId);

  const normalizedCommits = useMemo(() => {
    if (propCommits && propCommits.length > 0) {
      return propCommits.map(c => ({
        id: c.id || c.hash || '',
        message: c.message,
        branch: c.branch,
        parentId: c.parentId || c.parent || null,
        parentIds: c.parentIds || (c.parentId ? [c.parentId] : c.parent ? [c.parent] : []),
        timestamp: c.timestamp || new Date().toISOString(),
      }));
    }
    return Object.values(storeCommits).map(c => ({
      ...c,
      parentIds: c.parentIds || (c.parentId ? [c.parentId] : []),
    }));
  }, [propCommits, storeCommits]);

  const commits = normalizedCommits;
  const branchNames = propBranches || Object.keys(storeBranches);
  const currentBranch = propCurrentBranch || storeCurrentBranch || 'main';

  const latestOnBranch = useMemo(() => {
    const map: Record<string, string> = {};
    const branchLastSeen: Record<string, string> = {};
    commits.forEach((c) => {
      branchLastSeen[c.branch] = c.id;
    });
    Object.entries(branchLastSeen).forEach(([branch, commitId]) => {
      map[commitId] = branch;
    });
    return map;
  }, [commits]);

  const branchColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    commits.forEach((c) => {
      map[c.id] = getBranchColor(c.branch);
    });
    return map;
  }, [commits]);

  const { nodes, edges } = useMemo(() => {
    if (commits.length === 0) return { nodes: [], edges: [] };

    const { nodes: layoutNodes, edges: layoutEdges } = getLayoutedElements(
      commits.map(c => ({ id: c.id, parentIds: c.parentIds || (c.parentId ? [c.parentId] : []) })),
      branchColorMap
    );

    const enrichedNodes = layoutNodes.map((node) => {
      const commit = commits.find(c => c.id === node.id);
      if (!commit) return node;

      return {
        ...node,
        position: {
          x: node.position.x,
          y: node.position.y,
        },
        data: {
          hash: commit.id,
          message: commit.message,
          branch: commit.branch,
          timestamp: commit.timestamp,
          isHead: storeHeadCommitId === commit.id,
          isLatestOnBranch: latestOnBranch[commit.id] !== undefined,
        },
      };
    });

    return { nodes: enrichedNodes, edges: layoutEdges };
  }, [commits, storeHeadCommitId, latestOnBranch, branchColorMap]);

  const [nodesState, setNodes, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #E8E4DD',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #E8E4DD',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: '#2D6A4F18',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GitBranch size={14} color="#2D6A4F" />
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#1A1A1A' }}>
            Git Graph
          </h4>
          <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>
            {commits.length} commit{commits.length !== 1 ? 's' : ''} · {branchNames.length} branch{branchNames.length !== 1 ? 'es' : ''}
          </p>
        </div>
      </div>

      {/* React Flow */}
      <div style={{ height: 450, background: '#FAFAF8' }}>
        {commits.length === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
            }}
          >
            <GitBranch size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
            <p style={{ fontSize: 13, margin: 0 }}>No commits yet</p>
            <p style={{ fontSize: 11, margin: '4px 0 0' }}>Run git commit to see the graph</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodesState}
            edges={edgesState}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.4 }}
            minZoom={0.2}
            maxZoom={2.5}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { strokeWidth: 2.5 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#E8E4DD" gap={24} size={1} />
            <Controls
              showInteractive={false}
              style={{
                background: '#fff',
                border: '1px solid #E8E4DD',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            />
            <MiniMap
              nodeColor={(node) => {
                const data = node.data as CommitNodeData;
                return getBranchColor(data.branch || 'main');
              }}
              maskColor="rgba(248, 248, 246, 0.7)"
              style={{
                background: '#F8F8F6',
                border: '1px solid #E8E4DD',
                borderRadius: 8,
              }}
            />
          </ReactFlow>
        )}
      </div>

      {/* Branch legend */}
      {branchNames.length > 1 && (
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid #E8E4DD',
            background: '#F8F8F6',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {branchNames.map((branch) => (
            <div
              key={branch}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: '#6B7280',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: getBranchColor(branch),
                }}
              />
              <span style={{ fontWeight: branch === currentBranch ? 700 : 500 }}>
                {branch}
                {branch === currentBranch && ' (HEAD)'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes headPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        @keyframes nodeAppear {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default memo(GitGraph);
