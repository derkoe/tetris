export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type Cell = string | null; // null = empty, string = color
export type Board = Cell[][];

export function createBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

export interface ActivePiece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

export function isValidPosition(board: Board, piece: ActivePiece, offsetX = 0, offsetY = 0): boolean {
  for (let py = 0; py < piece.shape.length; py++) {
    for (let px = 0; px < piece.shape[py].length; px++) {
      if (!piece.shape[py][px]) continue;
      const newX = piece.x + px + offsetX;
      const newY = piece.y + py + offsetY;
      if (newX < 0 || newX >= BOARD_WIDTH) return false;
      if (newY >= BOARD_HEIGHT) return false;
      if (newY >= 0 && board[newY][newX] !== null) return false;
    }
  }
  return true;
}

export function placePiece(board: Board, piece: ActivePiece): Board {
  const newBoard = cloneBoard(board);
  for (let py = 0; py < piece.shape.length; py++) {
    for (let px = 0; px < piece.shape[py].length; px++) {
      if (!piece.shape[py][px]) continue;
      const x = piece.x + px;
      const y = piece.y + py;
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        newBoard[y][x] = piece.color;
      }
    }
  }
  return newBoard;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  const emptyRows: Cell[][] = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(null));
  return {
    board: [...emptyRows, ...newBoard],
    linesCleared,
  };
}
