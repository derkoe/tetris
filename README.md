# Tetris

A web-based Tetris game built with TypeScript and Vite.

## Setup

**Prerequisites:** Node.js 18+

```bash
npm install
```

## Running

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

Output is written to `dist/`. Preview the production build with:

```bash
npm run preview
```

## Controls

| Key | Action |
|-----|--------|
| `←` / `→` | Move left / right |
| `↑` / `X` | Rotate |
| `↓` | Soft drop |
| `Space` | Hard drop |
| `P` / `Esc` | Pause / Resume |
| `R` | Restart |

## Scoring

| Lines cleared | Points |
|---------------|--------|
| 1 | 100 × level |
| 2 | 300 × level |
| 3 | 500 × level |
| 4 (Tetris) | 800 × level |

Speed increases every 10 lines.
