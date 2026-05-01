import Toggle from './Toggle';

interface SettingsProps {
  darkMode: boolean;
  hardMode: boolean;
  colorBlind: boolean;
  onDarkMode: (val: boolean) => void;
  onHardMode: (val: boolean) => void;
  onColorBlind: (val: boolean) => void;
  onDismiss: () => void;
}

export default function Settings({ darkMode, hardMode, colorBlind, onDarkMode, onHardMode, onColorBlind, onDismiss }: SettingsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex flex-col w-80 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <h2 className="text-base font-bold tracking-tight uppercase">settings</h2>
          <button
            onClick={onDismiss}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            aria-label="close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800 px-6">
          <Toggle
            label="Dark Mode"
            checked={darkMode}
            onChange={onDarkMode}
          />
          <Toggle
            label="Hard Mode"
            description="Correct letters must be reused"
            checked={hardMode}
            onChange={onHardMode}
          />
          <Toggle
            label="Color Blind Mode"
            description="High contrast colors"
            checked={colorBlind}
            onChange={onColorBlind}
          />
        </div>
      </div>
    </div>
  );
}
