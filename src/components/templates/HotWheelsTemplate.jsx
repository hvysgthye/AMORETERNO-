import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Flame, Zap } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function HotWheelsTemplate({ data }) {
  const [turboActive, setTurboActive] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);

  const handleTurbo = () => {
    setTurboActive(true);
    sound.playUnlockSuccess();

    try {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f97316', '#eab308', '#ffffff']
      });
    } catch (e) {}

    setTimeout(() => {
      setUnlocked(true);
      sound.toggleMusicTrack(data?.customAudio, setBgmActive);
    }, 600);
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#1c0808] via-[#2d0e0e] to-[#120505] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['sparkle','dot']} colors={['#f97316','#facc15','#ef4444']} aurora={['#dc2626','#ea580c']} seed={21} />
      {/* Floating Music Control */}
      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#f97316" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Hot Wheels Special Romance Edition</span>
        </div>
        <h1 className="text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300">
          {data?.title || 'Acelerando Mi Corazón'}
        </h1>
        <p className="text-xs text-red-200/70 mt-1">
          {unlocked ? (data?.unlockMsg || '¡Vuelta rápida completada: Mi mayor premio eres tú!') : 'Presiona el botón de turbo para arrancar'}
        </p>
      </div>

      {/* Center Interactive Racetrack & Hot Wheels Bouquet */}
      <div className="my-auto relative flex flex-col items-center">
        {/* Animated Speed Lines */}
        <div className="relative w-64 h-48 bg-gradient-to-b from-red-950/40 to-black/80 rounded-3xl border-2 border-red-500/40 p-4 flex flex-col items-center justify-center shadow-2xl">
          {/* Orange Track Loop */}
          <div className="w-52 h-20 border-4 border-orange-500 rounded-full flex items-center justify-between px-3 shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            {/* Miniature Die-cast Car 1 */}
            <div className={`text-2xl transform transition-transform duration-500 ${turboActive ? 'translate-x-32 rotate-6' : 'translate-x-0'}`}>
              🏎️
            </div>
            {/* Car 2 */}
            <div className={`text-2xl transform transition-transform duration-500 ${turboActive ? '-translate-x-32 -rotate-6' : 'translate-x-0'}`}>
              🚗
            </div>
          </div>

          {/* Nitro Launch Button */}
          <button
            onClick={handleTurbo}
            className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/40 active:scale-95 transition flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{unlocked ? '¡ARRANCADO!' : 'ACTIVAR NITRO 🔥'}</span>
          </button>
        </div>
      </div>

      {/* Revealed Dedication Card */}
      {unlocked && (
        <div className="z-10 w-full max-w-md bg-gradient-to-t from-red-950/90 to-orange-950/80 border border-red-500/40 rounded-3xl p-5 backdrop-blur-xl shadow-2xl animate-float mb-2">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-red-400/30 max-h-48">
              <img src={data.photo} alt="Hot Wheels Amor" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-2 text-red-300 mb-1">
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            <h2 className="font-bold text-sm text-white">
              {data?.letterTitle || 'Para Mi Copiloto Favorito/a'}
            </h2>
          </div>
          <p className="text-xs text-red-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'La vida es como una pista llena de curvas, y no existe nadie con quien prefiera viajar que contigo.'}
          </p>
        </div>
      )}
    </div>
  );
}
