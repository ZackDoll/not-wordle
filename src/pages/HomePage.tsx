import Game from '@/components/Game';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.page}>
      <Game />
    </main>
  );
}
