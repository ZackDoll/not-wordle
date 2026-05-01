'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SettingsValue {
  darkMode: boolean;
  hardMode: boolean;
  colorBlind: boolean;
  setDarkMode(v: boolean): void;
  setHardMode(v: boolean): void;
  setColorBlind(v: boolean): void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [hardMode, setHardMode] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('colorblind', colorBlind);
  }, [colorBlind]);

  return (
    <SettingsContext.Provider value={{ darkMode, hardMode, colorBlind, setDarkMode, setHardMode, setColorBlind }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
