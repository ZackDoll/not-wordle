import { cn } from '@/utils/cn';

interface WinScreenProps {
  word: string;
  guesses: number;
  onDismiss: () => void;
}

export default function WinScreen({ word, guesses, onDismiss }: WinScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className={cn(
        'flex flex-col items-center gap-4 rounded-2xl p-8',
        'bg-white dark:bg-neutral-900 shadow-xl'
      )}>
        <h2 className="text-3xl font-bold tracking-tight">you got it!</h2>
        <p className="text-5xl font-black tracking-widest text-green-500">{word}</p>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          solved in {guesses} / 6 {guesses === 1 ? 'guess' : 'guesses'}
        </p>
        <button
          onClick={onDismiss}
          className="mt-2 rounded-lg bg-neutral-900 dark:bg-white px-6 py-2 text-sm font-bold text-white dark:text-neutral-900 hover:opacity-80 transition-opacity"
        >
          see board
        </button>
      </div>
    </div>
  );
}
