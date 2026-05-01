import Link from 'next/link';
import styles from './StartPage.module.css';

const modes = [
  {
    title: 'Daily Word',
    description: 'One new puzzle every day. Come back tomorrow for a fresh word.',
    btn: 'Play',
    href: '/daily',
    available: true,
  },
  {
    title: 'Quick Play',
    description: 'A random word every game, playable any time. No waiting required.',
    btn: 'Play',
    href: '/play',
    available: false,
  },
  {
    title: 'Custom Word',
    description: 'Pick your own word and send the link to a friend.',
    btn: 'Create',
    href: '/custom',
    available: false,
  },
];

export default function StartPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>wordlen&apos;t</h1>
      <p className={styles.subtitle}>pick a mode</p>
      <div className={styles.cards}>
        {modes.map(mode => (
          <div
            key={mode.title}
            className={`${styles.card}${mode.available ? '' : ` ${styles.cardDisabled}`}`}
          >
            <h2 className={styles.cardTitle}>{mode.title}</h2>
            <p className={styles.cardDesc}>{mode.description}</p>
            {mode.available ? (
              <Link href={mode.href} className={styles.btn}>{mode.btn}</Link>
            ) : (
              <span className={styles.badge}>coming soon</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
