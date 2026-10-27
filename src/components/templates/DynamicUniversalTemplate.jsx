import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Sparkles } from 'lucide-react';
import { TEMPLATES } from '../../data/templates';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

/* ------------------------------------------------------------------
   Plantilla universal temática.
   Cada plantilla sin componente dedicado recibe aquí su propio tema:
   fondo, paleta, partículas, emblema SVG ilustrado e interacción por
   pasos (toques) antes de revelar la carta.
------------------------------------------------------------------- */

const HEART_D =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

// Corazón SVG posicionado (centro x,y; s = escala sobre base 24px)
const H = ({ x, y, s = 1, ...rest }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) translate(-12 -12)`}>
    <path d={HEART_D} {...rest} />
  </g>
);

const Glow = ({ id, color }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="4" result="b" />
    <feFlood floodColor={color} />
    <feComposite in2="b" operator="in" />
    <feMerge>
      <feMergeNode />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

/* ======================= Emblemas ilustrados ======================= */

const BookEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="bk-leather" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7f1d1d" />
        <stop offset="1" stopColor="#3b0a0a" />
      </linearGradient>
      <linearGradient id="bk-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fde68a" />
        <stop offset="0.5" stopColor="#d97706" />
        <stop offset="1" stopColor="#fef3c7" />
      </linearGradient>
    </defs>
    {unlocked ? (
      <g>
        <path d="M20 60 Q60 45 100 60 V165 Q60 150 20 165z" fill="#fdf6e3" stroke="#d6c49a" />
        <path d="M180 60 Q140 45 100 60 V165 Q140 150 180 165z" fill="#fbf1d6" stroke="#d6c49a" />
        {[75, 88, 101, 114, 127].map((y) => (
          <path key={y} d={`M32 ${y} Q60 ${y - 8} 90 ${y}`} stroke="#c9b48a" strokeWidth="1.2" fill="none" />
        ))}
        <H x={140} y={105} s={2.2} fill="#e11d48" className="dp-heartbeat" style={{ transformOrigin: '140px 105px' }} />
        <path d="M100 60 V165" stroke="#b08d57" strokeWidth="2" />
      </g>
    ) : (
      <g>
        <rect x="45" y="35" width="115" height="140" rx="8" fill="#f5e6c8" />
        <rect x="40" y="30" width="115" height="140" rx="8" fill="url(#bk-leather)" stroke="url(#bk-gold)" strokeWidth="3" />
        <rect x="52" y="42" width="91" height="116" rx="4" fill="none" stroke="url(#bk-gold)" strokeWidth="1" strokeDasharray="3 3" />
        <H x={97} y={95} s={2.4} fill="url(#bk-gold)" />
        <text x="97" y="145" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="11" fill="#fde68a">
          Nuestra Historia
        </text>
        <rect x="150" y="88" width="18" height="16" rx="3" fill="url(#bk-gold)" />
      </g>
    )}
  </svg>
);

const ChocolateEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="ch-box" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#be123c" />
        <stop offset="1" stopColor="#4c0519" />
      </linearGradient>
      <radialGradient id="ch-bon" cx="0.35" cy="0.35">
        <stop offset="0" stopColor="#a16207" />
        <stop offset="0.6" stopColor="#5b2c0f" />
        <stop offset="1" stopColor="#2a1206" />
      </radialGradient>
    </defs>
    <H x={100} y={115} s={6.2} fill="url(#ch-box)" stroke="#fda4af" strokeWidth="0.3" />
    <H x={100} y={115} s={5.4} fill="#2a0a12" />
    {[
      [78, 92], [100, 95], [122, 92], [86, 116], [114, 116], [100, 138]
    ].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="10" fill="url(#ch-bon)" />
        <path d={`M${x - 5} ${y - 2} q5 -4 10 0`} stroke="#fcd34d" strokeWidth="1.2" fill="none" />
      </g>
    ))}
    {!unlocked && (
      <g style={{ transform: `translateY(${-step * 14}px) rotate(${-step * 4}deg)`, transformOrigin: '100px 60px', transition: 'transform .5s' }}>
        <H x={100} y={110} s={6.4} fill="url(#ch-box)" stroke="#fecdd3" strokeWidth="0.25" />
        <path d="M100 40 V175" stroke="#fcd34d" strokeWidth="6" />
        <path d="M25 105 H175" stroke="#fcd34d" strokeWidth="6" />
        <path d="M100 100 q-30 -35 -40 -5 q15 15 40 5z M100 100 q30 -35 40 -5 q-15 15 -40 5z" fill="#fbbf24" stroke="#b45309" />
        <circle cx="100" cy="100" r="7" fill="#f59e0b" stroke="#b45309" />
      </g>
    )}
  </svg>
);

const NetEmblem = ({ step, unlocked, total }) => {
  const nodes = [
    [100, 60], [60, 40], [140, 40], [30, 75], [170, 75], [45, 115], [155, 115], [75, 145], [125, 145], [100, 170]
  ];
  const links = [[1, 0], [2, 0], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 9]];
  const lit = unlocked ? links.length : Math.round((step / total) * links.length);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><Glow id="nt-g" color="#22d3ee" /></defs>
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={i < lit ? '#67e8f9' : 'rgba(148,163,184,0.25)'}
          strokeWidth={i < lit ? 2.2 : 1}
          filter={i < lit ? 'url(#nt-g)' : undefined}
          style={{ transition: 'all .6s' }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 || i === 9 ? 6 : 4.5} fill={unlocked ? '#f472b6' : '#a5f3fc'} filter="url(#nt-g)" />
      ))}
      {unlocked && <H x={100} y={105} s={2.4} fill="#f472b6" filter="url(#nt-g)" className="dp-heartbeat" style={{ transformOrigin: '100px 105px' }} />}
    </svg>
  );
};

const MemoramaEmblem = ({ step, unlocked }) => {
  const faces = ['♥', '★', '♥', '★'];
  return (
    <div className="grid grid-cols-2 gap-3 w-full h-full p-3">
      {faces.map((f, i) => {
        const open = unlocked || i < step;
        return (
          <div key={i} className="perspective-1000">
            <div
              className="relative w-full h-full transition-transform duration-700 transform-style-3d"
              style={{ transform: open ? 'rotateY(180deg)' : 'none' }}
            >
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-300/70 bg-gradient-to-br from-violet-700 to-rose-600 flex items-center justify-center [backface-visibility:hidden] shadow-lg">
                <span className="text-3xl text-amber-200/90 font-serif-romance">?</span>
              </div>
              <div
                className="absolute inset-0 rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center [backface-visibility:hidden] shadow-lg"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <span className={`text-4xl ${f === '♥' ? 'text-rose-500' : 'text-amber-500'}`}>{f}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MemoriHeartEmblem = ({ step, unlocked, total }) => {
  // Puntos sobre la silueta de un corazón paramétrico
  const pts = Array.from({ length: 14 }, (_, i) => {
    const t = (i / 14) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [100 + x * 4.6, 100 + y * 4.6];
  });
  const lit = unlocked ? pts.length : Math.round((step / total) * pts.length);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <Glow id="mh-g" color="#fb7185" />
        <linearGradient id="mh-f" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fda4af" />
          <stop offset="1" stopColor="#be123c" />
        </linearGradient>
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} style={{ transition: 'all .5s', opacity: i < lit ? 1 : 0.25 }}>
          <rect x={x - 11} y={y - 11} width="22" height="22" rx="4" fill="white" transform={`rotate(${(i % 3) * 6 - 6} ${x} ${y})`} />
          <rect x={x - 8} y={y - 8} width="16" height="14" rx="2" fill={i < lit ? 'url(#mh-f)' : '#334155'} transform={`rotate(${(i % 3) * 6 - 6} ${x} ${y})`} />
        </g>
      ))}
      <H x={100} y={102} s={unlocked ? 2.6 : 1.8} fill="#fb7185" filter="url(#mh-g)" className={unlocked ? 'dp-heartbeat' : ''} style={{ transformOrigin: '100px 102px', transition: 'all .5s' }} />
    </svg>
  );
};

const MazeEmblem = ({ step, unlocked, total }) => {
  const path = 'M25 25 H75 V65 H35 V105 H95 V45 H135 V85 H175 V135 H125 V175 H100';
  const len = 820;
  const progress = unlocked ? 1 : step / total;
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><Glow id="mz-g" color="#34d399" /></defs>
      <rect x="10" y="10" width="180" height="180" rx="14" fill="rgba(2,44,34,0.6)" stroke="#5eead4" strokeOpacity="0.4" />
      {['M10 50 H55', 'M55 85 H115', 'M115 25 V65', 'M155 65 V115', 'M10 125 H75 V190', 'M115 105 V155 H155', 'M155 155 V190'].map((d, i) => (
        <path key={i} d={d} stroke="#99f6e4" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" fill="none" />
      ))}
      <path d={path} stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeDasharray="4 6" fill="none" />
      <path
        d={path}
        stroke="#f472b6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#mz-g)"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
        style={{ transition: 'stroke-dashoffset .8s ease' }}
      />
      <circle cx="25" cy="25" r="6" fill="#fde68a" />
      <H x={100} y={178} s={unlocked ? 1.4 : 0.9} fill="#fb7185" filter="url(#mz-g)" className="dp-heartbeat" style={{ transformOrigin: '100px 178px' }} />
    </svg>
  );
};

const RaceEmblem = ({ step, unlocked, total }) => {
  const p = unlocked ? 1 : step / total;
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <pattern id="rc-flag" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#fff" /><rect x="4" y="4" width="4" height="4" fill="#fff" />
        </pattern>
      </defs>
      {[70, 120].map((y, i) => (
        <g key={y}>
          <rect x="15" y={y - 18} width="170" height="36" rx="18" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.15)" />
          <path d={`M30 ${y} H170`} stroke="rgba(255,255,255,0.35)" strokeDasharray="8 8" strokeWidth="1.5" />
          <g style={{ transform: `translateX(${p * (i ? 125 : 118)}px)`, transition: 'transform .7s cubic-bezier(.3,1.4,.5,1)' }}>
            <H x={32} y={y} s={1.3} fill={i ? '#fbbf24' : '#f43f5e'} stroke="#fff" strokeWidth="1" />
          </g>
        </g>
      ))}
      <rect x="170" y="45" width="10" height="100" fill="#111" />
      <rect x="170" y="45" width="10" height="100" fill="url(#rc-flag)" />
      <text x="100" y="175" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fde68a" letterSpacing="2">
        {unlocked ? '¡LLEGAMOS JUNTOS!' : `VUELTA ${step}/${total}`}
      </text>
    </svg>
  );
};

const CupidEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <radialGradient id="cp-t">
        <stop offset="0" stopColor="#fecdd3" />
        <stop offset="1" stopColor="#e11d48" />
      </radialGradient>
      <Glow id="cp-g" color="#fb7185" />
    </defs>
    <H x={100} y={100} s={6.5} fill="url(#cp-t)" filter="url(#cp-g)" />
    <H x={100} y={100} s={4.6} fill="none" stroke="#fff" strokeWidth="0.35" strokeDasharray="1 1" />
    <H x={100} y={100} s={2.6} fill="none" stroke="#fff" strokeWidth="0.45" />
    {Array.from({ length: unlocked ? 3 : step }).map((_, i) => {
      const ang = [-25, 10, 40][i];
      return (
        <g key={i} transform={`rotate(${ang} 100 100)`} className="dp-reveal">
          <line x1="100" y1="100" x2="185" y2="100" stroke="#fef3c7" strokeWidth="2.5" />
          <path d="M180 100 l10 -6 v12z M172 100 l10 -6 v12z" fill="#fda4af" />
          <path d="M96 100 l8 -5 v10z" fill="#fde68a" />
        </g>
      );
    })}
  </svg>
);

const BalloonHeartEmblem = ({ step, unlocked, total }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
    <defs>
      <radialGradient id="bh-f" cx="0.35" cy="0.3">
        <stop offset="0" stopColor="#fff1f2" />
        <stop offset="0.3" stopColor="#fb7185" />
        <stop offset="1" stopColor="#9f1239" />
      </radialGradient>
    </defs>
    {unlocked ? (
      Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <H key={i} x={100 + Math.cos(a) * 70} y={100 + Math.sin(a) * 70} s={1.1} fill={i % 2 ? '#fbbf24' : '#fb7185'} className="dp-reveal" />;
      })
    ) : null}
    <g
      className={!unlocked && step > 0 ? 'dp-shake' : ''}
      key={step}
      style={{ transform: `scale(${unlocked ? 0.9 : 0.75 + (step / total) * 0.4})`, transformOrigin: '100px 100px', transition: 'transform .4s cubic-bezier(.3,1.6,.5,1)' }}
    >
      <H x={100} y={100} s={5.8} fill="url(#bh-f)" />
      <ellipse cx="72" cy="70" rx="12" ry="7" fill="white" opacity="0.55" transform="rotate(-35 72 70)" />
      {unlocked && <text x="100" y="105" textAnchor="middle" fontSize="16" fill="white" fontFamily="Dancing Script, cursive" fontWeight="700">¡Sorpresa!</text>}
    </g>
  </svg>
);

const BubblesEmblem = ({ step, unlocked }) => {
  const bubbles = [[60, 60, 30], [140, 60, 26], [100, 105, 40], [55, 150, 24], [145, 150, 28]];
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="bb-f" cx="0.3" cy="0.3">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#7dd3fc" stopOpacity="0.15" />
          <stop offset="1" stopColor="#f0abfc" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      {bubbles.map(([x, y, r], i) => {
        const popped = unlocked || i < step;
        return (
          <g key={i}>
            <H x={x} y={y} s={r / 22} fill="#f472b6" opacity={popped ? 1 : 0.35} style={{ transition: 'opacity .4s' }} />
            {!popped && (
              <g>
                <circle cx={x} cy={y} r={r} fill="url(#bb-f)" stroke="rgba(255,255,255,0.6)" />
                <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.25} ry={r * 0.12} fill="white" opacity="0.8" transform={`rotate(-35 ${x} ${y})`} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const RoadEmblem = ({ step, unlocked, total }) => {
  const marks = [[45, 160, 'Nos conocimos'], [150, 125, 'Primer beso'], [55, 80, 'Viajes'], [140, 35, 'Para siempre']];
  const lit = unlocked ? marks.length : step;
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <path d="M20 190 C 120 175, 180 150, 100 120 S 20 80, 100 60 S 190 30, 150 10" stroke="#1f2937" strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M20 190 C 120 175, 180 150, 100 120 S 20 80, 100 60 S 190 30, 150 10" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="6 7" fill="none" />
      {marks.map(([x, y, label], i) => (
        <g key={i} style={{ opacity: i < lit ? 1 : 0.35, transition: 'opacity .5s' }}>
          <path d={`M${x} ${y} v-18`} stroke="#e5e7eb" strokeWidth="1.5" />
          <circle cx={x} cy={y - 22} r="7" fill={i < lit ? '#34d399' : '#475569'} stroke="#fff" />
          {i < lit && <H x={x} y={y - 22} s={0.35} fill="#fff" />}
          <text x={x + (x > 100 ? -12 : 12)} y={y - 19} textAnchor={x > 100 ? 'end' : 'start'} fontSize="9" fill="#ecfdf5" fontWeight="600">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
};

const ThreeHeartsEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs><Glow id="th-g" color="#f9a8d4" /></defs>
    {[[50, 115, '#fb7185'], [100, 80, '#f472b6'], [150, 115, '#a78bfa']].map(([x, y, c], i) => {
      const on = unlocked || i < step;
      return (
        <g key={i}>
          <H x={x} y={y} s={2.3} fill={on ? c : 'rgba(255,255,255,0.08)'} stroke={c} strokeWidth="0.6" filter={on ? 'url(#th-g)' : undefined} className={on ? 'dp-heartbeat' : ''} style={{ transformOrigin: `${x}px ${y}px`, transition: 'fill .5s' }} />
          <text x={x} y={y + 45} textAnchor="middle" fontSize="10" fill={on ? '#fce7f3' : '#94a3b8'} fontWeight="600">
            {['Deseo I', 'Deseo II', 'Deseo III'][i]}
          </text>
        </g>
      );
    })}
  </svg>
);

const NeonHeartEmblem = ({ unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="nh-g" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={unlocked ? 6 : 2.5} result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <H x={100} y={100} s={6.2} fill="none" stroke={unlocked ? '#f0abfc' : '#6b21a8'} strokeWidth="0.5" filter="url(#nh-g)" className={unlocked ? 'dp-heartbeat' : 'animate-pulse'} style={{ transformOrigin: '100px 100px' }} />
    <H x={100} y={100} s={4.4} fill="none" stroke={unlocked ? '#f472b6' : '#4c1d95'} strokeWidth="0.5" filter="url(#nh-g)" />
    <path d="M40 104 H75 l8 -20 l10 40 l10 -45 l8 25 H160" stroke={unlocked ? '#fff' : '#a855f7'} strokeWidth="2.2" fill="none" filter="url(#nh-g)" strokeLinejoin="round" />
  </svg>
);

const MonogramEmblem = ({ unlocked, data }) => {
  const initials = (data?.title || 'A & M')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase());
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="mg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.5" stopColor="#ca8a04" />
          <stop offset="1" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="78" fill="#0c0a09" stroke="url(#mg-gold)" strokeWidth="2" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="url(#mg-gold)" strokeWidth="0.6" strokeDasharray="2 4" />
      {Array.from({ length: 24 }).map((_, i) => (
        <circle key={i} cx={100 + Math.cos((i / 24) * Math.PI * 2) * 86} cy={100 + Math.sin((i / 24) * Math.PI * 2) * 86} r="1.6" fill="url(#mg-gold)" />
      ))}
      <text x="100" y="114" textAnchor="middle" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="42" fill="url(#mg-gold)">
        {initials.length === 2 ? `${initials[0]}·${initials[1]}` : '♥'}
      </text>
      <text x="100" y="140" textAnchor="middle" fontSize="8" letterSpacing="4" fill="#d6d3d1">
        {unlocked ? 'CON TODO MI AMOR' : 'TOCA PARA ABRIR'}
      </text>
    </svg>
  );
};

const PrincessEmblem = ({ step, unlocked, total }) => {
  const gems = [[70, 92, '#f472b6'], [100, 78, '#a78bfa'], [130, 92, '#38bdf8']];
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="pr-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef9c3" />
          <stop offset="0.5" stopColor="#facc15" />
          <stop offset="1" stopColor="#ca8a04" />
        </linearGradient>
        <Glow id="pr-g" color="#fbcfe8" />
      </defs>
      <ellipse cx="100" cy="165" rx="60" ry="8" fill="rgba(0,0,0,0.25)" />
      <path d="M45 140 L35 70 L70 105 L100 55 L130 105 L165 70 L155 140z" fill="url(#pr-gold)" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
      <rect x="45" y="138" width="110" height="18" rx="4" fill="url(#pr-gold)" stroke="#a16207" strokeWidth="2" />
      {[35, 100, 165].map((x, i) => <circle key={i} cx={x} cy={[70, 55, 70][i]} r="6" fill="#fff7ed" stroke="#a16207" />)}
      {gems.map(([x, y, c], i) => {
        const on = unlocked || i < step;
        return <H key={i} x={x} y={y + 28} s={0.9} fill={on ? c : '#78350f'} filter={on ? 'url(#pr-g)' : undefined} style={{ transition: 'fill .4s' }} />;
      })}
      {[60, 80, 100, 120, 140].map((x) => <circle key={x} cx={x} cy="147" r="3" fill="#fff" opacity="0.85" />)}
    </svg>
  );
};

const HalloweenEmblem = ({ step, unlocked, total }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <radialGradient id="hw-moon" cx="0.4" cy="0.4">
        <stop offset="0" stopColor="#fffbeb" />
        <stop offset="1" stopColor="#fbbf24" />
      </radialGradient>
      <radialGradient id="hw-pump" cx="0.4" cy="0.35">
        <stop offset="0" stopColor="#fdba74" />
        <stop offset="1" stopColor="#c2410c" />
      </radialGradient>
      <Glow id="hw-g" color="#fb923c" />
    </defs>
    <circle cx="140" cy="55" r="38" fill="url(#hw-moon)" opacity="0.95" />
    <circle cx="125" cy="45" r="5" fill="#f59e0b" opacity="0.3" />
    <circle cx="150" cy="70" r="7" fill="#f59e0b" opacity="0.25" />
    <path d="M10 175 Q40 150 70 165 T130 160 T190 170 V200 H10z" fill="#0b0613" />
    <path d="M100 95 q2 -12 10 -16" stroke="#3f6212" strokeWidth="4" fill="none" strokeLinecap="round" />
    <ellipse cx="78" cy="132" rx="22" ry="34" fill="url(#hw-pump)" />
    <ellipse cx="122" cy="132" rx="22" ry="34" fill="url(#hw-pump)" />
    <ellipse cx="100" cy="132" rx="24" ry="36" fill="url(#hw-pump)" />
    <g filter={unlocked || step > 0 ? 'url(#hw-g)' : undefined} opacity={unlocked ? 1 : 0.25 + (step / total) * 0.75} style={{ transition: 'opacity .5s' }}>
      <H x={84} y={124} s={0.55} fill="#fef08a" />
      <H x={116} y={124} s={0.55} fill="#fef08a" />
      <path d="M78 145 q22 18 44 0 q-6 4 -11 1 l-5 5 l-6 -5 l-6 5 l-5 -5 q-6 3 -11 -1z" fill="#fef08a" />
    </g>
    {[[30, 50], [60, 35]].map(([x, y], i) => (
      <path key={i} d={`M${x} ${y} q5 -6 10 0 q5 -6 10 0 q-5 2 -10 6 q-5 -4 -10 -6z`} fill="#1e1b4b" />
    ))}
  </svg>
);

/* ======================= NUEVAS 10 PLANTILLAS VIRALES ======================= */

const CassetteEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="cas-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#27272a" />
        <stop offset="1" stopColor="#09090b" />
      </linearGradient>
      <linearGradient id="cas-label" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff1f2" />
        <stop offset="1" stopColor="#fecdd3" />
      </linearGradient>
      <Glow id="cas-g" color="#f43f5e" />
    </defs>
    {/* Cuerpo de casete */}
    <rect x="25" y="45" width="150" height="105" rx="8" fill="url(#cas-body)" stroke="#52525b" strokeWidth="2" />
    <path d="M35 150 L55 125 H145 L165 150z" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
    {/* Tornillos esquinas */}
    {[ [32, 52], [168, 52], [32, 142], [168, 142] ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#71717a" />
    ))}
    {/* Etiqueta adhesiva */}
    <rect x="40" y="55" width="120" height="52" rx="4" fill="url(#cas-label)" />
    <rect x="43" y="58" width="114" height="6" fill="#e11d48" />
    <text x="100" y="74" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#881337">
      SIDE A • NUESTRAS CANCIONES
    </text>
    {/* Ventana de carretes */}
    <rect x="58" y="80" width="84" height="34" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
    {/* Cinta conectora */}
    <rect x="74" y="94" width="52" height="6" fill="#78350f" opacity="0.8" />
    {/* Carrete izquierdo */}
    <g className={unlocked ? 'dp-spin-slow' : undefined} style={{ transformOrigin: '76px 97px' }}>
      <circle cx="76" cy="97" r="12" fill="#f4f4f5" />
      <circle cx="76" cy="97" r="5" fill="#09090b" />
      {[0, 60, 120].map((deg) => (
        <line key={deg} x1={76 - 10 * Math.cos((deg * Math.PI) / 180)} y1={97 - 10 * Math.sin((deg * Math.PI) / 180)} x2={76 + 10 * Math.cos((deg * Math.PI) / 180)} y2={97 + 10 * Math.sin((deg * Math.PI) / 180)} stroke="#09090b" strokeWidth="2" />
      ))}
    </g>
    {/* Carrete derecho */}
    <g className={unlocked ? 'dp-spin-slow' : undefined} style={{ transformOrigin: '124px 97px' }}>
      <circle cx="124" cy="97" r="12" fill="#f4f4f5" />
      <circle cx="124" cy="97" r="5" fill="#09090b" />
      {[0, 60, 120].map((deg) => (
        <line key={deg} x1={124 - 10 * Math.cos((deg * Math.PI) / 180)} y1={97 - 10 * Math.sin((deg * Math.PI) / 180)} x2={124 + 10 * Math.cos((deg * Math.PI) / 180)} y2={97 + 10 * Math.sin((deg * Math.PI) / 180)} stroke="#09090b" strokeWidth="2" />
      ))}
    </g>
    {/* Ecualizador animado al reproducir */}
    <g opacity={unlocked ? 1 : 0.4} filter={unlocked ? 'url(#cas-g)' : undefined}>
      {[65, 80, 100, 120, 135].map((x, i) => (
        <rect key={x} x={x} y={132 - (i % 2 === 0 ? 8 : 12)} width="4" height={i % 2 === 0 ? 8 : 12} rx="1" fill="#f43f5e" />
      ))}
    </g>
    <H x={100} y={165} s={1.2} fill={unlocked ? '#e11d48' : '#71717a'} />
  </svg>
);

const StarMapEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <radialGradient id="sm-sky" cx="0.5" cy="0.5">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="60%" stopColor="#090d16" />
        <stop offset="100%" stopColor="#020408" />
      </radialGradient>
      <Glow id="sm-g" color="#fbbf24" />
    </defs>
    <circle cx="100" cy="100" r="82" fill="url(#sm-sky)" stroke="#d97706" strokeWidth="2" />
    <circle cx="100" cy="100" r="74" fill="none" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2 3" />
    {/* Anillo de constelaciones */}
    {Array.from({ length: 36 }).map((_, i) => (
      <line key={i} x1={100 + Math.cos((i * 10 * Math.PI) / 180) * 78} y1={100 + Math.sin((i * 10 * Math.PI) / 180) * 78} x2={100 + Math.cos((i * 10 * Math.PI) / 180) * 82} y2={100 + Math.sin((i * 10 * Math.PI) / 180) * 82} stroke="#fbbf24" strokeWidth="1" />
    ))}
    {/* Luna creciente */}
    <path d="M145 60 A18 18 0 1 0 135 90 A15 15 0 1 1 145 60z" fill="#fef08a" opacity="0.9" />
    {/* Constelación corazón */}
    <g stroke="#93c5fd" strokeWidth="1" opacity={unlocked ? 1 : 0.5}>
      <line x1="80" y1="85" x2="100" y2="70" />
      <line x1="100" y1="70" x2="120" y2="85" />
      <line x1="120" y1="85" x2="100" y2="120" />
      <line x1="100" y1="120" x2="80" y2="85" />
    </g>
    {[[80, 85], [100, 70], [120, 85], [100, 120], [65, 110], [135, 115], [70, 60], [130, 60]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i < 4 ? 3 : 2} fill="#fef08a" filter="url(#sm-g)" />
    ))}
    <text x="100" y="145" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill="#fde68a" letterSpacing="2">
      EL CIELO DE NUESTRA NOCHE
    </text>
    <text x="100" y="156" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fill="#94a3b8">
      19° 25' N • 99° 08' W
    </text>
  </svg>
);

const PolaroidEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="pol-cam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f8fafc" />
        <stop offset="1" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    {/* Cordel y pinzas con fotos colgadas */}
    <path d="M15 45 Q100 65 185 45" stroke="#78350f" strokeWidth="2" fill="none" />
    {/* Luces cálidas fairy lights */}
    {[35, 75, 100, 125, 165].map((x, i) => (
      <circle key={i} cx={x} cy={48 + (i % 2 === 0 ? 4 : 8)} r="4" fill="#fef08a" />
    ))}
    {/* Foto 1 izq */}
    <g transform="translate(40, 70) rotate(-8)">
      <rect x="0" y="0" width="55" height="70" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="5" y="5" width="45" height="45" fill="#f43f5e" />
      <H x={27} y={27} s={1.2} fill="#fff" />
      <rect x="23" y="-8" width="8" height="12" rx="1" fill="#d97706" />
    </g>
    {/* Foto 2 der */}
    <g transform="translate(105, 65) rotate(10)">
      <rect x="0" y="0" width="55" height="70" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="5" y="5" width="45" height="45" fill="#8b5cf6" />
      <H x={27} y={27} s={1.2} fill="#fff" />
      <rect x="23" y="-8" width="8" height="12" rx="1" fill="#d97706" />
    </g>
    {/* Foto central emergente */}
    <g transform="translate(72, 85)">
      <rect x="0" y="0" width="56" height="74" rx="4" fill="#ffffff" stroke="#e11d48" strokeWidth={unlocked ? 2 : 1} />
      <rect x="5" y="5" width="46" height="46" fill="#be123c" />
      <H x={28} y={28} s={1.6} fill="#fef08a" className="dp-heartbeat" style={{ transformOrigin: '28px 28px' }} />
      <text x="28" y="62" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="6" fontWeight="bold" fill="#0f172a">
        Nosotros ♥
      </text>
    </g>
  </svg>
);

const MessageBottleEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="bot-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0284c7" />
        <stop offset="1" stopColor="#0c4a6e" />
      </linearGradient>
      <linearGradient id="bot-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="1" stopColor="rgba(56,189,248,0.15)" />
      </linearGradient>
    </defs>
    {/* Olas del mar */}
    <path d="M10 155 Q50 145 100 155 T190 155 V200 H10z" fill="url(#bot-water)" />
    <path d="M10 165 Q60 155 110 165 T190 165 V200 H10z" fill="#0369a1" opacity="0.6" />
    {/* Botella inclinada flotando */}
    <g transform="translate(100, 115) rotate(25) translate(-100, -115)">
      {/* Cuello y corcho */}
      <rect x="94" y="42" width="12" height="12" rx="2" fill="#b45309" />
      <path d="M92 54 L92 70 L75 88 L75 145 Q75 155 100 155 Q125 155 125 145 L125 88 L108 70 L108 54z" fill="url(#bot-glass)" stroke="#7dd3fc" strokeWidth="2" />
      {/* Pergamino dentro */}
      <rect x="85" y="92" width="30" height="45" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
      {/* Cinta roja del pergamino */}
      <rect x="83" y="112" width="34" height="6" rx="1" fill="#e11d48" />
      <H x={100} y={115} s={0.7} fill="#ffffff" />
      {/* Brillos de cristal */}
      <path d="M82 92 L82 140" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </g>
    {/* Destellos mágicos sobre el agua */}
    {[ [40, 140], [160, 135], [130, 90] ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#fef08a" />
    ))}
  </svg>
);

const SunflowerEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="sun-petal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fde047" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <radialGradient id="sun-center" cx="0.4" cy="0.4">
        <stop offset="0" stopColor="#78350f" />
        <stop offset="80%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#1c0a03" />
      </radialGradient>
      <Glow id="sun-g" color="#facc15" />
    </defs>
    {/* Tallo verde */}
    <path d="M100 120 Q95 160 100 195" stroke="#15803d" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M96 150 Q60 145 50 160 Q80 165 96 155" fill="#16a34a" />
    <path d="M102 165 Q140 160 150 175 Q120 180 102 170" fill="#15803d" />
    {/* Pétalos radiales */}
    <g transform="translate(100, 95)" filter="url(#sun-g)">
      {Array.from({ length: 16 }).map((_, i) => (
        <path
          key={i}
          d="M0 0 C-10 -35, -8 -52, 0 -60 C8 -52, 10 -35, 0 0"
          fill="url(#sun-petal)"
          transform={`rotate(${i * 22.5})`}
        />
      ))}
      {/* Centro de semillas */}
      <circle cx="0" cy="0" r="28" fill="url(#sun-center)" />
      {/* Espirales doradas de semillas */}
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.cos((i * 137.5 * Math.PI) / 180) * (4 + i * 0.9)}
          cy={Math.sin((i * 137.5 * Math.PI) / 180) * (4 + i * 0.9)}
          r="1.4"
          fill="#fef08a"
          opacity="0.85"
        />
      ))}
      <H x={0} y={0} s={1.2} fill="#e11d48" className={unlocked ? 'dp-heartbeat' : undefined} />
    </g>
  </svg>
);

const BoardingPassEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="bp-card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#f1f5f9" />
      </linearGradient>
    </defs>
    {/* Tarjeta de embarque */}
    <rect x="22" y="50" width="156" height="100" rx="8" fill="url(#bp-card)" stroke="#cbd5e1" strokeWidth="2" />
    <rect x="22" y="50" width="156" height="22" rx="8" fill="#e11d48" />
    <text x="32" y="65" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#ffffff" letterSpacing="1">
      PASSENGER TICKET • AMOR AIRLINES
    </text>
    {/* Muescas laterales de boleto */}
    <circle cx="22" cy="100" r="8" fill="#070914" />
    <circle cx="178" cy="100" r="8" fill="#070914" />
    {/* Datos de vuelo */}
    <text x="35" y="90" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#0f172a">
      ORIGEN: MI CORAZÓN
    </text>
    <text x="35" y="105" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#e11d48">
      DESTINO: PARA SIEMPRE
    </text>
    <text x="35" y="125" fontFamily="sans-serif" fontSize="7" fill="#64748b">
      VUELO: LOVE-2026 • ASIENTO: 01A • CLASE: ETERNA
    </text>
    {/* Código de barras */}
    {[35, 40, 44, 48, 55, 60, 63, 70, 75, 78, 85].map((x, i) => (
      <line key={i} x1={x} y1="132" x2={x} y2="142" stroke="#0f172a" strokeWidth={i % 2 === 0 ? 2 : 1} />
    ))}
    {/* Sello de pasaporte de aprobación */}
    <g transform="translate(142, 115) rotate(-15)">
      <circle cx="0" cy="0" r="20" fill="none" stroke="#be123c" strokeWidth="2" strokeDasharray="3 2" />
      <text x="0" y="-4" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="#be123c">
        APPROVED
      </text>
      <H x={0} y={6} s={0.7} fill="#be123c" />
    </g>
  </svg>
);

const ScratchCardEmblem = ({ step, unlocked, total }) => {
  const scratched = unlocked || step >= total;
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="sc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>
      <rect x="25" y="45" width="150" height="110" rx="10" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
      <text x="100" y="65" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#fde047" letterSpacing="1">
        RASCA Y GANA MI AMOR
      </text>
      {/* 3 zonas de rascar */}
      {[ [55, 105], [100, 105], [145, 105] ].map(([x, y], i) => {
        const isOpen = unlocked || i < step;
        return (
          <g key={i}>
            <rect x={x - 18} y={y - 18} width="36" height="36" rx="6" fill="#1c1917" stroke="#eab308" strokeWidth="1" />
            {/* Contenido oculto revelado */}
            <H x={x} y={y} s={1.1} fill="#e11d48" className={isOpen ? 'dp-heartbeat' : undefined} />
            {/* Capa de rascar dorada si no está abierta */}
            {!isOpen && (
              <g>
                <rect x={x - 18} y={y - 18} width="36" height="36" rx="6" fill="url(#sc-gold)" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="14" fill="#78350f" fontWeight="bold">
                  ★
                </text>
              </g>
            )}
          </g>
        );
      })}
      <text x="100" y="142" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill="#fbcfe8">
        {scratched ? '¡PREMIO: MI CORAZÓN COMPLETO!' : 'TOCA PARA RASCAR Y REVELAR'}
      </text>
    </svg>
  );
};

const GameBoyEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="gb-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>
    {/* Chasis retro */}
    <rect x="45" y="30" width="110" height="142" rx="10" fill="url(#gb-body)" stroke="#64748b" strokeWidth="2" />
    <path d="M130 172 L155 147" stroke="#cbd5e1" strokeWidth="2" />
    {/* Pantalla dot matrix */}
    <rect x="58" y="44" width="84" height="64" rx="4" fill="#334155" />
    <rect x="66" y="50" width="68" height="52" rx="2" fill="#84cc16" />
    {/* 8-bit corazones en pantalla */}
    <text x="100" y="68" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#14532d">
      PLAYER 1 & 2
    </text>
    <g transform="translate(100, 84)">
      <H x={-15} y={0} s={0.8} fill="#14532d" />
      <text x="0" y="3" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#14532d">
        +
      </text>
      <H x={15} y={0} s={0.8} fill="#14532d" />
    </g>
    <text x="100" y="98" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#14532d">
      {unlocked ? 'LOVE: 100% MAX' : 'PRESS START ♥'}
    </text>
    {/* D-Pad Cruceta */}
    <g transform="translate(72, 130)">
      <rect x="-4" y="-12" width="8" height="24" rx="2" fill="#1e293b" />
      <rect x="-12" y="-4" width="24" height="8" rx="2" fill="#1e293b" />
      <circle cx="0" cy="0" r="2" fill="#334155" />
    </g>
    {/* Botones A y B */}
    <g transform="translate(130, 126)">
      <circle cx="-10" cy="6" r="6" fill="#be123c" />
      <circle cx="6" cy="-2" r="6" fill="#be123c" />
    </g>
    {/* Select y Start */}
    <rect x="88" y="156" width="10" height="3" rx="1.5" fill="#475569" transform="rotate(-25 88 156)" />
    <rect x="104" y="156" width="10" height="3" rx="1.5" fill="#475569" transform="rotate(-25 104 156)" />
  </svg>
);

const OrigamiEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="ori-paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#fce7f3" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    {/* Flores de cerezo Sakura de fondo */}
    {[ [35, 60], [165, 55], [45, 145], [160, 140] ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="5" fill="#fbcfe8" opacity="0.7" />
    ))}
    {/* Grulla de origami geométrica */}
    <g transform="translate(100, 100)" className={unlocked ? 'dp-float' : undefined}>
      {/* Cuerpo y alas */}
      <polygon points="0,-40 -50,-10 0,25" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="1" />
      <polygon points="0,-40 50,-10 0,25" fill="#f472b6" stroke="#f43f5e" strokeWidth="1" />
      {/* Cabeza y cuello */}
      <polygon points="0,-40 -20,-70 -15,-65 0,-40" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
      {/* Cola */}
      <polygon points="0,25 25,60 18,55 0,25" fill="#fce7f3" stroke="#f43f5e" strokeWidth="1" />
      <H x={0} y={-5} s={1.1} fill="#e11d48" className="dp-heartbeat" />
    </g>
    <text x="100" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill="#fbcfe8" letterSpacing="1">
      GRULLA DE LA ETERNIDAD
    </text>
  </svg>
);

const HourglassEmblem = ({ step, unlocked }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="hg-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <radialGradient id="hg-sand" cx="0.5" cy="0.5">
        <stop offset="0" stopColor="#fda4af" />
        <stop offset="100%" stopColor="#e11d48" />
      </radialGradient>
    </defs>
    {/* Bases de bronce superior e inferior */}
    <ellipse cx="100" cy="42" rx="45" ry="8" fill="url(#hg-gold)" />
    <ellipse cx="100" cy="158" rx="45" ry="8" fill="url(#hg-gold)" />
    {/* Columnas laterales */}
    <rect x="62" y="42" width="6" height="116" rx="2" fill="url(#hg-gold)" />
    <rect x="132" y="42" width="6" height="116" rx="2" fill="url(#hg-gold)" />
    {/* Cristal del reloj de arena */}
    <path d="M72 46 C72 80 92 96 98 100 C92 104 72 120 72 154 H128 C128 120 108 104 102 100 C108 96 128 80 128 46 Z" fill="rgba(255,255,255,0.15)" stroke="#fbbf24" strokeWidth="1.5" />
    {/* Arena cayendo */}
    <polygon points="80,55 120,55 100,95" fill="url(#hg-sand)" opacity={unlocked ? 0.3 : 0.8} />
    <line x1="100" y1="95" x2="100" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
    {/* Montículo de arena acumulado abajo */}
    <path d="M78 152 Q100 130 122 152 Z" fill="url(#hg-sand)" />
    <H x={100} y={100} s={0.8} fill="#ffffff" />
    <text x="100" y="178" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill="#fef08a" letterSpacing="1">
      NUESTRO TIEMPO ES ETERNO
    </text>
  </svg>
);

/* ======================= Temas por plantilla ======================= */

const THEMES = {
  'libro-amor': {
    bg: 'radial-gradient(circle at 50% 20%, #78350f 0%, #3b1d0b 45%, #120804 100%)',
    accent: '#fbbf24', particles: ['petal', 'sparkle'], colors: ['#fde68a', '#fb7185', '#fef3c7'], aurora: ['#b45309', '#9f1239'],
    taps: 1, Emblem: BookEmblem, hint: 'Toca el libro para abrir nuestra historia', paper: true, signature: 'Continuará… contigo'
  },
  chocolate: {
    bg: 'radial-gradient(circle at 50% 30%, #7c2d12 0%, #431407 45%, #1c0a05 100%)',
    accent: '#fb7185', particles: ['heart', 'sparkle'], colors: ['#fda4af', '#fcd34d', '#fecaca'], aurora: ['#be123c', '#92400e'],
    taps: 3, Emblem: ChocolateEmblem, hint: 'Toca la caja para levantar la tapa', signature: 'Eres mi dulce favorito'
  },
  net: {
    bg: 'radial-gradient(circle at 50% 40%, #083344 0%, #0c1a3a 50%, #05030f 100%)',
    accent: '#22d3ee', particles: ['dot', 'sparkle'], colors: ['#67e8f9', '#c084fc', '#f472b6'], aurora: ['#0891b2', '#7c3aed'],
    taps: 4, Emblem: NetEmblem, hint: 'Toca para conectar nuestras almas', signature: 'Conectados para siempre'
  },
  memorama: {
    bg: 'linear-gradient(160deg, #3b0764 0%, #4c0519 55%, #1c1917 100%)',
    accent: '#f59e0b', particles: ['sparkle', 'heart'], colors: ['#fcd34d', '#f9a8d4', '#c4b5fd'], aurora: ['#7c3aed', '#e11d48'],
    taps: 4, Emblem: MemoramaEmblem, hint: 'Toca para voltear cada carta', signature: 'Cada recuerdo contigo es un tesoro'
  },
  'memori-corazon': {
    bg: 'radial-gradient(circle at 50% 40%, #881337 0%, #4c0519 50%, #12030a 100%)',
    accent: '#fb7185', particles: ['heart', 'petal'], colors: ['#fda4af', '#fecdd3', '#f43f5e'], aurora: ['#e11d48', '#db2777'],
    taps: 5, Emblem: MemoriHeartEmblem, hint: 'Toca para llenar el corazón de recuerdos', signature: 'Mi corazón está hecho de ti'
  },
  laberinto: {
    bg: 'radial-gradient(circle at 50% 40%, #064e3b 0%, #022c22 50%, #020617 100%)',
    accent: '#34d399', particles: ['leaf', 'sparkle'], colors: ['#6ee7b7', '#a7f3d0', '#f9a8d4'], aurora: ['#059669', '#0e7490'],
    taps: 4, Emblem: MazeEmblem, hint: 'Toca para avanzar por el laberinto', signature: 'Todos los caminos llevan a ti'
  },
  'carrera-de-corazones': {
    bg: 'linear-gradient(160deg, #9d174d 0%, #7c2d12 60%, #1c0a05 100%)',
    accent: '#fbbf24', particles: ['heart', 'sparkle'], colors: ['#fbbf24', '#fb7185', '#fff'], aurora: ['#f97316', '#db2777'],
    taps: 5, Emblem: RaceEmblem, hint: 'Toca para acelerar hacia la meta', signature: 'Contigo cada meta es mejor'
  },
  'heart-shooter': {
    bg: 'radial-gradient(circle at 50% 40%, #9f1239 0%, #450a0a 55%, #0c0303 100%)',
    accent: '#fb7185', particles: ['heart', 'sparkle'], colors: ['#fb7185', '#fde68a', '#fecdd3'], aurora: ['#e11d48', '#d97706'],
    taps: 3, Emblem: CupidEmblem, hint: 'Toca para lanzar las flechas de Cupido', signature: 'Flechado/a por ti'
  },
  'corazon-revienta': {
    bg: 'radial-gradient(circle at 50% 45%, #be185d 0%, #7f1d1d 55%, #1a0505 100%)',
    accent: '#fbbf24', particles: ['heart', 'sparkle'], colors: ['#fb7185', '#fbbf24', '#fff'], aurora: ['#ec4899', '#f59e0b'],
    taps: 5, Emblem: BalloonHeartEmblem, hint: 'Toca para inflar el corazón hasta que estalle', signature: 'Me haces explotar de amor'
  },
  bubbles: {
    bg: 'linear-gradient(170deg, #0c4a6e 0%, #1e1b4b 55%, #500724 100%)',
    accent: '#7dd3fc', particles: ['bubble'], colors: ['#7dd3fc', '#f0abfc', '#e0f2fe'], aurora: ['#0284c7', '#c026d3'], motion: 'rise',
    taps: 5, Emblem: BubblesEmblem, hint: 'Toca para reventar las burbujas', signature: 'Floto cuando estoy contigo'
  },
  'el-camino-juntos': {
    bg: 'radial-gradient(circle at 50% 20%, #065f46 0%, #134e4a 45%, #020617 100%)',
    accent: '#34d399', particles: ['leaf', 'petal'], colors: ['#6ee7b7', '#fde68a', '#fda4af'], aurora: ['#10b981', '#0f766e'],
    taps: 4, Emblem: RoadEmblem, hint: 'Toca para recorrer nuestro camino', signature: 'Y lo mejor está por venir'
  },
  'tres-corazones': {
    bg: 'radial-gradient(circle at 50% 40%, #831843 0%, #312e81 60%, #0b0820 100%)',
    accent: '#f9a8d4', particles: ['sparkle', 'heart'], colors: ['#f9a8d4', '#c4b5fd', '#fde68a'], aurora: ['#db2777', '#4f46e5'],
    taps: 3, Emblem: ThreeHeartsEmblem, hint: 'Toca para encender cada deseo', signature: 'Mis tres deseos eres tú'
  },
  heart: {
    bg: 'radial-gradient(circle at 50% 45%, #3b0764 0%, #1e0533 50%, #000 100%)',
    accent: '#f0abfc', particles: ['dot', 'heart'], colors: ['#f0abfc', '#f472b6', '#a855f7'], aurora: ['#a21caf', '#7c3aed'],
    taps: 1, Emblem: NeonHeartEmblem, hint: 'Toca para encender el neón', signature: 'Laten al mismo ritmo'
  },
  dedicate: {
    bg: 'radial-gradient(circle at 50% 30%, #292524 0%, #1c1917 50%, #0c0a09 100%)',
    accent: '#d4a24c', particles: ['sparkle'], colors: ['#fde68a', '#e7e5e4'], aurora: ['#78716c', '#a16207'], count: 10,
    taps: 1, Emblem: MonogramEmblem, hint: 'Toca el sello dorado', paper: true, signature: 'Con amor'
  },
  'little-girl': {
    bg: 'linear-gradient(165deg, #be185d 0%, #86198f 55%, #3b0764 100%)',
    accent: '#fbcfe8', particles: ['sparkle', 'heart', 'petal'], colors: ['#fbcfe8', '#fde68a', '#ddd6fe', '#fff'], aurora: ['#f472b6', '#a78bfa'],
    taps: 3, Emblem: PrincessEmblem, hint: 'Toca la corona para colocar sus gemas', signature: 'Mi princesa hermosa'
  },
  halloween: {
    bg: 'radial-gradient(circle at 70% 20%, #4c1d95 0%, #1e0b36 45%, #050208 100%)',
    accent: '#fb923c', particles: ['bat', 'dot'], colors: ['#1e1b4b', '#fb923c', '#a78bfa'], aurora: ['#ea580c', '#6d28d9'],
    taps: 3, Emblem: HalloweenEmblem, hint: 'Toca para encender las calabazas', signature: 'Mi hechizo favorito eres tú'
  },
  'cassette-retro': {
    bg: 'radial-gradient(circle at 50% 30%, #1c1917 0%, #09090b 60%, #000000 100%)',
    accent: '#f43f5e', particles: ['sparkle', 'heart'], colors: ['#fb7185', '#fde047', '#38bdf8'], aurora: ['#e11d48', '#4f46e5'],
    taps: 2, Emblem: CassetteEmblem, hint: 'Toca el casete para insertar y presionar PLAY', signature: 'Eres mi canción favorita en bucle'
  },
  'star-map': {
    bg: 'radial-gradient(circle at 50% 25%, #0f172a 0%, #020617 60%, #000000 100%)',
    accent: '#fbbf24', particles: ['sparkle', 'dot'], colors: ['#fde68a', '#93c5fd', '#c084fc'], aurora: ['#1e3a8a', '#6b21a8'],
    taps: 3, Emblem: StarMapEmblem, hint: 'Toca las estrellas para alinear nuestro destino', signature: 'En cada universo te elegiría a ti'
  },
  'polaroid-album': {
    bg: 'radial-gradient(circle at 50% 35%, #4c0519 0%, #1c0a12 55%, #090306 100%)',
    accent: '#f43f5e', particles: ['heart', 'sparkle'], colors: ['#fecdd3', '#fde047', '#fff'], aurora: ['#be123c', '#831843'],
    taps: 3, Emblem: PolaroidEmblem, hint: 'Toca para revelar y colgar las fotos', signature: 'Tus fotos son mi lugar feliz'
  },
  'mensaje-botella': {
    bg: 'radial-gradient(circle at 50% 30%, #0369a1 0%, #082f49 50%, #020617 100%)',
    accent: '#38bdf8', particles: ['bubble', 'sparkle'], colors: ['#7dd3fc', '#fde047', '#e0f2fe'], aurora: ['#0284c7', '#0d9488'], motion: 'rise',
    taps: 2, Emblem: MessageBottleEmblem, hint: 'Toca el corcho para abrir el mensaje del mar', signature: 'Naufragué de amor por ti'
  },
  'girasoles-sunset': {
    bg: 'radial-gradient(circle at 50% 20%, #78350f 0%, #451a03 50%, #120701 100%)',
    accent: '#facc15', particles: ['petal', 'sparkle'], colors: ['#fde047', '#ea580c', '#fbbf24'], aurora: ['#d97706', '#b45309'],
    taps: 3, Emblem: SunflowerEmblem, hint: 'Toca los girasoles para que sigan tu luz', signature: 'Tú eres mi sol en cada atardecer'
  },
  'boarding-pass': {
    bg: 'linear-gradient(160deg, #1e1b4b 0%, #0f172a 50%, #020617 100%)',
    accent: '#e11d48', particles: ['dot', 'sparkle'], colors: ['#f43f5e', '#60a5fa', '#fff'], aurora: ['#4338ca', '#be123c'],
    taps: 2, Emblem: BoardingPassEmblem, hint: 'Toca el boleto para estampar tu pase al corazón', signature: 'El mejor viaje de mi vida comenzó contigo'
  },
  'scratch-card': {
    bg: 'radial-gradient(circle at 50% 40%, #701a75 0%, #3b0764 55%, #0f031b 100%)',
    accent: '#facc15', particles: ['sparkle', 'heart'], colors: ['#fde047', '#f472b6', '#fff'], aurora: ['#a21caf', '#ca8a04'],
    taps: 3, Emblem: ScratchCardEmblem, hint: 'Toca para raspar las zonas doradas', signature: 'Contigo me saqué la lotería'
  },
  'gameboy-8bit': {
    bg: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 60%, #020617 100%)',
    accent: '#84cc16', particles: ['dot', 'heart'], colors: ['#a3e635', '#f43f5e', '#38bdf8'], aurora: ['#15803d', '#1e40af'],
    taps: 3, Emblem: GameBoyEmblem, hint: 'Presiona START para conectar Player 1 & 2', signature: 'Game Over? No, contigo es partida infinita'
  },
  'origami-grulla': {
    bg: 'radial-gradient(circle at 50% 35%, #831843 0%, #3f0b24 55%, #0e0208 100%)',
    accent: '#f472b6', particles: ['petal', 'sparkle'], colors: ['#fbcfe8', '#f43f5e', '#fff'], aurora: ['#db2777', '#9d174d'],
    taps: 3, Emblem: OrigamiEmblem, hint: 'Toca para que la grulla despliegue sus alas', signature: 'Mil grullas para desearte siempre a mi lado'
  },
  'reloj-arena': {
    bg: 'radial-gradient(circle at 50% 30%, #451a03 0%, #291003 55%, #090301 100%)',
    accent: '#fbbf24', particles: ['sparkle', 'heart'], colors: ['#fde68a', '#fda4af', '#f59e0b'], aurora: ['#b45309', '#be123c'],
    taps: 2, Emblem: HourglassEmblem, hint: 'Toca para girar el reloj y detener el tiempo', signature: 'Si volviera a nacer, te buscaría antes'
  }
};

const DEFAULT_THEME = {
  bg: 'radial-gradient(circle at 50% 35%, #881337 0%, #3b0764 55%, #070914 100%)',
  accent: '#fb7185', particles: ['heart', 'sparkle'], colors: ['#fb7185', '#f9a8d4', '#fde68a'], aurora: ['#e11d48', '#7c3aed'],
  taps: 1, Emblem: NeonHeartEmblem, hint: 'Toca el corazón para abrir la sorpresa', signature: 'Siempre en mi corazón'
};

export default function DynamicUniversalTemplate({ templateId, data }) {
  const currentTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  const theme = THEMES[templateId] || DEFAULT_THEME;
  const { Emblem } = theme;
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reinicia el estado al cambiar de plantilla
  const [lastId, setLastId] = useState(templateId);
  if (lastId !== templateId) {
    setLastId(templateId);
    setStep(0);
    setUnlocked(false);
  }

  // 100% Editable and Removable field resolution
  const badgeText = resolveText(data?.badgeText, currentTemplate.name);
  const titleText = resolveText(data?.title, currentTemplate.defaults.title);
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, currentTemplate.defaults.lockTitle);
  const unlockSubtitle = resolveText(data?.unlockMsg, currentTemplate.defaults.unlockMsg);
  const actionHint = resolveText(data?.actionHint, theme.hint);
  const letterTitle = resolveText(data?.letterTitle, currentTemplate.defaults.letterTitle);
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, currentTemplate.defaults.letterBody);
  const signature = resolveText(data?.customSign, theme.signature || 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const handleTap = () => {
    if (unlocked) return;
    const next = step + 1;
    if (next < theme.taps) {
      setStep(next);
      try { sound.playDialClick(); } catch (e) {}
      return;
    }
    setStep(theme.taps);
    setUnlocked(true);
    sound.playUnlockSuccess();
    if (!isPlaying) sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
    try {
      const heart = confetti.shapeFromPath ? confetti.shapeFromPath({ path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' }) : null;
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.55 },
        colors: [theme.accent, ...theme.colors],
        ...(heart ? { shapes: [heart, 'circle'], scalar: 1.4 } : {})
      });
    } catch (e) {}
  };

  const remaining = theme.taps - step;

  return (
    <div
      className="relative min-h-full w-full text-white flex flex-col items-center justify-between gap-4 p-5 sm:p-7 select-none overflow-hidden isolate"
      style={{ background: theme.bg }}
    >
      <AmbientLayer
        className="-z-10"
        particles={theme.particles}
        colors={theme.colors}
        aurora={theme.aurora}
        motion={theme.motion}
        count={theme.count || 16}
        seed={templateId.length * 13}
      />

      <MusicDisc isPlaying={isPlaying} accent={theme.accent} onToggle={() => sound.toggleMusicTrack(data?.customAudio, setIsPlaying)} />

      {/* Encabezado */}
      {(badgeText || titleText || (unlocked ? unlockSubtitle : lockSubtitle)) && (
        <header className="relative z-10 text-center max-w-md w-full mt-4 animate-fade-in">
          {badgeText && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border text-[11px] font-semibold tracking-wide mb-3 backdrop-blur-sm"
              style={{ borderColor: `${theme.accent}66`, color: theme.accent }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
          )}
          {titleText && (
            <h1 className="text-3xl sm:text-4xl font-serif-romance font-semibold leading-tight dp-gold-text drop-shadow">
              {titleText}
            </h1>
          )}
          {(unlocked ? unlockSubtitle : lockSubtitle) && (
            <p className="text-sm text-white/75 mt-2 italic">
              {unlocked ? unlockSubtitle : lockSubtitle}
            </p>
          )}
        </header>
      )}

      {/* Emblema interactivo */}
      {!unlocked || !theme.hideEmblemOnUnlock ? (
        <div className="relative z-10 flex flex-col items-center my-auto">
          <button
            type="button"
            onClick={handleTap}
            aria-label={actionHint || theme.hint}
            className={`relative w-60 h-60 sm:w-64 sm:h-64 rounded-full transition-transform duration-300 ${
              unlocked ? 'scale-90' : 'hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            {/* Halo luminoso */}
            <span
              className="absolute inset-4 rounded-full blur-2xl opacity-60"
              style={{ background: `radial-gradient(circle, ${theme.accent}88, transparent 70%)` }}
            />
            {!unlocked && <span className="absolute inset-6 rounded-full dp-halo" style={{ color: `${theme.accent}55` }} />}
            <span className="relative block w-full h-full">
              <Emblem step={step} unlocked={unlocked} total={theme.taps} data={data} />
            </span>
          </button>

          {!unlocked && (
            <div className="mt-4 flex flex-col items-center gap-2">
              {theme.taps > 1 && (
                <div className="flex gap-1.5" aria-hidden="true">
                  {Array.from({ length: theme.taps }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: i < step ? 22 : 10, background: i < step ? theme.accent : 'rgba(255,255,255,0.25)' }}
                    />
                  ))}
                </div>
              )}
              {actionHint && (
                <span
                  className="text-xs font-semibold px-4 py-1.5 rounded-full bg-black/40 border backdrop-blur-sm animate-pulse"
                  style={{ borderColor: `${theme.accent}55`, color: '#fff' }}
                >
                  {actionHint}
                  {theme.taps > 1 && step > 0 ? ` · ${remaining} más` : ''}
                </span>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Carta revelada 100% editable y removible */}
      {unlocked ? (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            title={letterTitle}
            body={letterBody}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            accent={theme.accent}
            variant={theme.paper ? 'paper' : 'dark'}
            signature={signature}
            typewriter={true}
            onReplay={() => {
              setStep(0);
              setUnlocked(false);
            }}
          />
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );
}
