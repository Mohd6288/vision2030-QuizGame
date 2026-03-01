/* ═══════════════════════════════════════
   SOUND MANAGER
   Web Audio API — no external files needed.
   Generates short tones for game events.
═══════════════════════════════════════ */

class SoundManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  private play(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
    const ctx = this.getCtx();
    if (!ctx) return;

    // Resume if suspended (autoplay policy)
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private playSequence(notes: { freq: number; dur: number; delay: number; type?: OscillatorType }[], volume = 0.15) {
    notes.forEach((n) => {
      setTimeout(() => this.play(n.freq, n.dur, n.type || "sine", volume), n.delay * 1000);
    });
  }

  /** Bright ascending chime — correct answer */
  correct() {
    this.playSequence([
      { freq: 523, dur: 0.1, delay: 0 },       // C5
      { freq: 659, dur: 0.1, delay: 0.08 },     // E5
      { freq: 784, dur: 0.2, delay: 0.16 },     // G5
    ], 0.18);
  }

  /** Low descending buzz — wrong answer */
  incorrect() {
    this.playSequence([
      { freq: 311, dur: 0.15, delay: 0, type: "square" },
      { freq: 233, dur: 0.25, delay: 0.12, type: "square" },
    ], 0.08);
  }

  /** Short click — timer tick (≤5s) */
  tick() {
    this.play(880, 0.05, "sine", 0.06);
  }

  /** Descending warning — time's up */
  timeout() {
    this.playSequence([
      { freq: 440, dur: 0.15, delay: 0, type: "sawtooth" },
      { freq: 330, dur: 0.15, delay: 0.12, type: "sawtooth" },
      { freq: 220, dur: 0.3, delay: 0.24, type: "sawtooth" },
    ], 0.1);
  }

  /** Rising fanfare — level up / good result */
  levelUp() {
    this.playSequence([
      { freq: 523, dur: 0.12, delay: 0 },
      { freq: 659, dur: 0.12, delay: 0.1 },
      { freq: 784, dur: 0.12, delay: 0.2 },
      { freq: 1047, dur: 0.3, delay: 0.3 },
    ], 0.15);
  }

  /** Grand celebration — S/A rank */
  celebration() {
    this.playSequence([
      { freq: 523, dur: 0.1, delay: 0 },
      { freq: 659, dur: 0.1, delay: 0.08 },
      { freq: 784, dur: 0.1, delay: 0.16 },
      { freq: 1047, dur: 0.15, delay: 0.24 },
      { freq: 784, dur: 0.1, delay: 0.4 },
      { freq: 1047, dur: 0.1, delay: 0.48 },
      { freq: 1319, dur: 0.35, delay: 0.56 },
    ], 0.15);
  }

  /** Soft whoosh — slide transition */
  whoosh() {
    const ctx = this.getCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 200;
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }
}

export const sounds = new SoundManager();
