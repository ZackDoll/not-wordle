import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}

export default function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className={styles.row}>
      <div className={styles.labels}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={checked ? `${styles.track} ${styles.trackOn}` : styles.track}
      >
        <span className={checked ? `${styles.knob} ${styles.knobOn}` : styles.knob} />
      </button>
    </div>
  );
}
