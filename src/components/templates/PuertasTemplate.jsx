import React, { useState } from 'react';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Key, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function PuertasTemplate({ data }) {
  const [opened, setOpened] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      sound.playUnlockSuccess();
      sound.toggleMusicTrack(data?.customAudio, setBgmActive);
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#12080a] via-[#210d13] to-[#29140a] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['sparkle','petal']} colors={['#fbbf24','#fb7185','#fef3c7']} aurora={['#b45309','#7e22ce']} seed={19} />
      {/* Floating Music Control */}
      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#f59e0b" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Key className="w-3.5 h-3.5 text-amber-300" />
          <span>El Portal de Nuestro Amor</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-200">
          {data?.title || 'Abre la Puerta a Nuestro Amor'}
        </h1>
        <p className="text-xs text-amber-200/70 mt-1">
          {opened ? (data?.unlockMsg || 'Bienvenida/o a mi corazón.') : 'Toca el portal o la llave mágica para abrirlo'}
        </p>
      </div>

      {/* 3D Double French Doors Perspective Chamber */}
      <div className="my-auto relative w-64 h-80 perspective-1000 flex items-center justify-center cursor-pointer" onClick={handleOpen}>
        {/* Interior Heavenly Glow */}
        <div className="absolute inset-2 bg-gradient-to-b from-amber-200 via-rose-300 to-amber-500 rounded-2xl flex flex-col items-center justify-center p-4 text-slate-900 shadow-2xl transition-all duration-700">
          <Heart className="w-12 h-12 fill-rose-600 text-rose-600 animate-pulse" />
          <span className="font-romantic text-2xl font-bold text-rose-900 mt-2">¡Para Siempre!</span>
        </div>

        {/* Left Door Wing */}
        <div
          className={`absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#291c10] to-[#45301b] border-2 border-amber-500/60 rounded-l-2xl shadow-2xl flex flex-col items-end justify-center pr-3 origin-left transition-transform duration-1000 ease-in-out ${
            opened ? '-rotate-y-110 shadow-none' : 'rotate-y-0'
          }`}
          style={{ transformOrigin: 'left center' }}
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-200 shadow-md" />
        </div>

        {/* Right Door Wing */}
        <div
          className={`absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#291c10] to-[#45301b] border-2 border-amber-500/60 rounded-r-2xl shadow-2xl flex flex-col items-start justify-center pl-3 origin-right transition-transform duration-1000 ease-in-out ${
            opened ? 'rotate-y-110 shadow-none' : 'rotate-y-0'
          }`}
          style={{ transformOrigin: 'right center' }}
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-200 shadow-md" />
        </div>
      </div>

      {/* Revealed Dedication Card */}
      {opened && (
        <div className="z-10 w-full max-w-md bg-gradient-to-t from-amber-950/90 to-rose-950/80 border border-amber-500/40 rounded-3xl p-5 backdrop-blur-xl shadow-2xl animate-float mb-2">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-amber-400/30 max-h-48">
              <img src={data.photo} alt="Recuerdo" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="font-semibold text-sm text-amber-200 mb-1">
            {data?.letterTitle || 'Mi Puerta Siempre Está Abierta'}
          </h2>
          <p className="text-xs text-rose-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'Dicen que el hogar no es un lugar, sino una persona...'}
          </p>
        </div>
      )}
    </div>
  );
}
