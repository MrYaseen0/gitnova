import { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TermIcon, GitBranch, RotateCcw, Play, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
const GitGraph = lazy(() => import('../components/GitGraph'));
import { useGitEngineStore } from '../stores/gitEngineStore';

interface HistoryEntry {
  cmd: string;
  output: string;
  isError?: boolean;
  timestamp: string;
}

const scenarios = [
  {
    name: 'Empty repo',
    desc: 'Start from scratch',
    commands: ['git init', 'git add .', 'git commit -m "initial commit"'],
  },
  {
    name: 'Branching',
    desc: 'Create and switch branches',
    commands: [
      'git init',
      'git add .',
      'git commit -m "initial commit"',
      'git checkout -b feature',
      'git add README.md',
      'git commit -m "add readme"',
      'git checkout main',
    ],
  },
  {
    name: 'Merge workflow',
    desc: 'Merge branches together',
    commands: [
      'git init',
      'git add .',
      'git commit -m "initial commit"',
      'git checkout -b feature',
      'git add README.md',
      'git commit -m "feature work"',
      'git checkout main',
      'git merge feature',
    ],
  },
];

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export default function PlaygroundPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showScenarioDropdown, setShowScenarioDropdown] = useState(false);
  const [activePanel, setActivePanel] = useState<'terminal' | 'graph'>('terminal');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const engine = useGitEngineStore();
  const {
    initialized,
    branches: engineBranches,
    currentBranch: engineCurrentBranch,
    commits: engineCommits,
    stagingArea,
    workingDirectory,
  } = engine;

  const commits = Object.values(engineCommits);
  const branches = Object.keys(engineBranches);
  const currentBranch = engineCurrentBranch || 'main';
  const staged = Object.keys(stagingArea);
  const workingDir = Object.keys(workingDirectory);
  const repoInitialized = initialized;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const now = () => formatTime(new Date());

  const addEntry = useCallback((cmd: string, output: string, isError = false) => {
    setHistory(prev => [...prev, { cmd, output, isError, timestamp: now() }]);
  }, []);

  const execute = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const git = parts[0] === 'git';

    if (!git) {
      switch (parts[0]) {
        case 'clear':
          setHistory([]);
          return;
        case 'help':
          addEntry(cmd, 'Supported: git init, git add, git commit, git status, git log, git branch, git checkout, git merge, git diff, git reset\nOther: clear, help, ls, pwd');
          return;
        case 'ls':
          addEntry(cmd, repoInitialized ? 'README.md  src/  package.json  .gitignore' : 'README.md  src/  package.json');
          return;
        case 'pwd':
          addEntry(cmd, '/home/user/project');
          return;
        default:
          addEntry(cmd, `bash: ${parts[0]}: command not found`, true);
          return;
      }
    }

    const sub = parts[1];
    const args = parts.slice(2).join(' ').replace(/"/g, '');

    switch (sub) {
      case 'init': {
        const result = engine.gitInit();
        if (result === 'already-initialized') {
          addEntry(cmd, 'Reinitialized existing Git repository in /home/user/project/.git/');
        } else {
          addEntry(cmd, 'Initialized empty Git repository in /home/user/project/.git/');
        }
        break;
      }

      case 'add': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        if (args === '.' || args === '*') {
          const files = Object.keys(engine.workingDirectory);
          files.forEach(f => engine.gitAdd(f));
          addEntry(cmd, '');
        } else if (args) {
          const result = engine.gitAdd(args);
          if (result === 'file-not-found') {
            addEntry(cmd, `fatal: pathspec '${args}' did not match any files`, true);
          } else {
            addEntry(cmd, '');
          }
        } else {
          addEntry(cmd, 'usage: git add <file>...', true);
        }
        break;
      }

      case 'commit': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        const msg = args.replace(/^-m\s*/, '');
        if (Object.keys(stagingArea).length === 0) {
          addEntry(cmd, 'nothing to commit, working tree clean', true);
          break;
        }

        const result = engine.gitCommit(msg || 'empty message');
        if (result === 'nothing-to-commit') {
          addEntry(cmd, 'nothing to commit, working tree clean', true);
          break;
        }

        const headCommit = engine.getHeadCommit();
        if (headCommit) {
          const filesChanged = Object.keys(stagingArea).length;
          const insertions = Math.floor(Math.random() * 50) + 5;
          const commitMsg = msg || 'empty message';
          const fileLabel = filesChanged + (filesChanged > 1 ? ' files' : ' file');
          const insertLabel = insertions + ' insertion' + (insertions > 1 ? 's' : '');
          addEntry(cmd, `[${currentBranch} ${headCommit.id.slice(0, 7)}] ${commitMsg}\n${fileLabel} changed, ${insertLabel}(+)`);
        }
        break;
      }

      case 'status': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        let output = `On branch ${currentBranch}\n\n`;
        if (staged.length > 0) {
          output += 'Changes to be committed:\n';
          output += staged.map(f => `  new file:   ${f}`).join('\n') + '\n\n';
        }
        if (workingDir.length > 0) {
          output += 'Changes not staged for commit:\n';
          output += workingDir.map(f => `  modified:   ${f}`).join('\n') + '\n\n';
        }
        if (staged.length === 0 && workingDir.length === 0) {
          output += 'nothing to commit, working tree clean';
        }
        addEntry(cmd, output);
        break;
      }

      case 'log': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        const logCommits = engine.gitLog();
        if (logCommits.length === 0) {
          addEntry(cmd, `fatal: your current branch '${currentBranch}' does not have any commits yet`);
          break;
        }
        const useOneline = args.includes('--oneline');
        const logStr = logCommits.map((c) => {
          if (useOneline) return `${c.id.slice(0, 7)} ${c.message}`;
          return `commit ${c.id}\nAuthor: User <user@gitnova.dev>\nDate:   ${c.timestamp}\n\n    ${c.message}`;
        }).join(useOneline ? '\n' : '\n\n');
        addEntry(cmd, logStr);
        break;
      }

      case 'branch': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        if (!args) {
          addEntry(cmd, branches.map(b => b === currentBranch ? `* ${b}` : `  ${b}`).join('\n'));
        } else {
          const result = engine.gitBranch(args);
          if (result === 'already-exists') {
            addEntry(cmd, `fatal: a branch named '${args}' already exists.`, true);
          } else {
            addEntry(cmd, '');
          }
        }
        break;
      }

      case 'checkout': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        const flag = args.startsWith('-b ');
        const bName = flag ? args.replace('-b ', '').trim() : args.trim();
        if (!bName) {
          addEntry(cmd, 'error: pathspec not specified', true);
          break;
        }
        if (flag) {
          const result = engine.gitBranch(bName);
          if (result === 'already-exists') {
            addEntry(cmd, `fatal: a branch named '${bName}' already exists.`, true);
            break;
          }
          engine.gitCheckout(bName);
        } else {
          const result = engine.gitCheckout(bName);
          if (result === 'branch-not-found') {
            addEntry(cmd, `error: pathspec '${bName}' did not match any files known to git`, true);
            break;
          }
        }
        addEntry(cmd, `Switched${flag ? ' to a new branch' : ''} '${bName}'`);
        break;
      }

      case 'merge': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        if (!args) {
          addEntry(cmd, 'usage: git merge <branch>', true);
          break;
        }
        const result = engine.gitMerge(args);
        if (result === 'already-up-to-date') {
          addEntry(cmd, 'Already up to date.');
        } else if (result === 'branch-not-found') {
          addEntry(cmd, `error: pathspec '${args}' did not match any files known to git`, true);
        } else {
          const headCommit = engine.getHeadCommit();
          addEntry(cmd, `Merge complete: ${headCommit?.id.slice(0, 7) || 'ok'}`);
        }
        break;
      }

      case 'diff': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        addEntry(cmd, 'diff --git a/src/app.js b/src/app.js\nindex a1b2c3d..e4f5g6h 100644\n--- a/src/app.js\n+++ b/src/app.js\n@@ -1,3 +1,4 @@\n+import React from "react";\n import App from "./App";\n import ReactDOM from "react-dom";');
        break;
      }

      case 'reset': {
        if (!repoInitialized) {
          addEntry(cmd, 'fatal: not a git repository (or any of the parent directories): .git', true);
          break;
        }
        if (commits.length === 0) {
          addEntry(cmd, 'error: ambiguous argument: no commits', true);
          break;
        }
        const targetHash = args.replace(/^--(soft|hard)\s*/, '') || '';
        const targetCommit = commits.find(c => c.id.startsWith(targetHash)) || commits[commits.length - 1];
        
        if (args.includes('--hard')) {
          engine.gitResetHard(targetCommit.id);
          addEntry(cmd, `HEAD is now at ${targetCommit.id.slice(0, 7)} (hard reset)`);
        } else {
          engine.gitReset(targetCommit.id);
          addEntry(cmd, `HEAD is now at ${targetCommit.id.slice(0, 7)}`);
        }
        break;
      }

      default:
        if (sub) {
          addEntry(cmd, `git: '${sub}' is not a git command. See 'git --help'.`, true);
        } else {
          addEntry(cmd, 'usage: git <command> [<args>]', true);
        }
    }
  }, [repoInitialized, staged, stagingArea, workingDir, currentBranch, commits, branches, addEntry, engine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    execute(input);
    setInput('');
  };

  const loadScenario = (idx: number) => {
    setShowScenarioDropdown(false);
    engine.resetEngine();
    setHistory([]);
    const scenario = scenarios[idx];
    let delay = 0;
    for (const cmd of scenario.commands) {
      delay += 400;
      setTimeout(() => execute(cmd), delay);
    }
  };

  const resetPlayground = () => {
    engine.resetEngine();
    setHistory([]);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter' }}>
      <Header />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', paddingTop: 64 }}>
        {/* Mobile Toggle */}
        <div className="mobile-toggle" style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'none', zIndex: 100, gap: 4, padding: 4,
          background: '#161B22', borderRadius: 12, border: '1px solid #30363D',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePanel('terminal')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: activePanel === 'terminal' ? '#2D6A4F' : 'transparent',
              color: activePanel === 'terminal' ? '#fff' : '#8B949E',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <TermIcon size={14} /> Terminal
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePanel('graph')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: activePanel === 'graph' ? '#2D6A4F' : 'transparent',
              color: activePanel === 'graph' ? '#fff' : '#8B949E',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <GitBranch size={14} /> Graph
          </motion.button>
        </div>

        {/* Terminal Panel */}
        <div className="terminal-panel" style={{ flex: 1, background: '#0D1117', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Terminal Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#161B22', borderBottom: '1px solid #30363D', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 9999, background: '#FF5F57' }} />
              <div style={{ width: 12, height: 12, borderRadius: 9999, background: '#FFBD2E' }} />
              <div style={{ width: 12, height: 12, borderRadius: 9999, background: '#28CA41' }} />
            </div>
            <span style={{ color: '#8B949E', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              gitnova@terminal ~/project {currentBranch ? `(${currentBranch})` : ''}
            </span>
            <div style={{ flex: 1 }} />
            {/* Scenario dropdown */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowScenarioDropdown(!showScenarioDropdown)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8,
                  background: '#21262D', border: '1px solid #30363D', color: '#C9D1D9', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Play size={12} /> {scenarios[selectedScenario].name}
                <ChevronDown size={12} />
              </motion.button>
              <AnimatePresence>
                {showScenarioDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 4, width: 220,
                      background: '#161B22', border: '1px solid #30363D', borderRadius: 10,
                      padding: 4, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    {scenarios.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedScenario(i); loadScenario(i); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                          borderRadius: 8, border: 'none', background: i === selectedScenario ? '#21262D' : 'transparent',
                          color: '#C9D1D9', fontSize: 12, cursor: 'pointer',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#21262D')}
                        onMouseLeave={e => (e.currentTarget.style.background = i === selectedScenario ? '#21262D' : 'transparent')}
                      >
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ color: '#8B949E', fontSize: 11, marginTop: 2 }}>{s.desc}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPlayground}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8,
                background: '#21262D', border: '1px solid #30363D', color: '#8B949E', fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} /> Reset
            </motion.button>
          </div>

          {/* Terminal Output */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '16px 20px',
              fontSize: 13,
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              lineHeight: 1.7,
              color: '#C9D1D9',
              minHeight: 0,
            }}
            onClick={() => inputRef.current?.focus()}
          >
            <div style={{ color: '#52B788', marginBottom: 12, fontSize: 12, opacity: 0.8 }}>
              Welcome to GitNova Playground — a safe space to practice Git commands.
              {'\n'}Type "help" for available commands.
            </div>

            {history.map((h, i) => (
              <motion.div
                key={`${h.timestamp}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                style={{ marginBottom: 10 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#52B788', fontWeight: 700 }}>$</span>
                  <span style={{ color: '#E6EDF3' }}>{h.cmd}</span>
                  <span style={{ color: '#484F58', fontSize: 10, marginLeft: 'auto' }}>{h.timestamp}</span>
                </div>
                {h.output && (
                  <pre style={{ color: h.isError ? '#F85149' : '#8B949E', margin: '4px 0 0 18px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 12 }}>
                    {h.output}
                  </pre>
                )}
              </motion.div>
            ))}

            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#52B788', fontWeight: 700 }}>$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
                spellCheck={false}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#E6EDF3', fontSize: 13, fontFamily: 'JetBrains Mono, Consolas, monospace',
                  caretColor: '#52B788',
                }}
              />
            </form>
            <div ref={endRef} />
          </div>
        </div>

        {/* Visual Git Tree Panel */}
        <div className="graph-panel" style={{ flex: 1, background: '#fff', borderLeft: '1px solid #E8E4DD', display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
          <Suspense fallback={<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: 13 }}>Loading graph...</div>}>
            <GitGraph
            commits={commits.map(c => ({
              id: c.id,
              message: c.message,
              branch: c.branch,
              parentIds: c.parentIds,
              timestamp: c.timestamp,
            }))}
            branches={branches}
            currentBranch={currentBranch}
            style={{ flex: 1, border: 'none', borderRadius: 0 }}
          />
          </Suspense>

          {/* Branches Section */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #E8E4DD', background: '#F8F8F6', flexShrink: 0 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Branches</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {branches.map(b => (
                <div
                  key={b}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8,
                    background: b === currentBranch ? '#2D6A4F18' : 'transparent',
                    border: b === currentBranch ? '1px solid #2D6A4F38' : '1px solid transparent',
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: 9999,
                    background: b === currentBranch ? '#2D6A4F' : '#D1D5DB',
                    boxShadow: b === currentBranch ? '0 0 6px #2D6A4F' : 'none',
                  }} />
                  <span style={{ fontSize: 13, fontWeight: b === currentBranch ? 700 : 500, color: b === currentBranch ? '#2D6A4F' : '#6B7280' }}>
                    {b}
                  </span>
                  {b === currentBranch && (
                    <span style={{ marginLeft: 'auto', fontSize: 10, background: '#2D6A4F', color: '#fff', padding: '1px 8px', borderRadius: 9999, fontWeight: 600 }}>
                      HEAD
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 769px) {
          .terminal-panel { flex: 1 !important; }
          .graph-panel { flex: 1 !important; border-left: 1px solid #E8E4DD !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 768px) {
          .terminal-panel {
            flex: 1 !important;
            display: ${activePanel === 'terminal' ? 'flex' : 'none'} !important;
          }
          .graph-panel {
            flex: 1 !important;
            border-left: none !important;
            border-top: 1px solid #E8E4DD !important;
            display: ${activePanel === 'graph' ? 'flex' : 'none'} !important;
          }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
