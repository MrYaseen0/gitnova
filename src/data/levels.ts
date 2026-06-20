import type { Level, Language } from '../types';

const gitLevels: Level[] = [
  // ─── Foundation (1–10) ────────────────────────────────────────────────
  {
    id: 1,
    title: 'What is Version Control?',
    description: 'Understand why version control matters.',
    language: 'git',
    category: 'concept',
    xpReward: 50,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Version control tracks changes to files over time. Git is a distributed VCS that lets every developer keep a full history locally.\n\n```bash\ngit --version\n```\n\nRun the command above to confirm Git is installed.',
      },
    ],
  },
  {
    id: 2,
    title: 'Initializing a Repository',
    description: 'Create a new Git repository from scratch.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git init` creates a hidden `.git` folder that stores all version history for the project.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Initialize a new repository in the current directory.',
        expectedCommand: 'git init',
        hint: 'The command is just two words.',
      },
    ],
  },
  {
    id: 3,
    title: 'Staging Changes',
    description: 'Learn how to stage files for commit.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git add` moves changes from the working directory to the staging area.\n\n```bash\ngit add <file>\ngit add .          # stage everything\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Stage all current changes.',
        expectedCommand: 'git add .',
        hint: 'Use a dot to stage everything.',
      },
    ],
  },
  {
    id: 4,
    title: 'Making Commits',
    description: 'Record a snapshot of your staged changes.',
    language: 'git',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git commit` saves staged changes with a message describing what changed.\n\n```bash\ngit commit -m "your message"\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Commit staged files with the message "first commit".',
        expectedCommand: 'git commit -m "first commit"',
        hint: 'Use the -m flag to pass a message inline.',
      },
    ],
  },
  {
    id: 5,
    title: 'Checking Status',
    description: 'See what Git knows about your repository.',
    language: 'git',
    category: 'concept',
    xpReward: 50,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git status` shows modified, staged, and untracked files.\n\n```bash\ngit status\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Display the current status of the repository.',
        expectedCommand: 'git status',
        hint: 'One word after git.',
      },
    ],
  },
  {
    id: 6,
    title: 'Viewing History',
    description: 'Browse your commit log.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git log` shows commit history. Use `--oneline` for a compact view.\n\n```bash\ngit log --oneline\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Show the commit log in oneline format.',
        expectedCommand: 'git log --oneline',
        hint: 'Add the --oneline flag.',
      },
    ],
  },
  {
    id: 7,
    title: 'Viewing Diffs',
    description: 'Compare changes between commits or the working tree.',
    language: 'git',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git diff` shows unstaged changes. `git diff --staged` shows staged changes.\n\n```bash\ngit diff\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Show the diff of unstaged changes.',
        expectedCommand: 'git diff',
        hint: 'Two words.',
      },
    ],
  },
  {
    id: 8,
    title: 'Undoing Changes',
    description: 'Learn reset, restore, and revert.',
    language: 'git',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git restore` discards working-tree changes. `git reset --soft` undoes the last commit but keeps changes staged.\n\n```bash\ngit restore <file>\ngit reset --soft HEAD~1\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Soft-reset the last commit.',
        expectedCommand: 'git reset --soft HEAD~1',
        hint: 'HEAD~1 means one commit back.',
      },
    ],
  },
  {
    id: 9,
    title: 'Ignoring Files',
    description: 'Tell Git which files to skip.',
    language: 'git',
    category: 'concept',
    xpReward: 50,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Create a `.gitignore` file listing patterns for files Git should ignore.\n\n```\n# .gitignore\nnode_modules/\n.env\n*.log\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Add common ignore patterns to .gitignore.',
        code: 'node_modules/\n.env\n*.log\ndist/\n.DS_Store',
        language: 'gitignore',
      },
    ],
  },
  {
    id: 10,
    title: 'Foundation Boss',
    description: 'Demonstrate your understanding of Git basics.',
    language: 'git',
    category: 'boss',
    xpReward: 150,
    estimatedMinutes: 15,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'You\'ve learned init, add, commit, status, log, diff, reset, and .gitignore. Time to put it all together.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Initialize a repo, create a file, stage it, and commit with a message—all in sequence.',
        expectedCommand: 'git init && git add . && git commit -m "initial commit"',
        hint: 'Chain commands with &&.',
      },
    ],
  },

  // ─── Branching & Merging (11–20) ─────────────────────────────────────
  {
    id: 11,
    title: 'Understanding Branches',
    description: 'Learn what branches are and why they matter.',
    language: 'git',
    category: 'concept',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'A branch is an independent line of development. The default branch is usually `main`.',
      },
    ],
  },
  {
    id: 12,
    title: 'Creating & Listing Branches',
    description: 'Create and view branches.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '```bash\ngit branch feature-x    # create\ngit branch              # list\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Create a new branch called "feature".',
        expectedCommand: 'git branch feature',
        hint: 'git branch <name>',
      },
    ],
  },
  {
    id: 13,
    title: 'Switching Branches',
    description: 'Move between branches safely.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git checkout` or `git switch` changes your active branch.\n\n```bash\ngit switch feature\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Switch to the branch named "feature".',
        expectedCommand: 'git switch feature',
        hint: 'Use git switch <branch>.',
      },
    ],
  },
  {
    id: 14,
    title: 'Merging Branches',
    description: 'Combine branches together.',
    language: 'git',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git merge` integrates changes from one branch into another.\n\n```bash\ngit switch main\ngit merge feature\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Merge the "feature" branch into the current branch.',
        expectedCommand: 'git merge feature',
        hint: 'git merge <branch-name>',
      },
    ],
  },
  {
    id: 15,
    title: 'Resolving Merge Conflicts',
    description: 'Handle conflicts when they arise.',
    language: 'git',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Conflicts occur when the same line is changed on both branches. Git marks the conflict with `<<<<<<<`, `=======`, and `>>>>>>>`. Edit the file, then commit.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Resolve this conflict by keeping both changes.',
        code: '<<<<<<< HEAD\nconsole.log("Hello from main");\n=======\nconsole.log("Hello from feature");\n>>>>>>> feature',
        language: 'javascript',
      },
    ],
  },
  {
    id: 16,
    title: 'Fast-Forward vs 3-Way Merge',
    description: 'Know when Git uses each strategy.',
    language: 'git',
    category: 'concept',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'A **fast-forward** merge happens when the target branch has no new commits—Git simply moves the pointer. A **3-way merge** creates a new merge commit when both branches diverged.',
      },
    ],
  },
  {
    id: 17,
    title: 'Rebasing',
    description: 'Replay commits on top of another branch.',
    language: 'git',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git rebase` rewrites commit history to create a linear sequence.\n\n```bash\ngit switch feature\ngit rebase main\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Rebase the current branch onto "main".',
        expectedCommand: 'git rebase main',
        hint: 'git rebase <base-branch>',
      },
    ],
  },
  {
    id: 18,
    title: 'Cherry-Pick',
    description: 'Apply a specific commit to your branch.',
    language: 'git',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git cherry-pick <commit>` applies a single commit from another branch.\n\n```bash\ngit cherry-pick abc1234\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Cherry-pick commit abc1234.',
        expectedCommand: 'git cherry-pick abc1234',
        hint: 'Provide the commit hash after the command.',
      },
    ],
  },
  {
    id: 19,
    title: 'Branch Strategies',
    description: 'Learn common branching models.',
    language: 'git',
    category: 'concept',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Common strategies include **Gitflow** (feature, develop, release, main branches) and **trunk-based** (short-lived branches merged quickly into main).',
      },
    ],
  },
  {
    id: 20,
    title: 'Branching Boss',
    description: 'Master branch creation, merging, and conflict resolution.',
    language: 'git',
    category: 'boss',
    xpReward: 200,
    estimatedMinutes: 15,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Create a feature branch, make a commit, switch to main, make another commit, then merge. Handle any conflicts that arise.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Create and switch to a new branch called "dev" in one command.',
        expectedCommand: 'git switch -c dev',
        hint: 'Use the -c flag with switch.',
      },
    ],
  },

  // ─── Remote & Collaboration (21–30) ──────────────────────────────────
  {
    id: 21,
    title: 'Introduction to Remotes',
    description: 'Understand how Git handles remote repositories.',
    language: 'git',
    category: 'concept',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'A remote is a version of your repository hosted elsewhere (GitHub, GitLab). The default remote is called `origin`.',
      },
    ],
  },
  {
    id: 22,
    title: 'Adding Remotes',
    description: 'Connect to a remote repository.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '```bash\ngit remote add origin https://github.com/user/repo.git\ngit remote -v          # verify\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Add a remote named "origin" pointing to a GitHub URL.',
        expectedCommand: 'git remote add origin https://github.com/user/repo.git',
        hint: 'git remote add <name> <url>',
      },
    ],
  },
  {
    id: 23,
    title: 'Cloning Repositories',
    description: 'Copy a remote repository locally.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git clone` copies a remote repo and sets up tracking automatically.\n\n```bash\ngit clone https://github.com/user/repo.git\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Clone a repository from a URL.',
        expectedCommand: 'git clone https://github.com/user/repo.git',
        hint: 'git clone <url>',
      },
    ],
  },
  {
    id: 24,
    title: 'Pushing Changes',
    description: 'Upload local commits to a remote.',
    language: 'git',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git push` sends local commits to the remote.\n\n```bash\ngit push origin main\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Push the "main" branch to origin.',
        expectedCommand: 'git push origin main',
        hint: 'git push <remote> <branch>',
      },
    ],
  },
  {
    id: 25,
    title: 'Pulling Changes',
    description: 'Download and merge remote changes.',
    language: 'git',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git pull` is a fetch + merge. It downloads remote changes and merges them into your branch.\n\n```bash\ngit pull origin main\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Pull from origin main.',
        expectedCommand: 'git pull origin main',
        hint: 'git pull <remote> <branch>',
      },
    ],
  },
  {
    id: 26,
    title: 'Fetching Changes',
    description: 'Download remote changes without merging.',
    language: 'git',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git fetch` downloads remote data without modifying your working tree. Review changes before merging.\n\n```bash\ngit fetch origin\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Fetch all updates from origin.',
        expectedCommand: 'git fetch origin',
        hint: 'git fetch <remote>',
      },
    ],
  },
  {
    id: 27,
    title: 'Pull Requests',
    description: 'Learn the PR workflow for collaboration.',
    language: 'git',
    category: 'concept',
    xpReward: 70,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'A **Pull Request** (PR) proposes changes from one branch to another. It enables code review, discussion, and automated checks before merging.',
      },
    ],
  },
  {
    id: 28,
    title: 'Code Review Basics',
    description: 'Provide and receive meaningful code reviews.',
    language: 'git',
    category: 'concept',
    xpReward: 70,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Good code reviews focus on correctness, readability, and maintainability. Use GitHub\'s review feature to leave inline comments and request changes.',
      },
    ],
  },
  {
    id: 29,
    title: 'Forking Workflow',
    description: 'Contribute to projects you don\'t own.',
    language: 'git',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '1. **Fork** the repo on GitHub.\n2. **Clone** your fork locally.\n3. Create a branch, commit, push.\n4. Open a PR from your fork to the upstream repo.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Add an upstream remote named "upstream".',
        expectedCommand: 'git remote add upstream https://github.com/original/repo.git',
        hint: 'git remote add upstream <url>',
      },
    ],
  },
  {
    id: 30,
    title: 'Remote Boss',
    description: 'Demonstrate proficiency with remotes and collaboration.',
    language: 'git',
    category: 'boss',
    xpReward: 200,
    estimatedMinutes: 15,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Clone a repo, create a feature branch, push it, and open a pull request. This is the standard open-source contribution workflow.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Push a new branch and set upstream tracking.',
        expectedCommand: 'git push -u origin feature',
        hint: 'Use the -u flag to set upstream.',
      },
    ],
  },

  // ─── Advanced Git (31–40) ────────────────────────────────────────────
  {
    id: 31,
    title: 'Stashing Changes',
    description: 'Temporarily shelve uncommitted work.',
    language: 'git',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git stash` saves uncommitted changes and reverts the working directory.\n\n```bash\ngit stash\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Stash your current uncommitted changes.',
        expectedCommand: 'git stash',
        hint: 'Two words.',
      },
    ],
  },
  {
    id: 32,
    title: 'Managing Stashes',
    description: 'List, apply, and drop stashes.',
    language: 'git',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '```bash\ngit stash list              # view all\ngit stash apply             # re-apply\ngit stash pop               # apply + drop\ngit stash drop              # discard\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Apply and remove the most recent stash.',
        expectedCommand: 'git stash pop',
        hint: 'Use git stash pop.',
      },
    ],
  },
  {
    id: 33,
    title: 'Tagging Commits',
    description: 'Mark important commits with tags.',
    language: 'git',
    category: 'concept',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Tags label specific commits, commonly for releases.\n\n```bash\ngit tag v1.0.0\ngit tag -a v1.0.0 -m "Release 1.0"\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Create a lightweight tag named "v1.0".',
        expectedCommand: 'git tag v1.0',
        hint: 'git tag <tagname>',
      },
    ],
  },
  {
    id: 34,
    title: 'Annotated vs Lightweight Tags',
    description: 'Know the difference between tag types.',
    language: 'git',
    category: 'concept',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '**Lightweight tags** are simple pointers to a commit. **Annotated tags** store the tagger name, date, message, and optionally a GPG signature. Use `-a` for annotated tags.',
      },
    ],
  },
  {
    id: 35,
    title: 'Git Hooks',
    description: 'Automate tasks with custom scripts.',
    language: 'git',
    category: 'practice',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Git hooks are scripts in `.git/hooks/` that run automatically. Common hooks: `pre-commit`, `commit-msg`, `post-merge`.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a pre-commit hook that prevents commits to main.',
        code: '#!/bin/sh\nbranch=$(git rev-parse --abbrev-ref HEAD)\nif [ "$branch" = "main" ]; then\n  echo "Direct commits to main are not allowed!"\n  exit 1\nfi',
        language: 'bash',
      },
    ],
  },
  {
    id: 36,
    title: 'Git Bisect',
    description: 'Find the commit that introduced a bug.',
    language: 'git',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git bisect` uses binary search to find the exact commit that introduced a bug.\n\n```bash\ngit bisect start\ngit bisect bad              # current commit is broken\ngit bisect good v1.0        # this tag was working\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Start a bisect session.',
        expectedCommand: 'git bisect start',
        hint: 'git bisect start',
      },
    ],
  },
  {
    id: 37,
    title: 'Git Reflog',
    description: 'Recover lost commits with the reflog.',
    language: 'git',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git reflog` shows a log of all reference changes, including commits that appear "lost" after a reset.\n\n```bash\ngit reflog\ngit checkout <hash>         # recover\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Display the reflog.',
        expectedCommand: 'git reflog',
        hint: 'One word after git.',
      },
    ],
  },
  {
    id: 38,
    title: 'Worktrees',
    description: 'Work on multiple branches simultaneously.',
    language: 'git',
    category: 'practice',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git worktree` lets you check out multiple branches in separate directories.\n\n```bash\ngit worktree add ../hotfix hotfix\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Create a worktree for the "hotfix" branch.',
        expectedCommand: 'git worktree add ../hotfix hotfix',
        hint: 'git worktree add <path> <branch>',
      },
    ],
  },
  {
    id: 39,
    title: 'Interactive Rebase',
    description: 'Rewrite history with precision.',
    language: 'git',
    category: 'challenge',
    xpReward: 110,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`git rebase -i HEAD~N` opens an editor to reorder, squash, edit, or drop commits.\n\n```\npick abc1234 first commit\nsquash def5678 fix typo\n```',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Start an interactive rebase of the last 3 commits.',
        expectedCommand: 'git rebase -i HEAD~3',
        hint: 'git rebase -i HEAD~3',
      },
    ],
  },
  {
    id: 40,
    title: 'Advanced Boss',
    description: 'Demonstrate advanced Git mastery.',
    language: 'git',
    category: 'boss',
    xpReward: 250,
    estimatedMinutes: 20,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Use stash, bisect, and interactive rebase together to debug and clean up history.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Stash changes, then start a bisect session.',
        expectedCommand: 'git stash && git bisect start',
        hint: 'Chain commands with &&.',
      },
    ],
  },

  // ─── Mastery (41–50) ─────────────────────────────────────────────────
  {
    id: 41,
    title: 'CI/CD with Git',
    description: 'Automate testing and deployment with commits.',
    language: 'git',
    category: 'concept',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'CI/CD pipelines trigger on push or PR events. GitHub Actions, GitLab CI, and Jenkins read `.github/workflows/` or similar config files to run tests and deploy.',
      },
    ],
  },
  {
    id: 42,
    title: 'GitHub Actions Workflow',
    description: 'Write a basic CI workflow.',
    language: 'git',
    category: 'practice',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Create a GitHub Actions workflow that runs tests on push.',
        code: 'name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm test',
        language: 'yaml',
      },
    ],
  },
  {
    id: 43,
    title: 'Monorepo Strategies',
    description: 'Manage multiple projects in one repository.',
    language: 'git',
    category: 'concept',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Monorepos keep all projects in one repo. Use tools like **Turborepo**, **Nx**, or **Lerna** for build orchestration. Git sparse-checkout helps when the repo is large.',
      },
    ],
  },
  {
    id: 44,
    title: 'Git Large File Storage',
    description: 'Handle large files with Git LFS.',
    language: 'git',
    category: 'concept',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Git LFS replaces large files with pointers in the repo while storing the actual files on a separate server.\n\n```bash\ngit lfs install\ngit lfs track "*.psd"\n```',
      },
    ],
  },
  {
    id: 45,
    title: 'Git Internals: Objects',
    description: 'Understand blobs, trees, and commits.',
    language: 'git',
    category: 'concept',
    xpReward: 90,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Git stores data as three object types:\n- **blob**: file content\n- **tree**: directory listing\n- **commit**: snapshot + metadata\n\n```bash\ngit cat-file -t <hash>    # type\ngit cat-file -p <hash>    # contents\n```',
      },
    ],
  },
  {
    id: 46,
    title: 'Git Internals: Refs',
    description: 'Learn how branches and tags are just pointers.',
    language: 'git',
    category: 'concept',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Refs are files containing a commit hash. `HEAD` points to the current branch. Branches live in `.git/refs/heads/`. Tags live in `.git/refs/tags/`.',
      },
    ],
  },
  {
    id: 47,
    title: 'Gitflow Workflow',
    description: 'Implement a structured branching model.',
    language: 'git',
    category: 'concept',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Gitflow uses five branches: **main** (production), **develop** (integration), **feature/**, **release/**, and **hotfix/**. It suits scheduled releases.',
      },
    ],
  },
  {
    id: 48,
    title: 'Trunk-Based Development',
    description: 'Ship fast with short-lived branches.',
    language: 'git',
    category: 'concept',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Trunk-based development means everyone commits to `main` frequently. Branches live at most a few days. Feature flags gate incomplete features.',
      },
    ],
  },
  {
    id: 49,
    title: 'Git Performance & Optimization',
    description: 'Keep your repo fast as it grows.',
    language: 'git',
    category: 'challenge',
    xpReward: 110,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Run `git gc` to clean up unreachable objects. Use `git prune` to remove old objects. Enable `git config core.fsmonitor true` for large repos.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'Run garbage collection.',
        expectedCommand: 'git gc',
        hint: 'git gc',
      },
    ],
  },
  {
    id: 50,
    title: 'Git Grandmaster',
    description: 'The ultimate Git mastery challenge.',
    language: 'git',
    category: 'boss',
    xpReward: 500,
    estimatedMinutes: 30,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'You\'ve mastered every aspect of Git—from basics to internals. This final challenge combines everything: branching, rebasing, stashing, hooks, and CI/CD.',
      },
      {
        id: 2,
        type: 'terminal',
        content: 'View the internal hash of the HEAD commit.',
        expectedCommand: 'git rev-parse HEAD',
        hint: 'git rev-parse HEAD',
      },
    ],
  },
];

const pythonLevels: Level[] = [
  {
    id: 1,
    title: 'Python Basics',
    description: 'Variables, data types, and printing.',
    language: 'python',
    category: 'concept',
    xpReward: 50,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Python uses dynamic typing. Variables don\'t need explicit type declarations.\n\n```python\nname = "Alice"\nage = 30\nprint(name, age)\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Create variables and print them.',
        code: 'name = "World"\nprint(f"Hello, {name}!")',
        language: 'python',
      },
    ],
  },
  {
    id: 2,
    title: 'Control Flow',
    description: 'If/else statements and loops.',
    language: 'python',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Python uses indentation for blocks. `if`, `elif`, `else` for conditions; `for` and `while` for loops.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a for loop that prints even numbers from 0 to 10.',
        code: 'for i in range(11):\n    if i % 2 == 0:\n        print(i)',
        language: 'python',
      },
    ],
  },
  {
    id: 3,
    title: 'Functions',
    description: 'Define and call reusable functions.',
    language: 'python',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Use `def` to define functions. Return values with `return`. Default arguments use `=`.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a function that returns the square of a number.',
        code: 'def square(n):\n    return n * n\n\nprint(square(5))',
        language: 'python',
      },
    ],
  },
  {
    id: 4,
    title: 'Lists & List Comprehensions',
    description: 'Work with lists and concise comprehensions.',
    language: 'python',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Lists are ordered and mutable. List comprehensions create lists concisely.\n\n```python\nsquares = [x**2 for x in range(10)]\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Create a list of squares using a list comprehension.',
        code: 'squares = [x**2 for x in range(10)]\nprint(squares)',
        language: 'python',
      },
    ],
  },
  {
    id: 5,
    title: 'Dictionaries',
    description: 'Key-value data structures.',
    language: 'python',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Dictionaries map keys to values. Use `.get()` for safe access with defaults.\n\n```python\nuser = {"name": "Bob", "age": 25}\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Create a dictionary and access its values.',
        code: 'user = {"name": "Bob", "age": 25}\nprint(user.get("name", "Unknown"))',
        language: 'python',
      },
    ],
  },
  {
    id: 6,
    title: 'File I/O',
    description: 'Read and write files safely.',
    language: 'python',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Use `with open(...)` for safe file handling. It automatically closes the file.\n\n```python\nwith open("data.txt", "w") as f:\n    f.write("hello")\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write "Hello" to a file, then read it back.',
        code: 'with open("test.txt", "w") as f:\n    f.write("Hello, World!")\n\nwith open("test.txt", "r") as f:\n    print(f.read())',
        language: 'python',
      },
    ],
  },
  {
    id: 7,
    title: 'Error Handling',
    description: 'Use try/except to handle exceptions.',
    language: 'python',
    category: 'challenge',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Wrap risky code in `try` blocks. Catch specific exceptions and optionally use `finally`.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Handle a ValueError when converting a string to int.',
        code: 'try:\n    num = int("abc")\nexcept ValueError as e:\n    print(f"Invalid number: {e}")',
        language: 'python',
      },
    ],
  },
  {
    id: 8,
    title: 'Object-Oriented Programming',
    description: 'Classes, objects, and methods.',
    language: 'python',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Define classes with `class`. The `__init__` method initializes attributes. Use `self` to reference the instance.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Create a Dog class with a name and speak method.',
        code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Rex")\nprint(dog.speak())',
        language: 'python',
      },
    ],
  },
  {
    id: 9,
    title: 'Decorators & Generators',
    description: 'Advanced Python patterns.',
    language: 'python',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Write a decorator that logs function calls.',
        code: 'def log_calls(func):\n    def wrapper(*args, **kwargs):\n        print(f"Calling {func.__name__}")\n        return func(*args, **kwargs)\n    return wrapper\n\n@log_calls\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))',
        language: 'python',
      },
    ],
  },
  {
    id: 10,
    title: 'Python Boss',
    description: 'Master Python fundamentals.',
    language: 'python',
    category: 'boss',
    xpReward: 200,
    estimatedMinutes: 15,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Combine OOP, error handling, and file I/O to build a simple data processor.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a class that reads a CSV file and computes the average of a column.',
        code: 'import csv\n\nclass DataProcessor:\n    def __init__(self, path):\n        self.path = path\n\n    def average(self, col):\n        with open(self.path) as f:\n            reader = csv.DictReader(f)\n            values = [float(row[col]) for row in reader]\n        return sum(values) / len(values) if values else 0',
        language: 'python',
      },
    ],
  },
];

const cLevels: Level[] = [
  {
    id: 1,
    title: 'C Basics',
    description: 'Your first C program.',
    language: 'c',
    category: 'concept',
    xpReward: 50,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'C programs start in `main()`. `#include <stdio.h>` imports I/O functions.\n\n```c\n#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a hello world program.',
        code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 2,
    title: 'Variables & Types',
    description: 'int, float, char, and type sizes.',
    language: 'c',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'C is statically typed. Common types: `int`, `float`, `double`, `char`. Use `sizeof()` to check sizes.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Print the size of each basic type.',
        code: '#include <stdio.h>\n\nint main() {\n    printf("int: %zu\\n", sizeof(int));\n    printf("float: %zu\\n", sizeof(float));\n    printf("double: %zu\\n", sizeof(double));\n    printf("char: %zu\\n", sizeof(char));\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 3,
    title: 'Control Flow',
    description: 'if/else, switch, and loops.',
    language: 'c',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Write a switch statement for day of the week.',
        code: '#include <stdio.h>\n\nint main() {\n    int day = 3;\n    switch (day) {\n        case 1: printf("Monday\\n"); break;\n        case 2: printf("Tuesday\\n"); break;\n        case 3: printf("Wednesday\\n"); break;\n        default: printf("Other day\\n");\n    }\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 4,
    title: 'Functions & Pointers',
    description: 'Pass data by value and by reference.',
    language: 'c',
    category: 'challenge',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Pointers store memory addresses. Use `*` to dereference and `&` to get addresses.\n\n```c\nvoid swap(int *a, int *b) {\n    int tmp = *a; *a = *b; *b = tmp;\n}\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a swap function using pointers.',
        code: '#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\n\nint main() {\n    int x = 1, y = 2;\n    swap(&x, &y);\n    printf("x=%d y=%d\\n", x, y);\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 5,
    title: 'Arrays',
    description: 'Fixed-size collections of the same type.',
    language: 'c',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Find the maximum value in an array.',
        code: '#include <stdio.h>\n\nint main() {\n    int nums[] = {3, 7, 2, 9, 4};\n    int max = nums[0];\n    for (int i = 1; i < 5; i++)\n        if (nums[i] > max) max = nums[i];\n    printf("Max: %d\\n", max);\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 6,
    title: 'Strings',
    description: 'Character arrays and string functions.',
    language: 'c',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'C strings are null-terminated char arrays. Use `strlen`, `strcpy`, `strcmp` from `<string.h>`.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Reverse a string in place.',
        code: '#include <stdio.h>\n#include <string.h>\n\nvoid reverse(char *s) {\n    int len = strlen(s);\n    for (int i = 0; i < len / 2; i++) {\n        char tmp = s[i];\n        s[i] = s[len - 1 - i];\n        s[len - 1 - i] = tmp;\n    }\n}\n\nint main() {\n    char str[] = "hello";\n    reverse(str);\n    printf("%s\\n", str);\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 7,
    title: 'Dynamic Memory',
    description: 'malloc, calloc, and free.',
    language: 'c',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`malloc` allocates heap memory. Always `free` when done. Use `calloc` to zero-initialize.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Dynamically allocate an array, populate it, then free it.',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 5;\n    int *arr = malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) arr[i] = i * i;\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    free(arr);\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 8,
    title: 'Structs',
    description: 'Custom data types with fields.',
    language: 'c',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Define a Point struct and print its coordinates.',
        code: '#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Point;\n\nint main() {\n    Point p = {3, 7};\n    printf("(%d, %d)\\n", p.x, p.y);\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 9,
    title: 'File I/O',
    description: 'Read and write files in C.',
    language: 'c',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Use `fopen`, `fprintf`, `fscanf`, `fclose`. Modes: `"r"`, `"w"`, `"a"`.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write to a file and read it back line by line.',
        code: '#include <stdio.h>\n\nint main() {\n    FILE *f = fopen("test.txt", "w");\n    fprintf(f, "Line 1\\nLine 2\\n");\n    fclose(f);\n\n    f = fopen("test.txt", "r");\n    char buf[64];\n    while (fgets(buf, sizeof(buf), f))\n        printf("%s", buf);\n    fclose(f);\n    return 0;\n}',
        language: 'c',
      },
    ],
  },
  {
    id: 10,
    title: 'C Boss',
    description: 'Master C fundamentals.',
    language: 'c',
    category: 'boss',
    xpReward: 200,
    estimatedMinutes: 15,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Combine pointers, structs, and dynamic memory to implement a simple linked list.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Implement a linked list with push and print functions.',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nvoid push(Node **head, int val) {\n    Node *n = malloc(sizeof(Node));\n    n->data = val;\n    n->next = *head;\n    *head = n;\n}\n\nvoid print(Node *head) {\n    for (Node *cur = head; cur; cur = cur->next)\n        printf("%d -> ", cur->data);\n    printf("NULL\\n");\n}',
        language: 'c',
      },
    ],
  },
];

const cppLevels: Level[] = [
  {
    id: 1,
    title: 'C++ Basics',
    description: 'Cout, cin, and basic syntax.',
    language: 'cpp',
    category: 'concept',
    xpReward: 50,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'C++ extends C with classes, references, and the STL. `std::cout` and `std::cin` handle I/O.\n\n```cpp\n#include <iostream>\nstd::cout << "Hello!" << std::endl;\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Read a number and print its square.',
        code: '#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    std::cout << n * n << std::endl;\n    return 0;\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 2,
    title: 'Classes & Objects',
    description: 'Encapsulation and access control.',
    language: 'cpp',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Create a Rectangle class with area and perimeter methods.',
        code: '#include <iostream>\n\nclass Rectangle {\n    double w, h;\npublic:\n    Rectangle(double w, double h) : w(w), h(h) {}\n    double area() const { return w * h; }\n    double perimeter() const { return 2 * (w + h); }\n};\n\nint main() {\n    Rectangle r(3, 4);\n    std::cout << "Area: " << r.area() << std::endl;\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 3,
    title: 'Constructors & Destructors',
    description: 'Object lifecycle management.',
    language: 'cpp',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Constructors initialize objects; destructors clean up. Use **RAII** (Resource Acquisition Is Initialization) to tie resource lifetime to object lifetime.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a class with constructor and destructor that prints messages.',
        code: '#include <iostream>\n\nclass Logger {\npublic:\n    Logger() { std::cout << "Created\\n"; }\n    ~Logger() { std::cout << "Destroyed\\n"; }\n};\n\nint main() {\n    Logger obj;\n    return 0;\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 4,
    title: 'Inheritance',
    description: 'Extend classes with inheritance.',
    language: 'cpp',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Create a base Animal class and a derived Dog class.',
        code: '#include <iostream>\n#include <string>\n\nclass Animal {\npublic:\n    std::string name;\n    Animal(std::string n) : name(n) {}\n    virtual void speak() { std::cout << name << " makes a sound\\n"; }\n};\n\nclass Dog : public Animal {\npublic:\n    Dog(std::string n) : Animal(n) {}\n    void speak() override { std::cout << name << " barks\\n"; }\n};\n\nint main() {\n    Dog d("Rex");\n    d.speak();\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 5,
    title: 'Polymorphism',
    description: 'Virtual functions and dynamic dispatch.',
    language: 'cpp',
    category: 'challenge',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Declare methods as `virtual` to enable runtime polymorphism. Use `override` to verify the base class method exists.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Use a base pointer to call derived class methods.',
        code: '#include <iostream>\n\nclass Shape {\npublic:\n    virtual double area() const = 0;\n    virtual ~Shape() {}\n};\n\nclass Circle : public Shape {\n    double r;\npublic:\n    Circle(double r) : r(r) {}\n    double area() const override { return 3.14159 * r * r; }\n};\n\nint main() {\n    Shape *s = new Circle(5);\n    std::cout << s->area() << std::endl;\n    delete s;\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 6,
    title: 'Templates',
    description: 'Write generic, type-safe code.',
    language: 'cpp',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Write a template function that returns the larger of two values.',
        code: '#include <iostream>\n\ntemplate <typename T>\nT max_of(T a, T b) {\n    return (a > b) ? a : b;\n}\n\nint main() {\n    std::cout << max_of(3, 7) << std::endl;\n    std::cout << max_of(3.5, 2.1) << std::endl;\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 7,
    title: 'STL Containers',
    description: 'vector, map, and set.',
    language: 'cpp',
    category: 'practice',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Use a map to count word frequencies.',
        code: '#include <iostream>\n#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, int> freq;\n    freq["hello"]++;\n    freq["world"]++;\n    freq["hello"]++;\n    for (auto &[k, v] : freq)\n        std::cout << k << ": " << v << std::endl;\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 8,
    title: 'Smart Pointers',
    description: 'Automatic memory management.',
    language: 'cpp',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`std::unique_ptr` owns its object exclusively. `std::shared_ptr` uses reference counting. Prefer smart pointers over raw `new`/`delete`.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Use unique_ptr to manage a dynamically allocated object.',
        code: '#include <iostream>\n#include <memory>\n\nclass Widget {\npublic:\n    void greet() { std::cout << "Hi!\\n"; }\n};\n\nint main() {\n    auto w = std::make_unique<Widget>();\n    w->greet();\n}',
        language: 'cpp',
      },
    ],
  },
  {
    id: 9,
    title: 'Move Semantics',
    description: 'Efficient resource transfers with rvalue references.',
    language: 'cpp',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Move constructors transfer resources instead of copying. Use `std::move` to cast to an rvalue reference. The moved-from object should be left in a valid but unspecified state.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Implement a move constructor for a buffer class.',
        code: '#include <iostream>\n#include <cstring>\n\nclass Buffer {\n    char *data;\n    size_t len;\npublic:\n    Buffer(size_t n) : data(new char[n]), len(n) {}\n    Buffer(Buffer &&o) noexcept : data(o.data), len(o.len) {\n        o.data = nullptr; o.len = 0;\n    }\n    ~Buffer() { delete[] data; }\n};',
        language: 'cpp',
      },
    ],
  },
  {
    id: 10,
    title: 'C++ Boss',
    description: 'Master modern C++.',
    language: 'cpp',
    category: 'boss',
    xpReward: 200,
    estimatedMinutes: 15,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Combine templates, STL, smart pointers, and RAII to build a type-safe, memory-safe data structure.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Implement a generic Stack using templates and std::vector.',
        code: '#include <vector>\n#include <stdexcept>\n\ntemplate <typename T>\nclass Stack {\n    std::vector<T> data;\npublic:\n    void push(T val) { data.push_back(val); }\n    T pop() {\n        if (data.empty()) throw std::runtime_error("empty");\n        T val = data.back();\n        data.pop_back();\n        return val;\n    }\n    bool empty() const { return data.empty(); }\n};',
        language: 'cpp',
      },
    ],
  },
];

const javaLevels: Level[] = [
  {
    id: 1,
    title: 'Java Basics',
    description: 'Classes, main method, and printing.',
    language: 'java',
    category: 'concept',
    xpReward: 50,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Java runs on the JVM. Every program needs a class with a `public static void main` method.\n\n```java\npublic class App {\n    public static void main(String[] args) {\n        System.out.println("Hello!");\n    }\n}\n```',
      },
      {
        id: 2,
        type: 'code',
        content: 'Write a Java program that prints "Hello, Java!".',
        code: 'public class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 2,
    title: 'OOP in Java',
    description: 'Classes, fields, and methods.',
    language: 'java',
    category: 'practice',
    xpReward: 60,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Create a Student class with a name, grade, and a method to check if they passed.',
        code: 'public class Student {\n    String name;\n    double grade;\n\n    Student(String name, double grade) {\n        this.name = name;\n        this.grade = grade;\n    }\n\n    boolean passed() {\n        return grade >= 60;\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 3,
    title: 'Interfaces & Abstract Classes',
    description: 'Define contracts for implementations.',
    language: 'java',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          '`interface` defines method signatures. `abstract class` can have partial implementations. A class can implement multiple interfaces but extend only one class.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Define a Drawable interface and implement it in a Circle class.',
        code: 'interface Drawable {\n    void draw();\n}\n\nclass Circle implements Drawable {\n    double radius;\n    Circle(double r) { this.radius = r; }\n    public void draw() {\n        System.out.println("Drawing circle r=" + radius);\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 4,
    title: 'Collections Framework',
    description: 'ArrayList, HashMap, and iteration.',
    language: 'java',
    category: 'practice',
    xpReward: 70,
    estimatedMinutes: 5,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Use an ArrayList to store and iterate over names.',
        code: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<>();\n        names.add("Alice");\n        names.add("Bob");\n        for (String n : names)\n            System.out.println(n);\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 5,
    title: 'Exception Handling',
    description: 'Try-catch and custom exceptions.',
    language: 'java',
    category: 'challenge',
    xpReward: 80,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Handle a NumberFormatException when parsing a string.',
        code: 'public class Main {\n    public static void main(String[] args) {\n        try {\n            int num = Integer.parseInt("abc");\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid: " + e.getMessage());\n        } finally {\n            System.out.println("Done");\n        }\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 6,
    title: 'Generics',
    description: 'Write type-safe reusable classes.',
    language: 'java',
    category: 'challenge',
    xpReward: 90,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Create a generic Pair class.',
        code: 'public class Pair<T, U> {\n    T first;\n    U second;\n\n    Pair(T first, U second) {\n        this.first = first;\n        this.second = second;\n    }\n\n    public String toString() {\n        return "(" + first + ", " + second + ")";\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 7,
    title: 'Streams & Lambdas',
    description: 'Functional-style data processing.',
    language: 'java',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 8,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Filter and map a list using streams.',
        code: 'import java.util.List;\nimport java.util.stream.Collectors;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> words = List.of("hi", "hello", "hey", "world");\n        List<String> result = words.stream()\n            .filter(w -> w.length() > 3)\n            .map(String::toUpperCase)\n            .collect(Collectors.toList());\n        System.out.println(result);\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 8,
    title: 'Concurrency',
    description: 'Threads and Runnable.',
    language: 'java',
    category: 'challenge',
    xpReward: 100,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Extend `Thread` or implement `Runnable` to run code on a new thread. Use `synchronized` or `java.util.concurrent` for thread safety.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Run two threads that print numbers.',
        code: 'public class Main {\n    public static void main(String[] args) throws InterruptedException {\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < 5; i++) System.out.println("A" + i);\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = 0; i < 5; i++) System.out.println("B" + i);\n        });\n        t1.start(); t2.start();\n        t1.join(); t2.join();\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 9,
    title: 'Design Patterns',
    description: 'Singleton and Observer patterns.',
    language: 'java',
    category: 'challenge',
    xpReward: 110,
    estimatedMinutes: 10,
    steps: [
      {
        id: 1,
        type: 'code',
        content: 'Implement a thread-safe Singleton.',
        code: 'public class Singleton {\n    private static volatile Singleton instance;\n    private Singleton() {}\n\n    public static Singleton getInstance() {\n        if (instance == null) {\n            synchronized (Singleton.class) {\n                if (instance == null)\n                    instance = new Singleton();\n            }\n        }\n        return instance;\n    }\n}',
        language: 'java',
      },
    ],
  },
  {
    id: 10,
    title: 'Java Boss',
    description: 'Master Java fundamentals.',
    language: 'java',
    category: 'boss',
    xpReward: 200,
    estimatedMinutes: 15,
    steps: [
      {
        id: 1,
        type: 'theory',
        content:
          'Combine OOP, generics, streams, and concurrency to build a production-ready component.',
      },
      {
        id: 2,
        type: 'code',
        content: 'Build a generic thread-safe task queue.',
        code: 'import java.util.LinkedList;\nimport java.util.Queue;\n\npublic class TaskQueue<T> {\n    private final Queue<T> queue = new LinkedList<>();\n\n    public synchronized void enqueue(T task) {\n        queue.add(task);\n        notify();\n    }\n\n    public synchronized T dequeue() throws InterruptedException {\n        while (queue.isEmpty()) wait();\n        return queue.poll();\n    }\n}',
        language: 'java',
      },
    ],
  },
];

const levelsByLanguage: Record<Language, Level[]> = {
  git: gitLevels,
  python: pythonLevels,
  c: cLevels,
  cpp: cppLevels,
  java: javaLevels,
};

export const TRACK_INFO: Record<Language, { name: string; icon: string; color: string; description: string }> = {
  git: { name: 'Git & GitHub', icon: '🔀', color: '#2D6A4F', description: 'Version control mastery' },
  python: { name: 'Python', icon: '🐍', color: '#3776AB', description: 'From basics to advanced' },
  c: { name: 'C', icon: '⚙️', color: '#A8B9CC', description: 'Systems programming' },
  cpp: { name: 'C++', icon: '⚡', color: '#00599C', description: 'Performance & OOP' },
  java: { name: 'Java', icon: '☕', color: '#ED8B00', description: 'Enterprise development' },
};

export function getLevelsForLanguage(lang: Language): Level[] {
  return levelsByLanguage[lang] ?? [];
}
