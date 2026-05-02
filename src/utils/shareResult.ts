import type { BoardState } from '@/types/game';

const TILES = {
  correct: { normal: '🟩', colorblind: '🟧' },
  present: { normal: '🟨', colorblind: '🟦' },
  absent:  { normal: '⬛', colorblind: '⬛' },
};

export function buildShareText(
  board: BoardState,
  guesses: number | null,
  colorBlind: boolean
): string {
  const mode = colorBlind ? 'colorblind' : 'normal';
  const score = guesses !== null ? `${guesses}/6` : 'X/6';

  const grid = board
    .filter(row => row.some(t => t.state === 'correct' || t.state === 'present' || t.state === 'absent'))
    .map(row => row.map(t => TILES[t.state as keyof typeof TILES]?.[mode] ?? '⬛').join(''))
    .join('\n');

  return `Wordlen't ${score}\n\n${grid}`;
}
