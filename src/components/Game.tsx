'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [board, setBoard] = useState<BoardState>(emptyBoard());
  const [currentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const handleKey = useCallback(
    (key: string) => {
      if (key === 'ENTER') return;

      if (key === 'BACK') {
        if (currentCol === 0) return;
        const col = currentCol - 1;
        setBoard(prev => {
          const next = prev.map(r => r.map(t => ({ ...t })));
          next[currentRow][col] = { letter: '', state: 'empty' };
          return next;
        });
        setCurrentCol(col);
        return;
      }

      if (currentCol >= COLS) return;
      setBoard(prev => {
        const next = prev.map(r => r.map(t => ({ ...t })));
        next[currentRow][currentCol] = { letter: key, state: 'filled' };
        return next;
      });
      setCurrentCol(c => c + 1);
    },
    [currentRow, currentCol]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Backspace') return handleKey('BACK');
      if (e.key === 'Enter') return handleKey('ENTER');
      if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <Board board={board} />
      <Keyboard onKey={handleKey} />
    </div>
  );
}
