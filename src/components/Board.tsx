import type { BoardState } from '@/types/game';
import Tile from './Tile';

interface BoardProps {
  board: BoardState;
}

export default function Board({ board }: BoardProps) {
  return (
    <div className="flex flex-col gap-1 sm:gap-1.5">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5">
          {row.map((tile, colIndex) => (
            <Tile key={colIndex} letter={tile.letter} state={tile.state} />
          ))}
        </div>
      ))}
    </div>
  );
}
