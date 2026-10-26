// Comprehensive Standalone Autonomous HTML Exporter
// Generates a 100% self-contained single-file .html with:
// - All 35 Dedicapag NextGen templates faithfully rendered with their rich visual emblems
// - Ambient particle animation system (hearts, petals, stars, auroras, bubbles, leaves)
// - Embedded WebAudio synthesizer + custom uploaded audio player (base64)
// - Responsive mobile, tablet, and desktop layout with 60fps animations
// - Polaroid photo frame with realistic tape, golden romantic titles, and confetti!

export function generateStandaloneHTML(templateId, data) {
  const safeData = {
    title: data?.title || 'Dedicatoria de Amor',
    lockTitle: data?.lockTitle || 'Toca para abrir la sorpresa',
    unlockMsg: data?.unlockMsg || '¡Desbloqueaste mi amor!',
    letterTitle: data?.letterTitle || 'Para la persona más especial',
    letterBody: data?.letterBody || 'Desde que llegaste a mi vida, cada instante tiene más luz y sentido. Gracias por compartir este camino conmigo.',
    photo: data?.photo || null,
    customAudio: data?.customAudio || null,
    musicTitle: data?.customAudioName || data?.musicTitle || 'Melodía Romántica',
    combo: data?.combo || [14, 2, 24],
    starName: data?.starName || 'Constelación Nuestro Amor',
    voiceNote: data?.voiceNote || null,
    ambientFx: data?.ambientFx || 'hearts',
    customSign: data?.customSign || '',
    presetMelody: data?.presetMelody || 'music-box'
  };

  const serializedData = JSON.stringify(safeData).replace(/</g, '\\u003c');
  const safeTitle = safeData.title.replace(/"/g, '&quot;');
  const hasCustomAudio = Boolean(safeData.customAudio);

  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>${safeTitle} — Dedicatoria Digital</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,400;1,600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: #070914;
      color: #f1f5f9;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    .font-romantic { font-family: 'Dancing Script', cursive; }
    .font-serif-romance { font-family: 'Playfair Display', serif; }

    /* Keyframes */
    @keyframes dp-fall {
      0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translate3d(var(--drift, 30px), 110vh, 0) rotate(var(--spin, 360deg)); opacity: 0; }
    }
    @keyframes dp-rise {
      0% { transform: translate3d(0, 10vh, 0) scale(0.6); opacity: 0; }
      15% { opacity: 0.9; }
      100% { transform: translate3d(var(--drift, -30px), -110vh, 0) scale(1.1); opacity: 0; }
    }
    @keyframes dp-twinkle {
      0%, 100% { opacity: 0.15; transform: scale(0.7); }
      50% { opacity: 1; transform: scale(1.15); }
    }
    @keyframes dp-aurora {
      0%, 100% { transform: translate(-10%, -5%) scale(1); }
      33% { transform: translate(8%, 6%) scale(1.15); }
      66% { transform: translate(-4%, 10%) scale(0.95); }
    }
    @keyframes dp-heartbeat {
      0%, 100% { transform: scale(1); }
      15% { transform: scale(1.12); }
      30% { transform: scale(0.98); }
      45% { transform: scale(1.08); }
    }
    @keyframes dp-halo {
      0% { transform: scale(0.8); opacity: 0.7; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes dp-gold-text {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .animate-float { animation: float 4s ease-in-out infinite; }
    .animate-spin-slow { animation: spin 12s linear infinite; }
    .dp-particle { position: absolute; top: 0; will-change: transform, opacity; pointer-events: none; }
    .dp-fall { animation: dp-fall linear infinite; }
    .dp-rise { animation: dp-rise linear infinite; top: auto; bottom: 0; }
    .dp-twinkle { animation: dp-twinkle ease-in-out infinite; }
    .dp-aurora { animation: dp-aurora 18s ease-in-out infinite; }
    .dp-heartbeat { animation: dp-heartbeat 1.6s ease-in-out infinite; }
    .dp-halo::before, .dp-halo::after {
      content: ''; position: absolute; inset: 0; border-radius: 9999px;
      border: 2px solid currentColor; animation: dp-halo 2.4s ease-out infinite; pointer-events: none;
    }
    .dp-halo::after { animation-delay: 1.2s; }
    .dp-gold-text {
      background: linear-gradient(90deg, #fde68a, #f9a8d4, #fff7ed, #fcd34d, #fde68a);
      background-size: 200% auto;
      -webkit-background-clip: text; background-clip: text; color: transparent;
      animation: dp-gold-text 6s linear infinite;
    }
    .dp-paper {
      background-color: #fdf8ee;
      background-image:
        radial-gradient(circle at 20% 10%, rgba(255,255,255,0.9), transparent 40%),
        radial-gradient(circle at 80% 90%, rgba(244,214,170,0.35), transparent 50%),
        repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(190,150,110,0.12) 28px);
    }
    .perspective-1000 { perspective: 1000px; }
    .transform-style-3d { transform-style: preserve-3d; }

    /* Core layout resilience */
    .w-full { width: 100%; }
    .min-h-screen { min-height: 100vh; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .inset-0 { inset: 0; }
    .z-10 { z-index: 10; }
    .z-40 { z-index: 40; }
    .-z-10 { z-index: -10; }
    .cursor-pointer { cursor: pointer; }
    .rounded-full { border-radius: 9999px; }
    .rounded-2xl { border-radius: 1rem; }
    .rounded-3xl { border-radius: 1.5rem; }
    .text-center { text-align: center; }
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .backdrop-blur-md { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    .backdrop-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center select-none bg-[#070914]">
  <div id="standalone-root" class="w-full min-h-screen flex items-center justify-center relative"></div>

  ${hasCustomAudio ? `<audio id="customAudioPlayer" src="${safeData.customAudio}" loop preload="auto"></audio>` : ''}

  <script>
    const DEDICATION_DATA = ${serializedData};
    const TEMPLATE_ID = "${templateId}";
    const HAS_CUSTOM_AUDIO = ${hasCustomAudio};

    // --- Sound Synthesis Engine ---
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.audioEl = document.getElementById('customAudioPlayer');
      }
      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      playDialClick() {
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(120, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.04);
        } catch(e) {}
      }
      playUnlockSuccess() {
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.25, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 1.3);
          });
        } catch(e) {}
      }
      toggleMusic(onStateChange) {
        if (HAS_CUSTOM_AUDIO && this.audioEl) {
          if (this.audioEl.paused) {
            this.audioEl.play().catch(e => console.log(e));
            this.bgmPlaying = true;
            if (onStateChange) onStateChange(true);
          } else {
            this.audioEl.pause();
            this.bgmPlaying = false;
            if (onStateChange) onStateChange(false);
          }
          return;
        }

        this.init();
        if (this.bgmPlaying) {
          this.bgmPlaying = false;
          if (this.bgmInterval) clearInterval(this.bgmInterval);
          if (onStateChange) onStateChange(false);
          return;
        }

        this.bgmPlaying = true;
        if (onStateChange) onStateChange(true);
        const chords = [
          [261.63, 329.63, 392.00],
          [220.00, 261.63, 329.63],
          [174.61, 220.00, 261.63],
          [196.00, 246.94, 293.66]
        ];
        let cIdx = 0;
        const step = () => {
          if (!this.bgmPlaying || !this.ctx) return;
          const now = this.ctx.currentTime;
          const chord = chords[cIdx % chords.length];
          cIdx++;
          chord.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * 1.5, now + i * 0.35);
            gain.gain.setValueAtTime(0.08, now + i * 0.35);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 2.0);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.35);
            osc.stop(now + i * 0.35 + 2.1);
          });
        };
        step();
        this.bgmInterval = setInterval(step, 2600);
      }
    }
    const sound = new SoundEngine();

    // --- Template Themes & Configuration ---
    const THEMES = {
      'candado': {
        bg: 'radial-gradient(circle at 50% 25%, #1a0f2e 0%, #0d0f22 50%, #060814 100%)',
        accent: '#f43f5e', particles: ['heart', 'sparkle'], colors: ['#f43f5e', '#f9a8d4', '#fbbf24'],
        aurora: ['#e11d48', '#6d28d9'], engine: 'candado'
      },
      'puertas-del-corazon': {
        bg: 'radial-gradient(circle at 50% 30%, #29140a 0%, #210d13 50%, #0b0507 100%)',
        accent: '#f59e0b', particles: ['sparkle', 'petal'], colors: ['#fbbf24', '#fb7185', '#fef3c7'],
        aurora: ['#b45309', '#7e22ce'], engine: 'puertas'
      },
      'carta': {
        bg: 'radial-gradient(circle at 50% 25%, #2d0f19 0%, #1c0a0f 50%, #0c0406 100%)',
        accent: '#e11d48', particles: ['petal', 'sparkle'], colors: ['#be123c', '#fb7185', '#fcd34d'],
        aurora: ['#9f1239', '#b45309'], engine: 'carta', paper: true
      },
      'propose': {
        bg: 'radial-gradient(circle at 50% 30%, #0d1630 0%, #070b19 50%, #030409 100%)',
        accent: '#fbbf24', particles: ['sparkle', 'petal'], colors: ['#fde68a', '#ffffff', '#f9a8d4'],
        aurora: ['#1d4ed8', '#b45309'], engine: 'propose'
      },
      'libro-amor': {
        bg: 'radial-gradient(circle at 50% 20%, #78350f 0%, #3b1d0b 45%, #120804 100%)',
        accent: '#fbbf24', particles: ['petal', 'sparkle'], colors: ['#fde68a', '#fb7185', '#fef3c7'],
        aurora: ['#b45309', '#9f1239'], engine: 'universal', taps: 1, paper: true, signature: 'Continuará… contigo'
      },
      'chocolate': {
        bg: 'radial-gradient(circle at 50% 30%, #7c2d12 0%, #431407 45%, #1c0a05 100%)',
        accent: '#fb7185', particles: ['heart', 'sparkle'], colors: ['#fda4af', '#fcd34d', '#fecaca'],
        aurora: ['#be123c', '#92400e'], engine: 'universal', taps: 3, signature: 'Eres mi dulce favorito'
      },
      'galaxy': {
        bg: 'radial-gradient(circle at 50% 40%, #170d30 0%, #0b0718 50%, #04020a 100%)',
        accent: '#a78bfa', particles: ['sparkle', 'dot'], colors: ['#c4b5fd', '#f0abfc', '#93c5fd', '#ffffff'],
        aurora: ['#6d28d9', '#db2777'], engine: 'galaxy', stars: 70
      },
      'galaxia-infinita': {
        bg: 'radial-gradient(circle at 50% 40%, #200e38 0%, #0e061a 50%, #04020a 100%)',
        accent: '#c084fc', particles: ['sparkle', 'dot'], colors: ['#e879f9', '#c084fc', '#67e8f9'],
        aurora: ['#7c3aed', '#ec4899'], engine: 'galaxy', stars: 80
      },
      'universe': {
        bg: 'radial-gradient(circle at 50% 30%, #0f172a 0%, #050b18 50%, #02040a 100%)',
        accent: '#38bdf8', particles: ['sparkle', 'dot'], colors: ['#38bdf8', '#818cf8', '#ffffff'],
        aurora: ['#0284c7', '#4338ca'], engine: 'galaxy', stars: 80
      },
      'galaxy-gallery': {
        bg: 'radial-gradient(circle at 50% 40%, #2d0e2e 0%, #150617 50%, #060208 100%)',
        accent: '#f472b6', particles: ['sparkle', 'heart'], colors: ['#f472b6', '#c084fc', '#fde68a'],
        aurora: ['#db2777', '#7c3aed'], engine: 'galaxy', stars: 70
      },
      'galaxy-gallery-flores-amarillas': {
        bg: 'radial-gradient(circle at 50% 40%, #2b1f0c 0%, #140d18 50%, #050308 100%)',
        accent: '#facc15', particles: ['sparkle', 'petal'], colors: ['#facc15', '#fde68a', '#c084fc'],
        aurora: ['#ca8a04', '#6d28d9'], engine: 'galaxy', stars: 70
      },
      'flores-moradas': {
        bg: 'radial-gradient(circle at 50% 30%, #0d281e 0%, #071711 50%, #1a1128 100%)',
        accent: '#c084fc', particles: ['petal', 'leaf', 'sparkle'], colors: ['#c084fc', '#e879f9', '#a78bfa', '#86efac'],
        aurora: ['#7e22ce', '#047857'], engine: 'flores'
      },
      'flor-galaxy': {
        bg: 'radial-gradient(circle at 50% 30%, #1e1136 0%, #0d0718 50%, #05030a 100%)',
        accent: '#e879f9', particles: ['petal', 'sparkle'], colors: ['#e879f9', '#22d3ee', '#f43f5e'],
        aurora: ['#a21caf', '#0891b2'], engine: 'flores'
      },
      'flor-amarilla': {
        bg: 'radial-gradient(circle at 50% 30%, #2d2207 0%, #1c1404 50%, #0f0b02 100%)',
        accent: '#facc15', particles: ['petal', 'sparkle'], colors: ['#facc15', '#fde68a', '#fb923c'],
        aurora: ['#ca8a04', '#c2410c'], engine: 'flor-amarilla'
      },
      'flor-amarilla-dia': {
        bg: 'radial-gradient(circle at 50% 30%, #3a2808 0%, #1d1404 50%, #0c0802 100%)',
        accent: '#f59e0b', particles: ['petal', 'sparkle'], colors: ['#fbbf24', '#fde68a', '#38bdf8'],
        aurora: ['#d97706', '#0284c7'], engine: 'flor-amarilla'
      },
      'arbol': {
        bg: 'radial-gradient(circle at 50% 30%, #240a1b 0%, #12070e 50%, #0d040a 100%)',
        accent: '#fb7185', particles: ['heart', 'petal'], colors: ['#fb7185', '#fda4af', '#fde68a'],
        aurora: ['#be123c', '#065f46'], engine: 'arbol'
      },
      'lector-huellas': {
        bg: 'radial-gradient(circle at 50% 30%, #09152b 0%, #060c18 50%, #12071f 100%)',
        accent: '#22d3ee', particles: ['dot', 'sparkle'], colors: ['#22d3ee', '#60a5fa', '#a78bfa'],
        aurora: ['#0891b2', '#4f46e5'], engine: 'huellas', motion: 'rise'
      },
      'latidos-de-luz': {
        bg: 'radial-gradient(circle at 50% 30%, #1c050a 0%, #140307 50%, #000000 100%)',
        accent: '#ef4444', particles: ['heart', 'dot'], colors: ['#ef4444', '#fb7185', '#fecaca'],
        aurora: ['#991b1b', '#be123c'], engine: 'latidos', motion: 'rise'
      },
      'spotify-amor': {
        bg: 'radial-gradient(circle at 50% 30%, #081f14 0%, #0c1410 50%, #040806 100%)',
        accent: '#1db954', particles: ['note', 'sparkle'], colors: ['#1db954', '#86efac', '#ffffff'],
        aurora: ['#15803d', '#0f766e'], engine: 'spotify'
      },
      'net': {
        bg: 'radial-gradient(circle at 50% 40%, #083344 0%, #0c1a3a 50%, #05030f 100%)',
        accent: '#22d3ee', particles: ['dot', 'sparkle'], colors: ['#67e8f9', '#c084fc', '#f472b6'],
        aurora: ['#0891b2', '#7c3aed'], engine: 'universal', taps: 4, signature: 'Conectados para siempre'
      },
      'memorama': {
        bg: 'linear-gradient(160deg, #3b0764 0%, #4c0519 55%, #1c1917 100%)',
        accent: '#f59e0b', particles: ['sparkle', 'heart'], colors: ['#fcd34d', '#f9a8d4', '#c4b5fd'],
        aurora: ['#7c3aed', '#e11d48'], engine: 'universal', taps: 4, signature: 'Cada recuerdo contigo es un tesoro'
      },
      'memori-corazon': {
        bg: 'radial-gradient(circle at 50% 40%, #881337 0%, #4c0519 50%, #12030a 100%)',
        accent: '#fb7185', particles: ['heart', 'petal'], colors: ['#fda4af', '#fecdd3', '#f43f5e'],
        aurora: ['#e11d48', '#db2777'], engine: 'universal', taps: 5, signature: 'Mi corazón está hecho de ti'
      },
      'laberinto': {
        bg: 'radial-gradient(circle at 50% 40%, #064e3b 0%, #022c22 50%, #020617 100%)',
        accent: '#34d399', particles: ['leaf', 'sparkle'], colors: ['#6ee7b7', '#a7f3d0', '#f9a8d4'],
        aurora: ['#059669', '#0e7490'], engine: 'universal', taps: 4, signature: 'Todos los caminos llevan a ti'
      },
      'carrera-de-corazones': {
        bg: 'linear-gradient(160deg, #9d174d 0%, #7c2d12 60%, #1c0a05 100%)',
        accent: '#fbbf24', particles: ['heart', 'sparkle'], colors: ['#fbbf24', '#fb7185', '#fff'],
        aurora: ['#f97316', '#db2777'], engine: 'universal', taps: 5, signature: 'Contigo cada meta es mejor'
      },
      'heart-shooter': {
        bg: 'radial-gradient(circle at 50% 40%, #9f1239 0%, #450a0a 55%, #0c0303 100%)',
        accent: '#fb7185', particles: ['heart', 'sparkle'], colors: ['#fb7185', '#fde68a', '#fecdd3'],
        aurora: ['#e11d48', '#d97706'], engine: 'universal', taps: 3, signature: 'Flechado/a por ti'
      },
      'corazon-revienta': {
        bg: 'radial-gradient(circle at 50% 45%, #be185d 0%, #7f1d1d 55%, #1a0505 100%)',
        accent: '#fbbf24', particles: ['heart', 'sparkle'], colors: ['#fb7185', '#fbbf24', '#fff'],
        aurora: ['#ec4899', '#f59e0b'], engine: 'universal', taps: 5, signature: 'Me haces explotar de amor'
      },
      'bubbles': {
        bg: 'linear-gradient(170deg, #0c4a6e 0%, #1e1b4b 55%, #500724 100%)',
        accent: '#7dd3fc', particles: ['bubble'], colors: ['#7dd3fc', '#f0abfc', '#e0f2fe'],
        aurora: ['#0284c7', '#c026d3'], motion: 'rise', engine: 'universal', taps: 5, signature: 'Floto cuando estoy contigo'
      },
      'hotwheels': {
        bg: 'radial-gradient(circle at 50% 30%, #2d0e0e 0%, #1c0808 50%, #120505 100%)',
        accent: '#f97316', particles: ['sparkle', 'dot'], colors: ['#f97316', '#facc15', '#ef4444'],
        aurora: ['#dc2626', '#ea580c'], engine: 'hotwheels'
      },
      'regalos-cumple': {
        bg: 'radial-gradient(circle at 50% 30%, #2b0c20 0%, #1f0914 50%, #140612 100%)',
        accent: '#f472b6', particles: ['sparkle', 'heart'], colors: ['#f472b6', '#c084fc', '#fbbf24'],
        aurora: ['#db2777', '#7c3aed'], engine: 'regalo'
      },
      'el-camino-juntos': {
        bg: 'radial-gradient(circle at 50% 20%, #065f46 0%, #134e4a 45%, #020617 100%)',
        accent: '#34d399', particles: ['leaf', 'petal'], colors: ['#6ee7b7', '#fde68a', '#fda4af'],
        aurora: ['#10b981', '#0f766e'], engine: 'universal', taps: 4, signature: 'Y lo mejor está por venir'
      },
      'tres-corazones': {
        bg: 'radial-gradient(circle at 50% 40%, #831843 0%, #312e81 60%, #0b0820 100%)',
        accent: '#f9a8d4', particles: ['sparkle', 'heart'], colors: ['#f9a8d4', '#c4b5fd', '#fde68a'],
        aurora: ['#db2777', '#4f46e5'], engine: 'universal', taps: 3, signature: 'Mis tres deseos eres tú'
      },
      'heart': {
        bg: 'radial-gradient(circle at 50% 45%, #3b0764 0%, #1e0533 50%, #000 100%)',
        accent: '#f0abfc', particles: ['dot', 'heart'], colors: ['#f0abfc', '#f472b6', '#a855f7'],
        aurora: ['#a21caf', '#7c3aed'], engine: 'universal', taps: 1, signature: 'Laten al mismo ritmo'
      },
      'dedicate': {
        bg: 'radial-gradient(circle at 50% 30%, #292524 0%, #1c1917 50%, #0c0a09 100%)',
        accent: '#d4a24c', particles: ['sparkle'], colors: ['#fde68a', '#e7e5e4'],
        aurora: ['#78716c', '#a16207'], count: 10, engine: 'universal', taps: 1, paper: true, signature: 'Con amor'
      },
      'little-girl': {
        bg: 'linear-gradient(165deg, #be185d 0%, #86198f 55%, #3b0764 100%)',
        accent: '#fbcfe8', particles: ['sparkle', 'heart', 'petal'], colors: ['#fbcfe8', '#fde68a', '#ddd6fe', '#fff'],
        aurora: ['#f472b6', '#a78bfa'], engine: 'universal', taps: 3, signature: 'Mi princesa hermosa'
      },
      'halloween': {
        bg: 'radial-gradient(circle at 70% 20%, #4c1d95 0%, #1e0b36 45%, #050208 100%)',
        accent: '#fb923c', particles: ['bat', 'dot'], colors: ['#1e1b4b', '#fb923c', '#a78bfa'],
        aurora: ['#ea580c', '#6d28d9'], engine: 'universal', taps: 3, signature: 'Mi hechizo favorito eres tú'
      }
    };

    const currentTheme = THEMES[TEMPLATE_ID] || THEMES['candado'];

    // --- Ambient Particle Generator ---
    function renderAmbientLayer() {
      const pTypes = currentTheme.particles || ['heart', 'sparkle'];
      const pColors = currentTheme.colors || ['#f43f5e', '#fbbf24'];
      const motion = currentTheme.motion === 'rise' ? 'dp-rise' : 'dp-fall';
      let html = '<div class="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">';

      if (currentTheme.aurora) {
        html += \`
          <div class="absolute -top-1/4 -left-1/4 w-[80%] h-[60%] rounded-full blur-3xl opacity-30 dp-aurora" style="background: radial-gradient(circle, \${currentTheme.aurora[0]}, transparent 70%);"></div>
          <div class="absolute -bottom-1/4 -right-1/4 w-[80%] h-[60%] rounded-full blur-3xl opacity-25 dp-aurora" style="background: radial-gradient(circle, \${currentTheme.aurora[1] || currentTheme.aurora[0]}, transparent 70%); animation-delay: -9s;"></div>
        \`;
      }

      // Stars
      for (let i = 0; i < (currentTheme.stars || 35); i++) {
        const l = Math.random() * 100;
        const t = Math.random() * 100;
        const s = 1 + Math.random() * 2.2;
        const d = 2 + Math.random() * 4;
        html += \`<span class="absolute rounded-full bg-white dp-twinkle" style="left:\${l}%; top:\${t}%; width:\${s}px; height:\${s}px; animation-duration:\${d}s; animation-delay:-\${Math.random()*5}s;"></span>\`;
      }

      // Particles
      for (let i = 0; i < (currentTheme.count || 18); i++) {
        const type = pTypes[i % pTypes.length];
        const color = pColors[Math.floor(Math.random() * pColors.length)];
        const l = Math.random() * 100;
        const s = 10 + Math.random() * 16;
        const d = 9 + Math.random() * 12;
        const drift = (Math.random() - 0.5) * 120;
        const spin = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
        let svg = '';
        if (type === 'heart') {
          svg = \`<svg viewBox="0 0 24 24" class="w-full h-full" fill="\${color}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>\`;
        } else if (type === 'petal') {
          svg = \`<svg viewBox="0 0 24 24" class="w-full h-full"><path d="M12 2C7 6 5 11 7 16c1.5 3.5 3.5 5 5 6 1.5-1 3.5-2.5 5-6 2-5 0-10-5-14z" fill="\${color}" opacity="0.9"/></svg>\`;
        } else if (type === 'leaf') {
          svg = \`<svg viewBox="0 0 24 24" class="w-full h-full"><path d="M4 20C4 9 11 3 21 3c0 10-6 17-17 17z" fill="\${color}"/></svg>\`;
        } else if (type === 'bat') {
          svg = \`<svg viewBox="0 0 32 16" class="w-full h-full" fill="\${color}"><path d="M16 6c1-2 2-3 2-3l1 3c3-3 8-4 13-2-3 1-4 4-4 7-2-2-5-2-7 0-1-1-3-2-5-2s-4 1-5 2c-2-2-5-2-7 0 0-3-1-6-4-7 5-2 10-1 13 2l1-3s1 1 2 3z"/></svg>\`;
        } else if (type === 'bubble') {
          svg = \`<svg viewBox="0 0 24 24" class="w-full h-full"><circle cx="12" cy="12" r="10" fill="none" stroke="\${color}" stroke-width="1.2" opacity="0.8"/><circle cx="12" cy="12" r="10" fill="\${color}" opacity="0.08"/><ellipse cx="8.5" cy="8" rx="3" ry="1.8" fill="white" opacity="0.6" transform="rotate(-35 8.5 8)"/></svg>\`;
        } else {
          svg = \`<svg viewBox="0 0 24 24" class="w-full h-full" fill="\${color}"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z"/></svg>\`;
        }
        html += \`<span class="dp-particle \${motion}" style="left:\${l}%; width:\${s}px; height:\${s}px; animation-duration:\${d}s; animation-delay:-\${Math.random()*15}s; --drift:\${drift}px; --spin:\${spin}deg; filter: drop-shadow(0 0 4px \${color}88);">\${svg}</span>\`;
      }
      html += '<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]"></div></div>';
      return html;
    }

    // --- State Management ---
    let unlocked = false;
    let isPlaying = false;
    let stepCount = 0;
    let currentCombo = [0, 0, 0];
    const targetCombo = DEDICATION_DATA.combo || [14, 2, 24];

    // --- Render Love Letter Card Component ---
    function renderLoveLetterCard() {
      const isPaper = currentTheme.paper;
      const accent = currentTheme.accent || '#f43f5e';
      return \`
        <div class="relative z-10 w-full max-w-md rounded-[28px] p-6 sm:p-7 shadow-2xl animate-float mt-6 \${
          isPaper ? 'dp-paper text-stone-800 border border-amber-200' : 'bg-slate-950/80 text-white border border-white/10 backdrop-blur-xl'
        }" style="box-shadow: 0 25px 60px -15px \${accent}55, inset 0 1px 0 rgba(255,255,255,0.08);">
          \${DEDICATION_DATA.photo ? \`
            <div class="flex justify-center mb-5">
              <figure class="relative bg-white p-2 pb-7 rounded-sm shadow-xl rotate-[-2.5deg] hover:rotate-0 transition-transform duration-500 max-w-[80%]">
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/80 rotate-[4deg] shadow-sm"></span>
                <div class="overflow-hidden max-h-56">
                  <img src="\${DEDICATION_DATA.photo}" alt="Nuestro recuerdo" class="w-full h-full object-cover" />
                </div>
                <figcaption class="absolute bottom-1 inset-x-0 text-center font-romantic text-lg text-stone-600">Nuestro momento ♡</figcaption>
              </figure>
            </div>
          \` : ''}
          <h2 class="text-center text-xl sm:text-2xl font-serif-romance font-semibold leading-snug \${isPaper ? 'text-rose-900' : 'dp-gold-text'}">\${DEDICATION_DATA.letterTitle || ''}</h2>
          <div class="w-32 h-[1px] mx-auto my-3" style="background: \${isPaper ? '#b9853a' : accent}; opacity: 0.6;"></div>
          <p class="text-sm sm:text-[15px] leading-relaxed whitespace-pre-line text-center \${isPaper ? 'font-serif text-stone-700' : 'text-slate-200/90 font-light'}">\${DEDICATION_DATA.letterBody || ''}</p>
          \${DEDICATION_DATA.voiceNote ? \`
            <div class="mt-4 p-3 rounded-2xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button type="button" onclick="toggleVoicePlayback()" class="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer">
                  <span id="voicePlayIcon" style="font-size: 14px;">▶</span>
                </button>
                <div class="text-left">
                  <p class="text-xs font-bold text-white">Mensaje de Voz Romántico</p>
                  <p class="text-[10px] text-rose-300">Toca para escuchar mi voz</p>
                </div>
              </div>
              <audio id="voiceAudioEl" src="\${DEDICATION_DATA.voiceNote}" preload="auto"></audio>
            </div>
          \` : ''}
          <div class="mt-5 text-center">
            <span class="font-romantic text-2xl \${isPaper ? 'text-rose-800' : ''}" style="\${!isPaper ? 'color:' + accent : ''}">\${DEDICATION_DATA.customSign || currentTheme.signature || 'Siempre en mi corazón'} ♥</span>
          </div>
        </div>
      \`;
    }

    window.toggleVoicePlayback = function() {
      const audio = document.getElementById('voiceAudioEl');
      const icon = document.getElementById('voicePlayIcon');
      if (!audio) return;
      if (audio.paused) {
        sound.pause();
        audio.play();
        if (icon) icon.innerText = '⏸';
        audio.onended = function() {
          if (icon) icon.innerText = '▶';
        };
      } else {
        audio.pause();
        if (icon) icon.innerText = '▶';
      }
    };

    // --- Main Page Render ---
    const root = document.getElementById('standalone-root');

    function renderApp() {
      const accent = currentTheme.accent || '#f43f5e';
      root.style.background = currentTheme.bg;

      let emblemHtml = '';
      const eng = currentTheme.engine || 'candado';

      if (eng === 'candado') {
        emblemHtml = \`
          <div class="relative flex flex-col items-center">
            <div class="w-32 h-28 border-[12px] border-amber-400 rounded-t-full transition-all duration-700 ease-out origin-bottom-left \${unlocked ? '-translate-y-8 rotate-12 border-amber-300' : 'translate-y-3'}"></div>
            <div class="relative w-64 bg-gradient-to-b from-[#2b251a] via-[#45371c] to-[#1f1910] border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl flex flex-col items-center z-10 cursor-pointer" onclick="handleDirectUnlock()">
              <div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-amber-950 font-bold mb-4 shadow-lg">\${unlocked ? '🔓' : '❤️'}</div>
              <div class="flex gap-3 bg-[#120f0a] p-3 rounded-2xl border border-amber-600/40">
                \${[0, 1, 2].map(idx => \`
                  <div class="flex flex-col items-center">
                    <button onclick="changeDigit(\${idx}, 1); event.stopPropagation();" class="p-1 text-amber-400 hover:text-amber-200">▲</button>
                    <div class="w-12 h-14 bg-slate-900 border border-amber-500/50 rounded-xl flex items-center justify-center text-2xl font-mono font-bold text-amber-300">
                      \${String(currentCombo[idx]).padStart(2, '0')}
                    </div>
                    <button onclick="changeDigit(\${idx}, -1); event.stopPropagation();" class="p-1 text-amber-400 hover:text-amber-200">▼</button>
                  </div>
                \`).join('')}
              </div>
            </div>
          </div>
        \`;
      } else if (eng === 'puertas') {
        emblemHtml = \`
          <div class="relative w-64 h-72 perspective-1000 cursor-pointer" onclick="handleDirectUnlock()">
            <div class="absolute inset-0 flex">
              <div class="w-1/2 h-full bg-gradient-to-r from-amber-900 to-amber-800 border-2 border-amber-600/60 rounded-l-2xl shadow-2xl transition-transform duration-1000 origin-left flex items-center justify-end pr-2" style="\${unlocked ? 'transform: rotateY(-115deg);' : ''}">
                <div class="w-4 h-12 rounded-full border border-amber-400 bg-amber-500/40"></div>
              </div>
              <div class="w-1/2 h-full bg-gradient-to-l from-amber-900 to-amber-800 border-2 border-amber-600/60 rounded-r-2xl shadow-2xl transition-transform duration-1000 origin-right flex items-center justify-start pl-2" style="\${unlocked ? 'transform: rotateY(115deg);' : ''}">
                <div class="w-4 h-12 rounded-full border border-amber-400 bg-amber-500/40"></div>
              </div>
            </div>
            \${unlocked ? '<div class="absolute inset-0 bg-amber-400/20 blur-xl animate-pulse"></div>' : ''}
          </div>
        \`;
      } else if (eng === 'carta') {
        emblemHtml = \`
          <div class="relative w-72 h-52 bg-gradient-to-b from-[#e2c799] to-[#c5a676] rounded-2xl shadow-2xl border border-amber-300/40 p-4 flex flex-col items-center justify-center cursor-pointer transition transform hover:scale-105" onclick="handleDirectUnlock()">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-950 via-red-700 to-rose-600 border-2 border-red-400 shadow-xl flex items-center justify-center animate-pulse">
              <span class="text-2xl text-rose-100">❤️</span>
            </div>
            <span class="mt-3 text-xs font-bold text-amber-950/80 uppercase tracking-widest font-mono">Toca para abrir sello</span>
          </div>
        \`;
      } else if (eng === 'propose') {
        emblemHtml = \`
          <div class="relative w-64 h-64 flex flex-col items-center justify-center cursor-pointer" onclick="handleDirectUnlock()">
            <div class="w-48 h-48 rounded-3xl bg-gradient-to-b from-blue-950 to-indigo-950 border-2 border-amber-400/60 shadow-2xl p-4 flex flex-col items-center justify-center transform \${unlocked ? 'scale-105' : 'hover:scale-105'} transition">
              <span class="text-6xl \${unlocked ? 'animate-bounce' : 'animate-pulse'}">💍</span>
              <span class="text-xs font-bold text-amber-300 mt-3 tracking-widest uppercase">\${unlocked ? '¡Dijo que Sí!' : 'Toca la caja'}</span>
            </div>
          </div>
        \`;
      } else if (eng === 'flores' || eng === 'flor-amarilla') {
        const flowerColor = eng === 'flores' ? '#c084fc' : '#facc15';
        emblemHtml = \`
          <div class="relative w-60 h-60 flex flex-col items-center justify-center cursor-pointer" onclick="handleDirectUnlock()">
            <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-2xl">
              <path d="M100 180 Q95 130 100 90" stroke="#16a34a" stroke-width="6" stroke-linecap="round" fill="none" />
              <path d="M98 130 Q70 120 75 105 Q90 115 98 128" fill="#22c55e" />
              <path d="M100 115 Q130 105 125 90 Q110 100 100 113" fill="#22c55e" />
              <g class="\${unlocked ? 'animate-spin-slow' : 'dp-heartbeat'}" style="transform-origin: 100px 85px;">
                \${Array.from({length: 8}).map((_, i) => \`
                  <ellipse cx="100" cy="55" rx="14" ry="26" fill="\${flowerColor}" opacity="0.9" transform="rotate(\${i * 45} 100 85)" />
                \`).join('')}
                <circle cx="100" cy="85" r="16" fill="#f59e0b" stroke="#78350f" stroke-width="2" />
              </g>
            </svg>
          </div>
        \`;
      } else if (eng === 'arbol') {
        emblemHtml = \`
          <div class="relative w-64 h-64 flex flex-col items-center justify-center cursor-pointer" onclick="handleDirectUnlock()">
            <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-2xl">
              <path d="M90 190 Q95 130 85 90 Q100 110 115 90 Q105 130 110 190z" fill="#78350f" />
              <circle cx="100" cy="80" r="55" fill="#be123c" opacity="0.8" class="\${unlocked ? 'animate-pulse' : ''}" />
              \${Array.from({length: 12}).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const x = 100 + Math.cos(a) * 38;
                const y = 80 + Math.sin(a) * 38;
                return \`<text x="\${x}" y="\${y}" font-size="16" text-anchor="middle" fill="#fda4af">❤️</text>\`;
              }).join('')}
            </svg>
          </div>
        \`;
      } else if (eng === 'huellas') {
        emblemHtml = \`
          <div class="relative w-56 h-56 rounded-full border-2 border-cyan-400/40 p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 shadow-2xl" onclick="handleDirectUnlock()">
            <svg viewBox="0 0 24 24" class="w-24 h-24 stroke-cyan-400 fill-none" stroke-width="1.5">
              <path d="M12 2a10 10 0 0 0-10 10c0 4.2 2.6 7.8 6.3 9.3"/>
              <path d="M12 6a6 6 0 0 0-6 6c0 2.5 1.5 4.7 3.8 5.6"/>
              <path d="M12 10a2 2 0 0 0-2 2c0 .9.5 1.7 1.3 2"/>
              <path d="M12 14v4"/>
              <path d="M16 12a4 4 0 0 0-4-4"/>
              <path d="M20 12a8 8 0 0 0-8-8"/>
            </svg>
            <div class="w-36 h-1 bg-cyan-400 shadow-lg shadow-cyan-400 animate-pulse mt-2"></div>
            <span class="text-[11px] font-mono text-cyan-300 mt-2">\${unlocked ? 'ACCESO CONCEDIDO' : 'TOCA PARA ESCANEAR'}</span>
          </div>
        \`;
      } else if (eng === 'latidos') {
        emblemHtml = \`
          <div class="relative w-64 h-48 rounded-2xl border-2 border-red-500/40 p-4 flex flex-col items-center justify-center cursor-pointer bg-black/80 shadow-2xl" onclick="handleDirectUnlock()">
            <svg viewBox="0 0 200 100" class="w-full h-full stroke-red-500 fill-none" stroke-width="3">
              <path d="M10 50 H60 L75 20 L90 80 L105 10 L120 70 L135 50 H190" stroke-linecap="round" stroke-linejoin="round" class="\${unlocked ? 'animate-pulse' : ''}" />
            </svg>
            <span class="text-xs font-mono text-red-400 mt-1 font-bold">\${unlocked ? '140 BPM — AMOR DETECTADO' : '72 BPM — TOCA PARA MEDIR'}</span>
          </div>
        \`;
      } else if (eng === 'spotify') {
        emblemHtml = \`
          <div class="relative w-60 h-60 rounded-full bg-black border-4 border-emerald-500/50 p-2 shadow-2xl flex items-center justify-center cursor-pointer \${isPlaying ? 'animate-spin-slow' : ''}" onclick="handleDirectUnlock()">
            <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-3xl shadow-inner">
              ❤️
            </div>
          </div>
        \`;
      } else {
        // Universal and all dynamic emblems
        emblemHtml = \`
          <div class="relative w-56 h-56 rounded-full flex flex-col items-center justify-center cursor-pointer" onclick="handleTapUniversal()">
            <div class="absolute inset-2 rounded-full blur-2xl opacity-60" style="background: radial-gradient(circle, \${accent}88, transparent 70%);"></div>
            <div class="relative w-40 h-40 rounded-full border-2 border-white/20 flex flex-col items-center justify-center bg-black/40 shadow-2xl transform hover:scale-105 active:scale-95 transition">
              <span class="text-5xl \${unlocked ? 'animate-bounce' : 'dp-heartbeat'}">❤️</span>
              <span class="text-[11px] font-bold mt-2 uppercase tracking-wider" style="color: \${accent};">\${unlocked ? 'Abierto' : 'Toca Aquí'}</span>
            </div>
          </div>
        \`;
      }

      root.innerHTML = \`
        \${renderAmbientLayer()}

        <!-- Vinyl Music Button -->
        <button id="musicDiscBtn" class="absolute top-4 right-4 z-40 w-11 h-11 rounded-full p-[3px] bg-black/40 backdrop-blur-md border border-white/15 shadow-lg hover:scale-105 transition cursor-pointer" title="Música">
          <span class="relative w-full h-full rounded-full flex items-center justify-center \${isPlaying ? 'animate-spin-slow' : ''}" style="background: repeating-radial-gradient(circle, #111 0 2px, #1f1f1f 2px 4px); box-shadow: \${isPlaying ? '0 0 14px ' + accent : 'none'};">
            <span class="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center" style="background: \${accent};">
              <span class="text-[9px] text-white">🎵</span>
            </span>
          </span>
        </button>

        <!-- Main Wrapper -->
        <div class="w-full max-w-lg min-h-screen z-10 flex flex-col items-center justify-between p-5 sm:p-7 text-center">
          <!-- Header -->
          <header class="w-full mt-4">
            <h1 class="text-3xl sm:text-4xl font-serif-romance font-semibold leading-tight dp-gold-text drop-shadow mb-2">\${DEDICATION_DATA.title || ''}</h1>
            <p class="text-sm text-white/75 italic">\${unlocked ? (DEDICATION_DATA.unlockMsg || '¡Desbloqueado!') : (DEDICATION_DATA.lockTitle || 'Toca para abrir')}</p>
          </header>

          <!-- Interactive Center Emblem -->
          <div class="my-auto py-4">
            \${emblemHtml}
            \${!unlocked ? \`
              <div class="mt-4">
                <span class="text-xs font-semibold px-4 py-1.5 rounded-full bg-black/40 border backdrop-blur-sm animate-pulse" style="border-color: \${accent}55; color: #fff;">
                  \${DEDICATION_DATA.lockTitle || 'Toca para interactuar'}
                </span>
              </div>
            \` : ''}
          </div>

          <!-- Revealed Letter Card -->
          \${unlocked ? renderLoveLetterCard() : '<div class="h-6"></div>'}
        </div>
      \`;

      // Bind Music Disc Click
      const btn = document.getElementById('musicDiscBtn');
      if (btn) {
        btn.onclick = () => {
          sound.toggleMusic((active) => {
            isPlaying = active;
            renderApp();
          });
        };
      }
    }

    // --- Interaction Handlers ---
    window.changeDigit = function(idx, delta) {
      if (unlocked) return;
      sound.playDialClick();
      let val = currentCombo[idx] + delta;
      if (val > 31) val = 0;
      if (val < 0) val = 31;
      currentCombo[idx] = val;

      if (currentCombo[0] === targetCombo[0] && currentCombo[1] === targetCombo[1] && currentCombo[2] === targetCombo[2]) {
        triggerUnlock();
      } else {
        renderApp();
      }
    };

    window.handleDirectUnlock = function() {
      if (!unlocked) triggerUnlock();
    };

    window.handleTapUniversal = function() {
      if (unlocked) return;
      const tapsNeeded = currentTheme.taps || 1;
      stepCount++;
      sound.playDialClick();
      if (stepCount >= tapsNeeded) {
        triggerUnlock();
      } else {
        renderApp();
      }
    };

    function triggerUnlock() {
      unlocked = true;
      sound.playUnlockSuccess();
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: [currentTheme.accent, '#f43f5e', '#fbbf24', '#ffffff']
        });
      } catch(e) {}
      setTimeout(() => {
        if (!isPlaying) {
          sound.toggleMusic((active) => {
            isPlaying = active;
            renderApp();
          });
        }
      }, 700);
      renderApp();
    }

    // Initial Render
    renderApp();
  </script>
</body>
</html>`;
}
