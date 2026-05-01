import type { TileState } from '@/types/game';
import styles from './Tile.module.css';

interface TileProps {
  letter: string;
  state: TileState;
}

export default function Tile({ letter, state }: TileProps) {
  return (
    <div className={`${styles.tile} ${styles[state]}`}>
      {letter}
    </div>
  );
}
