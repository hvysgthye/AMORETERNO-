import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Sparkles, Calendar, Mail } from 'lucide-react';
import { MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function ArbolTemplate({ data }) {
  const [stage, setStage] = useState('seed'); // 'seed' | 'blooming' | 'letter'
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [floatingNotes, setFloatingNotes] = useState([]);
  const canvasRef = useRef(null);

  const badgeText = resolveText(data?.badgeText, 'El Árbol de Nuestro Amor');
  const titleText = resolveText(data?.title, 'Donde Crece Nuestro Amor');
  const subHeader = resolveText(data?.subHeader, 'Nuestro tiempo juntos');
  const actionHint = resolveText(data?.actionHint, 'Dale Click a la semilla, Amor 🌱❤️');
  const unlockMsg = resolveText(data?.unlockMsg, 'Toca el árbol para lanzar frases y corazones ✨');
  const letterTitle = resolveText(data?.letterTitle, 'Raíces profundas, amor eterno');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Como un árbol que resiste las tormentas y florece en primavera, nuestro amor se hace más fuerte con cada día que pasa.');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);
  const showCounter = data?.showCounter !== false;

  const phrases = useMemo(() => {
    const raw = resolveText(
      data?.floatingPhrases,
      'Te amo con todo mi corazón ❤️\nEres mi lugar favorito 🌸\nNuestro amor crece cada día ✨\nSiempre juntos, pase lo que pase 💕\nGracias por existir en mi vida 🌹'
    );
    return raw ? raw.split('\n').map(s => s.trim()).filter(Boolean) : [];
  }, [data?.floatingPhrases]);

  // Live Anniversary Counter with Seconds
  useEffect(() => {
    const startDate = data?.anniversaryDate ? new Date(data.anniversaryDate) : new Date('2024-02-14T00:00:00');
    const updateCounter = () => {
      const now = new Date();
      const diff = Math.max(0, now - startDate);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeTogether({ days, hours, mins, secs });
    };
    updateCounter();
    const timer = setInterval(updateCounter, 1000);
    return () => clearInterval(timer);
  }, [data?.anniversaryDate]);

  // Canvas Organic Growing Tree + 480 Heart Leaves + Falling Petals
  useEffect(() => {
    if (stage !== 'blooming') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const width = (canvas.width = 420);
    const height = (canvas.height = 420);

    // Pre-generate 420 heart leaves inside a crown canopy shape
    const leaves = Array.from({ length: 420 }, (_, i) => {
      // Heart-shaped canopy distribution
      const t = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.48);
      const hx = 16 * Math.pow(Math.sin(t), 3) * r * 7.2;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r * 6.8;
      return {
        x: width / 2 + hx + (Math.random() - 0.5) * 18,
        y: 155 + hy + (Math.random() - 0.5) * 18,
        size: 5 + Math.random() * 6.5,
        color: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#ec4899', '#be123c'][i % 6],
        delay: Math.random() * 1.4,
        angle: (Math.random() - 0.5) * 0.8
      };
    });

    // Falling heart petals
    const falling = Array.from({ length: 24 }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: 80 + Math.random() * 220,
      vx: -0.4 - Math.random() * 0.6,
      vy: 0.7 + Math.random() * 1.1,
      size: 5 + Math.random() * 4,
      color: ['#f43f5e', '#fb7185', '#fda4af'][Math.floor(Math.random() * 3)],
      rot: Math.random() * Math.PI
    }));

    const drawHeart = (cx, cy, s, color, rot = 0, alpha = 1) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.scale(s / 10, s / 10);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -3);
      ctx.bezierCurveTo(-5, -9, -12, -2, 0, 8);
      ctx.bezierCurveTo(12, -2, 5, -9, 0, -3);
      ctx.fill();
      ctx.restore();
    };

    let elapsed = 0;
    const render = () => {
      elapsed += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Soft ground shadow
      ctx.fillStyle = 'rgba(190, 18, 60, 0.14)';
      ctx.beginPath();
      ctx.ellipse(width / 2, 388, 95, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Trunk & Branches growth progress (0 to 1)
      const trunkProg = Math.min(1, elapsed / 0.9);
      ctx.save();
      ctx.strokeStyle = '#6b2f1a';
      ctx.lineCap = 'round';

      // Main trunk
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(width / 2, 388);
      ctx.quadraticCurveTo(width / 2 - 8, 388 - 80 * trunkProg, width / 2, 388 - 165 * trunkProg);
      ctx.stroke();

      if (trunkProg > 0.45) {
        const bProg = Math.min(1, (trunkProg - 0.45) / 0.55);
        ctx.lineWidth = 10;
        // Left branch
        ctx.beginPath();
        ctx.moveTo(width / 2 - 3, 270);
        ctx.quadraticCurveTo(width / 2 - 45 * bProg, 235, width / 2 - 82 * bProg, 185);
        ctx.stroke();

        // Right branch
        ctx.beginPath();
        ctx.moveTo(width / 2 + 3, 260);
        ctx.quadraticCurveTo(width / 2 + 45 * bProg, 225, width / 2 + 84 * bProg, 178);
        ctx.stroke();

        // Upper center branches
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(width / 2, 235);
        ctx.quadraticCurveTo(width / 2 - 32 * bProg, 180, width / 2 - 42 * bProg, 135);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width / 2, 235);
        ctx.quadraticCurveTo(width / 2 + 32 * bProg, 180, width / 2 + 42 * bProg, 135);
        ctx.stroke();
      }
      ctx.restore();

      // Bloom Heart Leaves
      if (elapsed > 0.6) {
        leaves.forEach((leaf, i) => {
          const localT = Math.max(0, elapsed - 0.6 - leaf.delay);
          if (localT <= 0) return;
          const scale = Math.min(1, localT * 1.8);
          const sway = Math.sin(elapsed * 1.5 + i * 0.2) * 2.2;
          drawHeart(leaf.x + sway, leaf.y, leaf.size * scale, leaf.color, leaf.angle, 0.92);
        });
      }

      // Falling Heart Petals
      if (elapsed > 1.8) {
        falling.forEach(p => {
          p.x += p.vx + Math.sin(elapsed + p.y * 0.03) * 0.3;
          p.y += p.vy;
          p.rot += 0.02;
          if (p.y > 386) {
            p.y = 110 + Math.random() * 80;
            p.x = width / 2 + (Math.random() - 0.5) * 180;
          }
          drawHeart(p.x, p.y, p.size, p.color, p.rot, 0.85);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [stage]);

  const handlePlantSeed = () => {
    sound.playUnlockSuccess();
    if (!isPlaying) sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
    setStage('blooming');
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#e11d48', '#fb7185', '#fda4af', '#fbbf24']
      });
    } catch (e) {}
  };

  const handleTreeTap = (e) => {
    sound.playClick();
    if (phrases.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
      const y = e.clientY ? e.clientY - rect.top : rect.height / 3;
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      const id = Date.now() + Math.random();
      setFloatingNotes(prev => [...prev.slice(-4), { id, text: phrase, x, y }]);
      setTimeout(() => {
        setFloatingNotes(prev => prev.filter(n => n.id !== id));
      }, 2600);
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div
      className="relative min-h-full w-full text-[#4a1525] flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate"
      style={{
        background: 'linear-gradient(160deg, #fff5f8 0%, #ffe4ec 50%, #ffd8e4 100%)'
      }}
    >
      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#e11d48" />

      {/* Header */}
      <div className="z-10 text-center max-w-md w-full mt-1">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-700 text-xs font-bold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-[#881337] drop-shadow-sm">
            {titleText}
          </h1>
        )}

        {/* Live Relationship Counter */}
        {showCounter && (
          <div className="mt-3 bg-white/75 backdrop-blur-md border border-rose-300/70 rounded-2xl p-3 shadow-md">
            {subHeader && <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 mb-1.5">{subHeader}</p>}
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { val: timeTogether.days, label: 'Días' },
                { val: timeTogether.hours, label: 'Horas' },
                { val: timeTogether.mins, label: 'Min' },
                { val: timeTogether.secs, label: 'Seg' }
              ].map((item, idx) => (
                <div key={idx} className="bg-rose-50/90 rounded-xl py-1.5 px-2 border border-rose-200">
                  <div className="text-base sm:text-lg font-black text-rose-700 font-mono">{item.val}</div>
                  <div className="text-[10px] text-rose-500 font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STAGE 1: Interactive Heart Seed */}
      {stage === 'seed' && (
        <div className="my-auto flex flex-col items-center z-10">
          <button
            type="button"
            onClick={handlePlantSeed}
            className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 flex items-center justify-center shadow-[0_12px_35px_rgba(225,29,72,0.45)] group-hover:scale-110 transition-transform duration-300 animate-bounce">
              <Heart className="w-14 h-14 text-white fill-white" />
            </div>
            {actionHint && (
              <span className="mt-4 px-5 py-2 rounded-full bg-white/90 border border-rose-300 text-rose-800 text-xs sm:text-sm font-bold shadow-md">
                {actionHint}
              </span>
            )}
          </button>
        </div>
      )}

      {/* STAGE 2: Blooming Heart-Leaf Tree Canvas */}
      {stage === 'blooming' && (
        <div className="relative my-auto flex flex-col items-center z-10 w-full max-w-md" onClick={handleTreeTap}>
          <canvas
            ref={canvasRef}
            className="w-72 h-72 sm:w-80 sm:h-80 cursor-pointer drop-shadow-[0_12px_25px_rgba(225,29,72,0.2)]"
          />

          {/* Floating Phrases on Click */}
          {floatingNotes.map(note => (
            <div
              key={note.id}
              style={{ left: Math.max(20, Math.min(260, note.x - 60)), top: Math.max(10, note.y - 30) }}
              className="absolute z-30 pointer-events-none bg-white/95 border border-rose-300 text-rose-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce"
            >
              {note.text}
            </div>
          ))}

          {unlockMsg && (
            <p className="text-xs text-rose-700/80 font-medium text-center mb-3">
              {unlockMsg}
            </p>
          )}

          {(letterTitle || letterBody || photos.length > 0) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setStage('letter');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(225,29,72,0.45)] hover:scale-105 transition cursor-pointer"
            >
              <Mail className="w-4 h-4 animate-pulse" />
              <span>Abrir Carta de Amor</span>
            </button>
          )}
        </div>
      )}

      {/* STAGE 3: Full Love Letter & Photo Carousel */}
      {stage === 'letter' && (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
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
            onReplay={() => setStage('blooming')}
          />
        </div>
      )}

      <div />
    </div>
  );
}
