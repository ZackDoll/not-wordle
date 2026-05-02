import type { BoardState } from '@/types/game';

const TILES = {
  correct: { normal: '🟩', colorblind: '🟧' },
  present: { normal: '🟨', colorblind: '🟦' },
  absent:  { normal: '⬛', colorblind: '⬛' },
};

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function buildShareText(
  board: BoardState,
  guesses: number | null,
  colorBlind: boolean,
  elapsedMs?: number
): string {
  const mode = colorBlind ? 'colorblind' : 'normal';
  const score = guesses !== null ? `${guesses}/6` : 'X/6';
  const time = elapsedMs && elapsedMs > 0 ? ` ${formatTime(elapsedMs)}` : '';

  const grid = board
    .filter(row => row.some(t => t.state === 'correct' || t.state === 'present' || t.state === 'absent'))
    .map(row => row.map(t => TILES[t.state as keyof typeof TILES]?.[mode] ?? '⬛').join(''))
    .join('\n');

  return `Wordlen't ${score}${time}\n\n${grid}`;
}
