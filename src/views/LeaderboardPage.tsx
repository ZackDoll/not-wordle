'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './LeaderboardPage.module.css';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Entry {
  rank: number;
  username: string;
  guesses: number;
}

function pstDate(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const date = pstDate();

  useEffect(() => {
    fetch(`${API}/results/leaderboard/${date}`)
      .then(r => r.json())
      .then(({ leaderboard }) => setEntries(leaderboard ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Today&apos;s Leaderboard</h1>
      <p className={styles.date}>{date}</p>

      {loading ? (
        <p className={styles.empty}>loading...</p>
      ) : entries.length === 0 ? (
        <p className={styles.empty}>No results yet, be the first to play!</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span className={styles.colRank}>#</span>
            <span className={styles.colName}>player</span>
            <span className={styles.colGuesses}>guesses</span>
          </div>
          {entries.map(entry => (
            <div
              key={entry.rank}
              className={`${styles.row}${user?.username === entry.username ? ` ${styles.rowMe}` : ''}`}
            >
              <span className={styles.colRank}>
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
              </span>
              <span className={styles.colName}>{entry.username}</span>
              <span className={styles.colGuesses}>{entry.guesses} / 6</span>
            </div>
          ))}
        </div>
      )}

      {!user && (
        <p className={styles.hint}>Sign in to appear on the leaderboard</p>
      )}
    </main>
  );
}
