import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Lock, Unlock, Music, Heart, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function CandadoTemplate({ data, standalone = false }) {
  const targetCombo = data?.combo || [14, 2, 24];
  const [currentCombo, setCurrentCombo] = useState([0, 0, 0]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);
  const [shackleOpen, setShackleOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  // Check if current combination matches target
  useEffect(() => {
    if (
      currentCombo[0] === targetCombo[0] &&
      currentCombo[1] === targetCombo[1] &&
      currentCombo[2] === targetCombo[2]
    ) {
      if (!isUnlocked) {
        handleUnlock();
      }
    }
  }, [currentCombo, targetCombo, isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sound.playUnlockSuccess();
    setShackleOpen(true);

    // Launch romantic heart confetti
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fcd34d', '#ffffff']
      });
    } catch (e) {
      // Confetti fallback
    }

    // Auto-enable romantic music
    setTimeout(() => {
      sound.toggleMusicTrack(data?.customAudio, setBgmActive);
      setShowLetter(true);
    }, 900);
  };

  const adjustDigit = (dialIndex, delta) => {
    if (isUnlocked) return;
    sound.playDialClick();
    setCurrentCombo(prev => {
      const next = [...prev];
      let val = next[dialIndex] + delta;
      if (val > 31) val = 0;
      if (val < 0) val = 31;
      next[dialIndex] = val;
      return next;
    });
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  // Quick helper to auto-solve for instant previewing
  const autoUnlockForPreview = () => {
    setCurrentCombo([...targetCombo]);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#0d0f22] via-[#1a0f2e] to-[#250d1d] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['heart','sparkle']} colors={['#f43f5e','#f9a8d4','#fbbf24']} aurora={['#e11d48','#6d28d9']} seed={19} />
      {/* Ambient background glowing orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-rose-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Floating Music Control */}
      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#f43f5e" />

      {/* Main Container */}
      <div className="w-full max-w-lg z-10 flex flex-col items-center">
        {/* Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Candado de Amor Eterno</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 font-serif-romance">
            {data?.title || 'Nuestro Secreto Eterno'}
          </h1>
          <p className="text-sm text-rose-200/70 mt-1 max-w-sm mx-auto">
            {isUnlocked ? (data?.unlockMsg || '¡Desbloqueaste mi corazón!') : (data?.lockTitle || 'Gira los números para abrir el candado')}
          </p>
        </div>

        {/* 3D Physical Padlock Object */}
        <div className="relative my-4 flex flex-col items-center perspective-1000">
          {/* Shackle (Arco metálico superior que se eleva y gira al abrir) */}
          <div
            className={`w-32 h-28 border-[12px] border-amber-300/90 rounded-t-full transition-all duration-700 ease-out origin-bottom-left shadow-md ${
              shackleOpen
                ? '-translate-y-8 rotate-12 border-amber-200 shadow-amber-400/50'
                : 'translate-y-3 border-amber-400 shadow-inner'
            }`}
            style={{
              background: 'transparent',
              borderColor: shackleOpen ? '#fde047' : '#fbbf24',
              boxShadow: shackleOpen ? '0 -6px 20px rgba(251, 191, 36, 0.4)' : 'none'
            }}
          />

          {/* Padlock Heavy Metallic Body */}
          <div className="relative w-56 sm:w-64 bg-gradient-to-b from-[#2b251a] via-[#45371c] to-[#1f1910] border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl shadow-black/80 flex flex-col items-center z-10 backdrop-blur-md">
            {/* Golden Heart Emblem on Padlock */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 flex items-center justify-center shadow-inner mb-4 border border-yellow-200/50">
              {isUnlocked ? (
                <Unlock className="w-5 h-5 text-amber-950 animate-bounce" />
              ) : (
                <Heart className="w-5 h-5 text-rose-800 fill-rose-600" />
              )}
            </div>

            {/* Dials Chamber (3 Rotating Tumblers) */}
            <div className="w-full bg-[#120f0a] rounded-2xl p-3 border border-amber-600/40 shadow-inner flex justify-center gap-3">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Up Button */}
                  <button
                    disabled={isUnlocked}
                    onClick={() => adjustDigit(idx, 1)}
                    className="p-1 rounded-md text-amber-400/80 hover:text-amber-200 hover:bg-amber-400/10 active:scale-95 disabled:opacity-30 transition"
                    aria-label={`Incrementar dígito ${idx + 1}`}
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  {/* Cylindrical Dial Face with metallic highlights */}
                  <div className="relative w-12 sm:w-14 h-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-amber-500/50 rounded-xl flex items-center justify-center shadow-lg overflow-hidden my-1">
                    {/* Metallic glare overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/60 pointer-events-none" />
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wider font-mono">
                      {String(currentCombo[idx]).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Down Button */}
                  <button
                    disabled={isUnlocked}
                    onClick={() => adjustDigit(idx, -1)}
                    className="p-1 rounded-md text-amber-400/80 hover:text-amber-200 hover:bg-amber-400/10 active:scale-95 disabled:opacity-30 transition"
                    aria-label={`Disminuir dígito ${idx + 1}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Status Indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isUnlocked ? 'bg-emerald-400 animate-ping' : 'bg-rose-500 animate-pulse'
                }`}
              />
              <span className="text-xs font-medium text-amber-200/80 uppercase tracking-widest">
                {isUnlocked ? 'DESBLOQUEADO' : 'CANDADO CERRADO'}
              </span>
            </div>

            {/* Shortcut hint for testing */}
            {!isUnlocked && (
              <button
                onClick={autoUnlockForPreview}
                className="mt-3 text-[11px] text-amber-400/60 hover:text-amber-300 underline transition cursor-pointer"
              >
                (Pista de prueba: {targetCombo.join(' - ')})
              </button>
            )}
          </div>
        </div>

        {/* Revealed Romantic Letter (Appears when lock opens) */}
        {showLetter && (
          <div className="w-full mt-6 bg-gradient-to-b from-rose-950/80 to-[#1f101f]/90 border border-rose-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-float transition-all duration-700">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4 mb-4">
              <div className="flex items-center gap-2 text-rose-300">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
                <span className="font-semibold text-sm tracking-wide">Para Mi Amor Eterno</span>
              </div>
              <span className="text-xs text-rose-300/60 font-mono">
                {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Photo if provided */}
            {data?.photo && (
              <div className="relative mb-5 overflow-hidden rounded-2xl border-2 border-rose-400/30 shadow-lg max-h-64 flex items-center justify-center bg-black/40">
                <img
                  src={data.photo}
                  alt="Foto romántica"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
              </div>
            )}

            {/* Letter Title & Body */}
            <h2 className="text-xl sm:text-2xl font-bold text-rose-100 font-serif-romance mb-3">
              {data?.letterTitle || 'Para la persona más especial de mi vida'}
            </h2>
            <p className="text-rose-200/90 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
              {data?.letterBody || 'Gracias por llenar mi mundo de luz y alegría cada día...'}
            </p>

            {/* Sweet Signature */}
            <div className="mt-6 pt-4 border-t border-rose-500/20 flex justify-end">
              <span className="font-romantic text-2xl text-rose-300">
                Con todo mi amor infinito ❤️
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
