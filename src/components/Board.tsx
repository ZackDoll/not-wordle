import type { BoardState } from '@/types/game';
import Tile from './Tile';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardState;
}

export default function Board({ board }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((tile, colIndex) => (
            <Tile key={colIndex} letter={tile.letter} state={tile.state} />
          ))}
        </div>
      ))}
    </div>
  );
}
