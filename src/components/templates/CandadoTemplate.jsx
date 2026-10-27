import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Lock, Unlock, Heart, ChevronUp, ChevronDown, Sparkles, Mail, RotateCcw } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function CandadoTemplate({ data }) {
  const c1 = data?.combo1 !== undefined && data?.combo1 !== '' ? Number(data.combo1) : (data?.combo?.[0] ?? 14);
  const c2 = data?.combo2 !== undefined && data?.combo2 !== '' ? Number(data.combo2) : (data?.combo?.[1] ?? 2);
  const c3 = data?.combo3 !== undefined && data?.combo3 !== '' ? Number(data.combo3) : (data?.combo?.[2] ?? 24);
  const targetCombo = [c1, c2, c3];

  const [currentCombo, setCurrentCombo] = useState([0, 0, 0]);
  const [stage, setStage] = useState('lock'); // 'lock' | 'heart' | 'letter'
  const [shackleOpen, setShackleOpen] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);
  const canvasRef = useRef(null);

  const badgeText = resolveText(data?.badgeText, 'Candado de Amor Eterno');
  const titleText = resolveText(data?.title, 'Nuestro Secreto Eterno');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Gira las ruedas hasta nuestra fecha especial');
  const unlockSubtitle = resolveText(data?.unlockMsg, '¡Desbloqueaste mi corazón!');
  const actionHint = resolveText(data?.actionHint, 'Encuentra los 3 números correctos');
  const skyText = resolveText(data?.skyText, 'TE AMO');
  const lockHint = resolveText(data?.lockHint, '');
  const letterTitle = resolveText(data?.letterTitle, 'Para la persona más especial de mi vida');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Gracias por llenar mi mundo de luz y alegría cada día...');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  useEffect(() => {
    if (
      stage === 'lock' &&
      !shackleOpen &&
      currentCombo[0] === targetCombo[0] &&
      currentCombo[1] === targetCombo[1] &&
      currentCombo[2] === targetCombo[2]
    ) {
      handleUnlock();
    }
  }, [currentCombo, targetCombo, stage, shackleOpen]);

  const handleUnlock = () => {
    setShackleOpen(true);
    sound.playUnlockSuccess();
    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fcd34d', '#ffffff']
      });
    } catch (e) {}

    setTimeout(() => {
      if (!bgmActive) sound.toggleMusicTrack(data?.customAudio, setBgmActive);
      setStage('heart');
    }, 850);
  };

  const adjustDigit = (dialIndex, delta) => {
    if (shackleOpen) return;
    sound.playDialClick();
    setCurrentCombo(prev => {
      const next = [...prev];
      let val = next[dialIndex] + delta;
      if (val > 99) val = 0;
      if (val < 0) val = 99;
      next[dialIndex] = val;
      return next;
    });
  };

  // Stage 2: 2,200-particle 3D Swirling Heart + Sky Text Canvas
  useEffect(() => {
    if (stage !== 'heart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement.clientHeight || 650);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 400;
      height = canvas.height = canvas.parentElement.clientHeight || 650;
    };
    window.addEventListener('resize', handleResize);

    // Sample points on a 3D parametric heart curve + interior volume
    const totalParticles = 1400;
    const particles = [];
    const scale = Math.min(width, height) * 0.0105;

    for (let i = 0; i < totalParticles; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.35); // denser near outline, filled inside
      const hx = 16 * Math.pow(Math.sin(t), 3) * r;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;

      particles.push({
        x: (Math.random() - 0.5) * width * 1.6 + width / 2,
        y: (Math.random() - 0.5) * height * 1.6 + height / 2,
        tx: hx * scale,
        ty: hy * scale,
        size: Math.random() * 2.2 + 0.9,
        color: ['#ff2a6d', '#ff5e8e', '#ff8da1', '#ffd1dc', '#fbbf24'][i % 5],
        speed: 0.03 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Background twinkling stars
    const bgStars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.4,
      a: Math.random()
    }));

    let pointer = { x: -9999, y: -9999 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);

    let time = 0;
    const render = () => {
      time += 0.035;
      ctx.fillStyle = 'rgba(10, 4, 18, 0.24)';
      ctx.fillRect(0, 0, width, height);

      // Stars
      bgStars.forEach(s => {
        s.a += 0.02;
        ctx.globalAlpha = 0.3 + Math.abs(Math.sin(s.a)) * 0.7;
        ctx.fillStyle = '#fde2e4';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Heartbeat pulse
      const beat = 1 + Math.pow(Math.sin(time * 1.7), 6) * 0.09;
      const cx = width / 2;
      const cy = height * 0.46;

      // Sky text glow at the top
      if (skyText) {
        ctx.save();
        ctx.globalAlpha = 0.85 + Math.sin(time * 2) * 0.15;
        ctx.font = `700 ${Math.max(22, Math.min(36, Math.floor(width * 0.075)))}px "Playfair Display", Georgia, serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 22;
        ctx.fillStyle = '#ffe4e6';
        ctx.fillText(skyText, cx, height * 0.14);
        ctx.restore();
      }

      // Draw swirling heart particles
      particles.forEach(p => {
        const targetX = cx + p.tx * beat + Math.cos(time + p.phase) * 2.2;
        const targetY = cy + p.ty * beat + Math.sin(time + p.phase) * 2.2;

        // Repulsion from finger/mouse
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 4200 && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (65 - dist) / 65;
          p.x += (dx / dist) * force * 9;
          p.y += (dy / dist) * force * 9;
        }

        p.x += (targetX - p.x) * p.speed;
        p.y += (targetY - p.y) * p.speed;

        ctx.globalAlpha = 0.88;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    // Initial black fill
    ctx.fillStyle = '#0a0412';
    ctx.fillRect(0, 0, width, height);
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [stage, skyText]);

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  const resetLock = () => {
    setShackleOpen(false);
    setCurrentCombo([0, 0, 0]);
    setStage('lock');
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#17091c] via-[#2a112b] to-[#0f0514] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['heart', 'sparkle']} colors={['#f43f5e', '#f9a8d4', '#fbbf24']} aurora={['#e11d48', '#86198f']} seed={19} />

      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#f43f5e" />

      {/* STAGE 1: LUXURY ROSE-GOLD 3D PADLOCK */}
      {stage === 'lock' && (
        <div className="w-full max-w-md z-10 flex flex-col items-center animate-fade-in">
          <div className="text-center mb-5">
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-200 text-xs font-semibold mb-2.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{badgeText}</span>
              </div>
            )}
            {titleText && (
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200 font-serif-romance drop-shadow">
                {titleText}
              </h1>
            )}
            {(shackleOpen ? unlockSubtitle : lockSubtitle) && (
              <p className="text-sm text-rose-200/80 mt-1.5 max-w-xs mx-auto">
                {shackleOpen ? unlockSubtitle : lockSubtitle}
              </p>
            )}
          </div>

          {/* 3D Rose-Gold Padlock */}
          <div className="relative my-2 flex flex-col items-center">
            {/* Metallic Shackle */}
            <div
              className={`w-32 h-28 rounded-t-full border-[13px] transition-all duration-700 ease-out origin-bottom-left ${
                shackleOpen
                  ? '-translate-y-7 rotate-12 border-amber-200 shadow-[0_-8px_28px_rgba(251,191,36,0.55)]'
                  : 'translate-y-4 border-[#f3c6b6] shadow-[inset_0_4px_8px_rgba(255,255,255,0.6),0_4px_15px_rgba(0,0,0,0.5)]'
              }`}
              style={{ background: 'transparent' }}
            />

            {/* Rose-Gold & Velvet Padlock Body */}
            <div
              className="relative w-64 sm:w-72 rounded-[2.2rem] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.75),inset_0_2px_12px_rgba(255,255,255,0.35)] border-2 border-[#f5cbbf]/60 flex flex-col items-center z-10"
              style={{
                background: 'linear-gradient(155deg, #f3b4c2 0%, #c96d8b 45%, #88395d 100%)'
              }}
            >
              {/* Inner metallic plate */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-950/80 via-rose-800 to-pink-400 flex items-center justify-center shadow-inner mb-4 border border-white/40">
                {shackleOpen ? (
                  <Unlock className="w-5 h-5 text-amber-200 animate-bounce" />
                ) : (
                  <Heart className="w-5 h-5 text-white fill-rose-200 animate-pulse" />
                )}
              </div>

              {/* 3 Rotating Cylindrical Tumblers */}
              <div className="w-full bg-[#240c1a]/90 rounded-2xl p-3.5 border border-pink-200/30 shadow-[inset_0_6px_16px_rgba(0,0,0,0.85)] flex justify-center gap-3.5">
                {[0, 1, 2].map(idx => (
                  <div key={idx} className="flex flex-col items-center">
                    <button
                      type="button"
                      disabled={shackleOpen}
                      onClick={() => adjustDigit(idx, 1)}
                      className="p-1.5 rounded-lg text-pink-200/90 hover:text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 transition cursor-pointer"
                      aria-label={`Subir rueda ${idx + 1}`}
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>

                    <div
                      onClick={() => adjustDigit(idx, 1)}
                      className="relative w-14 sm:w-16 h-18 bg-gradient-to-b from-[#3d1a2e] via-[#fff0f3] to-[#3d1a2e] border-2 border-[#f5cbbf]/80 rounded-xl flex items-center justify-center shadow-lg overflow-hidden my-1 cursor-pointer select-none"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/50 pointer-events-none" />
                      <span className="relative z-10 text-2xl sm:text-3xl font-black text-[#4a102a] tracking-wider font-mono drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                        {String(currentCombo[idx]).padStart(2, '0')}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={shackleOpen}
                      onClick={() => adjustDigit(idx, -1)}
                      className="p-1.5 rounded-lg text-pink-200/90 hover:text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 transition cursor-pointer"
                      aria-label={`Bajar rueda ${idx + 1}`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {actionHint && (
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${shackleOpen ? 'bg-emerald-300 animate-ping' : 'bg-amber-200 animate-pulse'}`} />
                  <span className="text-[11px] font-semibold text-white/90 uppercase tracking-widest text-center">
                    {shackleOpen ? (unlockSubtitle || 'DESBLOQUEADO') : actionHint}
                  </span>
                </div>
              )}

              {/* Optional Hint (ONLY shown if user explicitly added a lockHint) */}
              {lockHint && !shackleOpen && (
                <p className="mt-2.5 text-xs text-rose-100/90 bg-black/25 px-3 py-1 rounded-full border border-white/15 text-center">
                  💡 Pista: {lockHint}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: SWIRLING 3D PARTICLE HEART + SKY TEXT */}
      {stage === 'heart' && (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-6 z-20">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 cursor-pointer" />

          <div className="relative z-10 mt-4 text-center pointer-events-none">
            {unlockSubtitle && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {unlockSubtitle}
              </span>
            )}
          </div>

          <div className="relative z-10 mb-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setStage('letter');
              }}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-sm shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 animate-bounce" />
              <span>Ver Carta</span>
            </button>
            <button
              type="button"
              onClick={resetLock}
              className="text-xs text-rose-200/60 hover:text-rose-200 inline-flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Volver al candado
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: PARCHMENT LOVE LETTER WITH TYPEWRITER & OPTIONAL PHOTO */}
      {stage === 'letter' && (
        <div className="w-full max-w-lg z-20 flex flex-col items-center my-auto animate-fade-in">
          <LoveLetterCard
            variant="paper"
            accent="#e11d48"
            badge={badgeText}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => setStage('heart')}
          />
        </div>
      )}
    </div>
  );
}
