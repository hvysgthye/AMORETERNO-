import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Activity, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function LatidosLuzTemplate({ data }) {
  const [pulseBpm, setPulseBpm] = useState(75);
  const [accelerated, setAccelerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAccelerate = () => {
    setAccelerated(true);
    setPulseBpm(135);
    sound.playUnlockSuccess();
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#ffffff']
      });
    } catch (e) {}
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#1c050a] via-[#140307] to-black text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['heart','dot']} colors={['#ef4444','#fb7185','#fecaca']} aurora={['#991b1b','#be123c']} motion="rise" seed={22} />
      {/* Red Glowing Heartbeat Aura */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none transition-all duration-300 ${accelerated ? 'scale-125 bg-rose-600/30' : ''}`} />

      {/* Floating Music Control */}
      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#ef4444" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>Frecuencia Cardíaca: {pulseBpm} BPM</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-red-200">
          {data?.title || 'El Ritmo de Mi Corazón'}
        </h1>
        <p className="text-xs text-rose-300/70 mt-1">
          {accelerated ? '¡Taquicardia de amor detectada al 100%!' : 'Toca el monitor para sincronizar nuestros latidos'}
        </p>
      </div>

      {/* Glowing Neon ECG Line & Heart Monitor */}
      <div className="my-auto relative flex flex-col items-center cursor-pointer" onClick={handleAccelerate}>
        {/* ECG Grid Display */}
        <div className="relative w-72 sm:w-80 h-44 bg-black/80 rounded-2xl border-2 border-rose-500/40 shadow-2xl p-4 flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#881337_1px,transparent_1px),linear-gradient(to_bottom,#881337_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />

          {/* Glowing Animated Heart in Center */}
          <div className={`relative z-10 ${accelerated ? 'scale-125' : 'scale-100'} transition-transform duration-300`}>
            <Heart className={`w-20 h-20 text-rose-500 fill-rose-600 drop-shadow-[0_0_20px_#f43f5e] ${accelerated ? 'animate-ping' : 'animate-pulse'}`} />
          </div>

          {/* Running ECG Sine Wave Line */}
          <svg viewBox="0 0 300 60" className="absolute bottom-2 inset-x-0 w-full h-12 stroke-rose-400 fill-none">
            <path
              d="M0 30 L50 30 L60 30 L65 10 L75 55 L85 20 L95 35 L105 30 L160 30 L165 10 L175 55 L185 20 L195 35 L205 30 L300 30"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_#f43f5e]"
            />
          </svg>
        </div>

        {!accelerated && (
          <span className="mt-3 text-xs font-semibold text-rose-300/90 bg-rose-950/70 px-4 py-1.5 rounded-full border border-rose-500/30 animate-pulse">
            Toca el corazón para acelerar el ritmo 💓
          </span>
        )}
      </div>

      {/* Revealed Dedication Card */}
      {accelerated && (
        <div className="z-10 w-full max-w-md bg-slate-900/85 border border-rose-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-2xl mb-2 animate-float">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-rose-400/30 max-h-48">
              <img src={data.photo} alt="Latidos" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="font-semibold text-sm text-rose-200 mb-1">
            {data?.letterTitle || 'Mi corazón late a tu compás'}
          </h2>
          <p className="text-xs text-rose-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'Cada segundo, cada suspiro y cada latido lleva grabado tu nombre. Eres el motivo por el cual mi pulso se acelera de felicidad.'}
          </p>
        </div>
      )}
    </div>
  );
}
