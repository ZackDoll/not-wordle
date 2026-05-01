export type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface TileData {
  letter: string;
  state: TileState;
}

export type BoardState = TileData[][];
