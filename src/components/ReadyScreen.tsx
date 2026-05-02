'use client';

import Image from 'next/image';
import logo from '@/app/assets/wordlent_logo.png';
import styles from './ReadyScreen.module.css';

export default function ReadyScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <Image src={logo} alt="Wordlen't" height={80} />
        <h2 className={styles.heading}>Are You Ready?</h2>
        <p className={styles.subtext}>Timer starts when you press the button</p>
        <button onClick={onStart} className={styles.btn}>Start Timer</button>
      </div>
    </div>
  );
}
