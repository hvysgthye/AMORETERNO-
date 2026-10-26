import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Sparkles, Gem } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function ProposeTemplate({ data }) {
  const [opened, setOpened] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      sound.playUnlockSuccess();
      sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#fde047', '#f43f5e', '#ffffff']
        });
      } catch (e) {}
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    sound.playUnlockSuccess();
    try {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#e11d48', '#f59e0b', '#ec4899', '#ffffff']
      });
    } catch (e) {}
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#070b19] via-[#0d1630] to-[#04060d] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['sparkle','petal']} colors={['#fde68a','#ffffff','#f9a8d4']} aurora={['#1d4ed8','#b45309']} seed={19} />
      {/* Floating Music Control */}
      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#fbbf24" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Una Pregunta Para Toda la Vida</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-yellow-200">
          {data?.title || '¿Quieres Casarte Conmigo?'}
        </h1>
        <p className="text-xs text-amber-200/70 mt-1">
          {accepted ? '¡DIJO QUE SÍ! 💍❤️' : opened ? '¿Aceptas ser mi compañera/o de vida?' : 'Toca la cajita de terciopelo para abrirla'}
        </p>
      </div>

      {/* Velvet Ring Box 3D */}
      <div className="my-auto relative flex flex-col items-center cursor-pointer" onClick={handleOpen}>
        <div className="relative w-56 h-56 flex flex-col items-center justify-center">
          {/* Box Bottom */}
          <div className="relative w-48 h-36 bg-gradient-to-b from-[#1a2142] to-[#0b1024] border-2 border-amber-400/50 rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-center">
            {/* Interior Velvet Cushion */}
            <div className="w-36 h-24 bg-gradient-to-tr from-slate-950 to-indigo-950 rounded-xl border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden">
              {/* Gleaming Diamond Ring */}
              <div className={`relative transition-all duration-700 ${opened ? 'scale-125 -translate-y-2' : 'scale-75 opacity-50'}`}>
                {/* Ring Band */}
                <div className="w-16 h-16 rounded-full border-4 border-amber-300 shadow-[0_0_15px_#fde047] flex items-center justify-center relative">
                  {/* Diamond Gem */}
                  <div className="absolute -top-3 w-7 h-7 bg-white rotate-45 border-2 border-cyan-200 shadow-[0_0_20px_#67e8f9] animate-pulse flex items-center justify-center">
                    <Gem className="w-4 h-4 text-cyan-500 -rotate-45" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lid (Swings open 3D) */}
            <div
              className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#253061] to-[#171f42] border-t-2 border-amber-300 rounded-t-2xl shadow-xl origin-top transition-transform duration-700 ${
                opened ? '-rotate-x-120 shadow-none' : 'rotate-x-0'
              }`}
            />
          </div>

          {!opened && (
            <span className="mt-4 text-xs font-bold text-amber-300/80 animate-pulse bg-slate-900/80 px-4 py-1.5 rounded-full border border-amber-500/30">
              Toca para abrir la caja 💍
            </span>
          )}
        </div>

        {/* Accepted Decision Buttons */}
        {opened && !accepted && (
          <div className="mt-4 flex items-center gap-4 z-20">
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              ¡SÍ, ACEPTO! 💍❤️
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-xs font-semibold text-amber-300/80 hover:text-white transition cursor-pointer"
            >
              (¡Claro que sí!)
            </button>
          </div>
        )}
      </div>

      {/* Revealed Dedication Card */}
      {opened && (
        <div className="z-10 w-full max-w-md bg-slate-900/80 border border-amber-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-2xl mb-2">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-amber-400/30 max-h-48">
              <img src={data.photo} alt="Pedida" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="font-semibold text-sm text-amber-200 mb-1">
            {data?.letterTitle || 'El día en que comenzó nuestra eternidad'}
          </h2>
          <p className="text-xs text-amber-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'No imagino el resto de mis días sin tu risa y tu compañía. Quiero que cada amanecer sea a tu lado.'}
          </p>
        </div>
      )}
    </div>
  );
}
