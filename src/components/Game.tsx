import type { BoardState } from '@/types/game';
import Board from './Board';
import Keyboard from './Keyboard';

const ROWS = 6;
const COLS = 5;

const emptyBoard = (): BoardState =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ letter: '', state: 'empty' as const }))
  );

export default function Game() {
  const board = emptyBoard();

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <Board board={board} />
      <Keyboard />
    </div>
  );
}
