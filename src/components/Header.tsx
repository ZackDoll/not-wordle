'use client';

import { useState } from 'react';
import Settings from './Settings';

function GearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);

  return (
    <>
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800 py-4 px-6 flex items-center justify-center relative">
        <span className="text-xl font-bold tracking-tight">not wordle</span>
        <button
          onClick={() => setSettingsOpen(true)}
          className="absolute right-6 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          aria-label="open settings"
        >
          <GearIcon />
        </button>
      </header>
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
