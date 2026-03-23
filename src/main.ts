import './style.css';
import { createGame, spawnPiece, moveLeft, moveRight, moveDown, hardDrop, rotate, togglePause, getDropInterval } from './tetris/game';
import type { GameState } from './tetris/game';
import { Renderer } from './tetris/renderer';
import { sound } from './tetris/sound';

let state: GameState = spawnPiece(createGame());
let lastDrop = 0;

const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const nextCanvas = document.getElementById('next-canvas') as HTMLCanvasElement;
const scoreEl = document.getElementById('score') as HTMLElement;
const levelEl = document.getElementById('level') as HTMLElement;
const linesEl = document.getElementById('lines') as HTMLElement;
const muteBtn = document.getElementById('mute-btn') as HTMLButtonElement;

const renderer = new Renderer(gameCanvas, nextCanvas);

function updateUI(): void {
  scoreEl.textContent = String(state.score);
  levelEl.textContent = String(state.level);
  linesEl.textContent = String(state.lines);
}

function applyAndObserve(prev: GameState, next: GameState): GameState {
  if (next.gameOver && !prev.gameOver) {
    sound.gameOver();
  } else {
    const linesCleared = next.lines - prev.lines;
    if (linesCleared > 0) {
      sound.lineClear(linesCleared);
      if (next.level > prev.level) {
        setTimeout(() => sound.levelUp(), 300);
      }
    } else if (next.activePiece !== prev.activePiece && next.activePiece?.y === prev.activePiece?.y) {
      // piece locked (activePiece changed but no lines — lock sound)
      sound.lock();
    }
  }
  return next;
}

function loop(timestamp: number): void {
  const interval = getDropInterval(state.level);

  if (!state.paused && !state.gameOver) {
    if (timestamp - lastDrop >= interval) {
      const prev = state;
      state = moveDown(state);
      applyAndObserve(prev, state);
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

muteBtn.addEventListener('click', () => {
  const muted = sound.toggleMute();
  muteBtn.textContent = muted ? '🔇' : '🔊';
  muteBtn.title = muted ? 'Unmute' : 'Mute';
});

document.addEventListener('keydown', (e) => {
  const prev = state;
  switch (e.code) {
    case 'ArrowLeft':
      e.preventDefault();
      state = moveLeft(state);
      if (state.activePiece?.x !== prev.activePiece?.x) sound.move();
      break;
    case 'ArrowRight':
      e.preventDefault();
      state = moveRight(state);
      if (state.activePiece?.x !== prev.activePiece?.x) sound.move();
      break;
    case 'ArrowDown':
      e.preventDefault();
      state = applyAndObserve(prev, moveDown(state));
      lastDrop = performance.now();
      if (!state.gameOver && state.activePiece) sound.softDrop();
      break;
    case 'ArrowUp':
    case 'KeyX':
      e.preventDefault();
      state = rotate(state);
      if (state.activePiece?.shape !== prev.activePiece?.shape) sound.rotate();
      break;
    case 'Space':
      e.preventDefault();
      state = applyAndObserve(prev, hardDrop(state));
      sound.hardDrop();
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
    case 'KeyM':
      e.preventDefault();
      muteBtn.click();
      break;
  }
});

requestAnimationFrame(loop);
