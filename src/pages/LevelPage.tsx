import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import type { JSX } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw, Zap, Terminal, CheckCircle2, XCircle, ChevronRight, BookOpen, FileCode } from 'lucide-react';
const LazySyntaxHighlighter = lazy(() =>
  import('../lib/codeHighlighter').then((mod) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (props: any) => {
      const isDark = document.documentElement.classList.contains('dark');
      return <mod.Prism {...props} style={isDark ? mod.oneDark : mod.oneLight} />;
    },
  }))
);
import Confetti from 'react-confetti';
import Header from '../components/Header';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { getLevelsForLanguage } from '../data/levels';
import { useAuthStore } from '../stores/authStore';
import { useSRSStore } from '../stores/srsStore';
import { progressApi } from '../lib/api';
import type { Language } from '../types';

const GIT_RESPONSES: Record<string, string> = {
  'git init': 'Initialized empty Git repository in /home/user/project/.git/',
  'git add .': '',
  'git add': '',
  'git commit -m "first commit"': '[main (root-commit) a1b2c3d] first commit\n 1 file changed, 1 insertion(+)\n create mode 100644 README.md',
  'git commit': '[main d4e5f6a] Update\n 1 file changed, 2 insertions(+), 1 deletion(-)',
  'git status': 'On branch main\nnothing to commit, working tree clean',
  'git log --oneline': 'd4e5f6a (HEAD -> main) Update\na1b2c3d first commit',
  'git log': 'commit d4e5f6a789012345678901234567890123456789\nAuthor: User <user@example.com>\nDate:   Mon Jan 1 00:00:00 2026 +0000\n\n    Update\n\ncommit a1b2c3d456789012345678901234567890123456\nAuthor: User <user@example.com>\nDate:   Sun Dec 31 00:00:00 2025 +0000\n\n    first commit',
  'git diff': 'diff --git a/README.md b/README.md\nindex abc1234..def5678 100644\n--- a/README.md\n+++ b/README.md\n@@ -1 +1,2 @@\n # Hello\n+# World',
  'git diff --staged': '',
  'git reset --soft HEAD~1': '',
  'git branch feature': '',
  'git branch': '* main\n  feature',
  'git switch feature': 'Switched to branch \'feature\'',
  'git switch main': 'Switched to branch \'main\'',
  'git merge feature': 'Updating a1b2c3d..d4e5f6a\nFast-forward\n README.md | 1 +\n 1 file changed, 1 insertion(+)',
  'git push origin main': 'Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nWriting objects: 100% (3/3), 300 bytes, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo https://github.com/user/repo.git\n   a1b2c3d..d4e5f6a  main -> main',
  'git pull origin main': 'remote: Enumerating objects: 4, done.\nFrom https://github.com/user/repo\n   a1b2c3d..d4e5f6a  main     -> origin/main\nUpdating a1b2c3d..d4e5f6a\nFast-forward\n README.md | 1 +\n 1 file changed, 1 insertion(+)',
  'git fetch origin': '',
  'git remote add origin https://github.com/user/repo.git': '',
  'git remote add upstream https://github.com/original/repo.git': '',
  'git remote -v': 'origin\thttps://github.com/user/repo.git (fetch)\norigin\thttps://github.com/user/repo.git (push)',
  'git clone https://github.com/user/repo.git': 'Cloning into \'repo\'...\nremote: Enumerating objects: 12, done.\nremote: Counting objects: 100% (12/12), done.\nremote: Compressing objects: 100% (8/8), done.\nReceiving objects: 100% (12/12), 4.56 KiB | 4.56 MiB/s, done.\nResolving deltas: 100% (2/2), done.',
  'git stash': 'Saved working directory and index state WIP on main: d4e5f6a Update',
  'git stash pop': 'On branch main\nChanges not staged for commit:\n  modified:   README.md\n\nDropped refs/stash@{0}',
  'git tag v1.0': '',
  'git gc': 'Counting objects: 12, done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (8/8), done.\nWriting objects: 100% (12/12), done.\nTotal 12, reused 0, pack-reused 0',
  'git reflog': 'd4e5f6a (HEAD -> main) HEAD@{0}: commit: Update\na1b2c3d HEAD@{1}: commit: first commit',
  'git bisect start': 'status: waiting for both good and bad commits\nstatus: running bisect\nbad: expected [a1b2c3d]\ngood: expected [v1.0]',
  'git cherry-pick abc1234': '[main f7e8d9c] Fix typo\n Date: Mon Jan 1 00:00:00 2026 +0000\n 1 file changed, 1 insertion(+), 1 deletion(-)',
  'git rebase main': 'Successfully rebased and updated refs/heads/feature.',
  'git rebase -i HEAD~3': 'Successfully rebased and updated refs/heads/main.',
  'git switch -c dev': 'Switched to a new branch \'dev\'',
  'git push -u origin feature': 'Enumerating objects: 5, done.\nTotal 5 (delta 0), reused 0 (delta 0)\nTo https://github.com/user/repo.git\n * [new branch]      feature -> feature\nbranch \'feature\' set up to track \'origin/feature\'.',
  'git worktree add ../hotfix hotfix': 'HEAD is now at d4e5f6a Update',
  'git cat-file -t HEAD': 'commit',
  'git cat-file -p HEAD': 'tree 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b\nparent a1b2c3d456789012345678901234567890123456\nauthor User <user@example.com> 1735689600 +0000\ncommitter User <user@example.com> 1735689600 +0000\n\n    Update',
  'git rev-parse HEAD': 'd4e5f6a789012345678901234567890123456789',
};

