import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

const completeLevelSchema = z.object({
  levelId: z.string(),
  score: z.number().int().min(0).max(100).default(100),
});

// POST /api/progress/complete
router.post('/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const body = completeLevelSchema.parse(req.body);

    const level = await prisma.level.findUnique({
      where: { id: body.levelId },
    });

    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    const existing = await prisma.userLevel.findUnique({
      where: {
        userId_levelId: {
          userId: req.userId!,
          levelId: body.levelId,
        },
      },
    });

    if (existing?.completed) {
      return res.status(200).json({ message: 'Level already completed', alreadyCompleted: true });
    }

    const userLevel = await prisma.userLevel.upsert({
      where: {
        userId_levelId: {
          userId: req.userId!,
          levelId: body.levelId,
        },
      },
      update: {
        completed: true,
        score: body.score,
        completedAt: new Date(),
      },
      create: {
        userId: req.userId!,
        levelId: body.levelId,
        completed: true,
        score: body.score,
        completedAt: new Date(),
      },
    });

    // Award XP
    const xpGained = level.xpReward;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        xp: { increment: xpGained },
        lastActiveAt: new Date(),
      },
      select: { xp: true, level: true },
    });

    // Check level-up
    const newCalculatedLevel = Math.floor(updatedUser.xp / 500) + 1;
    if (newCalculatedLevel > updatedUser.level) {
      await prisma.user.update({
        where: { id: req.userId },
        data: { level: newCalculatedLevel },
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId: req.userId!,
        type: 'LEVEL_COMPLETED',
        description: `Completed level: ${level.title}`,
        metadata: { levelId: level.id, score: body.score, xpGained },
      },
    });

    // Check achievements
    await checkAndAwardAchievements(req.userId!);

    res.json({
      userLevel,
      xpGained,
      totalXp: updatedUser.xp,
      newLevel: newCalculatedLevel > updatedUser.level ? newCalculatedLevel : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    console.error('Complete level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/progress
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const completedLevels = await prisma.userLevel.findMany({
      where: {
        userId: req.userId,
        completed: true,
      },
      include: {
        level: {
          select: {
            id: true,
            title: true,
            language: true,
            difficulty: true,
            order: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const totalLevels = await prisma.level.count();
    const completedCount = completedLevels.length;

    res.json({
      completedLevels,
      stats: {
        totalLevels,
        completedCount,
        percentage: totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/progress/heatmap
router.get('/heatmap', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        userId: req.userId,
        type: { in: ['LEVEL_COMPLETED', 'DEMO_STARTED'] },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by date
    const heatmap: Record<string, number> = {};
    activities.forEach((a: typeof activities[number]) => {
      const date = a.createdAt.toISOString().split('T')[0];
      heatmap[date] = (heatmap[date] || 0) + 1;
    });

    res.json({ heatmap });
  } catch (error) {
    console.error('Get heatmap error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function checkAndAwardAchievements(userId: string) {
  const completedCount = await prisma.userLevel.count({
    where: { userId, completed: true },
  });

  const totalXp = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });

  const existingAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const earnedIds = new Set(existingAchievements.map((a: { achievementId: string }) => a.achievementId));

  const allAchievements = await prisma.achievement.findMany();

  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue;

    let earned = false;
    switch (achievement.category) {
      case 'levels':
        earned = completedCount >= achievement.requirement;
        break;
      case 'xp':
        earned = (totalXp?.xp || 0) >= achievement.requirement;
        break;
      case 'streak':
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { streak: true } });
        earned = (user?.streak || 0) >= achievement.requirement;
        break;
    }

    if (earned) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });

      await prisma.activity.create({
        data: {
          userId,
          type: 'ACHIEVEMENT_EARNED',
          description: `Earned achievement: ${achievement.title}`,
          metadata: { achievementId: achievement.id },
        },
      });
    }
  }
}

// GET /api/progress/analytics
router.get('/analytics', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const completedLevels = await prisma.userLevel.findMany({
      where: { userId: req.userId, completed: true },
      include: {
        level: {
          select: { language: true, difficulty: true, xpReward: true, order: true, title: true },
        },
      },
      orderBy: { completedAt: 'asc' },
    });

    const activities = await prisma.activity.findMany({
      where: { userId: req.userId },
      select: { type: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { xp: true, level: true, streak: true, createdAt: true },
    });

    // XP over time (cumulative by date)
    const xpByDate: Record<string, number> = {};
    let cumulativeXp = 0;
    for (const ul of completedLevels) {
      const date = ul.completedAt!.toISOString().split('T')[0];
      cumulativeXp += ul.level.xpReward;
      xpByDate[date] = cumulativeXp;
    }

    // Levels per language
    const byLanguage: Record<string, number> = {};
    for (const ul of completedLevels) {
      byLanguage[ul.level.language] = (byLanguage[ul.level.language] || 0) + 1;
    }

    // Difficulty distribution
    const byDifficulty: Record<string, number> = {};
    for (const ul of completedLevels) {
      byDifficulty[ul.level.difficulty] = (byDifficulty[ul.level.difficulty] || 0) + 1;
    }

    // Activity by date (for streak calculation)
    const activityByDate: Record<string, number> = {};
    for (const a of activities) {
      const date = a.createdAt.toISOString().split('T')[0];
      activityByDate[date] = (activityByDate[date] || 0) + 1;
    }

    // Weekly completion trend (last 8 weeks)
    const now = new Date();
    const weeklyTrend: { week: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + now.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const count = completedLevels.filter(ul => {
        const d = ul.completedAt!;
        return d >= weekStart && d < weekEnd;
      }).length;
      weeklyTrend.push({
        week: `W${8 - i}`,
        count,
      });
    }

    res.json({
      xpOverTime: xpByDate,
      byLanguage,
      byDifficulty,
      activityByDate,
      weeklyTrend,
      totals: {
        xp: user?.xp || 0,
        level: user?.level || 1,
        streak: user?.streak || 0,
        completedCount: completedLevels.length,
        joinedAt: user?.createdAt,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
