import type { Stats } from '@/utils/stats';
import styles from './StatsDisplay.module.css';

interface StatsDisplayProps {
  stats: Stats;
  highlight?: number | null;
}

export default function StatsDisplay({ stats, highlight }: StatsDisplayProps) {
  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;
  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  return (
    <div className={styles.container}>
      <div className={styles.numbers}>
        {[
          { value: stats.gamesPlayed, label: 'Played' },
          { value: winPct, label: 'Win %' },
          { value: stats.currentStreak, label: 'Streak' },
          { value: stats.bestStreak, label: 'Best' },
        ].map(({ value, label }) => (
          <div key={label} className={styles.stat}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
      <p className={styles.distLabel}>Guess Distribution</p>
      <div className={styles.distribution}>
        {[1, 2, 3, 4, 5, 6].map(n => {
          const count = stats.distribution[String(n)] ?? 0;
          const pct = Math.max((count / maxDist) * 100, count > 0 ? 8 : 5);
          const isHighlight = n === highlight;
          return (
            <div key={n} className={styles.distRow}>
              <span className={styles.distNum}>{n}</span>
              <div
                className={`${styles.distBar}${isHighlight ? ` ${styles.distBarHighlight}` : ''}`}
                style={{ width: `${pct}%` }}
              >
                <span className={styles.distCount}>{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
