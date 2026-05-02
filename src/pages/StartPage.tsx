import { Link } from 'react-router-dom';
import styles from './StartPage.module.css';

const modes = [
  {
    title: 'Daily Word',
    description: 'One new puzzle every day. Come back tomorrow for a fresh word.',
    btn: 'Play',
    to: '/daily',
    available: true,
  },
  {
    title: 'Quick Play',
    description: 'A random word every game, playable any time. No waiting required.',
    btn: 'Play',
    to: '/play',
    available: true,
  },
  {
    title: 'Custom Word',
    description: 'Pick your own word and send the link to a friend.',
    btn: 'Create',
    to: '/custom',
    available: true,
  },
];

export default function StartPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Wordlen&apos;t</h1>
      <p className={styles.subtitle}>Pick a mode</p>
      <div className={styles.cards}>
        {modes.map(mode => (
          <div
            key={mode.title}
            className={`${styles.card}${mode.available ? '' : ` ${styles.cardDisabled}`}`}
          >
            <h2 className={styles.cardTitle}>{mode.title}</h2>
            <p className={styles.cardDesc}>{mode.description}</p>
            {mode.available ? (
              <Link to={mode.to} className={styles.btn}>{mode.btn}</Link>
            ) : (
              <span className={styles.badge}>coming soon</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
