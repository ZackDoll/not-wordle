'use client';

import type { BoardState } from '@/types/game';
import Tile from './Tile';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardState;
  shakingRow?: number | null;
  onShakeEnd?: () => void;
  flippingRow?: number | null;
}

const FLIP_STAGGER = 150;

export default function Board({ board, shakingRow, onShakeEnd, flippingRow }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`${styles.row}${rowIndex === shakingRow ? ` ${styles.shake}` : ''}`}
          onAnimationEnd={rowIndex === shakingRow ? onShakeEnd : undefined}
        >
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              letter={tile.letter}
              state={tile.state}
              flipping={rowIndex === flippingRow}
              flipDelay={colIndex * FLIP_STAGGER}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
