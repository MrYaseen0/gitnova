import { Router, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/levels
router.get('/', async (req, res: Response) => {
  try {
    const { language } = req.query;

    const where = language ? { language: language as string } : {};

    const levels = await prisma.level.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    // Group by language
    const grouped: Record<string, typeof levels> = {};
    levels.forEach((level: typeof levels[number]) => {
      if (!grouped[level.language]) {
        grouped[level.language] = [];
      }
      grouped[level.language].push(level);
    });

    res.json({ levels, grouped });
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/levels/:id
router.get('/:id', async (req, res: Response) => {
  try {
    const level = await prisma.level.findUnique({
      where: { id: req.params.id },
    });

    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    res.json({ level });
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