const THEORY_KEYWORDS = ['tip:', 'note:', 'remember:', 'important:'];
const CONCEPT_KEYWORDS = ['concept:', 'definition:', 'what is'];

function renderContent(content: string) {
  const lines = content.split('\n');
  const parts: JSX.Element[] = [];
  let codeBlock: string[] = [];
  let codeLang = '';
  let inCode = false;
  let key = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```') && !inCode) {
      inCode = true;
      codeLang = trimmed.slice(3).trim() || 'text';
      codeBlock = [];
      return;
    }
    if (trimmed.startsWith('```') && inCode) {
      inCode = false;
      parts.push(
        <LazySyntaxHighlighter
          key={key++}
          language={codeLang === 'gitignore' ? 'bash' : codeLang}
          customStyle={{
            borderRadius: 10,
            fontSize: 13,
            padding: '16px',
            margin: '12px 0',
            background: '#F8F8F6',
          }}
        >
          {codeBlock.join('\n')}
        </LazySyntaxHighlighter>
      );
      return;
    }
    if (inCode) {
      codeBlock.push(line);
      return;
    }

    const lowerLine = trimmed.toLowerCase();
    if (THEORY_KEYWORDS.some((k) => lowerLine.startsWith(k))) {
      parts.push(
        <div
          key={key++}
          style={{
            background: '#FFF0E6',
            borderLeft: '4px solid #F4845F',
            padding: '10px 14px',
            borderRadius: '0 8px 8px 0',
            margin: '10px 0',
            fontSize: 13,
            color: '#5C3D2E',
            lineHeight: 1.6,
          }}
        >
          {trimmed}
        </div>
      );
    } else if (CONCEPT_KEYWORDS.some((k) => lowerLine.startsWith(k))) {
      parts.push(
        <div
          key={key++}
          style={{
            background: '#E8F5E9',
            borderLeft: '4px solid #2D6A4F',
            padding: '10px 14px',
            borderRadius: '0 8px 8px 0',
            margin: '10px 0',
            fontSize: 13,
            color: '#1B4332',
            lineHeight: 1.6,
          }}
        >
          {trimmed}
        </div>
      );
    } else if (trimmed === '') {
      parts.push(<div key={key++} style={{ height: 8 }} />);
    } else {
      parts.push(
        <p key={key++} style={{ margin: '6px 0', fontSize: 14, lineHeight: 1.7, color: '#374151' }}>
          {renderInlineCode(trimmed)}
        </p>
      );
    }
  });

  return parts;
}

function renderInlineCode(text: string) {
  const parts: JSX.Element[] = [];
  let key = 0;
  const regex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <code
        key={key++}
        style={{
          background: '#F0F0EE',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: 13,
          fontFamily: 'JetBrains Mono, monospace',
          color: '#2D6A4F',
        }}
      >
        {match[1]}
      </code>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key}>{text.slice(lastIndex)}</span>);
  }
  return parts;
}

