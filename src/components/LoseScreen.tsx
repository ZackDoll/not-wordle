'use client';

import { useState } from 'react';
import type { BoardState } from '@/types/game';
import { useSettings } from '@/context/SettingsContext';
import { buildShareText } from '@/utils/shareResult';
import styles from './WinScreen.module.css';

interface LoseScreenProps {
  word: string;
  board: BoardState;
  onDismiss: () => void;
}

export default function LoseScreen({ word, board, onDismiss }: LoseScreenProps) {
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
        <p className={styles.subtext}>the word was {word.toLowerCase()}</p>
        <button onClick={handleShare} className={styles.btn}>{copied ? 'copied!' : 'share'}</button>
        <button onClick={onDismiss} className={styles.btnSecondary}>see board</button>
      </div>
    </div>
  );
}
