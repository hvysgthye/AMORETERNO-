import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audioHelper';
import { Sparkles, Compass, Heart, Music } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function GalaxyTemplate({ data }) {
  const canvasRef = useRef(null);
  const [bgmActive, setBgmActive] = useState(false);
  const [showConstellation, setShowConstellation] = useState(true);
  const [selectedStar, setSelectedStar] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 650);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 650;
    };
    window.addEventListener('resize', handleResize);

    // Generate 180 cosmic stars with depth and twinkle
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      color: ['#ffffff', '#f472b6', '#a78bfa', '#67e8f9'][Math.floor(Math.random() * 4)],
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    }));

    // Interactive Constellation Points (Shaped as a double heart in the cosmos)
    const centerX = width / 2;
    const centerY = height / 2 - 40;
    const constellationPoints = [
      { x: centerX - 60, y: centerY - 40, label: 'Tú' },
      { x: centerX, y: centerY - 80, label: 'Amor' },
      { x: centerX + 60, y: centerY - 40, label: 'Yo' },
      { x: centerX + 90, y: centerY + 10, label: 'Destino' },
      { x: centerX, y: centerY + 90, label: 'Eternidad' },
      { x: centerX - 90, y: centerY + 10, label: 'Unión' },
    ];

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep cosmic gradient
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, width * 0.7
      );
      gradient.addColorStop(0, '#1a0b2e');
      gradient.addColorStop(0.5, '#0d0720');
      gradient.addColorStop(1, '#05030a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Twinkling Stars
      stars.forEach(star => {
        star.alpha += star.speed;
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const currentAlpha = Math.abs(Math.sin(star.alpha));
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Constellation Lines & Glowing Nodes
      if (showConstellation) {
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        constellationPoints.forEach((pt, i) => {
          // Subtle celestial breathing wobble
          const wobbleX = pt.x + Math.sin(t + i) * 3;
          const wobbleY = pt.y + Math.cos(t + i) * 3;
          if (i === 0) ctx.moveTo(wobbleX, wobbleY);
          else ctx.lineTo(wobbleX, wobbleY);
        });
        ctx.closePath();
        ctx.stroke();

        // Draw Nodes
        constellationPoints.forEach((pt, i) => {
          const wobbleX = pt.x + Math.sin(t + i) * 3;
          const wobbleY = pt.y + Math.cos(t + i) * 3;

          // Glowing Aura
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(wobbleX, wobbleY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(wobbleX, wobbleY, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showConstellation]);

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-[#05030a] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['sparkle','dot']} colors={['#c4b5fd','#f0abfc','#93c5fd','#ffffff']} aurora={['#6d28d9','#db2777']} stars={70} seed={18} />
      {/* Background Interactive Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 cursor-crosshair" />

      {/* Floating Music Control */}
      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#a78bfa" />

      {/* Top Header Card */}
      <div className="z-10 text-center max-w-md w-full bg-slate-900/60 border border-purple-500/30 backdrop-blur-md rounded-2xl p-4 shadow-xl mt-2 animate-float">
        <div className="inline-flex items-center gap-1.5 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Compass className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
          <span>{data?.starName || 'Constelación Mateo & Sofia'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200">
          {data?.title || 'Nuestro Universo Juntos'}
        </h1>
        <p className="text-xs text-purple-200/70 mt-1">
          Coordenadas: 14° 02' 24" N — Fecha estelar: {data?.anniversaryDate || 'Eternidad'}
        </p>
      </div>

      {/* Center Prompt */}
      <div className="z-10 text-center my-auto pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/40 border border-purple-400/30 backdrop-blur-lg text-purple-200 text-xs shadow-lg shadow-purple-900/40">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>Toca las estrellas para sentir nuestra gravedad cósmica</span>
        </div>
      </div>

      {/* Bottom Love Message */}
      <div className="z-10 w-full max-w-md bg-gradient-to-t from-slate-950/90 to-purple-950/70 border border-purple-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl mb-2">
        <div className="flex items-center gap-2 text-pink-300 mb-2">
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          <h2 className="font-semibold text-sm tracking-wide">
            {data?.letterTitle || 'Más allá de las estrellas'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-light whitespace-pre-line">
          {data?.letterBody || 'Ni todo el brillo de las galaxias se compara con la luz que trajiste a mi mundo. Te amo hasta el infinito y más allá.'}
        </p>
      </div>
    </div>
  );
}
