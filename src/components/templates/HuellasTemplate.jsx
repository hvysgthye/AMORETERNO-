import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Fingerprint, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AmbientLayer, MusicDisc, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function HuellasTemplate({ data }) {
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);
  const intervalRef = useRef(null);

  const badgeText = resolveText(data?.badgeText, 'Detector Biométrico del Amor');
  const titleText = resolveText(data?.title, 'Acceso al Corazón');
  const lockSubtitle = resolveText(data?.lockStatus ?? data?.lockTitle, 'Mantén presionado el sensor con tu dedo para escanear');
  const unlockSubtitle = resolveText(data?.unlockMsg, '¡Identidad verificada: Dueña/o de mi corazón!');
  const actionHint = resolveText(data?.actionHint, 'SENSOR LISTO • MANTÉN PRESIONADO');
  const letterTitle = resolveText(data?.letterTitle, 'Acceso Concedido: Te Amo');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Solo tú tienes la clave única para abrir mi corazón...');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const startScan = (e) => {
    e.preventDefault();
    if (isVerified) return;
    setIsScanning(true);
    sound.init();

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 4;
        sound.playLaserHum(next / 100);
        if (next >= 100) {
          clearInterval(intervalRef.current);
          handleVerified();
          return 100;
        }
        return next;
      });
    }, 45);
  };

  const endScan = () => {
    if (isVerified) return;
    setIsScanning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  };

  const handleVerified = () => {
    setIsScanning(false);
    setIsVerified(true);
    sound.playUnlockSuccess();

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#06b6d4', '#3b82f6', '#ec4899', '#ffffff']
      });
    } catch (e) {}

    setTimeout(() => {
      if (!bgmActive) sound.toggleMusicTrack(data?.customAudio, setBgmActive);
    }, 600);
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#060c18] via-[#09152b] to-[#12071f] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['dot', 'sparkle']} colors={['#22d3ee', '#60a5fa', '#a78bfa']} aurora={['#0891b2', '#4f46e5']} motion="rise" seed={19} />

      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#22d3ee" />

      <div className="w-full max-w-md z-10 flex flex-col items-center text-center mt-2">
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/35 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{badgeText}</span>
          </div>
        )}

        {titleText && (
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-100 to-pink-200 font-serif-romance">
            {titleText}
          </h1>
        )}
        {(isVerified ? unlockSubtitle : lockSubtitle) && (
          <p className="text-xs sm:text-sm text-cyan-200/75 mt-1 max-w-xs">
            {isVerified ? unlockSubtitle : lockSubtitle}
          </p>
        )}
      </div>

      {!isVerified ? (
        <div className="my-auto relative flex flex-col items-center z-10">
          <div
            className={`w-44 h-44 rounded-full p-1.5 transition-all duration-300 flex items-center justify-center border-2 ${
              isScanning
                ? 'border-cyan-400 shadow-2xl shadow-cyan-500/50 bg-cyan-950/30 scale-105'
                : 'border-cyan-500/30 shadow-lg shadow-cyan-900/20 bg-slate-900/60'
            }`}
          >
            <button
              type="button"
              onMouseDown={startScan}
              onMouseUp={endScan}
              onTouchStart={startScan}
              onTouchEnd={endScan}
              onClick={handleVerified}
              className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer outline-none transition overflow-hidden bg-[#071322] active:bg-cyan-950/80"
            >
              {isScanning && (
                <div
                  className="absolute inset-x-0 h-1 bg-cyan-300 shadow-[0_0_15px_#22d3ee] pointer-events-none transition-all duration-75"
                  style={{ top: `${progress}%` }}
                />
              )}
              <Fingerprint
                className={`w-20 h-20 transition-all duration-300 ${
                  isScanning ? 'text-cyan-300 scale-110 drop-shadow-[0_0_12px_#22d3ee]' : 'text-cyan-500/60 hover:text-cyan-400'
                }`}
              />
              {isScanning && (
                <span className="absolute bottom-3 text-[11px] font-mono text-cyan-300 font-bold tracking-widest">
                  {progress}%
                </span>
              )}
            </button>
          </div>

          {actionHint && (
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-cyan-400 animate-ping' : 'bg-cyan-500'}`} />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-200">
                {isScanning ? 'ESCANEANDO HUELLA...' : actionHint}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="Flush"
            accent="#06b6d4"
            badge={badgeText}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => {
              setProgress(0);
              setIsVerified(false);
            }}
          />
        </div>
      )}

      <div />
    </div>
  );
}
