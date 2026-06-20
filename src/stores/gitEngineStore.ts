import { create } from 'zustand';
import type { Commit, Branch, GitState, GitEngineActions } from '../types';

function generateCommitId(counter: number): string {
  const timestamp = Date.now().toString(36);
  const hash = counter.toString(16).padStart(4, '0');
  return `${timestamp}-${hash}`;
}

function createCommit(
  id: string,
  message: string,
  parentId: string | null,
  branch: string,
  files: Record<string, string>,
  parentIds?: string[]
): Commit {
  return {
    id,
    message,
    parentId,
    parentIds: parentIds || (parentId ? [parentId] : []),
    branch,
    timestamp: new Date().toISOString(),
    files: { ...files },
  };
}

const DEFAULT_FILES: Record<string, string> = {
  'README.md': '# My Project\n\nA new project.',
  'src/app.js': 'console.log("Hello World");',
  'src/utils.js': 'export const add = (a, b) => a + b;',
  'package.json': '{\n  "name": "my-project",\n  "version": "1.0.0"\n}',
  '.gitignore': 'node_modules/\n.env\n.DS_Store',
};

function isAncestor(
  commits: Record<string, Commit>,
  ancestorId: string,
  descendantId: string
): boolean {
  const visited = new Set<string>();
  const queue = [descendantId];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === ancestorId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    
    const commit = commits[current];
    if (commit) {
      for (const parentId of commit.parentIds) {
        queue.push(parentId);
      }
    }
  }
  
  return false;
}

function getReachableCommits(
  commits: Record<string, Commit>,
  startId: string | null
): Set<string> {
  const reachable = new Set<string>();
  if (!startId) return reachable;
  
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;
    reachable.add(current);
    
    const commit = commits[current];
    if (commit) {
      for (const parentId of commit.parentIds) {
        queue.push(parentId);
      }
    }
  }
  
  return reachable;
}

const INITIAL_STATE: GitState = {
  initialized: false,
  branches: {},
  currentBranch: null,
  commits: {},
  headCommitId: null,
  stagingArea: {},
  workingDirectory: {},
  commitCounter: 0,
};

