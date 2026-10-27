import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Sun, Sparkles, Mail, RotateCcw } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function FlorAmarillaTemplate({ data }) {
  const [pluckedPetals, setPluckedPetals] = useState([]);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const badgeText = resolveText(data?.badgeText, 'Tus Flores Amarillas Soñadas');
  const titleText = resolveText(data?.title, 'Flores Amarillas Eternas');
  const lockSubtitle = resolveText(data?.lockStatus, 'Toca cada pétalo dorado para descubrir un mensaje de amor 🌻💛');
  const unlockSubtitle = resolveText(data?.unlockMsg, '¡Tus flores amarillas nunca se marchitarán!');
  const letterTitle = resolveText(data?.letterTitle, 'Porque te mereces todas las flores del mundo');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Sé cuánto soñabas con tus flores amarillas. Hoy quiero recordarte que iluminas mis días como el sol más radiante.');
  const signature = resolveText(data?.customSign, 'Con todo mi amor 💛');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const phrases = useMemo(() => {
    const raw = resolveText(
      data?.floatingPhrases,
      'Iluminas mis días como el sol ☀️\nMis flores amarillas son para ti 🌻\nQuiero una vida entera a tu lado 💛\nTu sonrisa es mi paz favorita ✨\nGracias por hacerme tan feliz 🌼\nEres mi primavera eterna 💛\nTe elijo hoy y siempre 🌻\nMi corazón florece contigo ❤️'
    );
    return raw ? raw.split('\n').map(s => s.trim()).filter(Boolean) : [];
  }, [data?.floatingPhrases]);

  const totalPetals = 8;
  const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  const handlePetalClick = (idx) => {
    sound.playClick();
    if (!isPlaying) sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

    if (!pluckedPetals.includes(idx)) {
      const next = [...pluckedPetals, idx];
      setPluckedPetals(next);
      if (next.length === totalPetals) {
        sound.playUnlockSuccess();
      }
    }

    if (phrases.length > 0) {
      setCurrentPhrase(phrases[idx % phrases.length]);
    }

    try {
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#facc15', '#eab308', '#fde047', '#f59e0b', '#ffffff']
      });
    } catch (e) {}
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#1f1603] via-[#332406] to-[#120d02] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['petal', 'sparkle']} colors={['#facc15', '#fde68a', '#fb923c']} aurora={['#ca8a04', '#ea580c']} seed={24} />

      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#facc15" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-1">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs font-semibold mb-2">
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-orange-200">
            {titleText}
          </h1>
        )}
        {(pluckedPetals.length > 0 ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-amber-200/80 mt-1">
            {pluckedPetals.length === totalPetals ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* Interactive Pluckable 8-Petal Golden Flower */}
      {!showLetter && (
        <div className="my-auto relative flex flex-col items-center z-10">
          {/* Active Petal Phrase Card */}
          <div className="min-h-[48px] flex items-center justify-center mb-1">
            {currentPhrase ? (
              <div className="px-5 py-2.5 rounded-2xl bg-amber-950/90 border border-amber-400/50 text-amber-100 text-xs sm:text-sm font-serif-romance text-center shadow-xl animate-bounce">
                “{currentPhrase}”
              </div>
            ) : (
              <span className="text-xs text-amber-300/80 font-medium">
                Pétalos descubiertos: {pluckedPetals.length} / {totalPetals} 🌻
              </span>
            )}
          </div>

          <div className="relative w-68 h-76 sm:w-76 sm:h-80 drop-shadow-[0_0_35px_rgba(250,204,21,0.45)]">
            <svg viewBox="0 0 240 270" className="w-full h-full">
              {/* Bouquet Wrapping & Ribbons */}
              <polygon points="75,165 165,165 142,258 98,258" fill="#78350f" opacity="0.45" />
              {/* Stem */}
              <path
                d="M120 255 C112 200, 128 155, 120 100"
                fill="transparent"
                stroke="#16a34a"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Leaves */}
              <path d="M118 185 C82 172, 68 148, 90 136 C108 148, 118 168, 118 185" fill="#22c55e" />
              <path d="M122 155 C158 142, 172 118, 150 106 C132 118, 122 138, 122 155" fill="#16a34a" />

              {/* Companion Side Mini Sunflowers */}
              <g transform="translate(68, 125) scale(0.55)">
                {petalAngles.map((a, i) => (
                  <ellipse key={i} cx="0" cy="-28" rx="9" ry="20" transform={`rotate(${a})`} fill="#facc15" />
                ))}
                <circle cx="0" cy="0" r="14" fill="#78350f" />
              </g>
              <g transform="translate(172, 125) scale(0.55)">
                {petalAngles.map((a, i) => (
                  <ellipse key={i} cx="0" cy="-28" rx="9" ry="20" transform={`rotate(${a})`} fill="#facc15" />
                ))}
                <circle cx="0" cy="0" r="14" fill="#78350f" />
              </g>

              {/* Main Interactive 8-Petal Golden Flower */}
              <g transform="translate(120, 95)">
                {petalAngles.map((angle, idx) => {
                  const isPlucked = pluckedPetals.includes(idx);
                  return (
                    <g
                      key={idx}
                      transform={`rotate(${angle})`}
                      onClick={() => handlePetalClick(idx)}
                      className="cursor-pointer group"
                    >
                      <ellipse
                        cx="0"
                        cy={isPlucked ? -52 : -38}
                        rx="14"
                        ry="28"
                        fill={isPlucked ? '#fde047' : '#facc15'}
                        stroke="#ca8a04"
                        strokeWidth="1.5"
                        opacity={isPlucked ? 0.55 : 1}
                        className="transition-all duration-500 hover:brightness-110"
                      />
                    </g>
                  );
                })}
                {/* Center Core */}
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill="#78350f"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  onClick={() => handlePetalClick(pluckedPetals.length % totalPetals)}
                  className="cursor-pointer"
                />
                <circle cx="0" cy="0" r="13" fill="#451a03" className="pointer-events-none" />
                <text x="0" y="4" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold" className="pointer-events-none">
                  💛
                </text>
              </g>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {(letterTitle || letterBody || photos.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowLetter(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-amber-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(250,204,21,0.5)] hover:scale-105 transition cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Leer Carta Dorada 🌻</span>
              </button>
            )}
            {pluckedPetals.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPluckedPetals([]);
                  setCurrentPhrase('');
                }}
                className="inline-flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurar pétalos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full Dedication Card Modal */}
      {showLetter && (
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
            onReplay={() => setShowLetter(false)}
          />
        </div>
      )}

      <div />
    </div>
  );
}
