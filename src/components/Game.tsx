'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BoardState, TileState } from '@/types/game';
import { useSettings } from '@/context/SettingsContext';
import { ordinal } from '@/utils/ordinal';
import type { Definition } from '@/utils/dictionary';
import { fetchDefinition } from '@/utils/dictionary';
import type { Stats } from '@/utils/stats';
import { recordResult } from '@/utils/stats';
import Board from './Board';
import Keyboard from './Keyboard';
import HowToPlay from './HowToPlay';
import WinScreen from './WinScreen';
import LoseScreen from './LoseScreen';
import styles from './Game.module.css';

const ROWS = 6;
const COLS = 5;
const FLIP_STAGGER = 150;
const FLIP_DURATION = 400;
const TOTAL_FLIP_MS = (COLS - 1) * FLIP_STAGGER + FLIP_DURATION;
const DAILY_STATE_KEY = 'wordle-daily-state';

interface DailyState {
  date: string;
  board: BoardState;
  currentRow: number;
  currentCol: number;
  guessCount: number;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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

interface GameProps {
  initialWord?: string;
  onPlayAgain?: () => void;
}

export default function Game({ initialWord, onPlayAgain }: GameProps = {}) {
  const { hardMode } = useSettings();
  const [target, setTarget] = useState<string[]>([]);
  const [board, setBoard] = useState<BoardState>(emptyBoard());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [flippingRow, setFlippingRow] = useState<number | null>(null);
  const isFlippingRef = useRef(false);
  const constraintsRef = useRef<Constraints>({
    positions: Array(COLS).fill(null),
    letters: new Set<string>(),
  });
  const wordSetRef = useRef<Set<string>>(new Set());
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [gameStats, setGameStats] = useState<Stats | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState<boolean>(() => {
    if (initialWord) return true;
    try {
      const raw = localStorage.getItem(DAILY_STATE_KEY);
      if (!raw) return true;
      const saved = JSON.parse(raw) as { date?: string };
      return saved.date !== todayStr();
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!localStorage.getItem('wordle-seen-intro')) setShowIntro(true);
  }, []);

  function dismissIntro() {
    localStorage.setItem('wordle-seen-intro', '1');
    setShowIntro(false);
  }

  const letterStates = useMemo(() => {
    const rank: Record<TileState, number> = { correct: 2, present: 1, absent: 0, filled: -1, empty: -1 };
    const result: Record<string, TileState> = {};
    for (const row of board) {
      for (const tile of row) {
        if (tile.state === 'empty' || tile.state === 'filled') continue;
        if (result[tile.letter] === undefined || rank[tile.state] > rank[result[tile.letter]]) {
          result[tile.letter] = tile.state;
        }
      }
    }
    return result;
  }, [board]);

  useEffect(() => {
    if (initialWord) {
      setTarget(initialWord.toUpperCase().split(''));
      fetchDefinition(initialWord).then(setDefinition);
      return;
    }
    fetch('/api/word')
      .then(r => r.json())
      .then(({ word }: { word: string }) => {
        setTarget(word.split(''));
        fetchDefinition(word).then(setDefinition);
      });
  }, [initialWord]);

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

  useEffect(() => {
    if (initialWord || target.length === 0) return;
    try {
      const raw = localStorage.getItem(DAILY_STATE_KEY);
      if (!raw) return;
      const saved: DailyState = JSON.parse(raw);
      if (saved.date !== todayStr()) return;
      setBoard(saved.board);
      setCurrentRow(saved.currentRow);
      setCurrentCol(saved.currentCol);
      setGuessCount(saved.guessCount);
      const lastRow = saved.board[saved.currentRow - 1];
      const isWon = !!lastRow && lastRow.every(t => t.state === 'correct');
      const isLost = saved.currentRow >= ROWS && !isWon;
      setWon(isWon);
      setLost(isLost);
      const positions: (string | null)[] = Array(COLS).fill(null);
      const letters = new Set<string>();
      for (const row of saved.board) {
        for (let i = 0; i < COLS; i++) {
          if (row[i].state === 'correct') positions[i] = row[i].letter;
          if (row[i].state === 'present') letters.add(row[i].letter);
        }
      }
      constraintsRef.current = { positions, letters };
    } catch {}
    setReady(true);
  }, [target, initialWord]);

  useEffect(() => {
    if (initialWord || target.length === 0) return;
    if (currentRow === 0 && currentCol === 0) return;
    try {
      const state: DailyState = { date: todayStr(), board, currentRow, currentCol, guessCount };
      localStorage.setItem(DAILY_STATE_KEY, JSON.stringify(state));
    } catch {}
  }, [board, currentRow, currentCol, guessCount, initialWord, target]);

  const handleKey = useCallback(
    (key: string) => {
      if (isFlippingRef.current || won || currentRow >= ROWS) return;

      if (key === 'ENTER') {
        if (currentCol < COLS || target.length === 0) return;
        const guess = board[currentRow].map(t => t.letter);

        if (wordSetRef.current.size > 0 && !wordSetRef.current.has(guess.join(''))) {
          setError('Not in word list');
          setShakingRow(currentRow);
          return;
        }

        if (hardMode) {
          const msg = validateHardMode(guess, constraintsRef.current);
          if (msg) { setError(msg); setShakingRow(currentRow); return; }
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

        const rowJustScored = currentRow;
        const didWin = states.every(s => s === 'correct');
        isFlippingRef.current = true;
        setFlippingRow(rowJustScored);

        setTimeout(() => {
          isFlippingRef.current = false;
          setFlippingRow(null);
          if (didWin) {
            setGuessCount(rowJustScored + 1);
            setWon(true);
            if (!initialWord) setGameStats(recordResult(true, rowJustScored + 1));
          } else if (rowJustScored === ROWS - 1) {
            setLost(true);
            if (!initialWord) setGameStats(recordResult(false, 0));
          }
          setCurrentRow(rowJustScored + 1);
          setCurrentCol(0);
        }, TOTAL_FLIP_MS);
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
    [won, currentRow, currentCol, board, target, hardMode, initialWord]
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
    <div className={styles.game} style={ready ? undefined : { visibility: 'hidden' }}>
      {showIntro && <HowToPlay onDismiss={dismissIntro} />}
      {error && <div className={styles.error}>{error}</div>}
      <Board board={board} shakingRow={shakingRow} onShakeEnd={() => setShakingRow(null)} flippingRow={flippingRow} />
      <Keyboard onKey={handleKey} letterStates={letterStates} />
      {won && (
        <WinScreen
          word={target.join('')}
          guesses={guessCount}
          board={board}
          definition={definition}
          stats={gameStats ?? undefined}
          onDismiss={() => setWon(false)}
          onPlayAgain={onPlayAgain}
        />
      )}
      {lost && (
        <LoseScreen
          word={target.join('')}
          board={board}
          definition={definition}
          stats={gameStats ?? undefined}
          onDismiss={() => setLost(false)}
          onPlayAgain={onPlayAgain}
        />
      )}
    </div>
  );
}
