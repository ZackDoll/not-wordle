'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomSetupPage.module.css';

function encode(word: string): string {
  return btoa(word.toUpperCase()).replace(/=/g, '');
}

export default function CustomSetupPage() {
  const [word, setWord] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const wordSetRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch('/valid_words.txt')
      .then(r => r.text())
      .then(text => {
        const words = text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length === 5);
        wordSetRef.current = new Set(words);
      });
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5);
    setWord(val);
    setLink('');
    setError('');
  }

  function handleGenerate() {
    if (word.length !== 5) return;
    if (wordSetRef.current.size > 0 && !wordSetRef.current.has(word)) {
      setError('That word isn\'t in our word list.');
      return;
    }
    setError('');
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
        {error && <p className={styles.error}>{error}</p>}
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
