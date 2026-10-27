import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Gift, Heart } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function RegaloTemplate({ data }) {
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const badgeText = resolveText(data?.badgeText, '¡Sorpresa Especial Para Ti!');
  const titleText = resolveText(data?.title, '¡Feliz Día, Amor de Mi Vida!');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Toca el moño dorado para abrir tu regalo 🎁');
  const unlockSubtitle = resolveText(data?.unlockMsg, '¡Sorpresa preparada con todo mi cariño!');
  const actionHint = resolveText(data?.actionHint, 'Desatar moño 🎁');
  const letterTitle = resolveText(data?.letterTitle, 'El mejor regalo de mi vida eres tú');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Hoy celebramos tu existencia, tu alegría y cada instante compartido...');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      sound.playUnlockSuccess();
      if (!isPlaying) sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

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
      <AmbientLayer className="-z-10" particles={['sparkle', 'heart']} colors={['#f472b6', '#c084fc', '#fbbf24']} aurora={['#db2777', '#7c3aed']} seed={18} />

      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#f472b6" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/35 text-pink-200 text-xs font-semibold mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-200 to-amber-200">
            {titleText}
          </h1>
        )}
        {(opened ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-pink-200/80 mt-1">
            {opened ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* 3D Gift Box Object */}
      {!opened ? (
        <div className="my-auto relative flex flex-col items-center cursor-pointer z-10" onClick={handleOpen}>
          <div className="relative w-56 h-56 flex flex-col items-center justify-center">
            <div className="w-48 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl border-2 border-amber-300/60 shadow-2xl z-20 flex items-center justify-center translate-y-1 hover:-translate-y-1 transition-transform">
              <div className="w-11 h-11 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-amber-950 font-black shadow-md">
                🎀
              </div>
            </div>

            <div className="w-44 h-40 bg-gradient-to-b from-rose-700 to-pink-900 border-2 border-pink-400/40 rounded-b-2xl shadow-2xl relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-y-0 w-8 bg-amber-400 border-x border-amber-200/50" />
              <div className="absolute inset-x-0 h-8 bg-amber-400 border-y border-amber-200/50" />
            </div>

            {actionHint && (
              <span className="mt-4 text-xs font-bold text-pink-200 animate-pulse bg-pink-950/60 px-4 py-1.5 rounded-full border border-pink-500/30">
                {actionHint}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="Flush"
            accent="#ec4899"
            badge={badgeText}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => setOpened(false)}
          />
        </div>
      )}

      <div />
    </div>
  );
}
