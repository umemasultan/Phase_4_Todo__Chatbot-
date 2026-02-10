import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateBody, chatMessageSchema } from '../middleware/validation';
import { AuthRequest, ChatMessageInput } from '../types';
import { claudeService } from '../services/claude-service';
import { todoService } from '../services/todo-service';
import { getPrismaClient } from '../db/client';
import { logger } from '../utils/logger';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Send chat message
router.post(
  '/message',
  validateBody(chatMessageSchema),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const { message } = req.body as ChatMessageInput;
      const userId = req.user!.id;
      const prisma = getPrismaClient();

      // Save user message
      await prisma.chatMessage.create({
        data: {
          userId,
          role: 'USER',
          content: message,
        },
      });

      // Process with Claude
      const intent = await claudeService.processUserMessage(userId, message);

      // Execute action if present
      let actionResult = null;
      if (intent.action) {
        try {
          actionResult = await todoService.executeAction(userId, intent.action);
        } catch (error) {
          logger.error('Failed to execute todo action', { error, userId, action: intent.action });
        }
      }

      // Save assistant response
      await prisma.chatMessage.create({
        data: {
          userId,
          role: 'ASSISTANT',
          content: intent.reply,
        },
      });

      // Get updated todos
      const todos = await todoService.getTodos(userId);

      res.json({
        success: true,
        data: {
          reply: intent.reply,
          intent: intent.intent,
          actionResult,
          todos,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get chat history
router.get('/history', async (req: AuthRequest, res: Response, next) => {
  try {
    const { limit = '50' } = req.query;
    const prisma = getPrismaClient();

    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
});

export default router;
