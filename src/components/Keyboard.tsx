import { cn } from '@/utils/cn';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

function BackspaceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 sm:h-6 sm:w-6"
    >
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}

function Key({ label }: { label: string }) {
  const isWide = label === 'ENTER' || label === 'BACK';
  return (
    <button
      className={cn(
        'flex items-center justify-center rounded font-bold uppercase',
        'h-12 sm:h-14',
        'bg-neutral-300 dark:bg-neutral-600 text-neutral-900 dark:text-neutral-100',
        isWide ? 'flex-[1.5] text-xs sm:text-sm' : 'flex-1 text-sm sm:text-base'
      )}
    >
      {label === 'BACK' ? <BackspaceIcon /> : label}
    </button>
  );
}

export default function Keyboard() {
  return (
    <div className="flex w-[340px] sm:w-[400px] lg:w-[444px] flex-col gap-1 sm:gap-1.5">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1 sm:gap-1.5">
          {row.map((key) => (
            <Key key={key} label={key} />
          ))}
        </div>
      ))}
    </div>
  );
}
