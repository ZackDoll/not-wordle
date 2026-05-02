'use client';

import { useState } from 'react';
import type { BoardState } from '@/types/game';
import type { Definition } from '@/utils/dictionary';
import { useSettings } from '@/context/SettingsContext';
import { buildShareText } from '@/utils/shareResult';
import WordDefinition from './WordDefinition';
import styles from './WinScreen.module.css';

interface WinScreenProps {
  word: string;
  guesses: number;
  board: BoardState;
  definition: Definition | null;
  onDismiss: () => void;
  onPlayAgain?: () => void;
}

export default function WinScreen({ word, guesses, board, definition, onDismiss, onPlayAgain }: WinScreenProps) {
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
        <h2 className={styles.heading}>you got it!</h2>
        <p className={styles.word}>{word}</p>
        <WordDefinition definition={definition} />
        <p className={styles.subtext}>solved in {guesses} / 6 {guesses === 1 ? 'guess' : 'guesses'}</p>
        {onPlayAgain && <button onClick={onPlayAgain} className={styles.btn}>play again</button>}
        <button onClick={handleShare} className={styles.btn}>{copied ? 'copied!' : 'share'}</button>
        <button onClick={onDismiss} className={styles.btnSecondary}>see board</button>
      </div>
    </div>
  );
}
