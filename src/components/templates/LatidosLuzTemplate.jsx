import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Activity } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function LatidosLuzTemplate({ data }) {
  const [pulseBpm, setPulseBpm] = useState(75);
  const [accelerated, setAccelerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const badgeText = resolveText(data?.badgeText, `Frecuencia Cardíaca: ${pulseBpm} BPM`);
  const titleText = resolveText(data?.title, 'El Ritmo de Mi Corazón');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Toca el monitor para sincronizar nuestros latidos');
  const unlockSubtitle = resolveText(data?.unlockMsg, '¡Taquicardia de amor detectada al 100%!');
  const actionHint = resolveText(data?.actionHint, 'Toca el corazón para acelerar el ritmo 💓');
  const letterTitle = resolveText(data?.letterTitle, 'Mi corazón late a tu compás');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Cada segundo, cada suspiro y cada latido lleva grabado tu nombre. Eres el motivo por el cual mi pulso se acelera de felicidad.');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const handleAccelerate = () => {
    setAccelerated(true);
    setPulseBpm(138);
    sound.playUnlockSuccess();
    if (!isPlaying) sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

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
      <AmbientLayer className="-z-10" particles={['heart', 'dot']} colors={['#ef4444', '#fb7185', '#fecaca']} aurora={['#991b1b', '#be123c']} motion="rise" seed={22} />

      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#ef4444" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/35 text-rose-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-red-200">
            {titleText}
          </h1>
        )}
        {(accelerated ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-rose-300/80 mt-1">
            {accelerated ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* Glowing Neon ECG Line & Heart Monitor */}
      {!accelerated ? (
        <div className="my-auto relative flex flex-col items-center cursor-pointer z-10" onClick={handleAccelerate}>
          <div className="relative w-72 sm:w-80 h-44 bg-black/80 rounded-2xl border-2 border-rose-500/40 shadow-2xl p-4 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#881337_1px,transparent_1px),linear-gradient(to_bottom,#881337_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
            <div className="relative z-10 transition-transform duration-300 hover:scale-110">
              <Heart className="w-20 h-20 text-rose-500 fill-rose-600 drop-shadow-[0_0_20px_#f43f5e] animate-pulse" />
            </div>
            <svg viewBox="0 0 300 60" className="absolute bottom-2 inset-x-0 w-full h-12 stroke-rose-400 fill-none">
              <path
                d="M0 30 L50 30 L60 30 L65 10 L75 55 L85 20 L95 35 L105 30 L160 30 L165 10 L175 55 L185 20 L195 35 L205 30 L300 30"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_8px_#f43f5e]"
              />
            </svg>
          </div>

          {actionHint && (
            <span className="mt-4 text-xs font-semibold text-rose-200 bg-rose-950/70 px-4 py-1.5 rounded-full border border-rose-500/30 animate-pulse">
              {actionHint}
            </span>
          )}
        </div>
      ) : (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="Flush"
            accent="#ef4444"
            badge={badgeText}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => {
              setPulseBpm(75);
              setAccelerated(false);
            }}
          />
        </div>
      )}

      <div />
    </div>
  );
}
