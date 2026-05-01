'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BoardState, TileState } from '@/types/game';
import Board from './Board';
import Keyboard from './Keyboard';
import WinScreen from './WinScreen';
import styles from './Game.module.css';

const ROWS = 6;
const COLS = 5;

function scoreGuess(guess: string[], target: string[]): TileState[] {
  const result: TileState[] = Array(COLS).fill('absent');
  const remaining = target.reduce<Record<string, number>>((acc, l) => {
    acc[l] = (acc[l] ?? 0) + 1;
    return acc;
  }, {});

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
      remaining[guess[i]]--;
    }
  }

  for (let i = 0; i < COLS; i++) {
    if (result[i] === 'correct') continue;
    if ((remaining[guess[i]] ?? 0) > 0) {
      result[i] = 'present';
      remaining[guess[i]]--;
    }
  }

  return result;
}

const emptyBoard = (): BoardState =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ letter: '', state: 'empty' as const }))
  );

export default function Game() {
  const [target, setTarget] = useState<string[]>([]);
  const [board, setBoard] = useState<BoardState>(emptyBoard());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [won, setWon] = useState(false);
  const [guessCount, setGuessCount] = useState(0);

  useEffect(() => {
    fetch('/api/word')
      .then(r => r.json())
      .then(({ word }: { word: string }) => setTarget(word.split('')));
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (won || currentRow >= ROWS) return;

      if (key === 'ENTER') {
        if (currentCol < COLS || target.length === 0) return;
        const guess = board[currentRow].map(t => t.letter);
        const states = scoreGuess(guess, target);
        setBoard(prev => {
          const next = prev.map(r => r.map(t => ({ ...t })));
          states.forEach((state, i) => {
            next[currentRow][i] = { letter: guess[i], state };
          });
          return next;
        });
        if (states.every(s => s === 'correct')) {
          setGuessCount(currentRow + 1);
          setWon(true);
        }
        setCurrentRow(r => r + 1);
        setCurrentCol(0);
        return;
      }

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
    [won, currentRow, currentCol, board, target]
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
    <div className={styles.game}>
      <Board board={board} />
      <Keyboard onKey={handleKey} />
      {won && (
        <WinScreen
          word={target.join('')}
          guesses={guessCount}
          onDismiss={() => setWon(false)}
        />
      )}
    </div>
  );
}
