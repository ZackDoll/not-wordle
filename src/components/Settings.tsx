import Toggle from './Toggle';
import styles from './Settings.module.css';

interface SettingsProps {
  darkMode: boolean;
  hardMode: boolean;
  colorBlind: boolean;
  onDarkMode: (val: boolean) => void;
  onHardMode: (val: boolean) => void;
  onColorBlind: (val: boolean) => void;
  onDismiss: () => void;
}

export default function Settings({ darkMode, hardMode, colorBlind, onDarkMode, onHardMode, onColorBlind, onDismiss }: SettingsProps) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>settings</h2>
          <button onClick={onDismiss} className={styles.closeBtn} aria-label="close settings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          <Toggle label="Dark Mode" checked={darkMode} onChange={onDarkMode} />
          <Toggle label="Hard Mode" description="Correct letters must be reused" checked={hardMode} onChange={onHardMode} />
          <Toggle label="Color Blind Mode" description="High contrast colors" checked={colorBlind} onChange={onColorBlind} />
        </div>
      </div>
    </div>
  );
}
