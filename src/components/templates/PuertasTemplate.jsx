import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Key } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function PuertasTemplate({ data }) {
  const [opened, setOpened] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);

  const badgeText = resolveText(data?.badgeText, 'El Portal de Nuestro Amor');
  const titleText = resolveText(data?.title, 'Abre la Puerta a Nuestro Amor');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Toca las puertas doradas para abrir mi corazón');
  const unlockSubtitle = resolveText(data?.unlockMsg, 'Bienvenida/o a mi corazón.');
  const actionHint = resolveText(data?.actionHint, 'Toca para abrir el portal 🗝️');
  const letterTitle = resolveText(data?.letterTitle, 'Mi Puerta Siempre Está Abierta');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Dicen que el hogar no es un lugar, sino una persona...');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      sound.playUnlockSuccess();
      if (!bgmActive) sound.toggleMusicTrack(data?.customAudio, setBgmActive);
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#fbbf24', '#fb7185', '#fde68a']
        });
      } catch (e) {}
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#12080a] via-[#210d13] to-[#29140a] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['sparkle', 'petal']} colors={['#fbbf24', '#fb7185', '#fef3c7']} aurora={['#b45309', '#7e22ce']} seed={19} />

      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#f59e0b" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs font-semibold mb-2">
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-pink-200">
            {titleText}
          </h1>
        )}
        {(opened ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-amber-200/80 mt-1">
            {opened ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* 3D Double French Doors Perspective Chamber */}
      {!opened ? (
        <div className="my-auto flex flex-col items-center cursor-pointer z-10" onClick={handleOpen}>
          <div className="relative w-64 h-80 perspective-1000 flex items-center justify-center">
            <div className="absolute inset-2 bg-gradient-to-b from-amber-200 via-rose-300 to-amber-500 rounded-2xl flex flex-col items-center justify-center p-4 text-slate-900 shadow-2xl">
              <Heart className="w-12 h-12 fill-rose-600 text-rose-600 animate-pulse" />
            </div>

            <div
              className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#291c10] to-[#45301b] border-2 border-amber-500/60 rounded-l-2xl shadow-2xl flex flex-col items-end justify-center pr-3 transition-transform duration-700 hover:-translate-x-1"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-200 shadow-md" />
            </div>

            <div
              className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#291c10] to-[#45301b] border-2 border-amber-500/60 rounded-r-2xl shadow-2xl flex flex-col items-start justify-center pl-3 transition-transform duration-700 hover:translate-x-1"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-200 shadow-md" />
            </div>
          </div>

          {actionHint && (
            <span className="mt-4 px-5 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold animate-pulse">
              {actionHint}
            </span>
          )}
        </div>
      ) : (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="paper"
            accent="#d97706"
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
