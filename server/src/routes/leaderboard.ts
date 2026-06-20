import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authMiddleware, optionalAuth } from '../middleware/auth';

const router = Router();

// GET /api/leaderboard
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { isDemo: false },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          xp: true,
          level: true,
          streak: true,
        },
        orderBy: [{ xp: 'desc' }, { level: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.user.count({ where: { isDemo: false } }),
    ]);

    const ranked = users.map((user: typeof users[number], index: number) => ({
      ...user,
      rank: skip + index + 1,
    }));

    let currentUserRank: number | null = null;
    if (req.userId) {
      const me = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { xp: true },
      });
      if (me) {
        const rank = await prisma.user.count({
          where: {
            isDemo: false,
            xp: { gt: me.xp },
          },
        });
        currentUserRank = rank + 1;
      }
    }

    res.json({
      leaderboard: ranked,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      currentUserRank,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leaderboard/:username
router.get('/:username', async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params.username as string;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        xp: true,
        level: true,
        streak: true,
        createdAt: true,
        completedLevels: {
          where: { completed: true },
          include: {
            level: {
              select: {
                id: true,
                title: true,
                language: true,
                difficulty: true,
              },
            },
          },
          orderBy: { completedAt: 'desc' },
        },
        achievements: {
          include: {
            achievement: {
              select: {
                id: true,
                title: true,
                description: true,
                icon: true,
                category: true,
              },
            },
          },
          orderBy: { earnedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const rank = await prisma.user.count({
      where: {
        isDemo: false,
        xp: { gt: user.xp },
      },
    });

    const { id: _, ...profile } = user;
    res.json({ profile, rank: rank + 1 });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
