// Romantic Melody Synthesizer using Web Audio API
// Generates continuous ambient romantic background music without any external MP3 files!
// 100% royalty-free, offline, works instantly on mobile and desktop.

export const ROMANTIC_PRESETS = [
  {
    id: 'music-box',
    name: 'Caja de Música Romántica',
    desc: 'Campanitas y arpegios celestiales dulces',
    icon: '✨',
    notes: [523.25, 659.25, 783.99, 1046.50, 880.00, 659.25, 698.46, 587.33],
    bpm: 90,
    type: 'sine'
  },
  {
    id: 'piano-love',
    name: 'Piano Acústico de Amor',
    desc: 'Progresión de acordes emotiva y nostálgica',
    icon: '🎹',
    notes: [261.63, 329.63, 392.00, 440.00, 349.23, 440.00, 523.25, 392.00],
    bpm: 80,
    type: 'triangle'
  },
  {
    id: 'sunset-rhodes',
    name: 'Atardecer Cálido Lo-Fi',
    desc: 'Armonía suave, envolvente y relajante',
    icon: '🌅',
    notes: [329.63, 392.00, 493.88, 587.33, 440.00, 523.25, 659.25, 587.33],
    bpm: 75,
    type: 'sine'
  },
  {
    id: 'starlight-waltz',
    name: 'Vals Bajo las Estrellas',
    desc: 'Ritmo suave de ensueño y fantasía',
    icon: '🌌',
    notes: [392.00, 523.25, 659.25, 783.99, 659.25, 523.25, 440.00, 392.00],
    bpm: 100,
    type: 'triangle'
  }
];

class RomanticAudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.intervalId = null;
    this.isPlaying = false;
    this.currentPresetId = 'music-box';
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playPreset(presetId = 'music-box') {
    this.init();
    if (!this.audioCtx) return;
    this.stop();

    const preset = ROMANTIC_PRESETS.find((p) => p.id === presetId) || ROMANTIC_PRESETS[0];
    this.currentPresetId = preset.id;
    this.isPlaying = true;

    let step = 0;
    const intervalMs = (60 / preset.bpm) * 1000;

    const playNote = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const freq = preset.notes[step % preset.notes.length];
      step++;

      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = preset.type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Soft romantic attack and gentle decay
        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.3);
      } catch (e) {
        console.error('Audio playback error:', e);
      }
    };

    playNote();
    this.intervalId = setInterval(playNote, intervalMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const romanticAudio = new RomanticAudioPlayer();
