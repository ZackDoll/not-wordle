'use client';

import { useEffect, useState } from 'react';
import Game from '@/components/Game';
import styles from './HomePage.module.css';

export default function QuickPlayPage() {
  const [word, setWord] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0);

  function fetchWord() {
    setWord(null);
    fetch('/api/random-word', { cache: 'no-store' })
      .then(r => r.json())
      .then(({ word: w }: { word: string }) => {
        setWord(w);
        setGameKey(k => k + 1);
      });
  }

  useEffect(() => { fetchWord(); }, []);

  if (!word) {
    return (
      <main className={styles.page} style={{ justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Game key={gameKey} initialWord={word} onPlayAgain={fetchWord} mode="quick" />
    </main>
  );
}