export const useGitEngineStore = create<GitState & GitEngineActions>((set, get) => ({
  ...INITIAL_STATE,

  gitInit: () => {
    const state = get();
    if (state.initialized) return 'already-initialized';

    const mainBranch: Branch = { name: 'main', headCommitId: null };
    set({
      initialized: true,
      branches: { main: mainBranch },
      currentBranch: 'main',
      workingDirectory: { ...DEFAULT_FILES },
    });
    return 'ok';
  },

  gitCommit: (message: string) => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    if (Object.keys(state.stagingArea).length === 0) return 'nothing-to-commit';

    const newCounter = state.commitCounter + 1;
    const newId = generateCommitId(newCounter);
    const newCommit = createCommit(
      newId,
      message,
      state.headCommitId,
      state.currentBranch!,
      state.stagingArea
    );

    const updatedBranches = {
      ...state.branches,
      [state.currentBranch!]: {
        ...state.branches[state.currentBranch!],
        headCommitId: newId,
      },
    };

    set({
      commits: { ...state.commits, [newId]: newCommit },
      branches: updatedBranches,
      headCommitId: newId,
      commitCounter: newCounter,
      stagingArea: {},
    });
    return 'ok';
  },

  gitAdd: (filePath: string) => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    if (!(filePath in state.workingDirectory)) return 'file-not-found';

    set({
      stagingArea: {
        ...state.stagingArea,
        [filePath]: state.workingDirectory[filePath],
      },
    });
    return 'ok';
  },

  gitStatus: () => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    return 'ok';
  },

  gitLog: () => {
    const state = get();
    if (!state.initialized) return [];

    const log: Commit[] = [];
    const visited = new Set<string>();
    const queue = [state.headCommitId];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!currentId || visited.has(currentId)) continue;
      visited.add(currentId);
      
      const commit = state.commits[currentId];
      if (commit) {
        log.push(commit);
        for (const pid of commit.parentIds) {
          queue.push(pid);
        }
      }
    }
    return log;
  },

  gitBranch: (name: string) => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    if (name in state.branches) return 'already-exists';

    set({
      branches: {
        ...state.branches,
        [name]: { name, headCommitId: state.headCommitId },
      },
    });
    return 'ok';
  },

  gitCheckout: (branchName: string) => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    if (!(branchName in state.branches)) return 'branch-not-found';

    const branch = state.branches[branchName];
    set({
      currentBranch: branchName,
      headCommitId: branch.headCommitId,
    });
    return 'ok';
  },

  gitReset: (commitId: string) => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    if (!(commitId in state.commits)) return 'commit-not-found';

    const updatedBranches = {
      ...state.branches,
      [state.currentBranch!]: {
        ...state.branches[state.currentBranch!],
        headCommitId: commitId,
      },
    };

    set({
      headCommitId: commitId,
      branches: updatedBranches,
    });
    return 'ok';
  },

  gitMerge: (branchName: string) => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    if (!(branchName in state.branches)) return 'branch-not-found';
    if (branchName === state.currentBranch) return 'already-up-to-date';

    const sourceBranch = state.branches[branchName];
    const targetBranch = state.branches[state.currentBranch!];
    const sourceHeadId = sourceBranch.headCommitId;
    const targetHeadId = targetBranch.headCommitId;

    if (!sourceHeadId) return 'already-up-to-date';
    if (!targetHeadId) {
      set({
        headCommitId: sourceHeadId,
        branches: {
          ...state.branches,
          [state.currentBranch!]: {
            ...state.branches[state.currentBranch!],
            headCommitId: sourceHeadId,
          },
        },
      });
      return 'ok';
    }

    const isFastForward = isAncestor(state.commits, targetHeadId, sourceHeadId);

    if (isFastForward) {
      set({
        headCommitId: sourceHeadId,
        branches: {
          ...state.branches,
          [state.currentBranch!]: {
            ...state.branches[state.currentBranch!],
            headCommitId: sourceHeadId,
          },
        },
      });
      return 'ok';
    }

    const newCounter = state.commitCounter + 1;
    const newId = generateCommitId(newCounter);
    const mergeCommit = createCommit(
      newId,
      `Merge branch '${branchName}' into ${state.currentBranch}`,
      targetHeadId,
      state.currentBranch!,
      {},
      [targetHeadId, sourceHeadId]
    );

    set({
      commits: { ...state.commits, [newId]: mergeCommit },
      headCommitId: newId,
      commitCounter: newCounter,
      branches: {
        ...state.branches,
        [state.currentBranch!]: {
          ...state.branches[state.currentBranch!],
          headCommitId: newId,
        },
      },
    });
    return 'ok';
  },

  gitResetHard: (commitId: string) => {
    const state = get();
    if (!state.initialized) return 'not-initialized';
    if (!(commitId in state.commits)) return 'commit-not-found';

    const currentBranch = state.currentBranch!;
    const targetCommit = commitId;
    
    const reachableFromBranches = new Set<string>();
    for (const branch of Object.values(state.branches)) {
      if (branch.headCommitId) {
        const reachable = getReachableCommits(state.commits, branch.headCommitId);
        reachable.forEach(id => reachableFromBranches.add(id));
      }
    }

    const commitsToDelete: string[] = [];
    for (const cid of Object.keys(state.commits)) {
      if (!reachableFromBranches.has(cid) && cid !== targetCommit) {
        commitsToDelete.push(cid);
      }
    }

    const updatedCommits = { ...state.commits };
    commitsToDelete.forEach(id => delete updatedCommits[id]);

    set({
      headCommitId: targetCommit,
      commits: updatedCommits,
      branches: {
        ...state.branches,
        [currentBranch]: {
          ...state.branches[currentBranch],
          headCommitId: targetCommit,
        },
      },
      stagingArea: {},
      workingDirectory: {},
    });
    return 'ok';
  },

  gitDiff: () => {
    const state = get();
    const diffs: Record<string, { before: string; after: string }> = {};

    for (const [filePath, stagedContent] of Object.entries(state.stagingArea)) {
      const wdContent = state.workingDirectory[filePath];
      if (wdContent !== stagedContent) {
        diffs[filePath] = { before: stagedContent, after: wdContent };
      }
    }

    for (const [filePath, wdContent] of Object.entries(state.workingDirectory)) {
      if (!(filePath in state.stagingArea)) {
        diffs[filePath] = { before: '', after: wdContent };
      }
    }

    return diffs;
  },

  gitShow: (commitId: string) => {
    const state = get();
    return state.commits[commitId] || null;
  },

  resetEngine: () => {
    set(INITIAL_STATE);
  },

  getCommitCount: () => {
    return get().commitCounter;
  },

  getHeadCommit: () => {
    const state = get();
    if (!state.headCommitId) return null;
    return state.commits[state.headCommitId] || null;
  },

  getCurrentBranch: () => {
    const state = get();
    if (!state.currentBranch) return null;
    return state.branches[state.currentBranch] || null;
  },
}));
