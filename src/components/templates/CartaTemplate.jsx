import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Mail, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard } from './shared/Decor';

export default function CartaTemplate({ data }) {
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      sound.playUnlockSuccess();
      sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#be123c', '#fb7185', '#fcd34d']
        });
      } catch (e) {}
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#1c0a0f] via-[#2d0f19] to-[#120508] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['petal','sparkle']} colors={['#be123c','#fb7185','#fcd34d']} aurora={['#9f1239','#b45309']} seed={17} />
      {/* Floating Music Control */}
      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#e11d48" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
          <Mail className="w-3.5 h-3.5" />
          <span>Correspondencia de Amor Clásica</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
          {data?.title || 'Una Carta Sellada Con Mi Alma'}
        </h1>
        <p className="text-xs text-rose-200/70 mt-1">
          {opened ? (data?.unlockMsg || 'El sello se ha roto para ti.') : (data?.lockTitle || 'Toca el sello de lacre para romperlo y leer')}
        </p>
      </div>

      {/* Interactive Wax Sealed Envelope */}
      <div className="my-auto relative flex flex-col items-center cursor-pointer" onClick={handleOpen}>
        {!opened ? (
          <div className="relative w-72 sm:w-80 h-52 bg-gradient-to-b from-[#e2c799] to-[#c5a676] rounded-2xl shadow-2xl border border-amber-300/40 p-4 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300">
            {/* Envelope Flap Lines */}
            <div className="absolute top-0 inset-x-0 h-24 border-b-2 border-amber-900/20 clip-path-triangle pointer-events-none" />

            {/* Glowing Red Wax Seal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-950 via-red-700 to-rose-600 border-2 border-red-400 shadow-xl flex items-center justify-center animate-pulse-glow z-10">
              <Heart className="w-8 h-8 fill-rose-100 text-rose-200" />
            </div>
            <span className="mt-3 text-xs font-bold text-amber-950/80 uppercase tracking-widest font-mono">
              Toca para abrir sello
            </span>
          </div>
        ) : (
          /* Carta desplegada en pergamino con foto polaroid y ornamentos */
          <LoveLetterCard
            variant="paper"
            accent="#be123c"
            photo={data?.photo}
            title={data?.letterTitle || 'Mi más sincera confesión de amor'}
            body={data?.letterBody || 'Hay sentimientos tan profundos que solo una carta escrita desde el corazón puede expresar...'}
            signature="Sellado para siempre en mi corazón"
          />
        )}
      </div>

      <div />
    </div>
  );
}
