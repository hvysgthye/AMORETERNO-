import React, { useRef, useEffect, useState, useMemo } from 'react';
import { sound } from '../../utils/audioHelper';
import { Sparkles, Heart, Mail, X, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function GalaxyTemplate({ data }) {
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [zoom, setZoom] = useState(1);

  const badgeText = resolveText(data?.badgeText, 'Nuestro Universo Infinito');
  const titleText = resolveText(data?.title, 'Nuestro Universo Juntos');
  const subHeader = resolveText(data?.subHeader ?? data?.lockStatus, 'Arrastra para rotar la galaxia • Toca las estrellas y recuerdos');
  const unlockMsg = resolveText(data?.unlockMsg, 'Brillas más que todas las estrellas del cosmos');
  const letterTitle = resolveText(data?.letterTitle, 'Más allá de las estrellas');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Ni todo el brillo de las galaxias se compara con la luz que trajiste a mi mundo. Te amo hasta el infinito y más allá.');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const phrases = useMemo(() => {
    const raw = resolveText(
      data?.floatingPhrases,
      'Eres mi universo entero ✨\nMi estrella favorita 🌟\nContigo hasta el infinito 💫\nMi lugar seguro ❤️\nAmor cósmico y eterno 🪐\nNacimos bajo la misma estrella 🌙'
    );
    return raw
      ? raw.split('\n').map(s => s.trim()).filter(Boolean)
      : [];
  }, [data?.floatingPhrases]);

  const projectedItemsRef = useRef([]);
  const rotRef = useRef({ yaw: 0.3, pitch: 0.45, dragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement.clientHeight || 660);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 400;
      height = canvas.height = canvas.parentElement.clientHeight || 660;
    };
    window.addEventListener('resize', handleResize);

    // 550 Spiral Galaxy Stars in 3D space
    const spiralStars = Array.from({ length: 550 }, (_, i) => {
      const arm = i % 3;
      const dist = 35 + Math.pow(Math.random(), 0.75) * 240;
      const angle = (dist * 0.032) + (arm * ((Math.PI * 2) / 3)) + (Math.random() - 0.5) * 0.55;
      return {
        dist,
        angle,
        y: (Math.random() - 0.5) * 28 * (1 - dist / 300),
        size: Math.random() * 2 + 0.6,
        color: ['#ffffff', '#f472b6', '#c084fc', '#67e8f9', '#fde047'][i % 5],
        speed: 0.002 + (1 / (dist + 40)) * 0.35
      };
    });

    // Orbiting 3D Romantic Phrases & Photo Nodes
    const orbitNodes = [
      ...phrases.map((text, idx) => ({
        type: 'phrase',
        text,
        dist: 115 + (idx % 3) * 45,
        angle: (idx / Math.max(1, phrases.length)) * Math.PI * 2,
        y: ((idx % 2 === 0 ? 1 : -1) * 18),
        speed: 0.0032
      })),
      ...photos.map((src, idx) => ({
        type: 'photo',
        src,
        dist: 155 + (idx % 2) * 40,
        angle: (idx / Math.max(1, photos.length)) * Math.PI * 2 + 0.5,
        y: (idx % 2 === 0 ? -24 : 24),
        speed: 0.0026
      }))
    ];

    // Shooting stars
    const meteors = Array.from({ length: 3 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      vx: -4 - Math.random() * 3,
      vy: 2 + Math.random() * 2,
      len: 55 + Math.random() * 40,
      alpha: 0
    }));

    let t = 0;
    const render = () => {
      t += 0.016;
      if (!rotRef.current.dragging) {
        rotRef.current.yaw += 0.0035;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep space nebula background
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.75);
      grad.addColorStop(0, '#2e0b46');
      grad.addColorStop(0.45, '#110622');
      grad.addColorStop(1, '#040208');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Shooting stars
      meteors.forEach(m => {
        if (m.alpha <= 0 && Math.random() < 0.012) {
          m.x = width * (0.4 + Math.random() * 0.6);
          m.y = Math.random() * height * 0.35;
          m.alpha = 1;
        }
        if (m.alpha > 0) {
          m.x += m.vx;
          m.y += m.vy;
          m.alpha -= 0.018;
          ctx.save();
          ctx.strokeStyle = `rgba(244, 114, 182, ${Math.max(0, m.alpha)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * 8, m.y - m.vy * 8);
          ctx.stroke();
          ctx.restore();
        }
      });

      const cx = width / 2;
      const cy = height * 0.48;
      const cosY = Math.cos(rotRef.current.yaw);
      const sinY = Math.sin(rotRef.current.yaw);
      const cosP = Math.cos(rotRef.current.pitch);
      const sinP = Math.sin(rotRef.current.pitch);
      const fov = 420 * zoom;

      const project3D = (x, y, z) => {
        const rx = x * cosY - z * sinY;
        const rz = x * sinY + z * cosY;
        const ry = y * cosP - rz * sinP;
        const fz = y * sinP + rz * cosP;
        const depth = fov / Math.max(120, fov + fz + 260);
        return {
          sx: cx + rx * depth,
          sy: cy + ry * depth,
          depth,
          fz
        };
      };

      // Draw spiral galaxy particles
      spiralStars.forEach(s => {
        s.angle += s.speed;
        const x = Math.cos(s.angle) * s.dist;
        const z = Math.sin(s.angle) * s.dist;
        const p = project3D(x, s.y, z);
        ctx.globalAlpha = Math.min(1, Math.max(0.15, p.depth * 0.85));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, s.size * p.depth, 0, Math.PI * 2);
        ctx.fill();
      });

      // Glowing Heart Accretion Core at center (0,0,0)
      const beat = 1 + Math.sin(t * 3.2) * 0.08;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(beat * zoom, beat * zoom);
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 32;
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.bezierCurveTo(-18, -28, -36, -6, 0, 22);
      ctx.bezierCurveTo(36, -6, 18, -28, 0, -10);
      ctx.fill();
      ctx.restore();

      // Orbiting 3D Phrases & Photo badges
      const hitList = [];
      orbitNodes.forEach(node => {
        node.angle += node.speed;
        const x = Math.cos(node.angle) * node.dist;
        const z = Math.sin(node.angle) * node.dist;
        const p = project3D(x, node.y, z);

        ctx.save();
        ctx.globalAlpha = Math.min(1, Math.max(0.35, p.depth * 0.95));
        if (node.type === 'phrase') {
          ctx.font = `600 ${Math.max(10, Math.round(12 * p.depth))}px system-ui, sans-serif`;
          const textW = ctx.measureText(node.text).width;
          const padX = 10;
          const boxW = textW + padX * 2;
          const boxH = 24 * p.depth;
          ctx.fillStyle = 'rgba(30, 10, 48, 0.78)';
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.55)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(p.sx - boxW / 2, p.sy - boxH / 2, boxW, boxH, 999);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fce7f3';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.text, p.sx, p.sy);
          hitList.push({ x: p.sx, y: p.sy, r: Math.max(24, boxW / 2), node });
        } else if (node.type === 'photo') {
          const r = 18 * p.depth;
          ctx.fillStyle = 'rgba(236, 72, 153, 0.28)';
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.font = `${Math.round(14 * p.depth)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('📸', p.sx, p.sy);
          hitList.push({ x: p.sx, y: p.sy, r: r + 10, node });
        }
        ctx.restore();
      });

      projectedItemsRef.current = hitList;
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [phrases, photos, zoom]);

  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    rotRef.current.dragging = true;
    rotRef.current.lastX = clientX;
    rotRef.current.lastY = clientY;
  };

  const handlePointerMove = (e) => {
    if (!rotRef.current.dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - rotRef.current.lastX;
    const dy = clientY - rotRef.current.lastY;
    rotRef.current.yaw += dx * 0.007;
    rotRef.current.pitch = Math.max(-1.1, Math.min(1.1, rotRef.current.pitch + dy * 0.007));
    rotRef.current.lastX = clientX;
    rotRef.current.lastY = clientY;
  };

  const handlePointerUp = () => {
    rotRef.current.dragging = false;
  };

  const handleCanvasClick = (e) => {
    if (!started) {
      setStarted(true);
      sound.playUnlockSuccess();
      if (!bgmActive) sound.toggleMusicTrack(data?.customAudio, setBgmActive);
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if user tapped an orbiting phrase or photo node
    for (let i = projectedItemsRef.current.length - 1; i >= 0; i--) {
      const item = projectedItemsRef.current[i];
      const dist = Math.hypot(x - item.x, y - item.y);
      if (dist <= item.r) {
        sound.playClick();
        if (item.node.type === 'phrase') {
          setSelectedPhrase(item.node.text);
        } else if (item.node.type === 'photo') {
          setSelectedPhoto(item.node.src);
        }
        return;
      }
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-[#040208] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#c084fc" />

      {/* Top Cosmic Header */}
      <div className="z-10 text-center max-w-md w-full bg-slate-950/65 border border-purple-500/30 backdrop-blur-md rounded-2xl p-4 shadow-xl mt-1">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-xl sm:text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200">
            {titleText}
          </h1>
        )}
        {subHeader && (
          <p className="text-xs text-purple-200/75 mt-1">{subHeader}</p>
        )}
      </div>

      {/* Initial Tap to Enter Galaxy Overlay */}
      {!started && (
        <div
          onClick={() => {
            setStarted(true);
            sound.playUnlockSuccess();
            if (!bgmActive) sound.toggleMusicTrack(data?.customAudio, setBgmActive);
          }}
          className="z-20 my-auto flex flex-col items-center cursor-pointer bg-purple-950/60 border border-pink-400/40 backdrop-blur-xl px-7 py-5 rounded-3xl shadow-[0_0_40px_rgba(236,72,153,0.4)] animate-pulse"
        >
          <Sparkles className="w-8 h-8 text-pink-400 mb-2" />
          <span className="text-base font-bold text-pink-100">Toca para explorar nuestra galaxia ✨</span>
          {unlockMsg && <span className="text-xs text-purple-200/80 mt-1">{unlockMsg}</span>}
        </div>
      )}

      {/* Selected Floating Phrase Toast */}
      {selectedPhrase && (
        <div className="z-20 my-auto max-w-xs bg-purple-950/90 border border-pink-400/50 rounded-2xl p-4 text-center shadow-2xl backdrop-blur-xl animate-fade-in">
          <p className="text-sm font-serif-romance text-pink-100 mb-2">“{selectedPhrase}”</p>
          <button
            type="button"
            onClick={() => setSelectedPhrase(null)}
            className="text-xs text-pink-300 underline cursor-pointer"
          >
            Seguir explorando
          </button>
        </div>
      )}

      {/* Selected Orbiting Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-sm w-full bg-slate-900 border border-pink-500/40 rounded-3xl p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={selectedPhoto} alt="" className="w-full max-h-80 object-cover rounded-2xl" />
            {photoCaption && <p className="text-center text-xs text-pink-200 mt-3 italic">{photoCaption}</p>}
          </div>
        </div>
      )}

      {/* Bottom Controls & Open Letter Button */}
      <div className="z-10 w-full max-w-md flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-1.5 bg-slate-950/75 border border-purple-500/30 rounded-full p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setZoom(z => Math.max(0.65, +(z - 0.15).toFixed(2)))}
            className="p-2 rounded-full hover:bg-white/10 text-purple-200 cursor-pointer"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(z => Math.min(1.6, +(z + 0.15).toFixed(2)))}
            className="p-2 rounded-full hover:bg-white/10 text-purple-200 cursor-pointer"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {(letterTitle || letterBody || photos.length > 0) && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowLetterModal(true);
            }}
            className="flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-[1.02] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Leer Carta Estelar</span>
          </button>
        )}
      </div>

      {/* Full Cosmic Love Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-auto">
            <LoveLetterCard
              variant="Flush"
              accent="#ec4899"
              badge={badgeText}
              photo={photos[0] || ''}
              photos={photos}
              photoCaption={photoCaption}
              title={letterTitle}
              body={letterBody}
              signature={signature}
              typewriter={true}
              onReplay={() => setShowLetterModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
