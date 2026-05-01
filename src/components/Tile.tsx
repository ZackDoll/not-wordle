import { cn } from '@/utils/cn';
import type { TileState } from '@/types/game';

interface TileProps {
  letter: string;
  state: TileState;
}

const stateStyles: Record<TileState, string> = {
  empty: 'border-2 border-neutral-300 dark:border-neutral-600',
  filled: 'border-2 border-neutral-500 dark:border-neutral-400',
  correct: 'border-2 border-green-600 bg-green-600 text-white',
  present: 'border-2 border-yellow-500 bg-yellow-500 text-white',
  absent: 'border-2 border-neutral-400 bg-neutral-400 dark:bg-neutral-600 text-white',
};

export default function Tile({ letter, state }: TileProps) {
  return (
    <div
      className={cn(
        'flex h-14 w-14 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem] items-center justify-center text-2xl sm:text-3xl font-bold uppercase',
        stateStyles[state]
      )}
    >
      {letter}
    </div>
  );
}
