import type { Board, ActivePiece } from './board';
import { createBoard, isValidPosition, placePiece, clearLines, BOARD_WIDTH } from './board';
import type { Tetromino } from './pieces';
import { randomPiece, rotatePiece } from './pieces';

export interface GameState {
  board: Board;
  activePiece: ActivePiece | null;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  paused: boolean;
}

const SCORE_TABLE = [0, 100, 300, 500, 800];

export function createGame(): GameState {
  return {
    board: createBoard(),
    activePiece: null,
    nextPiece: randomPiece(),
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    paused: false,
  };
}

export function spawnPiece(state: GameState): GameState {
  const piece = state.nextPiece;
  const activePiece: ActivePiece = {
    shape: piece.shape,
    color: piece.color,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
    y: 0,
  };

  const nextPiece = randomPiece();

  if (!isValidPosition(state.board, activePiece)) {
    return { ...state, activePiece, nextPiece, gameOver: true };
  }

  return { ...state, activePiece, nextPiece };
}

export function moveLeft(state: GameState): GameState {
  if (!state.activePiece || state.gameOver || state.paused) return state;
  if (isValidPosition(state.board, state.activePiece, -1, 0)) {
    return { ...state, activePiece: { ...state.activePiece, x: state.activePiece.x - 1 } };
  }
  return state;
}

export function moveRight(state: GameState): GameState {
  if (!state.activePiece || state.gameOver || state.paused) return state;
  if (isValidPosition(state.board, state.activePiece, 1, 0)) {
    return { ...state, activePiece: { ...state.activePiece, x: state.activePiece.x + 1 } };
  }
  return state;
}

export function moveDown(state: GameState): GameState {
  if (!state.activePiece || state.gameOver || state.paused) return state;

  if (isValidPosition(state.board, state.activePiece, 0, 1)) {
    return { ...state, activePiece: { ...state.activePiece, y: state.activePiece.y + 1 } };
  }

  // Lock piece
  const newBoard = placePiece(state.board, state.activePiece);
  const { board: clearedBoard, linesCleared } = clearLines(newBoard);
  const newLines = state.lines + linesCleared;
  const newLevel = Math.floor(newLines / 10) + 1;
  const newScore = state.score + SCORE_TABLE[linesCleared] * state.level;

  const newState: GameState = {
    ...state,
    board: clearedBoard,
    activePiece: null,
    score: newScore,
    level: newLevel,
    lines: newLines,
  };

  return spawnPiece(newState);
}

export function hardDrop(state: GameState): GameState {
  if (!state.activePiece || state.gameOver || state.paused) return state;
  let current = state;
  while (current.activePiece && isValidPosition(current.board, current.activePiece, 0, 1)) {
    current = { ...current, activePiece: { ...current.activePiece!, y: current.activePiece!.y + 1 } };
  }
  return moveDown(current);
}

export function rotate(state: GameState): GameState {
  if (!state.activePiece || state.gameOver || state.paused) return state;
  const rotatedShape = rotatePiece(state.activePiece.shape);
  const rotatedPiece = { ...state.activePiece, shape: rotatedShape };

  // Wall kick attempts: 0, -1, +1, -2, +2
  for (const offset of [0, -1, 1, -2, 2]) {
    if (isValidPosition(state.board, rotatedPiece, offset, 0)) {
      return { ...state, activePiece: { ...rotatedPiece, x: rotatedPiece.x + offset } };
    }
  }
  return state;
}

export function getGhostY(state: GameState): number {
  if (!state.activePiece) return 0;
  let ghostY = state.activePiece.y;
  while (isValidPosition(state.board, { ...state.activePiece, y: ghostY + 1 })) {
    ghostY++;
  }
  return ghostY;
}

export function togglePause(state: GameState): GameState {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

export function getDropInterval(level: number): number {
  return Math.max(100, 1000 - (level - 1) * 90);
}
