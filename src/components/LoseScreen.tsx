import styles from './WinScreen.module.css';

interface LoseScreenProps {
  word: string;
  onDismiss: () => void;
}

export default function LoseScreen({ word, onDismiss }: LoseScreenProps) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <h2 className={styles.heading}>better luck next time</h2>
        <p className={styles.wordLost}>{word}</p>
        <p className={styles.subtext}>the word was {word.toLowerCase()}</p>
        <button onClick={onDismiss} className={styles.btn}>see board</button>
      </div>
    </div>
  );
}
