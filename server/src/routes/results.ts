import { Router } from 'express';
import { prisma } from '../db/client';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const { userId } = req as AuthRequest;
  const { date, guesses, solved, timeSecs } = req.body as {
    date: string;
    guesses: number;
    solved: boolean;
    timeSecs?: number;
  };

  if (!date || typeof guesses !== 'number' || typeof solved !== 'boolean') {
    res.status(400).json({ error: 'date, guesses, and solved are required' });
    return;
  }

  try {
    const result = await prisma.dailyResult.create({
      data: { userId, date, guesses, solved, timeSecs: typeof timeSecs === 'number' ? timeSecs : null },
    });
    res.status(201).json({ result });
  } catch {
    res.status(409).json({ error: 'Result already submitted for this date' });
  }
});

router.get('/leaderboard/:date', async (req, res) => {
  const { date } = req.params;

  const entries = await prisma.dailyResult.findMany({
    where: { date, solved: true },
    orderBy: [{ guesses: 'asc' }, { timeSecs: 'asc' }],
    take: 50,
    select: {
      guesses: true,
      timeSecs: true,
      user: { select: { username: true } },
    },
  });

  const leaderboard = entries.map((e, i) => ({
    rank: i + 1,
    username: e.user.username,
    guesses: e.guesses,
    timeSecs: e.timeSecs,
  }));

  res.json({ date, leaderboard });
});

export default router;
