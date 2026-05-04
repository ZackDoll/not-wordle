import { Router } from 'express';
import { prisma } from '../db/client';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';

const router = Router();
const MODES = ['daily', 'quick'] as const;
type Mode = typeof MODES[number];

router.get('/', requireAuth, async (req, res) => {
  const { userId } = req as AuthRequest;
  const rows = await prisma.userStats.findMany({ where: { userId } });
  const result: Record<string, object | null> = { daily: null, quick: null };
  for (const mode of MODES) {
    const row = rows.find(r => r.mode === mode);
    if (row) {
      result[mode] = {
        gamesPlayed: row.gamesPlayed,
        gamesWon: row.gamesWon,
        currentStreak: row.currentStreak,
        bestStreak: row.bestStreak,
        lastPlayedDate: row.lastPlayedDate,
        distribution: row.distribution,
        totalSolveMs: row.totalSolveMs,
        timedSolves: row.timedSolves,
      };
    }
  }
  res.json(result);
});

router.put('/:mode', requireAuth, async (req, res) => {
  const { userId } = req as AuthRequest;
  const { mode } = req.params;
  if (!(MODES as readonly string[]).includes(mode)) {
    res.status(400).json({ error: 'Invalid mode' });
    return;
  }
  const body = req.body as {
    gamesPlayed?: number;
    gamesWon?: number;
    currentStreak?: number;
    bestStreak?: number;
    lastPlayedDate?: string | null;
    distribution?: Record<string, number>;
    totalSolveMs?: number;
    timedSolves?: number;
  };
  const data = {
    gamesPlayed: body.gamesPlayed ?? 0,
    gamesWon: body.gamesWon ?? 0,
    currentStreak: body.currentStreak ?? 0,
    bestStreak: body.bestStreak ?? 0,
    lastPlayedDate: body.lastPlayedDate ?? null,
    distribution: body.distribution ?? {},
    totalSolveMs: body.totalSolveMs ?? 0,
    timedSolves: body.timedSolves ?? 0,
  };
  const stats = await prisma.userStats.upsert({
    where: { userId_mode: { userId, mode: mode as Mode } },
    create: { userId, mode, ...data },
    update: data,
  });
  res.json({ stats });
});

export default router;
