import type { TileState } from '@/types/game';
import styles from './Keyboard.module.css';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

function BackspaceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}

interface KeyProps {
  label: string;
  state?: TileState;
  onKey: (key: string) => void;
}

function Key({ label, state, onKey }: KeyProps) {
  const isWide = label === 'ENTER' || label === 'BACK';
  const stateClass = state && styles[state] ? ` ${styles[state]}` : '';
  return (
    <button
      onClick={() => onKey(label)}
      className={`${styles.key}${isWide ? ` ${styles.wide}` : ''}${stateClass}`}
    >
      {label === 'BACK' ? <BackspaceIcon /> : label}
    </button>
  );
}

interface KeyboardProps {
  onKey: (key: string) => void;
  letterStates: Record<string, TileState>;
}

export default function Keyboard({ onKey, letterStates }: KeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, i) => (
        <div key={i} className={styles.row}>
          {row.map((key) => (
            <Key key={key} label={key} state={letterStates[key]} onKey={onKey} />
          ))}
        </div>
      ))}
    </div>
  );
}
