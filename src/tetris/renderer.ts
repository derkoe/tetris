import type { Board } from './board';
import { BOARD_WIDTH, BOARD_HEIGHT } from './board';
import type { Tetromino } from './pieces';
import type { GameState } from './game';
import { getGhostY } from './game';

const CELL_SIZE = 32;
const BORDER = 1;

export class Renderer {
  private gameCanvas: HTMLCanvasElement;
  private nextCanvas: HTMLCanvasElement;
  private gameCtx: CanvasRenderingContext2D;
  private nextCtx: CanvasRenderingContext2D;

  constructor(gameCanvas: HTMLCanvasElement, nextCanvas: HTMLCanvasElement) {
    this.gameCanvas = gameCanvas;
    this.nextCanvas = nextCanvas;
    this.gameCtx = gameCanvas.getContext('2d')!;
    this.nextCtx = nextCanvas.getContext('2d')!;

    this.gameCanvas.width = BOARD_WIDTH * CELL_SIZE;
    this.gameCanvas.height = BOARD_HEIGHT * CELL_SIZE;
    this.nextCanvas.width = 6 * CELL_SIZE;
    this.nextCanvas.height = 6 * CELL_SIZE;
  }

  render(state: GameState): void {
    this.drawBoard(state);
    this.drawNextPiece(state.nextPiece);
  }

  private drawBoard(state: GameState): void {
    const ctx = this.gameCtx;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

    // Draw grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // Draw placed cells
    this.drawCells(ctx, state.board);

    // Draw ghost piece
    if (state.activePiece) {
      const ghostY = getGhostY(state);
      this.drawPieceCells(ctx, state.activePiece.shape, state.activePiece.x, ghostY, state.activePiece.color, 0.2);
    }

    // Draw active piece
    if (state.activePiece) {
      this.drawPieceCells(ctx, state.activePiece.shape, state.activePiece.x, state.activePiece.y, state.activePiece.color, 1);
    }

    // Pause overlay
    if (state.paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', this.gameCanvas.width / 2, this.gameCanvas.height / 2);
    }

    // Game over overlay
    if (state.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
      ctx.fillStyle = '#f44';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', this.gameCanvas.width / 2, this.gameCanvas.height / 2 - 20);
      ctx.fillStyle = '#fff';
      ctx.font = '16px monospace';
      ctx.fillText('Press R to restart', this.gameCanvas.width / 2, this.gameCanvas.height / 2 + 20);
    }
  }

  private drawCells(ctx: CanvasRenderingContext2D, board: Board): void {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = board[y][x];
        if (cell) {
          this.drawCell(ctx, x, y, cell, 1);
        }
      }
    }
  }

  private drawPieceCells(
    ctx: CanvasRenderingContext2D,
    shape: number[][],
    pieceX: number,
    pieceY: number,
    color: string,
    alpha: number
  ): void {
    for (let py = 0; py < shape.length; py++) {
      for (let px = 0; px < shape[py].length; px++) {
        if (shape[py][px]) {
          this.drawCell(ctx, pieceX + px, pieceY + py, color, alpha);
        }
      }
    }
  }

  private drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha: number): void {
    const px = x * CELL_SIZE;
    const py = y * CELL_SIZE;
    const s = CELL_SIZE - BORDER;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(px + BORDER, py + BORDER, s, s);

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(px + BORDER, py + BORDER, s, 4);
    ctx.fillRect(px + BORDER, py + BORDER, 4, s);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(px + BORDER, py + s - 3, s, 3);
    ctx.fillRect(px + s - 3, py + BORDER, 3, s);

    ctx.globalAlpha = 1;
  }

  private drawNextPiece(piece: Tetromino): void {
    const ctx = this.nextCtx;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

    const offsetX = Math.floor((6 - piece.shape[0].length) / 2);
    const offsetY = Math.floor((6 - piece.shape.length) / 2);

    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          this.drawCell(ctx, offsetX + px, offsetY + py, piece.color, 1);
        }
      }
    }
  }
}
