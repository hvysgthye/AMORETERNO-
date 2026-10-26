import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Sun, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function FlorAmarillaTemplate({ data }) {
  const [bloomed, setBloomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBloom = () => {
    if (!bloomed) {
      setBloomed(true);
      sound.playUnlockSuccess();
      sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

      try {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#eab308', '#facc15', '#f59e0b', '#fbbf24', '#ffffff']
        });
      } catch (e) {}
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#1c1404] via-[#2d2207] to-[#0f0b02] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['petal','sparkle']} colors={['#facc15','#fde68a','#fb923c']} aurora={['#ca8a04','#c2410c']} seed={24} />
      {/* Sun Ray Beams Ambient Effect */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Music Control */}
      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#facc15" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-2">
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>Tus Flores Amarillas Soñadas</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200">
          {data?.title || 'Flores Amarillas Eternas'}
        </h1>
        <p className="text-xs text-amber-200/70 mt-1">
          {bloomed ? (data?.unlockMsg || '¡Tus flores amarillas nunca se marchitarán!') : 'Toca el girasol para regar y abrir sus pétalos dorados'}
        </p>
      </div>

      {/* Giant Blooming Sunflower / Yellow Flower SVG */}
      <div className="my-auto relative flex flex-col items-center cursor-pointer" onClick={handleBloom}>
        <div className={`relative w-64 h-72 transition-all duration-1000 transform ${bloomed ? 'scale-110 drop-shadow-[0_0_35px_rgba(250,204,21,0.6)]' : 'scale-95 hover:scale-100'}`}>
          <svg viewBox="0 0 200 240" className="w-full h-full">
            {/* Green Stem */}
            <path
              d="M100 230 C90 180, 110 140, 100 85"
              fill="transparent"
              stroke="#15803d"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <path d="M100 160 C70 150, 60 130, 80 120 C95 130, 100 145, 100 160" fill="#16a34a" />
            <path d="M100 130 C130 120, 140 100, 120 90 C105 100, 100 115, 100 130" fill="#16a34a" />

            {/* Radiant Golden Yellow Petals (12 Sunburst petals) */}
            <g transform="translate(100, 85)">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                <ellipse
                  key={i}
                  cx="0"
                  cy={bloomed ? -42 : -20}
                  rx={bloomed ? 12 : 6}
                  ry={bloomed ? 32 : 16}
                  transform={`rotate(${angle})`}
                  fill="#facc15"
                  stroke="#eab308"
                  strokeWidth="1"
                  className="transition-all duration-1000 ease-out origin-center"
                  style={{ transitionDelay: `${i * 45}ms` }}
                />
              ))}
              {/* Inner Chocolate Center */}
              <circle cx="0" cy="0" r={bloomed ? 22 : 14} fill="#78350f" className="transition-all duration-500 shadow-xl" />
              <circle cx="0" cy="0" r={bloomed ? 14 : 9} fill="#451a03" />
              <circle cx="0" cy="0" r="4" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        {!bloomed && (
          <span className="mt-2 text-xs font-bold text-amber-300 bg-amber-950/70 px-4 py-1.5 rounded-full border border-amber-500/40 animate-pulse">
            Regar con amor 🌻💛
          </span>
        )}
      </div>

      {/* Revealed Dedication Card */}
      {bloomed && (
        <div className="z-10 w-full max-w-md bg-slate-900/85 border border-amber-500/40 rounded-3xl p-5 backdrop-blur-xl shadow-2xl mb-2 animate-float">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-amber-400/40 max-h-48">
              <img src={data.photo} alt="Flores Amarillas" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="font-semibold text-sm text-amber-300 mb-1">
            {data?.letterTitle || 'Porque te mereces todas las flores del mundo'}
          </h2>
          <p className="text-xs text-amber-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'Sé cuánto soñabas con tus flores amarillas. Hoy quiero recordarte que iluminas mis días como el sol más radiante.'}
          </p>
        </div>
      )}
    </div>
  );
}
