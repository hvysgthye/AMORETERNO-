import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Sparkles, Gem } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function ProposeTemplate({ data }) {
  const [opened, setOpened] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noIdx, setNoIdx] = useState(0);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });

  const badgeText = resolveText(data?.badgeText, 'Una Pregunta Para Toda la Vida');
  const titleText = resolveText(data?.title, '¿Quieres Casarte Conmigo?');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Toca la cajita de terciopelo para abrirla 💍');
  const unlockSubtitle = resolveText(data?.unlockMsg, '¡DIJO QUE SÍ! 💍❤️');
  const actionHint = resolveText(data?.actionHint, 'Toca para abrir la caja 💍');
  const yesText = resolveText(data?.yesText, '¡SÍ, ACEPTO! 💍❤️');
  const letterTitle = resolveText(data?.letterTitle, 'El día en que comenzó nuestra eternidad');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'No imagino el resto de mis días sin tu risa y tu compañía. Quiero que cada amanecer sea a tu lado.');
  const signature = resolveText(data?.customSign, 'Por siempre tuyo/a ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const noPhrases = useMemo(() => {
    const raw = resolveText(
      data?.noPhrases,
      '¿Estás segura/o? 🥺\nPiénsalo otra vez 💕\n¡Ese botón no vale! 🙈\nMi corazón dice que sí ❤️\n¡Intenta el otro botón! ✨'
    );
    return raw ? raw.split('\n').map(s => s.trim()).filter(Boolean) : ['¿Segura/o? 🥺'];
  }, [data?.noPhrases]);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
      sound.playUnlockSuccess();
      if (!isPlaying) sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

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

  const handleAccept = (e) => {
    e.stopPropagation();
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

  const handleDodgeNo = (e) => {
    e.stopPropagation();
    sound.playClick();
    setNoIdx(i => i + 1);
    setNoOffset({
      x: (Math.random() - 0.5) * 140,
      y: (Math.random() - 0.5) * 70
    });
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#070b19] via-[#0d1630] to-[#1a091e] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['sparkle', 'heart', 'petal']} colors={['#fde68a', '#ffffff', '#f9a8d4']} aurora={['#1d4ed8', '#be185d']} seed={19} />

      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#fbbf24" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-yellow-200">
            {titleText}
          </h1>
        )}
        {(accepted ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-amber-200/80 mt-1">
            {accepted ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* Velvet Ring Box 3D & Proposal Interaction */}
      {!accepted ? (
        <div className="my-auto relative flex flex-col items-center z-10" onClick={handleOpen}>
          <div className="relative w-60 h-60 flex flex-col items-center justify-center cursor-pointer">
            <div className="relative w-52 h-40 bg-gradient-to-b from-[#2b102f] via-[#4a102a] to-[#1f0818] border-2 border-amber-400/60 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-4 flex flex-col items-center justify-center">
              <div className="w-40 h-28 bg-gradient-to-tr from-slate-950 via-rose-950 to-indigo-950 rounded-2xl border border-amber-200/20 flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className={`relative transition-all duration-700 ${opened ? 'scale-125 -translate-y-1' : 'scale-75 opacity-60'}`}>
                  <div className="w-16 h-16 rounded-full border-4 border-amber-300 shadow-[0_0_25px_#fde047] flex items-center justify-center relative">
                    <div className="absolute -top-3.5 w-8 h-8 bg-white rotate-45 border-2 border-cyan-200 shadow-[0_0_25px_#67e8f9] animate-pulse flex items-center justify-center">
                      <Gem className="w-4 h-4 text-cyan-500 -rotate-45" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#591334] to-[#2e091b] border-t-2 border-amber-300 rounded-t-3xl shadow-xl origin-top transition-transform duration-700 ${
                  opened ? '-translate-y-14 scale-y-50 opacity-30' : ''
                }`}
              />
            </div>

            {!opened && actionHint && (
              <span className="mt-5 text-xs font-bold text-amber-200 animate-pulse bg-slate-900/80 px-5 py-2 rounded-full border border-amber-500/40">
                {actionHint}
              </span>
            )}
          </div>

          {opened && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 z-20 relative min-h-[70px]">
              <button
                type="button"
                onClick={handleAccept}
                style={{ transform: `scale(${Math.min(1.45, 1 + noIdx * 0.08)})` }}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:brightness-110 transition-all cursor-pointer"
              >
                {yesText || '¡SÍ, ACEPTO! 💍'}
              </button>

              {noPhrases.length > 0 && (
                <button
                  type="button"
                  onMouseEnter={handleDodgeNo}
                  onClick={handleDodgeNo}
                  style={{ transform: `translate(${noOffset.x}px, ${noOffset.y}px)` }}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-100/90 transition-transform duration-200 cursor-pointer"
                >
                  {noIdx === 0 ? 'No sé...' : noPhrases[(noIdx - 1) % noPhrases.length]}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="Flush"
            accent="#fbbf24"
            badge={unlockSubtitle}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => setAccepted(false)}
          />
        </div>
      )}

      <div />
    </div>
  );
}