export default function LevelPage() {
  const { language, id } = useParams<{ language: string; id: string }>();
  const navigate = useNavigate();
  const { completeLevel } = useAuthStore();
  const addSRSCard = useSRSStore(s => s.addCard);

  const lang = (language || 'git') as Language;
  const levels = useMemo(() => getLevelsForLanguage(lang), [lang]);
  const level = useMemo(() => levels.find((l) => l.id === Number(id)), [levels, id]);
  const levelIndex = useMemo(() => levels.findIndex((l) => l.id === Number(id)), [levels, id]);
  const nextLevel = levels[levelIndex + 1];

  const [currentStep, setCurrentStep] = useState(0);
  const [codeInput, setCodeInput] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'terminal'>('theory');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCodeInput('');
    setCommandInput('');
    setResult(null);
  }, [currentStep, level]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-set active tab based on step type on mobile
  useEffect(() => {
    const currentStepData = level?.steps[currentStep];
    if (isMobile && currentStepData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (currentStepData.type === 'theory') setActiveTab('theory');
      else if (currentStepData.type === 'code') setActiveTab('code');
      else if (currentStepData.type === 'terminal') setActiveTab('terminal');
    }
  }, [currentStep, isMobile, level]);

  if (!level) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F8F6' }}>
        <Header />
        <div style={{ paddingTop: 120, textAlign: 'center', color: '#6B7280' }}>
          <p>Level not found.</p>
        </div>
      </div>
    );
  }

  const step = level.steps[currentStep];
  const totalSteps = level.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleRun = () => {
    const cmd = commandInput.trim();
    if (!cmd) return;
    const output = GIT_RESPONSES[cmd] ?? `bash: ${cmd.split(' ')[0]}: command not found`;
    setCommandHistory((prev) => [...prev, { cmd, output }]);
    setCommandInput('');
  };

  const handleCheckAnswer = () => {
    if (step.type === 'terminal') {
      const lastCmd = commandHistory[commandHistory.length - 1]?.cmd?.trim();
      if (lastCmd === step.expectedCommand) {
        setResult('pass');
        setTimeout(() => {
          if (currentStep < totalSteps - 1) {
            setCurrentStep((s) => s + 1);
            setCommandHistory([]);
          } else {
            handleComplete();
          }
        }, 1200);
      } else {
        setResult('fail');
      }
    } else if (step.type === 'code') {
      const normalizeCode = (code: string) =>
        code.split('\n').map(l => l.trim()).filter(Boolean).join('\n').trim();
      const userCode = normalizeCode(codeInput);
      const expectedCode = normalizeCode(step.code || '');
      
      if (!userCode) {
        setResult('fail');
      } else if (expectedCode && userCode === expectedCode) {
        setResult('pass');
        setTimeout(() => {
          if (currentStep < totalSteps - 1) {
            setCurrentStep((s) => s + 1);
          } else {
            handleComplete();
          }
        }, 1200);
      } else {
        setResult('fail');
      }
    } else {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    setXpEarned(level.xpReward);
    setShowComplete(true);
    completeLevel(lang, level.id, level.xpReward);
    // Add Git commands from this level to SRS deck
    if (lang === 'git') {
      for (const step of level.steps) {
        const cmd = step.expectedCommand?.trim();
        if (cmd) addSRSCard(cmd, lang);
      }
    }
    try {
      await progressApi.complete({ levelId: String(level.id), score: 100, language: lang });
    } catch { /* best effort */ }
  };

  const handleReset = () => {
    setCodeInput('');
    setCommandInput('');
    setCommandHistory([]);
    setResult(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', display: 'flex', flexDirection: 'column' }}>
      {showComplete && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}
      <Header />

      {/* Top bar */}
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          zIndex: 100,
          background: '#fff',
          borderBottom: '1px solid #E8E4DD',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          height: 52,
        }}
      >
        <button
          onClick={() => navigate(`/learn/${lang}`)}
          aria-label="Go back to level map"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            color: '#6B7280',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>
            Level {level.id}: {level.title}
          </div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(233,196,106,0.15)',
            padding: '4px 10px',
            borderRadius: 12,
          }}
        >
          <Zap size={12} color="#E9C46A" fill="#E9C46A" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#B8860B' }}>{level.xpReward} XP</span>
        </div>
        <ThemeToggle size="sm" />
      </motion.div>

      {/* Progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 116,
          left: 0,
          right: 0,
          height: 3,
          background: '#E8E4DD',
          zIndex: 100,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>

      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 116,
          left: 0,
          right: 0,
          zIndex: 100,
          background: '#fff',
          borderBottom: '1px solid #E8E4DD',
          display: 'flex',
        }}>
          {[
            { id: 'theory' as const, label: 'Theory', icon: <BookOpen size={14} /> },
            { id: 'code' as const, label: 'Code', icon: <FileCode size={14} /> },
            { id: 'terminal' as const, label: 'Terminal', icon: <Terminal size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '12px 8px',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #2D6A4F' : '2px solid transparent',
                background: activeTab === tab.id ? '#F8F8F6' : 'transparent',
                color: activeTab === tab.id ? '#2D6A4F' : '#6B7280',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Three-panel layout (desktop) or Tabbed layout (mobile) */}
      {isMobile ? (
        /* Mobile: Single panel with tabs */
        <div style={{
          flex: 1,
          marginTop: activeTab ? 160 : 125,
          height: activeTab ? 'calc(100vh - 160px)' : 'calc(100vh - 125px)',
          overflowY: 'auto',
        }}>
          {activeTab === 'theory' && (
            <Suspense fallback={<div style={{ padding: '24px 20px', color: '#6B7280', fontSize: 13 }}>Loading content...</div>}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ padding: '24px 20px', background: '#fff', minHeight: '100%' }}
            >
              <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A', margin: '0 0 12px', fontFamily: 'Sora, sans-serif' }}>
                {level.title}
              </h1>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.6 }}>
                {level.description}
              </p>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: '#374151' }}>
                {renderContent(step.content)}
              </div>
              {step.hint && (
                <div style={{ marginTop: 16, padding: '12px 14px', background: '#FFF8F0', borderRadius: 10, borderLeft: '4px solid #F4845F', fontSize: 13, color: '#7C4A2E' }}>
                  <strong>Hint:</strong> {step.hint}
                </div>
              )}
            </motion.div>
            </Suspense>
          )}

          {activeTab === 'code' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: '20px 16px', background: '#F8F8F6', minHeight: '100%' }}
            >
              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                {level.steps.map((s, i) => (
                  <div key={s.id} style={{
                    width: 28, height: 28, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    background: i < currentStep ? '#2D6A4F' : i === currentStep ? '#2D6A4F' : '#E8E4DD',
                    color: i <= currentStep ? '#fff' : '#9CA3AF',
                  }}>
                    {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                ))}
              </div>

              {step.type === 'code' ? (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase' }}>Your Code</label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    spellCheck={false}
                    style={{
                      width: '100%', minHeight: 250, padding: 16,
                      background: '#1E1E1E', color: '#D4D4D4',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.6,
                      border: 'none', borderRadius: 12, resize: 'vertical', outline: 'none',
                    }}
                  />
                </div>
              ) : (
                <div style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', padding: 40 }}>
                  Switch to Terminal tab to enter commands
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={handleCheckAnswer} style={{
                  flex: 1, padding: '14px 20px',
                  background: result === 'fail' ? '#EF4444' : 'linear-gradient(135deg, #2D6A4F, #52B788)',
                  border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {result === 'pass' ? <><CheckCircle2 size={18} /> Correct!</> : result === 'fail' ? <><XCircle size={18} /> Try Again</> : <>Check Answer <ChevronRight size={16} /></>}
                </button>
                <button onClick={handleReset} style={{
                  padding: '14px 16px', background: '#fff', border: '1px solid #E8E4DD',
                  borderRadius: 12, color: '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'terminal' && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ background: '#0D1117', minHeight: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #21262D', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
                </div>
                <span style={{ fontSize: 12, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>Terminal</span>
              </div>

              <div ref={terminalRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.7 }}>
                {commandHistory.length === 0 && (
                  <div style={{ color: '#484F58', fontStyle: 'italic' }}>Commands will appear here...</div>
                )}
                {commandHistory.map((entry, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ color: '#52B788' }}>$ {entry.cmd}</div>
                    {entry.output && <div style={{ color: '#C9D1D9', whiteSpace: 'pre-wrap' }}>{entry.output}</div>}
                  </div>
                ))}

                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{
                      marginTop: 16, padding: 16, borderRadius: 12, textAlign: 'center',
                      background: result === 'pass' ? 'rgba(45,106,79,0.15)' : 'rgba(239,68,68,0.15)',
                      border: `1px solid ${result === 'pass' ? '#2D6A4F' : '#EF4444'}`,
                    }}>
                      {result === 'pass' ? (
                        <><CheckCircle2 size={28} color="#52B788" style={{ marginBottom: 8 }} /><div style={{ color: '#52B788', fontWeight: 700, fontSize: 15 }}>Pass!</div></>
                      ) : (
                        <><XCircle size={28} color="#EF4444" style={{ marginBottom: 8 }} /><div style={{ color: '#EF4444', fontWeight: 700, fontSize: 15 }}>Not quite</div></>
                      )}
            </motion.div>
          )}
                </AnimatePresence>
              </div>

              {/* Terminal input */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #21262D', background: '#161B22' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#0D1117', borderRadius: 12, padding: '12px 16px', gap: 8 }}>
                  <Terminal size={16} color="#52B788" />
                  <span style={{ color: '#52B788', fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>$</span>
                  <input
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
                    placeholder="git ..."
                    spellCheck={false}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#D4D4D4', fontFamily: 'JetBrains Mono, monospace', fontSize: 14, outline: 'none' }}
                  />
                  <button onClick={handleRun} style={{
                    background: '#2D6A4F', border: 'none', borderRadius: 8, padding: '6px 14px',
                    color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Play size={12} /> Run
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
      /* Desktop: Three-panel layout */
      <div
        style={{
          display: 'flex',
          flex: 1,
          marginTop: 125,
          gap: 0,
          height: 'calc(100vh - 125px)',
        }}
      >
        {/* LEFT: Theory panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            width: '30%',
            borderRight: '1px solid #E8E4DD',
            overflowY: 'auto',
            padding: '24px 20px',
            background: '#fff',
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#1A1A1A',
              margin: '0 0 16px',
              fontFamily: 'Sora, sans-serif',
            }}
          >
            {level.title}
          </h2>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.6 }}>
            {level.description}
          </p>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: '#374151' }}>
            {renderContent(step.content)}
          </div>

          {step.hint && (
            <div
              style={{
                marginTop: 16,
                padding: '12px 14px',
                background: '#FFF8F0',
                borderRadius: 10,
                borderLeft: '4px solid #F4845F',
                fontSize: 12,
                color: '#7C4A2E',
              }}
            >
              <strong>Hint:</strong> {step.hint}
            </div>
          )}
        </motion.div>

        {/* CENTER: Code/Answer panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            background: '#F8F8F6',
          }}
        >
          {/* Step indicator */}
          <div
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid #E8E4DD',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
            }}
          >
            {level.steps.map((s, i) => (
              <div
                key={s.id}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  background: i < currentStep ? '#2D6A4F' : i === currentStep ? '#2D6A4F' : '#E8E4DD',
                  color: i <= currentStep ? '#fff' : '#9CA3AF',
                  transition: 'all .2s',
                }}
              >
                {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
              </div>
            ))}
          </div>

          {/* Code editor or terminal input */}
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            {step.type === 'code' ? (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#6B7280',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Your Code
                </label>
                <textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  spellCheck={false}
                  style={{
                    width: '100%',
                    minHeight: 300,
                    padding: 16,
                    background: '#1E1E1E',
                    color: '#D4D4D4',
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    border: 'none',
                    borderRadius: 12,
                    resize: 'vertical',
                    outline: 'none',
                    tabSize: 2,
                  }}
                />
              </div>
            ) : step.type === 'terminal' ? (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#6B7280',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Type the Git command
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#1E1E1E',
                    borderRadius: 12,
                    padding: '12px 16px',
                    gap: 8,
                  }}
                >
                  <Terminal size={16} color="#52B788" />
                  <span style={{ color: '#52B788', fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>$</span>
                  <input
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRun();
                    }}
                    placeholder="git ..."
                    spellCheck={false}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: '#D4D4D4',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleRun}
                    style={{
                      background: '#2D6A4F',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 14px',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Play size={12} /> Run
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  color: '#9CA3AF',
                  fontSize: 14,
                }}
              >
                Read the theory and continue to the next step.
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                onClick={handleCheckAnswer}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: result === 'fail' ? '#EF4444' : 'linear-gradient(135deg, #2D6A4F, #52B788)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all .2s',
                  boxShadow: result === 'fail' ? '0 2px 12px rgba(239,68,68,0.3)' : '0 2px 12px rgba(45,106,79,0.3)',
                }}
              >
                {result === 'pass' ? (
                  <>
                    <CheckCircle2 size={18} /> Correct!
                  </>
                ) : result === 'fail' ? (
                  <>
                    <XCircle size={18} /> Try Again
                  </>
                ) : (
                  <>
                    Check Answer
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
              {(step.type === 'code' || step.type === 'terminal') && (
                <button
                  onClick={handleReset}
                  style={{
                    padding: '12px 16px',
                    background: '#fff',
                    border: '1px solid #E8E4DD',
                    borderRadius: 12,
                    color: '#6B7280',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Terminal/Output panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            width: '30%',
            background: '#0D1117',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid #21262D',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
            </div>
            <span style={{ fontSize: 12, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>
              Terminal
            </span>
          </div>

          <div
            ref={terminalRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 16px',
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            {commandHistory.length === 0 && (
              <div style={{ color: '#484F58', fontStyle: 'italic' }}>
                Commands will appear here...
              </div>
            )}
            {commandHistory.map((entry, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ color: '#52B788' }}>
                  $ {entry.cmd}
                </div>
                {entry.output && (
                  <div style={{ color: '#C9D1D9', whiteSpace: 'pre-wrap' }}>
                    {entry.output}
                  </div>
                )}
              </div>
            ))}

            {/* Result feedback */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    marginTop: 16,
                    padding: '16px',
                    borderRadius: 12,
                    background: result === 'pass' ? 'rgba(45,106,79,0.15)' : 'rgba(239,68,68,0.15)',
                    border: `1px solid ${result === 'pass' ? '#2D6A4F' : '#EF4444'}`,
                    textAlign: 'center',
                  }}
                >
                  {result === 'pass' ? (
                    <>
                      <CheckCircle2 size={32} color="#52B788" style={{ marginBottom: 8 }} />
                      <div style={{ color: '#52B788', fontWeight: 700, fontSize: 16 }}>
                        Pass!
                      </div>
                      <div style={{ color: '#8B949E', fontSize: 12, marginTop: 4 }}>
                        {currentStep < totalSteps - 1 ? 'Moving to next step...' : 'Level complete!'}
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle size={32} color="#EF4444" style={{ marginBottom: 8 }} />
                      <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 16 }}>
                        Not quite
                      </div>
                      <div style={{ color: '#8B949E', fontSize: 12, marginTop: 4 }}>
                        Check the expected command and try again.
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terminal input */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #21262D', background: '#161B22' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#0D1117', borderRadius: 10, padding: '10px 14px', gap: 8 }}>
              <Terminal size={14} color="#52B788" />
              <span style={{ color: '#52B788', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>$</span>
              <input
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
                placeholder="git ..."
                spellCheck={false}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#D4D4D4', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, outline: 'none' }}
              />
              <button onClick={handleRun} style={{
                background: '#2D6A4F', border: 'none', borderRadius: 8, padding: '5px 12px',
                color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Play size={10} /> Run
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      )}

      {/* Completion modal */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Level completed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: '40px 48px',
                textAlign: 'center',
                maxWidth: 400,
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#1A1A1A',
                  margin: '0 0 8px',
                  fontFamily: 'Sora, sans-serif',
                }}
              >
                Level Complete!
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px' }}>
                You earned
              </p>

              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(233,196,106,0.15)',
                  padding: '8px 20px',
                  borderRadius: 16,
                  marginBottom: 28,
                }}
              >
                <Zap size={20} color="#E9C46A" fill="#E9C46A" />
                <span style={{ fontSize: 28, fontWeight: 800, color: '#B8860B' }}>
                  {xpEarned} XP
                </span>
              </motion.div>

              <div style={{ display: 'flex', gap: 12 }}>
                {nextLevel && (
                  <button
                    onClick={() => {
                      setShowComplete(false);
                      navigate(`/level/${lang}/${nextLevel.id}`);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                      border: 'none',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(45,106,79,0.3)',
                    }}
                  >
                    Next Level →
                  </button>
                )}
                <button
                  onClick={() => navigate(`/learn/${lang}`)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: '#fff',
                    border: '2px solid #E8E4DD',
                    borderRadius: 12,
                    color: '#374151',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Back to Map
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
