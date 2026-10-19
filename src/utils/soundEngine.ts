/**
 * Gentle Web Audio API synthesizer for Pip's Midnight Observatory.
 * Respects sound muted/unmuted state, generates soft music-box / celestial chimes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isSoundEnabled: boolean = false;
  private currentLullabyTimer: number | null = null;
  private isLullabyPlaying: boolean = false;
  private activeNotesTimeouts: number[] = [];

  constructor() {
    // Sound is OFF initially as required
    this.isSoundEnabled = false;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (enabled) {
      this.getContext();
    }
  }

  /**
   * Plays a soft music box chime for UI button clicks
   */
  public playClick(pitch: number = 523.25) { // C5 default
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.98, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // AudioContext might be blocked or unavailable
    }
  }

  /**
   * Magical sparkle chime when a lantern toggles or starlight triggers
   */
  public playSparkle() {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [587.33, 739.99, 880.0, 1108.73, 1318.51]; // D5, F#5, A5, C#6, E6
      freqs.forEach((freq, idx) => {
        const timeout = window.setTimeout(() => {
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }, idx * 60);
        this.activeNotesTimeouts.push(timeout);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Easter egg chime celebration
   */
  public playEasterEggChime() {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((freq, idx) => {
        window.setTimeout(() => {
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        }, idx * 80);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Play celestial bell notes for constellation stars
   */
  public playStarNote(stepIndex: number = 0) {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6
      const freq = pentatonic[stepIndex % pentatonic.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch {
      // Ignore
    }
  }

  /**
   * Play sweet sleepy giggle or yawn tone
   */
  public playSleepyCute() {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(392, ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(329.63, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch {
      // Ignore
    }
  }

  /**
   * Synthesize gentle music box patterns for lullabies
   */
  public playLullabyPattern(trackName: string) {
    this.stopLullaby();
    this.isLullabyPlaying = true;

    // Define peaceful scale notes
    const patterns: Record<string, number[]> = {
      'Sunrise Lullaby': [261.63, 329.63, 392.00, 440.00, 523.25, 392.00], // C4, E4, G4, A4, C5, G4
      'Starry Window': [311.13, 392.00, 466.16, 523.25, 622.25, 466.16], // Eb4, G4, Bb4, C5, Eb5, Bb4
      'Moonlight Forest': [220.00, 261.63, 329.63, 440.00, 493.88, 392.00], // A3, C4, E4, A4, B4, G4
      'Cloud Parade': [293.66, 369.99, 440.00, 587.33, 440.00, 369.99], // D4, F#4, A4, D5, A4, F#4
      'Goodnight World': [196.00, 261.63, 329.63, 392.00, 523.25, 329.63], // G3, C4, E4, G4, C5, E4
    };

    const notes = patterns[trackName] || patterns['Sunrise Lullaby'];
    let step = 0;

    const playNextNote = () => {
      if (!this.isLullabyPlaying) return;

      if (this.isSoundEnabled) {
        try {
          const ctx = this.getContext();
          if (ctx) {
            const freq = notes[step % notes.length];
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Soothing bell / music box profile
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 1.25);
          }
        } catch {
          // Ignore
        }
      }

      step++;
      this.currentLullabyTimer = window.setTimeout(playNextNote, 950);
    };

    playNextNote();
  }

  public stopLullaby() {
    this.isLullabyPlaying = false;
    if (this.currentLullabyTimer !== null) {
      clearTimeout(this.currentLullabyTimer);
      this.currentLullabyTimer = null;
    }
    this.activeNotesTimeouts.forEach(t => clearTimeout(t));
    this.activeNotesTimeouts = [];
  }
}

export const sound = new SoundEngine();
