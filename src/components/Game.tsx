'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoardState, TileState } from '@/types/game';
import { useSettings } from '@/context/SettingsContext';
import { ordinal } from '@/utils/ordinal';
import Board from './Board';
import Keyboard from './Keyboard';
import WinScreen from './WinScreen';
import styles from './Game.module.css';

const ROWS = 6;
const COLS = 5;

interface Constraints {
  positions: (string | null)[];
  letters: Set<string>;
}

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

function validateHardMode(guess: string[], constraints: Constraints): string | null {
  for (let i = 0; i < COLS; i++) {
    if (constraints.positions[i] && guess[i] !== constraints.positions[i])
      return `${ordinal(i + 1)} letter must be ${constraints.positions[i]}`;
  }
  for (const letter of Array.from(constraints.letters)) {
    if (!guess.includes(letter))
      return `Guess must contain ${letter}`;
  }
  return null;
}

const emptyBoard = (): BoardState =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ letter: '', state: 'empty' as const }))
  );

export default function Game() {
  const { hardMode } = useSettings();
  const [target, setTarget] = useState<string[]>([]);
  const [board, setBoard] = useState<BoardState>(emptyBoard());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [won, setWon] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const constraintsRef = useRef<Constraints>({
    positions: Array(COLS).fill(null),
    letters: new Set<string>(),
  });
  const wordSetRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/word')
      .then(r => r.json())
      .then(({ word }: { word: string }) => setTarget(word.split('')));
  }, []);

  useEffect(() => {
    fetch('/valid_words.txt')
      .then(r => r.text())
      .then(text => {
        const words = text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length === 5);
        wordSetRef.current = new Set(words);
      });
  }, []);

  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 1500);
    return () => clearTimeout(id);
  }, [error]);

  const handleKey = useCallback(
    (key: string) => {
      if (won || currentRow >= ROWS) return;

      if (key === 'ENTER') {
        if (currentCol < COLS || target.length === 0) return;
        const guess = board[currentRow].map(t => t.letter);

        if (wordSetRef.current.size > 0 && !wordSetRef.current.has(guess.join(''))) {
          setError('Not in word list');
          return;
        }

        if (hardMode) {
          const msg = validateHardMode(guess, constraintsRef.current);
          if (msg) { setError(msg); return; }
        }

        const states = scoreGuess(guess, target);
        setBoard(prev => {
          const next = prev.map(r => r.map(t => ({ ...t })));
          states.forEach((state, i) => {
            next[currentRow][i] = { letter: guess[i], state };
          });
          return next;
        });

        states.forEach((s, i) => {
          if (s === 'correct') constraintsRef.current.positions[i] = guess[i];
          if (s === 'present') constraintsRef.current.letters.add(guess[i]);
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
    [won, currentRow, currentCol, board, target, hardMode]
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
      {error && <div className={styles.error}>{error}</div>}
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
