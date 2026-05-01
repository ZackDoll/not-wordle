import { cn } from '@/utils/cn';
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
  const card = darkMode ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-neutral-900';
  const border = darkMode ? 'border-neutral-800' : 'border-neutral-200';
  const divider = darkMode ? 'divide-neutral-800' : 'divide-neutral-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className={cn('flex flex-col w-80 rounded-2xl shadow-xl', card)}>
        <div className={cn('flex items-center justify-between border-b px-6 py-4', border)}>
          <h2 className="text-base font-bold tracking-tight uppercase">settings</h2>
          <button
            onClick={onDismiss}
            className="opacity-50 hover:opacity-100 transition-opacity"
            aria-label="close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={cn('flex flex-col divide-y px-6', divider)}>
          <Toggle label="Dark Mode" checked={darkMode} onChange={onDarkMode} />
          <Toggle label="Hard Mode" description="Correct letters must be reused" checked={hardMode} onChange={onHardMode} />
          <Toggle label="Color Blind Mode" description="High contrast colors" checked={colorBlind} onChange={onColorBlind} />
        </div>
      </div>
    </div>
  );
}
