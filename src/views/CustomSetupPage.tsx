'use client';

import { useState } from 'react';
import styles from './CustomSetupPage.module.css';

function encode(word: string): string {
  return btoa(word.toUpperCase()).replace(/=/g, '');
}

export default function CustomSetupPage() {
  const [word, setWord] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5);
    setWord(val);
    setLink('');
  }

  function handleGenerate() {
    if (word.length !== 5) return;
    setLink(`${window.location.origin}/custom/play/${encode(word)}`);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Custom Wordle</h1>
        <p className={styles.subtext}>Enter a 5-letter word. Share the link. Watch your friend suffer.</p>
        <p className={styles.subtext}>Any 5 letters work, it can be a real word, but it doesn&apos;t have to be</p>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="text"
            value={word}
            onChange={handleInput}
            placeholder="CRANE"
            spellCheck={false}
            autoComplete="off"
          />
          <button className={styles.btn} onClick={handleGenerate} disabled={word.length !== 5}>
            Generate Link
          </button>
        </div>
        {link && (
          <div className={styles.row}>
            <input className={styles.linkInput} type="text" readOnly value={link} />
            <button className={styles.btn} onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
