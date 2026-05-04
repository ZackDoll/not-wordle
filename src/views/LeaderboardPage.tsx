'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ordinal } from '@/utils/ordinal';
import AuthModal from '@/components/AuthModal';
import styles from './LeaderboardPage.module.css';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Entry {
  rank: number;
  username: string;
  guesses: number;
  timeSecs: number | null;
}

function formatTime(secs: number): string {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
}

function pstDate(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday}, ${month} ${ordinal(d)}`;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
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
      <p className={styles.date}>{formatDate(date)}</p>

      {loading ? (
        <p className={styles.empty}>Loading...</p>
      ) : entries.length === 0 ? (
        <p className={styles.empty}>No results yet, be the first to play!</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span className={styles.colRank}>#</span>
            <span className={styles.colName}>Player</span>
            <span className={styles.colGuesses}>Guesses</span>
            <span className={styles.colTime}>Time</span>
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
              <span className={styles.colTime}>{entry.timeSecs != null ? formatTime(entry.timeSecs) : '—'}</span>
            </div>
          ))}
        </div>
      )}

      {!user && (
        <p className={styles.hint}>
          <button className={styles.hintLink} onClick={() => setShowAuth(true)}>Sign in</button>
          {' '}to appear on the leaderboard
        </p>
      )}
      {showAuth && <AuthModal onDismiss={() => setShowAuth(false)} />}
    </main>
  );
}
