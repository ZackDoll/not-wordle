import type { TileState } from '@/types/game';
import styles from './Tile.module.css';

interface TileProps {
  letter: string;
  state: TileState;
  flipping?: boolean;
  flipDelay?: number;
}

export default function Tile({ letter, state, flipping, flipDelay }: TileProps) {
  return (
    <div
      className={`${styles.tile} ${styles[state]}${flipping ? ` ${styles.flipping}` : ''}`}
      style={flipping ? { animationDelay: `${flipDelay ?? 0}ms` } : undefined}
    >
      {letter}
    </div>
  );
}
