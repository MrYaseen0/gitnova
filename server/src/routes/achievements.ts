import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest, authMiddleware, optionalAuth } from '../middleware/auth';

const router = Router();

// GET /api/achievements
router.get('/', async (req, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { requirement: 'asc' }],
    });

    res.json({ achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/achievements/mine
router.get('/mine', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: req.userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    const allAchievements = await prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { requirement: 'asc' }],
    });

    const earnedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    const achievements = allAchievements.map((a: typeof allAchievements[number]) => ({
      ...a,
      earned: earnedIds.has(a.id),
      earnedAt: userAchievements.find((ua: { achievementId: string; earnedAt: Date }) => ua.achievementId === a.id)?.earnedAt || null,
    }));

    res.json({
      achievements,
      stats: {
        total: allAchievements.length,
        earned: userAchievements.length,
        percentage: allAchievements.length > 0
          ? Math.round((userAchievements.length / allAchievements.length) * 100)
          : 0,
      },
    });
  } catch (error) {
    console.error('Get my achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/achievements/report
const reportSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.string().default('medium'),
  steps: z.string().optional(),
});

router.post('/report', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const body = reportSchema.parse(req.body);

    const report = await prisma.report.create({
      data: {
        userId: req.userId || null,
        name: body.name,
        email: body.email,
        type: body.type,
        title: body.title,
        description: body.description,
        priority: body.priority,
        steps: body.steps,
      },
    });

    res.status(201).json({ report, message: 'Report submitted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    console.error('Submit report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
