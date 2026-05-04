'use client';

import { useParams } from 'react-router-dom';
import Game from '@/components/Game';
import styles from './HomePage.module.css';

function decodeWord(encoded: string): string {
  try {
    const padded = encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    return atob(padded);
  } catch {
    return '';
  }
}

export default function CustomGamePage() {
  const { encoded } = useParams<{ encoded: string }>();
  const word = decodeWord(encoded ?? '');
  const isValid = /^[A-Za-z]{5}$/.test(word);

  if (!isValid) {
    return (
      <main className={styles.page} style={{ justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Invalid or expired link.</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Game initialWord={word.toUpperCase()} mode="custom" />
    </main>
  );
}
