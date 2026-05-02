'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import Settings from './Settings';
import StatsModal from './StatsModal';
import AuthModal from './AuthModal';
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

function TrophyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <path d="M6 3h12v8a6 6 0 0 1-12 0V3z" />
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

function PersonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { darkMode, hardMode, colorBlind, setDarkMode, setHardMode, setColorBlind } = useSettings();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  return (
    <>
      <header className={styles.header}>
        {!isHome && (
          <Link to="/" className={styles.backBtn} aria-label="back to home">
            <BackIcon />
          </Link>
        )}
        <span className={styles.title}>Wordlen&apos;t</span>
        <div className={styles.rightBtns}>
          <Link to="/leaderboard" className={styles.iconBtn} aria-label="leaderboard">
            <TrophyIcon />
          </Link>
          <button onClick={() => setStatsOpen(true)} className={styles.iconBtn} aria-label="view statistics">
            <BarChartIcon />
          </button>
          {user ? (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className={styles.userBtn}
                aria-label="account menu"
              >
                {user.username}
              </button>
              {userMenuOpen && (
                <div className={styles.dropdown}>
                  <span className={styles.dropdownEmail}>{user.email}</span>
                  <button
                    className={styles.dropdownLogout}
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                  >
                    log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setAuthOpen(true)} className={styles.iconBtn} aria-label="sign in">
              <PersonIcon />
            </button>
          )}
          <button onClick={() => setSettingsOpen(true)} className={styles.iconBtn} aria-label="open settings">
            <GearIcon />
          </button>
        </div>
      </header>
      {statsOpen && <StatsModal onDismiss={() => setStatsOpen(false)} />}
      {authOpen && <AuthModal onDismiss={() => setAuthOpen(false)} />}
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
