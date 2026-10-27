import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Flame, Zap } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function HotWheelsTemplate({ data }) {
  const [turboActive, setTurboActive] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);

  const badgeText = resolveText(data?.badgeText, 'Hot Wheels Romance Edition');
  const titleText = resolveText(data?.title, 'Acelerando Mi Corazón');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Presiona el botón de nitro para arrancar 🏎️🔥');
  const unlockSubtitle = resolveText(data?.unlockMsg, '¡Vuelta rápida completada: Mi mayor premio eres tú!');
  const actionHint = resolveText(data?.actionHint, 'ACTIVAR NITRO 🔥');
  const letterTitle = resolveText(data?.letterTitle, 'Para Mi Copiloto Favorito/a');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'La vida es como una pista llena de curvas, y no existe nadie con quien prefiera viajar que contigo.');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

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
      if (!bgmActive) sound.toggleMusicTrack(data?.customAudio, setBgmActive);
    }, 600);
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#1c0808] via-[#2d0e0e] to-[#120505] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['sparkle', 'dot']} colors={['#f97316', '#facc15', '#ef4444']} aurora={['#dc2626', '#ea580c']} seed={21} />

      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#f97316" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300">
            {titleText}
          </h1>
        )}
        {(unlocked ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-red-200/80 mt-1">
            {unlocked ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* Center Interactive Racetrack */}
      {!unlocked ? (
        <div className="my-auto relative flex flex-col items-center z-10">
          <div className="relative w-72 h-52 bg-gradient-to-b from-red-950/50 to-black/80 rounded-3xl border-2 border-orange-500/50 p-5 flex flex-col items-center justify-center shadow-2xl">
            <div className="w-56 h-20 border-4 border-orange-500 rounded-full flex items-center justify-between px-4 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
              <div className={`text-3xl transform transition-transform duration-500 ${turboActive ? 'translate-x-36 rotate-6' : 'translate-x-0'}`}>
                🏎️
              </div>
              <div className={`text-3xl transform transition-transform duration-500 ${turboActive ? '-translate-x-36 -rotate-6' : 'translate-x-0'}`}>
                🚗
              </div>
            </div>

            {actionHint && (
              <button
                type="button"
                onClick={handleTurbo}
                className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/40 active:scale-95 transition flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{actionHint}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="Flush"
            accent="#f97316"
            badge={badgeText}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => {
              setTurboActive(false);
              setUnlocked(false);
            }}
          />
        </div>
      )}

      <div />
    </div>
  );
}
