import React, { useState } from 'react';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function FloresTemplate({ data }) {
  const [bloomed, setBloomed] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);

  const handleBloom = () => {
    if (!bloomed) {
      setBloomed(true);
      sound.playUnlockSuccess();
      sound.toggleMusicTrack(data?.customAudio, setBgmActive);
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#071711] via-[#0d281e] to-[#1a1128] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['petal','leaf','sparkle']} colors={['#c084fc','#e879f9','#a78bfa','#86efac']} aurora={['#7e22ce','#047857']} seed={18} />
      {/* Floating Music Control */}
      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#c084fc" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Jardín Botánico del Amor</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-pink-200">
          {data?.title || 'Flores que Nunca Se Marchitan'}
        </h1>
        <p className="text-xs text-emerald-200/70 mt-1">
          {bloomed ? (data?.unlockMsg || 'Floreces cada rincón de mi vida.') : 'Toca la flor para verla florecer ante tus ojos'}
        </p>
      </div>

      {/* Center Interactive Botanical SVG Flower */}
      <div className="my-auto relative flex flex-col items-center cursor-pointer" onClick={handleBloom}>
        <svg
          viewBox="0 0 200 240"
          className={`w-52 h-64 transition-all duration-1000 transform ${
            bloomed ? 'scale-110 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]' : 'scale-95 hover:scale-100'
          }`}
        >
          {/* Animated Stem */}
          <path
            d="M100 230 C95 180, 110 140, 100 90"
            fill="transparent"
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Leaves */}
          <path
            d="M100 170 C70 160, 60 140, 75 130 C90 140, 100 155, 100 170"
            fill="#059669"
            className={`transition-all duration-700 ${bloomed ? 'opacity-100' : 'opacity-70'}`}
          />
          <path
            d="M100 140 C130 130, 140 110, 125 100 C110 110, 100 125, 100 140"
            fill="#059669"
            className={`transition-all duration-700 ${bloomed ? 'opacity-100' : 'opacity-70'}`}
          />

          {/* Golden / Purple Petals (Animated unfolding) */}
          <g transform="translate(100, 90)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy={bloomed ? -36 : -18}
                rx={bloomed ? 14 : 7}
                ry={bloomed ? 26 : 14}
                transform={`rotate(${angle})`}
                fill={angle % 90 === 0 ? '#fbbf24' : '#a855f7'}
                className="transition-all duration-1000 ease-out origin-center"
                style={{
                  transitionDelay: `${i * 60}ms`,
                  opacity: 0.95
                }}
              />
            ))}
            {/* Center Core */}
            <circle cx="0" cy="0" r={bloomed ? 16 : 10} fill="#f59e0b" className="transition-all duration-500 shadow-lg" />
            <circle cx="0" cy="0" r="7" fill="#d97706" />
          </g>
        </svg>

        {!bloomed && (
          <span className="mt-2 text-xs font-medium text-emerald-300/80 animate-pulse bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Toca aquí para regar y florecer 🌸
          </span>
        )}
      </div>

      {/* Revealed Card */}
      {bloomed && (
        <div className="z-10 w-full max-w-md bg-gradient-to-t from-emerald-950/90 to-teal-950/80 border border-emerald-500/40 rounded-3xl p-5 backdrop-blur-xl shadow-2xl animate-float mb-2">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-emerald-400/30 max-h-48">
              <img src={data.photo} alt="Flores" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-2 text-amber-300 mb-1">
            <Heart className="w-4 h-4 fill-amber-400 text-amber-400" />
            <h2 className="font-semibold text-sm text-white">
              {data?.letterTitle || 'Como las flores en primavera'}
            </h2>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'Estas flores digitales vivirán para siempre, tal como mi amor por ti.'}
          </p>
        </div>
      )}
    </div>
  );
}
