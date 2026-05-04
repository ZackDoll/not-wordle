'use client';

import { useEffect, useState } from 'react';
import { loadStats } from '@/utils/stats';
import type { Stats, StatsMode } from '@/utils/stats';
import StatsDisplay from './StatsDisplay';
import styles from './StatsModal.module.css';
import winStyles from './WinScreen.module.css';

export default function StatsModal({ onDismiss }: { onDismiss: () => void }) {
  const [tab, setTab] = useState<StatsMode>('daily');
  const [daily, setDaily] = useState<Stats | null>(null);
  const [quick, setQuick] = useState<Stats | null>(null);

  useEffect(() => {
    setDaily(loadStats('daily'));
    setQuick(loadStats('quick'));
  }, []);

  const stats = tab === 'daily' ? daily : quick;

  return (
    <div className={winStyles.backdrop} onClick={onDismiss}>
      <div className={winStyles.card} onClick={e => e.stopPropagation()}>
        <h2 className={winStyles.heading}>Statistics</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab}${tab === 'daily' ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setTab('daily')}
          >
            Daily Word
          </button>
          <button
            className={`${styles.tab}${tab === 'quick' ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setTab('quick')}
          >
            Quick Play
          </button>
        </div>
        {stats && <StatsDisplay stats={stats} />}
        <button className={winStyles.btnSecondary} onClick={onDismiss}>Close</button>
      </div>
    </div>
  );
}
