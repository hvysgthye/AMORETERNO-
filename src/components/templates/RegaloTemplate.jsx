import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Gift, Heart, Music, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function RegaloTemplate({ data }) {
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      sound.playUnlockSuccess();
      sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

      try {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#f43f5e', '#a855f7', '#fbbf24', '#ffffff']
        });
      } catch (e) {}
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#1f0914] via-[#2b0c20] to-[#140612] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['sparkle','heart']} colors={['#f472b6','#c084fc','#fbbf24']} aurora={['#db2777','#7c3aed']} seed={18} />
      {/* Floating Music Control */}
      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#f472b6" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-2">
          <Gift className="w-3.5 h-3.5" />
          <span>¡Sorpresa Especial Para Ti!</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-200 to-amber-200">
          {data?.title || '¡Feliz Día, Amor de Mi Vida!'}
        </h1>
        <p className="text-xs text-pink-200/70 mt-1">
          {opened ? (data?.unlockMsg || '¡Sorpresa preparada con todo mi cariño!') : 'Toca el moño dorado para abrir la caja'}
        </p>
      </div>

      {/* 3D Gift Box Object */}
      <div className="my-auto relative flex flex-col items-center cursor-pointer" onClick={handleOpen}>
        <div className="relative w-56 h-56 flex flex-col items-center justify-center">
          {/* Lid (Pops up and rotates when opened) */}
          <div
            className={`w-48 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl border-2 border-amber-300/60 shadow-2xl z-20 flex items-center justify-center transition-all duration-700 ${
              opened ? '-translate-y-20 -rotate-12 opacity-80' : 'translate-y-1'
            }`}
          >
            {/* Golden Ribbon Bow */}
            <div className="w-10 h-10 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-amber-950 font-black shadow-md">
              🎀
            </div>
          </div>

          {/* Box Base */}
          <div className="w-44 h-40 bg-gradient-to-b from-rose-700 to-pink-900 border-2 border-pink-400/40 rounded-b-2xl shadow-2xl relative flex items-center justify-center overflow-hidden">
            {/* Vertical Golden Ribbon */}
            <div className="absolute inset-y-0 w-8 bg-amber-400 border-x border-amber-200/50" />
            {/* Horizontal Golden Ribbon */}
            <div className="absolute inset-x-0 h-8 bg-amber-400 border-y border-amber-200/50" />

            {/* Inner Glowing Surprise when opened */}
            {opened && (
              <div className="z-10 text-center animate-bounce">
                <Heart className="w-14 h-14 text-white fill-rose-500 drop-shadow-[0_0_15px_#f43f5e]" />
              </div>
            )}
          </div>

          {!opened && (
            <span className="mt-4 text-xs font-bold text-pink-300/80 animate-pulse bg-pink-950/60 px-4 py-1.5 rounded-full border border-pink-500/30">
              Desatar moño 🎁
            </span>
          )}
        </div>
      </div>

      {/* Revealed Card */}
      {opened && (
        <div className="z-10 w-full max-w-md bg-slate-900/80 border border-pink-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-2xl mb-2">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-pink-400/30 max-h-48">
              <img src={data.photo} alt="Regalo" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="font-semibold text-sm text-pink-200 mb-1">
            {data?.letterTitle || 'El mejor regalo de mi vida eres tú'}
          </h2>
          <p className="text-xs text-pink-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'Hoy celebramos tu existencia, tu alegría y cada instante compartido...'}
          </p>
        </div>
      )}
    </div>
  );
}
