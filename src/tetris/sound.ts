export class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'square',
    gainPeak = 0.15,
    pitchEnd?: number,
  ): void {
    if (this.muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (pitchEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(pitchEnd, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(gainPeak, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private noise(duration: number, gainPeak = 0.1): void {
    if (this.muted) return;
    const ctx = this.getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainPeak, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  }

  move(): void {
    this.tone(220, 0.04, 'square', 0.06);
  }

  rotate(): void {
    this.tone(440, 0.06, 'sine', 0.08, 330);
  }

  softDrop(): void {
    this.tone(180, 0.05, 'square', 0.07, 140);
  }

  hardDrop(): void {
    if (this.muted) return;
    // Two-tone thud
    this.tone(120, 0.08, 'square', 0.15, 60);
    setTimeout(() => this.noise(0.06, 0.08), 30);
  }

  lineClear(lines: number): void {
    if (this.muted) return;
    if (lines === 4) {
      // Tetris — triumphant arpeggio
      this.tetris();
    } else {
      // Ascending tones per line count
      const freqs = [0, 523, 659, 784][lines] ?? 523;
      this.tone(freqs, 0.12, 'sine', 0.18, freqs * 1.5);
      setTimeout(() => this.tone(freqs * 1.5, 0.15, 'sine', 0.12), 80);
    }
  }

  private tetris(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.tone(freq, 0.15, 'sine', 0.2), i * 70);
    });
  }

  levelUp(): void {
    if (this.muted) return;
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.tone(freq, 0.1, 'triangle', 0.15), i * 55);
    });
  }

  gameOver(): void {
    if (this.muted) return;
    const notes = [440, 370, 311, 261];
    notes.forEach((freq, i) => {
      setTimeout(() => this.tone(freq, 0.2, 'sawtooth', 0.15), i * 120);
    });
  }

  lock(): void {
    this.noise(0.04, 0.07);
  }
}

export const sound = new SoundEngine();
