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
  onDismiss: () => void;
  onPlayAgain?: () => void;
}

export default function LoseScreen({ word, board, definition, stats, onDismiss, onPlayAgain }: LoseScreenProps) {
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
        <h2 className={styles.heading}>better luck next time</h2>
        <p className={styles.wordLost}>{word}</p>
        <WordDefinition definition={definition} />
        <p className={styles.subtext}>the word was {word.toLowerCase()}</p>
        {stats && <StatsDisplay stats={stats} />}
        {onPlayAgain && <button onClick={onPlayAgain} className={styles.btn}>play again</button>}
        <button onClick={handleShare} className={styles.btn}>{copied ? 'copied!' : 'share'}</button>
        <button onClick={onDismiss} className={styles.btnSecondary}>see board</button>
      </div>
    </div>
  );
}
