'use client';

import styles from './HowToPlay.module.css';

const EXAMPLES = [
  {
    word: 'CRANE',
    highlight: 0,
    state: 'correct' as const,
    label: 'C is in the right spot.',
  },
  {
    word: 'SLUMP',
    highlight: 1,
    state: 'present' as const,
    label: 'L is in the word but wrong spot.',
  },
  {
    word: 'VALID',
    highlight: 3,
    state: 'absent' as const,
    label: 'I is not in the word.',
  },
];

interface HowToPlayProps {
  onDismiss: () => void;
}

export default function HowToPlay({ onDismiss }: HowToPlayProps) {
  return (
    <div className={styles.backdrop} onClick={onDismiss}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <h2 className={styles.heading}>How to play</h2>
        <p className={styles.rule}>Guess the word in <strong>6 tries</strong>.</p>
        <ul className={styles.rules}>
          <li>Each guess must be a valid 5-letter word.</li>
          <li>The color of each tile changes after you submit a guess.</li>
        </ul>
        <hr className={styles.divider} />
        <p className={styles.examplesLabel}>Examples</p>
        <div className={styles.examples}>
          {EXAMPLES.map(({ word, highlight, state, label }) => (
            <div key={word} className={styles.example}>
              <div className={styles.tiles}>
                {word.split('').map((letter, i) => (
                  <div
                    key={i}
                    className={`${styles.tile} ${i === highlight ? styles[state] : styles.empty}`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className={styles.exampleLabel}>{label}</p>
            </div>
          ))}
        </div>
        <button className={styles.btn} onClick={onDismiss}>Got it</button>
      </div>
    </div>
  );
}
