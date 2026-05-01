import styles from './WinScreen.module.css';

interface WinScreenProps {
  word: string;
  guesses: number;
  onDismiss: () => void;
}

export default function WinScreen({ word, guesses, onDismiss }: WinScreenProps) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <h2 className={styles.heading}>you got it!</h2>
        <p className={styles.word}>{word}</p>
        <p className={styles.subtext}>solved in {guesses} / 6 {guesses === 1 ? 'guess' : 'guesses'}</p>
        <button onClick={onDismiss} className={styles.btn}>see board</button>
      </div>
    </div>
  );
}
