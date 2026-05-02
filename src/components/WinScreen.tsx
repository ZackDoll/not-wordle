'use client';

import { useState } from 'react';
import type { BoardState } from '@/types/game';
import type { Definition } from '@/utils/dictionary';
import type { Stats } from '@/utils/stats';
import { useSettings } from '@/context/SettingsContext';
import { buildShareText } from '@/utils/shareResult';
import StatsDisplay from './StatsDisplay';
import WordDefinition from './WordDefinition';
import styles from './WinScreen.module.css';

interface WinScreenProps {
  word: string;
  guesses: number;
  board: BoardState;
  definition: Definition | null | 'not-found';
  stats?: Stats;
  elapsedMs?: number;
  showLeaderboardSignIn?: boolean;
  onRequestSignIn?: () => void;
  onDismiss: () => void;
  onPlayAgain?: () => void;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function WinScreen({ word, guesses, board, definition, stats, elapsedMs, showLeaderboardSignIn, onRequestSignIn, onDismiss, onPlayAgain }: WinScreenProps) {
  const { colorBlind } = useSettings();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = buildShareText(board, guesses, colorBlind);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <h2 className={styles.heading}>You Got It!</h2>
        <p className={styles.word}>{word}</p>
        <WordDefinition definition={definition} />
        <p className={styles.subtext}>Solved in {guesses} / 6 {guesses === 1 ? 'guess' : 'guesses'}</p>
        {elapsedMs != null && elapsedMs > 0 && (
          <p className={styles.subtext}>Time: {formatTime(elapsedMs)}</p>
        )}
        {stats && <StatsDisplay stats={stats} highlight={guesses} />}
        {onPlayAgain && <button onClick={onPlayAgain} className={styles.btn}>Play Again</button>}
        <button onClick={handleShare} className={styles.btn}>{copied ? 'Copied!' : 'Share'}</button>
        <button onClick={onDismiss} className={styles.btnSecondary}>See Board</button>
        {showLeaderboardSignIn && onRequestSignIn && (
          <div className={styles.leaderboardPrompt}>
            <p className={styles.leaderboardHint}>Sign in to appear on today&apos;s leaderboard</p>
            <button onClick={onRequestSignIn} className={styles.btn}>Sign In</button>
          </div>
        )}
      </div>
    </div>
  );
}
