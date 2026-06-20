export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  rank: string;
  streak: number;
  longestStreak: number;
  joinedAt: string;
  isDemo: boolean;
  languagePreference: Language;
  completedLevels: Record<Language, number[]>;
  achievements: string[];
  emailNotifications: boolean;
  streakReminders: boolean;
}

export type Language = 'git' | 'python' | 'c' | 'cpp' | 'java';

export interface Level {
  id: number;
  title: string;
  description: string;
  language: Language;
  category: 'concept' | 'practice' | 'challenge' | 'boss';
  xpReward: number;
  estimatedMinutes: number;
  steps: LevelStep[];
}

export interface LevelStep {
  id: number;
  type: 'theory' | 'code' | 'terminal';
  content: string;
  code?: string;
  language?: string;
  expectedCommand?: string;
  hint?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: string;
  requirement: number;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
}

export type TrackId = Language;

export interface Commit {
  id: string;
  message: string;
  parentId: string | null;
  parentIds: string[];
  branch: string;
  timestamp: string;
  files: Record<string, string>;
}

export interface Branch {
  name: string;
  headCommitId: string | null;
}

export type GitInitStatus = 'ok' | 'already-initialized';
export type GitCommitStatus = 'ok' | 'nothing-to-commit' | 'not-initialized';
export type GitAddStatus = 'ok' | 'file-not-found' | 'not-initialized';
export type GitBranchStatus = 'ok' | 'already-exists' | 'not-initialized';
export type GitCheckoutStatus = 'ok' | 'branch-not-found' | 'not-initialized';
export type GitStatusStatus = 'ok' | 'not-initialized';
export type GitLogStatus = 'ok' | 'not-initialized';
export type GitResetStatus = 'ok' | 'not-initialized' | 'commit-not-found';
export type GitMergeStatus = 'ok' | 'already-up-to-date' | 'not-initialized' | 'branch-not-found';
export type GitResetHardStatus = 'ok' | 'not-initialized' | 'commit-not-found';

export interface GitState {
  initialized: boolean;
  branches: Record<string, Branch>;
  currentBranch: string | null;
  commits: Record<string, Commit>;
  headCommitId: string | null;
  stagingArea: Record<string, string>;
  workingDirectory: Record<string, string>;
  commitCounter: number;
}

export interface GitEngineActions {
  gitInit: () => GitInitStatus;
  gitCommit: (message: string) => GitCommitStatus;
  gitAdd: (filePath: string) => GitAddStatus;
  gitStatus: () => GitStatusStatus;
  gitLog: () => Commit[];
  gitBranch: (name: string) => GitBranchStatus;
  gitCheckout: (branchName: string) => GitCheckoutStatus;
  gitReset: (commitId: string) => GitResetStatus;
  gitMerge: (branchName: string) => GitMergeStatus;
  gitResetHard: (commitId: string) => GitResetHardStatus;
  gitDiff: () => Record<string, { before: string; after: string }>;
  gitShow: (commitId: string) => Commit | null;
  resetEngine: () => void;
  getCommitCount: () => number;
  getHeadCommit: () => Commit | null;
  getCurrentBranch: () => Branch | null;
}
