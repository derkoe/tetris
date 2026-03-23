export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
}

export const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    type: 'I',
    color: '#00f0f0',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  O: {
    type: 'O',
    color: '#f0f000',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    type: 'T',
    color: '#a000f0',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  S: {
    type: 'S',
    color: '#00f000',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  Z: {
    type: 'Z',
    color: '#f00000',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
  J: {
    type: 'J',
    color: '#0000f0',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  L: {
    type: 'L',
    color: '#f0a000',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
};

export const PIECE_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export function randomPiece(): Tetromino {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return { ...TETROMINOES[type], shape: TETROMINOES[type].shape.map(row => [...row]) };
}

export function rotatePiece(shape: number[][]): number[][] {
  const N = shape.length;
  const rotated: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      rotated[x][N - 1 - y] = shape[y][x];
    }
  }
  return rotated;
}
