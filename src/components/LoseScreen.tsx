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

interface LoseScreenProps {
  word: string;
  board: BoardState;
  definition: Definition | null | 'not-found';
  stats?: Stats;
  elapsedMs?: number;
  onDismiss: () => void;
  onPlayAgain?: () => void;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function LoseScreen({ word, board, definition, stats, elapsedMs, onDismiss, onPlayAgain }: LoseScreenProps) {
  const { colorBlind } = useSettings();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = buildShareText(board, null, colorBlind);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Better Luck Next Time</h2>
        <p className={styles.wordLost}>{word}</p>
        <WordDefinition definition={definition} />
        <p className={styles.subtext}>The word was {word.toLowerCase()}</p>
        {elapsedMs != null && elapsedMs > 0 && (
          <p className={styles.subtext}>Time: {formatTime(elapsedMs)}</p>
        )}
        {stats && <StatsDisplay stats={stats} />}
        {onPlayAgain && <button onClick={onPlayAgain} className={styles.btn}>Play Again</button>}
        <button onClick={handleShare} className={styles.btn}>{copied ? 'Copied!' : 'Share'}</button>
        <button onClick={onDismiss} className={styles.btnSecondary}>See Board</button>
      </div>
    </div>
  );
}
