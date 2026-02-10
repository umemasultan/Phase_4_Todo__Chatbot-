import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getPrismaClient } from '../db/client';
import { generateToken, authenticateToken } from '../middleware/auth';
import { validateBody, registerSchema, loginSchema } from '../middleware/validation';
import { AuthRequest, RegisterInput, LoginInput } from '../types';
import { AppError } from '../middleware/error';
import { logger } from '../utils/logger';

const router = Router();

// Register new user
router.post(
  '/register',
  validateBody(registerSchema),
  async (req: Request, res: Response, next) => {
    try {
      const { email, password } = req.body as RegisterInput;
      const prisma = getPrismaClient();

      // Check if user exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError(400, 'Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      // Generate token
      const token = generateToken(user.id, user.email);

      logger.info('User registered', { userId: user.id, email });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  validateBody(loginSchema),
  async (req: Request, res: Response, next) => {
    try {
      const { email, password } = req.body as LoginInput;
      const prisma = getPrismaClient();

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError(401, 'Invalid email or password');
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new AppError(401, 'Invalid email or password');
      }

      // Generate token
      const token = generateToken(user.id, user.email);

      logger.info('User logged in', { userId: user.id, email });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
