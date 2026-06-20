import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gitnova-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// POST /api/auth/register
router.post('/register', async (req, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { username: body.username },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === body.email ? 'email' : 'username';
      return res.status(409).json({ error: `A user with this ${field} already exists` });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        username: body.username,
        password: hashedPassword,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        xp: true,
        level: true,
        streak: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'ACCOUNT_CREATED',
        description: 'Account created',
      },
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/demo
router.post('/demo', async (req, res: Response) => {
  try {
    const demoUsername = `demo_${Date.now()}`;
    const hashedPassword = await bcrypt.hash('demo-password-' + Date.now(), 12);

    const user = await prisma.user.create({
      data: {
        email: `${demoUsername}@demo.gitnova.local`,
        name: 'Demo User',
        username: demoUsername,
        password: hashedPassword,
        isDemo: true,
        xp: 250,
        level: 3,
        streak: 2,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        xp: true,
        level: true,
        streak: true,
        isDemo: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'DEMO_STARTED',
        description: 'Started demo mode',
      },
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Demo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        role: true,
        xp: true,
        level: true,
        streak: true,
        isDemo: true,
        createdAt: true,
        settings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        xp: true,
        level: true,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    const resetToken = jwt.sign({ userId: user.id, type: 'password-reset' }, JWT_SECRET, { expiresIn: '1h' });

    // In production, send email here with the reset link
    // For now, return the token (frontend can use it)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ message: 'If an account with that email exists, a reset link has been sent.', resetToken });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/reset-password
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

router.post('/reset-password', async (req, res: Response) => {
  try {
    const body = resetPasswordSchema.parse(req.body);

    let decoded: any;
    try {
      decoded = jwt.verify(body.token, JWT_SECRET) as { userId: string; type: string };
    } catch {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (decoded.type !== 'password-reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/avatar — upload avatar (base64)
router.post('/avatar', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { avatar } = req.body;

    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ error: 'Avatar data is required' });
    }

    // Validate it's a base64 data URL
    if (!avatar.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // Check size (max 500KB)
    const base64Data = avatar.split(',')[1];
    const sizeInBytes = Math.ceil(base64Data.length * 3 / 4);
    if (sizeInBytes > 500 * 1024) {
      return res.status(400).json({ error: 'Image too large. Max 500KB.' });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { avatar },
      select: { id: true, avatar: true },
    });

    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
