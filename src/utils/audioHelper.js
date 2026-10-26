// Audio Engine: Supports Custom Uploaded MP3/WAV/Audio Files & Procedural Synthesizers

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.masterGain = null;
    this.customAudioEl = null;
    this.customAudioUrl = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Load and play custom user audio (Base64 data URI or Object URL)
  setCustomAudio(urlOrBase64) {
    if (this.customAudioEl) {
      this.customAudioEl.pause();
      this.customAudioEl.src = '';
      this.customAudioEl = null;
    }
    this.customAudioUrl = urlOrBase64;
    if (urlOrBase64) {
      this.customAudioEl = new Audio(urlOrBase64);
      this.customAudioEl.loop = true;
      this.customAudioEl.volume = 0.7;
    }
  }

  playCustomAudio() {
    if (this.customAudioEl) {
      this.customAudioEl.play().catch(e => {
        console.warn('Autoplay prevented by browser:', e);
      });
      return true;
    }
    return false;
  }

  pauseCustomAudio() {
    if (this.customAudioEl) {
      this.customAudioEl.pause();
    }
  }

  toggleMusicTrack(customUrl, onStateChange) {
    if (customUrl) {
      if (!this.customAudioEl || this.customAudioUrl !== customUrl) {
        this.setCustomAudio(customUrl);
      }
      if (this.customAudioEl.paused) {
        this.playCustomAudio();
        if (onStateChange) onStateChange(true);
      } else {
        this.pauseCustomAudio();
        if (onStateChange) onStateChange(false);
      }
    } else {
      // Fallback to procedural music box
      this.toggleRomanticBGM(!this.bgmPlaying, onStateChange);
    }
  }

  // Mechanical Dial Click Sound
  playDialClick() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Unlocking Shackle Pop & Harmonious Chime
  playUnlockSuccess() {
    this.init();
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.3);
    });
  }

  // Laser scanner hum for Fingerprint
  playLaserHum(progress) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const freq = 200 + progress * 400;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Procedural Romantic Celestial Music Box Theme
  toggleRomanticBGM(enable, onStateChange) {
    this.init();
    if (!enable) {
      this.bgmPlaying = false;
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      if (onStateChange) onStateChange(false);
      return;
    }

    if (this.bgmPlaying) return;
    this.bgmPlaying = true;
    if (onStateChange) onStateChange(true);

    const melodyChords = [
      [261.63, 329.63, 392.00], // C, E, G
      [220.00, 261.63, 329.63], // A, C, E
      [174.61, 220.00, 261.63], // F, A, C
      [196.00, 246.94, 293.66], // G, B, D
    ];
    let chordIdx = 0;

    const playStep = () => {
      if (!this.bgmPlaying) return;
      const now = this.ctx.currentTime;
      const chord = melodyChords[chordIdx % melodyChords.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.5, now + i * 0.35);
        gain.gain.setValueAtTime(0.09, now + i * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 2.0);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.35);
        osc.stop(now + i * 0.35 + 2.1);
      });
    };

    playStep();
    this.bgmInterval = setInterval(playStep, 2600);
  }
}

export const sound = new SoundEngine();
