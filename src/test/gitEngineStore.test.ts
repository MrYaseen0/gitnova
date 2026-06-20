import { describe, it, expect, beforeEach } from 'vitest';
import { useGitEngineStore } from '../stores/gitEngineStore';

describe('gitEngineStore', () => {
  beforeEach(() => {
    useGitEngineStore.getState().resetEngine();
  });

  describe('gitInit', () => {
    it('initializes the repository', () => {
      const result = useGitEngineStore.getState().gitInit();
      expect(result).toBe('ok');

      const state = useGitEngineStore.getState();
      expect(state.initialized).toBe(true);
      expect(state.currentBranch).toBe('main');
      expect(state.branches.main).toBeDefined();
    });

    it('populates working directory with default files', () => {
      useGitEngineStore.getState().gitInit();

      const state = useGitEngineStore.getState();
      expect(Object.keys(state.workingDirectory)).toContain('README.md');
      expect(Object.keys(state.workingDirectory)).toContain('src/app.js');
      expect(Object.keys(state.workingDirectory)).toContain('package.json');
    });

    it('returns already-initialized on second call', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitInit();
      expect(result).toBe('already-initialized');
    });
  });

  describe('gitAdd', () => {
    it('stages a file', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitAdd('README.md');

      expect(result).toBe('ok');
      expect(useGitEngineStore.getState().stagingArea['README.md']).toBeDefined();
    });

    it('returns not-initialized if no init', () => {
      const result = useGitEngineStore.getState().gitAdd('README.md');
      expect(result).toBe('not-initialized');
    });

    it('returns file-not-found for missing file', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitAdd('nonexistent.txt');
      expect(result).toBe('file-not-found');
    });
  });

  describe('gitCommit', () => {
    it('creates a commit from staged files', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      const result = useGitEngineStore.getState().gitCommit('Initial commit');

      expect(result).toBe('ok');
      const state = useGitEngineStore.getState();
      expect(state.headCommitId).not.toBeNull();
      expect(Object.keys(state.commits).length).toBe(1);
      expect(state.stagingArea).toEqual({});
    });

    it('returns nothing-to-commit with empty staging', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitCommit('Empty commit');
      expect(result).toBe('nothing-to-commit');
    });

    it('returns not-initialized if no init', () => {
      const result = useGitEngineStore.getState().gitCommit('Test');
      expect(result).toBe('not-initialized');
    });

    it('chains parent commits', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('First');

      useGitEngineStore.getState().gitAdd('src/app.js');
      useGitEngineStore.getState().gitCommit('Second');

      const state = useGitEngineStore.getState();
      const commits = Object.values(state.commits);
      expect(commits.length).toBe(2);

      const secondCommit = commits.find(c => c.message === 'Second');
      expect(secondCommit?.parentIds.length).toBe(1);
    });
  });

  describe('gitBranch', () => {
    it('creates a new branch', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitBranch('feature');

      expect(result).toBe('ok');
      expect(useGitEngineStore.getState().branches.feature).toBeDefined();
    });

    it('returns already-exists for duplicate branch', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitBranch('feature');
      const result = useGitEngineStore.getState().gitBranch('feature');
      expect(result).toBe('already-exists');
    });
  });

  describe('gitCheckout', () => {
    it('switches to another branch', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitBranch('feature');
      const result = useGitEngineStore.getState().gitCheckout('feature');

      expect(result).toBe('ok');
      expect(useGitEngineStore.getState().currentBranch).toBe('feature');
    });

    it('returns branch-not-found for missing branch', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitCheckout('nonexistent');
      expect(result).toBe('branch-not-found');
    });
  });

  describe('gitMerge', () => {
    it('fast-forwards when source is ancestor of target', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('Initial');

      useGitEngineStore.getState().gitBranch('feature');
      useGitEngineStore.getState().gitCheckout('feature');
      useGitEngineStore.getState().gitAdd('src/app.js');
      useGitEngineStore.getState().gitCommit('Feature work');

      useGitEngineStore.getState().gitCheckout('main');
      const result = useGitEngineStore.getState().gitMerge('feature');

      expect(result).toBe('ok');
      expect(useGitEngineStore.getState().headCommitId).toBe(
        useGitEngineStore.getState().branches.feature.headCommitId
      );
    });

    it('creates merge commit for diverged branches', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('Initial');

      // Create feature branch and add commit
      useGitEngineStore.getState().gitBranch('feature');
      useGitEngineStore.getState().gitCheckout('feature');
      useGitEngineStore.getState().gitAdd('src/app.js');
      useGitEngineStore.getState().gitCommit('Feature work');

      // Go back to main and add another commit
      useGitEngineStore.getState().gitCheckout('main');
      useGitEngineStore.getState().gitAdd('package.json');
      useGitEngineStore.getState().gitCommit('Main work');

      // Merge feature into main
      const result = useGitEngineStore.getState().gitMerge('feature');

      expect(result).toBe('ok');
      const mergeCommit = useGitEngineStore.getState().commits[useGitEngineStore.getState().headCommitId!];
      expect(mergeCommit.parentIds.length).toBe(2);
      expect(mergeCommit.message).toContain('Merge');
    });

    it('returns already-up-to-date when merging same branch', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitMerge('main');
      expect(result).toBe('already-up-to-date');
    });

    it('returns branch-not-found for missing branch', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitMerge('nonexistent');
      expect(result).toBe('branch-not-found');
    });
  });

  describe('gitReset', () => {
    it('resets HEAD to a specific commit', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('First');

      const firstId = useGitEngineStore.getState().headCommitId;

      useGitEngineStore.getState().gitAdd('src/app.js');
      useGitEngineStore.getState().gitCommit('Second');

      const result = useGitEngineStore.getState().gitReset(firstId!);
      expect(result).toBe('ok');
      expect(useGitEngineStore.getState().headCommitId).toBe(firstId);
    });

    it('returns commit-not-found for invalid commit', () => {
      useGitEngineStore.getState().gitInit();
      const result = useGitEngineStore.getState().gitReset('invalid-id');
      expect(result).toBe('commit-not-found');
    });
  });

  describe('gitLog', () => {
    it('returns commit history in order', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('First');

      useGitEngineStore.getState().gitAdd('src/app.js');
      useGitEngineStore.getState().gitCommit('Second');

      const log = useGitEngineStore.getState().gitLog();
      expect(log.length).toBe(2);
      expect(log[0].message).toBe('Second');
      expect(log[1].message).toBe('First');
    });

    it('returns empty array when no commits', () => {
      useGitEngineStore.getState().gitInit();
      const log = useGitEngineStore.getState().gitLog();
      expect(log).toEqual([]);
    });
  });

  describe('gitShow', () => {
    it('returns commit by id', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('Test commit');

      const headId = useGitEngineStore.getState().headCommitId;
      const commit = useGitEngineStore.getState().gitShow(headId!);

      expect(commit).not.toBeNull();
      expect(commit?.message).toBe('Test commit');
    });

    it('returns null for invalid id', () => {
      useGitEngineStore.getState().gitInit();
      const commit = useGitEngineStore.getState().gitShow('invalid');
      expect(commit).toBeNull();
    });
  });

  describe('gitDiff', () => {
    it('shows differences between working directory and staging', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');

      // Modify the file after staging
      const state = useGitEngineStore.getState();
      useGitEngineStore.setState({
        workingDirectory: { ...state.workingDirectory, 'README.md': 'Modified content' },
      });

      const diff = useGitEngineStore.getState().gitDiff();
      expect(diff['README.md']).toBeDefined();
      expect(diff['README.md'].after).toBe('Modified content');
    });
  });

  describe('resetEngine', () => {
    it('resets all state to initial values', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('Test');

      useGitEngineStore.getState().resetEngine();

      const state = useGitEngineStore.getState();
      expect(state.initialized).toBe(false);
      expect(state.commits).toEqual({});
      expect(state.branches).toEqual({});
      expect(state.currentBranch).toBeNull();
    });
  });

  describe('getHeadCommit', () => {
    it('returns current HEAD commit', () => {
      useGitEngineStore.getState().gitInit();
      useGitEngineStore.getState().gitAdd('README.md');
      useGitEngineStore.getState().gitCommit('Test');

      const head = useGitEngineStore.getState().getHeadCommit();
      expect(head).not.toBeNull();
      expect(head?.message).toBe('Test');
    });

    it('returns null when no commits', () => {
      useGitEngineStore.getState().gitInit();
      expect(useGitEngineStore.getState().getHeadCommit()).toBeNull();
    });
  });

  describe('getCurrentBranch', () => {
    it('returns current branch info', () => {
      useGitEngineStore.getState().gitInit();
      const branch = useGitEngineStore.getState().getCurrentBranch();
      expect(branch).not.toBeNull();
      expect(branch?.name).toBe('main');
    });

    it('returns null when not initialized', () => {
      expect(useGitEngineStore.getState().getCurrentBranch()).toBeNull();
    });
  });
});
