import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

const settingsSchema = z.object({
  soundEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  notifications: z.boolean().optional(),
  difficulty: z.enum(['easy', 'normal', 'hard']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
});

// GET /api/settings
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId: req.userId! },
      });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/settings
router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const body = settingsSchema.parse(req.body);

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.userId },
      update: body,
      create: {
        userId: req.userId!,
        ...body,
      },
    });

    res.json({ settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/settings/account
router.delete('/account', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: req.userId },
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
