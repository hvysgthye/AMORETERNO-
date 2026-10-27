import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Mail, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function CartaTemplate({ data }) {
  const [stage, setStage] = useState('closed'); // 'closed' | 'opening' | 'opened'
  const [isPlaying, setIsPlaying] = useState(false);

  const badgeText = resolveText(data?.badgeText, 'Correspondencia de Amor Clásica');
  const titleText = resolveText(data?.title, 'Una Carta Sellada Con Mi Alma');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Toca el sello de corazón para abrir el sobre');
  const unlockSubtitle = resolveText(data?.unlockMsg, 'Escrita desde lo más profundo de mi corazón');
  const actionHint = resolveText(data?.actionHint, 'Toca para abrir el sobre 💌');
  const letterTitle = resolveText(data?.letterTitle, 'Mi más sincera confesión de amor');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Hay sentimientos tan profundos que solo una carta escrita desde el corazón puede expresar...');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;
    setStage('opening');
    sound.playUnlockSuccess();
    if (!isPlaying) sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

    try {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#fda4af', '#fcd34d']
      });
    } catch (e) {}

    setTimeout(() => {
      setStage('opened');
    }, 1050);
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#230914] via-[#3b0d22] to-[#14050b] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['heart', 'petal', 'sparkle']} colors={['#fb7185', '#f43f5e', '#fcd34d']} aurora={['#be123c', '#9f1239']} seed={17} />

      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#e11d48" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/35 text-rose-200 text-xs font-semibold mb-2">
            <Mail className="w-3.5 h-3.5 text-rose-300" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200">
            {titleText}
          </h1>
        )}
        {(stage === 'opened' ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-rose-200/80 mt-1">
            {stage === 'opened' ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* 3D Folding Envelope Scene */}
      {stage !== 'opened' ? (
        <button className="ae-envelope-button my-auto relative flex flex-col items-center z-10 cursor-pointer" type="button" aria-label="Romper el sello y abrir la carta" onClick={handleOpenEnvelope}>
          <div className="ae-envelope relative h-56 perspective-1000">
            {/* Back of Envelope */}
            <div className="absolute inset-0 rounded-2xl ae-envelope-back shadow-[0_25px_60px_rgba(0,0,0,0.65)] border border-rose-200/50" />

            {/* Rising Letter Sheet Inside Pocket */}
            <div
              className={`absolute inset-x-5 bg-[#fffdf9] rounded-xl p-5 shadow-md border border-rose-200 transition-all duration-700 ease-out flex flex-col items-center text-center ${
                stage === 'opening' ? '-translate-y-24 h-52 opacity-100 z-20' : 'translate-y-4 h-44 opacity-95 z-10'
              }`}
            >
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 mb-2 animate-pulse" />
              <p className="font-serif-romance font-bold text-rose-900 text-base line-clamp-1">
                {letterTitle || 'Para Ti ❤️'}
              </p>
              <p className="text-xs text-rose-800/80 mt-1 line-clamp-3 font-serif-romance italic">
                {letterBody}
              </p>
            </div>

            {/* Front Left/Right/Bottom Pocket Fold */}
            <svg viewBox="0 0 360 220" className="absolute inset-0 w-full h-full z-20 pointer-events-none rounded-2xl overflow-hidden">
              <polygon points="0,0 180,115 0,220" fill="var(--ae-paper-light)" />
              <polygon points="360,0 180,115 360,220" fill="var(--ae-paper-mid)" />
              <polygon points="0,220 180,105 360,220" fill="var(--ae-paper-shadow)" />
            </svg>

            {/* Top 3D Folding Triangular Flap */}
            <svg
              viewBox="0 0 360 130"
              style={{
                transformOrigin: 'top center',
                transform: stage === 'opening' ? 'rotateX(180deg)' : 'rotateX(0deg)',
                transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className={`absolute top-0 inset-x-0 w-full h-32 pointer-events-none ${stage === 'opening' ? 'z-10' : 'z-30'}`}
            >
              <polygon points="0,0 180,125 360,0" fill="var(--ae-paper-mid)" stroke="var(--ae-paper-light)" strokeWidth="1.5" />
            </svg>

            {/* Beating Red Wax Heart Seal */}
            {stage === 'closed' && (
              <div className="ae-wax absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-900 via-red-600 to-rose-500 border-2 border-amber-200/80 shadow-[0_6px_20px_rgba(190,18,60,0.7)] flex items-center justify-center hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 fill-rose-100 text-white animate-pulse" />
              </div>
            )}
          </div>

          {actionHint && (
            <span className="mt-5 px-5 py-2 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-100 text-xs font-bold tracking-wide animate-pulse">
              {actionHint}
            </span>
          )}
        </button>
      ) : (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="paper"
            accent="#be123c"
            badge={badgeText}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => setStage('closed')}
          />
        </div>
      )}

      <div />
    </div>
  );
}
