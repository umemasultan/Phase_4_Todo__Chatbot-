import { Router, Request, Response } from 'express';
import { testDatabaseConnection } from '../db/client';
import { claudeService } from '../services/claude-service';

const router = Router();

// Liveness probe - is the app running?
router.get('/liveness', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe - is the app ready to serve traffic?
router.get('/readiness', async (_req: Request, res: Response) => {
  const checks = {
    database: false,
    claudeApi: false,
  };

  try {
    // Check database
    checks.database = await testDatabaseConnection();

    // Check Claude API (optional, can be slow)
    if (process.env.FEATURE_HEALTH_CHECK_CLAUDE === 'true') {
      checks.claudeApi = await claudeService.testConnection();
    } else {
      checks.claudeApi = true; // Skip check
    }

    const isReady = checks.database && checks.claudeApi;

    res.status(isReady ? 200 : 503).json({
      status: isReady ? 'ready' : 'not ready',
      checks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      checks,
      timestamp: new Date().toISOString(),
    });
  }
});

// Metrics endpoint
router.get('/metrics', (_req: Request, res: Response) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    uptime: uptime,
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
