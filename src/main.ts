import './style.css';
import { createGame, spawnPiece, moveLeft, moveRight, moveDown, hardDrop, rotate, togglePause, getDropInterval } from './tetris/game';
import type { GameState } from './tetris/game';
import { Renderer } from './tetris/renderer';

let state: GameState = spawnPiece(createGame());
let lastDrop = 0;

const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const nextCanvas = document.getElementById('next-canvas') as HTMLCanvasElement;
const scoreEl = document.getElementById('score') as HTMLElement;
const levelEl = document.getElementById('level') as HTMLElement;
const linesEl = document.getElementById('lines') as HTMLElement;

const renderer = new Renderer(gameCanvas, nextCanvas);

function updateUI(): void {
  scoreEl.textContent = String(state.score);
  levelEl.textContent = String(state.level);
  linesEl.textContent = String(state.lines);
}

function loop(timestamp: number): void {
  const interval = getDropInterval(state.level);

  if (!state.paused && !state.gameOver) {
    if (timestamp - lastDrop >= interval) {
      state = moveDown(state);
      lastDrop = timestamp;
    }
  }

  renderer.render(state);
  updateUI();
  requestAnimationFrame(loop);
}

function restart(): void {
  state = spawnPiece(createGame());
  lastDrop = 0;
}

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      e.preventDefault();
      state = moveLeft(state);
      break;
    case 'ArrowRight':
      e.preventDefault();
      state = moveRight(state);
      break;
    case 'ArrowDown':
      e.preventDefault();
      state = moveDown(state);
      lastDrop = performance.now();
      break;
    case 'ArrowUp':
    case 'KeyX':
      e.preventDefault();
      state = rotate(state);
      break;
    case 'Space':
      e.preventDefault();
      state = hardDrop(state);
      break;
    case 'KeyP':
    case 'Escape':
      e.preventDefault();
      state = togglePause(state);
      break;
    case 'KeyR':
      e.preventDefault();
      restart();
      break;
  }
});

requestAnimationFrame(loop);
