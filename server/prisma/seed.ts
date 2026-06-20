import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter } as any);

const gitLevels = [
  { title: 'What is Git?', description: 'Learn what Git is and why it matters', language: 'git', difficulty: 'beginner', order: 1, xpReward: 50, estimatedMinutes: 5 },
  { title: 'Installing Git', description: 'Set up Git on your computer', language: 'git', difficulty: 'beginner', order: 2, xpReward: 50, estimatedMinutes: 5 },
  { title: 'Your First Repository', description: 'Create and initialize a Git repository', language: 'git', difficulty: 'beginner', order: 3, xpReward: 50, estimatedMinutes: 10 },
  { title: 'git add', description: 'Stage changes for commit', language: 'git', difficulty: 'beginner', order: 4, xpReward: 50, estimatedMinutes: 10 },
  { title: 'git commit', description: 'Save your changes with a message', language: 'git', difficulty: 'beginner', order: 5, xpReward: 50, estimatedMinutes: 10 },
  { title: 'git status', description: 'Check what has been modified', language: 'git', difficulty: 'beginner', order: 6, xpReward: 50, estimatedMinutes: 5 },
  { title: 'git log', description: 'View commit history', language: 'git', difficulty: 'beginner', order: 7, xpReward: 50, estimatedMinutes: 5 },
  { title: 'git diff', description: 'See what changed between commits', language: 'git', difficulty: 'beginner', order: 8, xpReward: 50, estimatedMinutes: 10 },
  { title: 'Branches Basics', description: 'Create and switch between branches', language: 'git', difficulty: 'intermediate', order: 9, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Merging', description: 'Combine branches together', language: 'git', difficulty: 'intermediate', order: 10, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Merge Conflicts', description: 'Resolve conflicts when merging', language: 'git', difficulty: 'intermediate', order: 11, xpReward: 100, estimatedMinutes: 20 },
  { title: 'git stash', description: 'Temporarily save changes', language: 'git', difficulty: 'intermediate', order: 12, xpReward: 75, estimatedMinutes: 10 },
  { title: 'git reset', description: 'Undo changes with reset', language: 'git', difficulty: 'intermediate', order: 13, xpReward: 100, estimatedMinutes: 15 },
  { title: 'Remote Repositories', description: 'Connect to GitHub', language: 'git', difficulty: 'intermediate', order: 14, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Push & Pull', description: 'Send and receive changes', language: 'git', difficulty: 'intermediate', order: 15, xpReward: 75, estimatedMinutes: 15 },
  { title: 'git clone', description: 'Copy a remote repository', language: 'git', difficulty: 'beginner', order: 16, xpReward: 50, estimatedMinutes: 10 },
  { title: 'git fork', description: 'Create your own copy of a repo', language: 'git', difficulty: 'intermediate', order: 17, xpReward: 75, estimatedMinutes: 10 },
  { title: 'Pull Requests', description: 'Propose changes to a project', language: 'git', difficulty: 'intermediate', order: 18, xpReward: 100, estimatedMinutes: 20 },
  { title: 'git rebase', description: 'Reapply commits on another base', language: 'git', difficulty: 'advanced', order: 19, xpReward: 100, estimatedMinutes: 20 },
  { title: 'git cherry-pick', description: 'Apply specific commits', language: 'git', difficulty: 'advanced', order: 20, xpReward: 100, estimatedMinutes: 15 },
  { title: 'git revert', description: 'Create a new commit that undoes changes', language: 'git', difficulty: 'intermediate', order: 21, xpReward: 75, estimatedMinutes: 10 },
  { title: '.gitignore', description: 'Tell Git which files to ignore', language: 'git', difficulty: 'beginner', order: 22, xpReward: 50, estimatedMinutes: 10 },
  { title: 'git tag', description: 'Mark important commits', language: 'git', difficulty: 'intermediate', order: 23, xpReward: 75, estimatedMinutes: 10 },
  { title: 'git blame', description: 'See who changed what', language: 'git', difficulty: 'intermediate', order: 24, xpReward: 75, estimatedMinutes: 10 },
  { title: 'Git Hooks', description: 'Automate tasks with hooks', language: 'git', difficulty: 'advanced', order: 25, xpReward: 150, estimatedMinutes: 25 },
  { title: 'GitHub Actions', description: 'CI/CD with GitHub Actions', language: 'git', difficulty: 'advanced', order: 26, xpReward: 150, estimatedMinutes: 30 },
  { title: 'Git Flow', description: 'Branching strategy for teams', language: 'git', difficulty: 'advanced', order: 27, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Git Aliases', description: 'Create shortcuts for commands', language: 'git', difficulty: 'beginner', order: 28, xpReward: 50, estimatedMinutes: 5 },
  { title: 'Bisect', description: 'Binary search for bugs', language: 'git', difficulty: 'advanced', order: 29, xpReward: 100, estimatedMinutes: 15 },
  { title: 'Git Config', description: 'Customize Git settings', language: 'git', difficulty: 'beginner', order: 30, xpReward: 50, estimatedMinutes: 5 },
  { title: 'Submodules', description: 'Include other repos in yours', language: 'git', difficulty: 'advanced', order: 31, xpReward: 150, estimatedMinutes: 25 },
  { title: 'Interactive Rebase', description: 'Rewrite commit history cleanly', language: 'git', difficulty: 'advanced', order: 32, xpReward: 150, estimatedMinutes: 25 },
  { title: 'Worktrees', description: 'Multiple working directories', language: 'git', difficulty: 'advanced', order: 33, xpReward: 100, estimatedMinutes: 15 },
  { title: 'Reflog', description: 'Recover lost commits', language: 'git', difficulty: 'advanced', order: 34, xpReward: 100, estimatedMinutes: 15 },
  { title: 'Signing Commits', description: 'Verify commit authenticity', language: 'git', difficulty: 'advanced', order: 35, xpReward: 100, estimatedMinutes: 15 },
  { title: 'Large File Storage', description: 'Handle big files with Git LFS', language: 'git', difficulty: 'advanced', order: 36, xpReward: 100, estimatedMinutes: 15 },
  { title: 'GitHub Pages', description: 'Host websites with GitHub', language: 'git', difficulty: 'intermediate', order: 37, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Code Review Best Practices', description: 'Review code effectively', language: 'git', difficulty: 'intermediate', order: 38, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Git Security', description: 'Keep your repos secure', language: 'git', difficulty: 'advanced', order: 39, xpReward: 100, estimatedMinutes: 15 },
  { title: 'Advanced Workflows', description: 'Master complex Git workflows', language: 'git', difficulty: 'advanced', order: 40, xpReward: 200, estimatedMinutes: 30 },
  { title: 'Python Basics', description: 'Hello World in Python', language: 'python', difficulty: 'beginner', order: 1, xpReward: 50, estimatedMinutes: 10 },
  { title: 'Variables & Types', description: 'Working with Python data types', language: 'python', difficulty: 'beginner', order: 2, xpReward: 50, estimatedMinutes: 15 },
  { title: 'Control Flow', description: 'if/else statements and loops', language: 'python', difficulty: 'beginner', order: 3, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Functions', description: 'Define and call functions', language: 'python', difficulty: 'beginner', order: 4, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Lists & Tuples', description: 'Working with sequences', language: 'python', difficulty: 'beginner', order: 5, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Dictionaries', description: 'Key-value pairs in Python', language: 'python', difficulty: 'beginner', order: 6, xpReward: 75, estimatedMinutes: 15 },
  { title: 'File I/O', description: 'Read and write files', language: 'python', difficulty: 'intermediate', order: 7, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Error Handling', description: 'Try/except blocks', language: 'python', difficulty: 'intermediate', order: 8, xpReward: 100, estimatedMinutes: 15 },
  { title: 'Classes & OOP', description: 'Object-oriented programming', language: 'python', difficulty: 'intermediate', order: 9, xpReward: 100, estimatedMinutes: 25 },
  { title: 'Modules & Packages', description: 'Import and organize code', language: 'python', difficulty: 'intermediate', order: 10, xpReward: 100, estimatedMinutes: 15 },
  { title: 'C Hello World', description: 'Your first C program', language: 'c', difficulty: 'beginner', order: 1, xpReward: 50, estimatedMinutes: 10 },
  { title: 'Variables & Data Types', description: 'int, float, char in C', language: 'c', difficulty: 'beginner', order: 2, xpReward: 50, estimatedMinutes: 15 },
  { title: 'Operators', description: 'Arithmetic and logical operators', language: 'c', difficulty: 'beginner', order: 3, xpReward: 50, estimatedMinutes: 10 },
  { title: 'Control Flow', description: 'if/else, for, while in C', language: 'c', difficulty: 'beginner', order: 4, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Functions', description: 'Defining and calling functions', language: 'c', difficulty: 'beginner', order: 5, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Arrays', description: 'Working with arrays in C', language: 'c', difficulty: 'beginner', order: 6, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Pointers', description: 'Understanding pointers', language: 'c', difficulty: 'intermediate', order: 7, xpReward: 100, estimatedMinutes: 25 },
  { title: 'Strings', description: 'String manipulation in C', language: 'c', difficulty: 'intermediate', order: 8, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Structs', description: 'Custom data types', language: 'c', difficulty: 'intermediate', order: 9, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Dynamic Memory', description: 'malloc, free, and memory management', language: 'c', difficulty: 'advanced', order: 10, xpReward: 150, estimatedMinutes: 25 },
  { title: 'C++ Hello World', description: 'Your first C++ program', language: 'cpp', difficulty: 'beginner', order: 1, xpReward: 50, estimatedMinutes: 10 },
  { title: 'Classes & Objects', description: 'OOP in C++', language: 'cpp', difficulty: 'beginner', order: 2, xpReward: 75, estimatedMinutes: 15 },
  { title: 'Inheritance', description: 'Class hierarchies', language: 'cpp', difficulty: 'intermediate', order: 3, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Polymorphism', description: 'Virtual functions and overrides', language: 'cpp', difficulty: 'intermediate', order: 4, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Templates', description: 'Generic programming', language: 'cpp', difficulty: 'advanced', order: 5, xpReward: 150, estimatedMinutes: 25 },
  { title: 'STL Containers', description: 'vector, map, set', language: 'cpp', difficulty: 'intermediate', order: 6, xpReward: 100, estimatedMinutes: 20 },
  { title: 'STL Algorithms', description: 'sort, find, transform', language: 'cpp', difficulty: 'intermediate', order: 7, xpReward: 100, estimatedMinutes: 20 },
  { title: 'Smart Pointers', description: 'unique_ptr, shared_ptr', language: 'cpp', difficulty: 'advanced', order: 8, xpReward: 150, estimatedMinutes: 25 },
  { title: 'Move Semantics', description: 'Rvalue references and std::move', language: 'cpp', difficulty: 'advanced', order: 9, xpReward: 150, estimatedMinutes: 25 },
  { title: 'Lambda Expressions', description: 'Anonymous functions in C++', language: 'cpp', difficulty: 'intermediate', order: 10, xpReward: 100, estimatedMinutes: 15 },
];

const achievements = [
  { title: 'First Steps', description: 'Complete your first level', icon: '🎯', category: 'levels', requirement: 1, xpReward: 50 },
  { title: 'Getting Started', description: 'Complete 5 levels', icon: '🚀', category: 'levels', requirement: 5, xpReward: 100 },
  { title: 'Level Up', description: 'Complete 10 levels', icon: '⬆️', category: 'levels', requirement: 10, xpReward: 200 },
  { title: 'Dedicated Learner', description: 'Complete 25 levels', icon: '📚', category: 'levels', requirement: 25, xpReward: 500 },
  { title: 'Git Master', description: 'Complete all 40 Git levels', icon: '🏆', category: 'levels', requirement: 40, xpReward: 1000 },
  { title: 'Polyglot', description: 'Complete levels in 3 different languages', icon: '🌍', category: 'levels', requirement: 3, xpReward: 300 },
  { title: 'XP Hunter', description: 'Earn 500 XP', icon: '💎', category: 'xp', requirement: 500, xpReward: 100 },
  { title: 'XP Champion', description: 'Earn 2000 XP', icon: '👑', category: 'xp', requirement: 2000, xpReward: 250 },
  { title: 'XP Legend', description: 'Earn 5000 XP', icon: '⚡', category: 'xp', requirement: 5000, xpReward: 500 },
  { title: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', category: 'streak', requirement: 3, xpReward: 100 },
  { title: 'Unstoppable', description: 'Maintain a 7-day streak', icon: '💪', category: 'streak', requirement: 7, xpReward: 250 },
  { title: 'Dedicated', description: 'Maintain a 30-day streak', icon: '🌟', category: 'streak', requirement: 30, xpReward: 1000 },
  { title: 'Speed Runner', description: 'Complete a level in under 2 minutes', icon: '⏱️', category: 'special', requirement: 1, xpReward: 200 },
  { title: 'Perfect Score', description: 'Get 100% on 10 levels', icon: '💯', category: 'special', requirement: 10, xpReward: 300 },
  { title: 'Explorer', description: 'Try all 5 languages', icon: '🗺️', category: 'special', requirement: 5, xpReward: 500 },
  { title: 'Night Owl', description: 'Study after midnight', icon: '🦉', category: 'special', requirement: 1, xpReward: 50 },
  { title: 'Early Bird', description: 'Study before 7 AM', icon: '🐦', category: 'special', requirement: 1, xpReward: 50 },
  { title: 'Social Butterfly', description: 'Share your progress', icon: '🦋', category: 'special', requirement: 1, xpReward: 100 },
];

async function main() {
  console.log('Seeding database...');

  // Create levels
  for (const level of gitLevels) {
    await prisma.level.upsert({
      where: {
        id: `${level.language}-${level.order}`,
      },
      update: level,
      create: {
        id: `${level.language}-${level.order}`,
        ...level,
      },
    });
  }
  console.log(`Seeded ${gitLevels.length} levels`);

  // Create achievements
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: {
        id: achievement.title.toLowerCase().replace(/\s+/g, '-'),
      },
      update: achievement,
      create: {
        id: achievement.title.toLowerCase().replace(/\s+/g, '-'),
        ...achievement,
      },
    });
  }
  console.log(`Seeded ${achievements.length} achievements`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
