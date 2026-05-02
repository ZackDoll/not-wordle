'use client';

import { useEffect, useState } from 'react';
import { loadStats } from '@/utils/stats';
import type { Stats } from '@/utils/stats';
import StatsDisplay from './StatsDisplay';
import styles from './WinScreen.module.css';

export default function StatsModal({ onDismiss }: { onDismiss: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  return (
    <div className={styles.backdrop} onClick={onDismiss}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <h2 className={styles.heading}>Statistics</h2>
        {stats && <StatsDisplay stats={stats} />}
        <button className={styles.btnSecondary} onClick={onDismiss}>Close</button>
      </div>
    </div>
  );
}
