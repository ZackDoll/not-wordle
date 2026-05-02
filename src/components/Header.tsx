'use client';

import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import Settings from './Settings';
import StatsModal from './StatsModal';
import styles from './Header.module.css';

function GearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

export default function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const { darkMode, hardMode, colorBlind, setDarkMode, setHardMode, setColorBlind } = useSettings();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <header className={styles.header}>
        {!isHome && (
          <Link to="/" className={styles.backBtn} aria-label="back to home">
            <BackIcon />
          </Link>
        )}
        <span className={styles.title}>Wordlen't</span>
        <div className={styles.rightBtns}>
          <button onClick={() => setStatsOpen(true)} className={styles.iconBtn} aria-label="view statistics">
            <BarChartIcon />
          </button>
          <button onClick={() => setSettingsOpen(true)} className={styles.iconBtn} aria-label="open settings">
            <GearIcon />
          </button>
        </div>
      </header>
      {statsOpen && <StatsModal onDismiss={() => setStatsOpen(false)} />}
      {settingsOpen && (
        <Settings
          darkMode={darkMode}
          hardMode={hardMode}
          colorBlind={colorBlind}
          onDarkMode={setDarkMode}
          onHardMode={setHardMode}
          onColorBlind={setColorBlind}
          onDismiss={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
