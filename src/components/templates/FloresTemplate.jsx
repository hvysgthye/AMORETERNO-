import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Sparkles, Mail } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function FloresTemplate({ data }) {
  const [bloomed, setBloomed] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [activePhrase, setActivePhrase] = useState('');
  const [bgmActive, setBgmActive] = useState(false);

  const badgeText = resolveText(data?.badgeText, 'Ramo Eterno para Ti');
  const titleText = resolveText(data?.title, 'Flores que Nunca Se Marchitan');
  const lockSubtitle = resolveText(data?.lockStatus, 'Toca el ramo para hacerlo florecer y descubrir tus mensajes 💜');
  const unlockSubtitle = resolveText(data?.unlockMsg, 'Toca cada flor del ramo para leer un mensaje especial ✨');
  const letterTitle = resolveText(data?.letterTitle, 'Como las flores en primavera');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Estas flores digitales vivirán para siempre, tal como mi amor por ti.');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const phrases = useMemo(() => {
    const raw = resolveText(
      data?.floatingPhrases,
      'Eres el jardín donde quiero quedarme siempre 💜\nCada pétalo guarda un te amo para ti 🌸\nNunca dejaré de regalarte flores ✨\nIluminas cada rincón de mi vida 🌷\nMi amor por ti florece cada mañana 💕'
    );
    return raw ? raw.split('\n').map(s => s.trim()).filter(Boolean) : [];
  }, [data?.floatingPhrases]);

  const handleBloomBouquet = () => {
    if (!bloomed) {
      setBloomed(true);
      sound.playUnlockSuccess();
      if (!bgmActive) sound.toggleMusicTrack(data?.customAudio, setBgmActive);
      try {
        confetti({
          particleCount: 85,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#c084fc', '#a855f7', '#e879f9', '#f472b6', '#fde047']
        });
      } catch (e) {}
    }
  };

  const handleFlowerClick = (idx, e) => {
    e.stopPropagation();
    if (!bloomed) {
      handleBloomBouquet();
      return;
    }
    sound.playClick();
    if (phrases.length > 0) {
      setActivePhrase(phrases[idx % phrases.length]);
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  // 7 Flowers in a Lush Bouquet Arrangement
  const bouquetFlowers = [
    { cx: 140, cy: 72, scale: 1.08, hue1: '#c084fc', hue2: '#9333ea', stemX: 140 },
    { cx: 95, cy: 90, scale: 0.95, hue1: '#e879f9', hue2: '#a855f7', stemX: 128 },
    { cx: 185, cy: 90, scale: 0.95, hue1: '#d8b4fe', hue2: '#7e22ce', stemX: 152 },
    { cx: 65, cy: 118, scale: 0.85, hue1: '#f0abfc', hue2: '#9333ea', stemX: 120 },
    { cx: 215, cy: 118, scale: 0.85, hue1: '#c084fc', hue2: '#6b21a8', stemX: 160 },
    { cx: 115, cy: 125, scale: 0.92, hue1: '#f472b6', hue2: '#a855f7', stemX: 135 },
    { cx: 165, cy: 125, scale: 0.92, hue1: '#e879f9', hue2: '#7e22ce', stemX: 145 }
  ];

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#0c0618] via-[#1a0b2e] to-[#071712] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['petal', 'sparkle']} colors={['#c084fc', '#e879f9', '#f472b6', '#fde047']} aurora={['#7e22ce', '#be185d']} stars={45} seed={18} />

      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#c084fc" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-1">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-400/35 text-purple-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200">
            {titleText}
          </h1>
        )}
        {(bloomed ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs text-purple-200/80 mt-1">
            {bloomed ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {/* Interactive 7-Flower Luxury Bouquet + Envelope */}
      {!showLetter && (
        <div className="my-auto relative flex flex-col items-center z-10" onClick={handleBloomBouquet}>
          {activePhrase && (
            <div className="mb-2 max-w-xs bg-purple-950/90 border border-purple-400/50 px-4 py-2 rounded-2xl text-center text-xs sm:text-sm text-purple-100 font-serif-romance shadow-xl animate-bounce">
              “{activePhrase}”
            </div>
          )}

          <svg
            viewBox="0 0 280 320"
            className={`w-72 h-80 sm:w-80 sm:h-88 transition-all duration-1000 cursor-pointer ${
              bloomed ? 'scale-105 drop-shadow-[0_0_35px_rgba(192,132,252,0.55)]' : 'scale-95 hover:scale-100'
            }`}
          >
            {/* Back Kraft Paper Bouquet Cone */}
            <polygon points="55,145 225,145 162,295 118,295" fill="#4c1d95" opacity="0.45" />

            {/* Stems & Lush Greenery */}
            {bouquetFlowers.map((f, i) => (
              <path
                key={`stem-${i}`}
                d={`M${f.stemX} 285 Q${(f.cx + f.stemX) / 2} 195 ${f.cx} ${f.cy}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            ))}

            {/* Swaying Grass & Eucalyptus Leaves */}
            <path d="M125 220 C85 190, 55 160, 75 140 C95 155, 115 185, 125 220" fill="#059669" opacity="0.85" />
            <path d="M155 220 C195 190, 225 160, 205 140 C185 155, 165 185, 155 220" fill="#059669" opacity="0.85" />

            {/* Front Wrapped Silk Bouquet Paper */}
            <polygon points="72,165 140,210 112,298 168,298 140,210 208,165 172,302 108,302" fill="#f3e8ff" opacity="0.92" />
            <polygon points="82,175 198,175 166,300 114,300" fill="#d8b4fe" opacity="0.85" />

            {/* Satin Ribbon Bow at Bouquet Waist */}
            <ellipse cx="124" cy="248" rx="18" ry="10" transform="rotate(-18 124 248)" fill="#ec4899" />
            <ellipse cx="156" cy="248" rx="18" ry="10" transform="rotate(18 156 248)" fill="#ec4899" />
            <circle cx="140" cy="248" r="7" fill="#be185d" />

            {/* 7 Multi-Layered Purple & Lavender Blooms */}
            {bouquetFlowers.map((f, idx) => (
              <g
                key={`flower-${idx}`}
                transform={`translate(${f.cx}, ${f.cy}) scale(${bloomed ? f.scale : f.scale * 0.55})`}
                onClick={(e) => handleFlowerClick(idx, e)}
                className="transition-all duration-700 cursor-pointer"
              >
                {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, pIdx) => (
                  <ellipse
                    key={pIdx}
                    cx="0"
                    cy={bloomed ? -20 : -11}
                    rx={bloomed ? 9.5 : 5}
                    ry={bloomed ? 18 : 10}
                    transform={`rotate(${angle})`}
                    fill={pIdx % 2 === 0 ? f.hue1 : f.hue2}
                    opacity="0.95"
                  />
                ))}
                <circle cx="0" cy="0" r="9" fill="#facc15" />
                <circle cx="0" cy="0" r="4.5" fill="#d97706" />
              </g>
            ))}
          </svg>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            {!bloomed ? (
              <button
                type="button"
                onClick={handleBloomBouquet}
                className="px-6 py-2.5 rounded-full bg-purple-600/80 border border-purple-300/50 text-white text-xs sm:text-sm font-bold shadow-lg animate-pulse cursor-pointer"
              >
                Toca aquí para hacer florecer tu ramo 🌸💜
              </button>
            ) : (
              (letterTitle || letterBody || photos.length > 0) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setShowLetter(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(192,132,252,0.6)] hover:scale-105 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4 animate-bounce" />
                  <span>Abrir Sobre del Ramo 💌</span>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Full Letter Modal */}
      {showLetter && (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="Flush"
            accent="#a855f7"
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
