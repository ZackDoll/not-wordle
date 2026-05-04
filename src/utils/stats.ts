const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type StatsMode = 'daily' | 'quick';

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  distribution: Record<string, number>;
  totalSolveMs: number;
  timedSolves: number;
}

const KEYS: Record<StatsMode, string> = {
  daily: 'wordle-stats-daily',
  quick: 'wordle-stats-quick',
};

const LEGACY_KEY = 'wordle-stats';

const DEFAULT: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
  distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 },
  totalSolveMs: 0,
  timedSolves: 0,
};

function dateStr(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseStats(raw: string | null): Stats {
  if (!raw) return { ...DEFAULT, distribution: { ...DEFAULT.distribution } };
  try {
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return { ...DEFAULT, ...parsed, distribution: { ...DEFAULT.distribution, ...parsed.distribution } };
  } catch {
    return { ...DEFAULT, distribution: { ...DEFAULT.distribution } };
  }
}

export function loadStats(mode: StatsMode = 'daily'): Stats {
  try {
    if (mode === 'daily' && !localStorage.getItem(KEYS.daily)) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) localStorage.setItem(KEYS.daily, legacy);
    }
    return parseStats(localStorage.getItem(KEYS[mode]));
  } catch {
    return { ...DEFAULT, distribution: { ...DEFAULT.distribution } };
  }
}

function saveStats(mode: StatsMode, s: Stats): void {
  localStorage.setItem(KEYS[mode], JSON.stringify(s));
}

function parseServerStats(raw: Record<string, unknown> | null): Stats | null {
  if (!raw) return null;
  return {
    ...DEFAULT,
    ...raw,
    distribution: { ...DEFAULT.distribution, ...((raw.distribution as Record<string, number>) ?? {}) },
  } as Stats;
}

export async function fetchServerStats(token: string): Promise<{ daily: Stats; quick: Stats } | null> {
  try {
    const r = await fetch(`${API}/stats`, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return null;
    const data = await r.json() as { daily: Record<string, unknown> | null; quick: Record<string, unknown> | null };
    return {
      daily: parseServerStats(data.daily) ?? { ...DEFAULT, distribution: { ...DEFAULT.distribution } },
      quick: parseServerStats(data.quick) ?? { ...DEFAULT, distribution: { ...DEFAULT.distribution } },
    };
  } catch {
    return null;
  }
}

export async function pushStats(token: string, mode: StatsMode, stats: Stats): Promise<void> {
  try {
    await fetch(`${API}/stats/${mode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(stats),
    });
  } catch {}
}

export async function syncOnSignIn(token: string): Promise<void> {
  try {
    const r = await fetch(`${API}/stats`, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return;
    const data = await r.json() as { daily: Record<string, unknown> | null; quick: Record<string, unknown> | null };
    for (const mode of ['daily', 'quick'] as StatsMode[]) {
      const server = data[mode];
      const hasServer = server && (server.gamesPlayed as number) > 0;
      if (!hasServer) {
        const local = loadStats(mode);
        if (local.gamesPlayed > 0) await pushStats(token, mode, local);
      }
    }
  } catch {}
}

export function recordResult(mode: StatsMode, won: boolean, guesses: number, timeSecs?: number): Stats {
  const stats = loadStats(mode);
  const today = dateStr();

  if (mode === 'daily' && stats.lastPlayedDate === today) return stats;

  const next: Stats = { ...stats, distribution: { ...stats.distribution } };
  next.gamesPlayed++;
  if (mode === 'daily') next.lastPlayedDate = today;

  if (won) {
    next.gamesWon++;
    next.distribution[String(guesses)] = (next.distribution[String(guesses)] ?? 0) + 1;
    if (mode === 'daily') {
      next.currentStreak = stats.lastPlayedDate === dateStr(-1) ? stats.currentStreak + 1 : 1;
    } else {
      next.currentStreak = stats.currentStreak + 1;
    }
    next.bestStreak = Math.max(next.currentStreak, stats.bestStreak);
    if (typeof timeSecs === 'number' && timeSecs > 0) {
      next.totalSolveMs += timeSecs * 1000;
      next.timedSolves++;
    }
  } else {
    next.currentStreak = 0;
  }

  saveStats(mode, next);
  return next;
}
