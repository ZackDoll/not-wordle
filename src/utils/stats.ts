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

const KEY = 'wordle-stats';

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

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT, distribution: { ...DEFAULT.distribution } };
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return { ...DEFAULT, ...parsed, distribution: { ...DEFAULT.distribution, ...parsed.distribution } };
  } catch {
    return { ...DEFAULT, distribution: { ...DEFAULT.distribution } };
  }
}

function saveStats(s: Stats): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function recordResult(won: boolean, guesses: number, timeSecs?: number): Stats {
  const stats = loadStats();
  const today = dateStr();

  if (stats.lastPlayedDate === today) return stats;

  const next: Stats = { ...stats, distribution: { ...stats.distribution } };
  next.gamesPlayed++;
  next.lastPlayedDate = today;

  if (won) {
    next.gamesWon++;
    const key = String(guesses);
    next.distribution[key] = (next.distribution[key] ?? 0) + 1;
    next.currentStreak = stats.lastPlayedDate === dateStr(-1) ? stats.currentStreak + 1 : 1;
    next.bestStreak = Math.max(next.currentStreak, stats.bestStreak);
    if (typeof timeSecs === 'number' && timeSecs > 0) {
      next.totalSolveMs += timeSecs * 1000;
      next.timedSolves++;
    }
  } else {
    next.currentStreak = 0;
  }

  saveStats(next);
  return next;
}
