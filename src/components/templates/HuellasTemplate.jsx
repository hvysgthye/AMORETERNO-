import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Fingerprint, CheckCircle2, Heart, Music, ShieldCheck } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function HuellasTemplate({ data }) {
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [bgmActive, setBgmActive] = useState(false);
  const intervalRef = useRef(null);

  const startScan = (e) => {
    e.preventDefault();
    if (isVerified) return;
    setIsScanning(true);
    sound.init();

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 3;
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
      sound.toggleMusicTrack(data?.customAudio, setBgmActive);
    }, 800);
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setBgmActive);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#060c18] via-[#09152b] to-[#12071f] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none isolate">
      <AmbientLayer className="-z-10" particles={['dot','sparkle']} colors={['#22d3ee','#60a5fa','#a78bfa']} aurora={['#0891b2','#4f46e5']} motion="rise" seed={19} />
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Music Control */}
      <MusicDisc isPlaying={bgmActive} onToggle={toggleMusic} accent="#22d3ee" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col items-center text-center">
        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Biometric Heart Lock v2.0</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-100 to-pink-200 font-serif-romance">
          {data?.title || 'Acceso al Corazón'}
        </h1>
        <p className="text-xs sm:text-sm text-cyan-200/70 mt-1 max-w-xs">
          {isVerified
            ? (data?.unlockMsg || '¡Identidad verificada: Dueña/o de mi corazón!')
            : (data?.lockTitle || 'Mantén presionado el sensor con tu dedo para escanear')}
        </p>

        {/* Biometric Scanner Plate */}
        <div className="my-8 relative flex flex-col items-center">
          {/* Circular Neon Halo Ring */}
          <div
            className={`w-44 h-44 rounded-full p-1.5 transition-all duration-300 flex items-center justify-center border-2 ${
              isVerified
                ? 'border-emerald-400 shadow-2xl shadow-emerald-500/40 bg-emerald-950/30'
                : isScanning
                ? 'border-cyan-400 shadow-2xl shadow-cyan-500/50 bg-cyan-950/30 scale-105'
                : 'border-cyan-500/30 shadow-lg shadow-cyan-900/20 bg-slate-900/60'
            }`}
          >
            {/* Interactive Fingerprint Pad */}
            <button
              onMouseDown={startScan}
              onMouseUp={endScan}
              onTouchStart={startScan}
              onTouchEnd={endScan}
              className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer outline-none transition overflow-hidden ${
                isVerified ? 'bg-emerald-500/10' : 'bg-[#071322] active:bg-cyan-950/80'
              }`}
              title="Mantén presionado para escanear"
            >
              {/* Laser Line Scanning Effect */}
              {isScanning && (
                <div
                  className="absolute inset-x-0 h-1 bg-cyan-300 shadow-[0_0_15px_#22d3ee] pointer-events-none transition-all duration-75"
                  style={{ top: `${progress}%` }}
                />
              )}

              {/* Icon */}
              {isVerified ? (
                <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
              ) : (
                <Fingerprint
                  className={`w-20 h-20 transition-all duration-300 ${
                    isScanning
                      ? 'text-cyan-300 scale-110 drop-shadow-[0_0_12px_#22d3ee]'
                      : 'text-cyan-500/50 hover:text-cyan-400'
                  }`}
                />
              )}

              {/* Live Scan Percent Counter */}
              {isScanning && (
                <span className="absolute bottom-3 text-[11px] font-mono text-cyan-300 font-bold tracking-widest">
                  {progress}%
                </span>
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isVerified ? 'bg-emerald-400' : isScanning ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
              {isVerified ? 'AUTORIZADO: 100% AMOR' : isScanning ? 'ESCANEANDO HUELLA...' : 'SENSOR LISTO'}
            </span>
          </div>
        </div>

        {/* Revealed Dedication Card */}
        {isVerified && (
          <div className="w-full bg-slate-900/80 border border-cyan-500/40 rounded-3xl p-6 backdrop-blur-xl shadow-2xl animate-float transition-all">
            {data?.photo && (
              <div className="rounded-2xl overflow-hidden mb-4 border border-cyan-400/30 max-h-56">
                <img src={data.photo} alt="Recuerdo" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <Heart className="w-5 h-5 fill-cyan-400 text-cyan-400 animate-pulse" />
              <h2 className="text-lg font-bold font-serif-romance text-white">
                {data?.letterTitle || 'Acceso Concedido: Te Amo'}
              </h2>
            </div>
            <p className="text-sm text-cyan-100/90 leading-relaxed font-light whitespace-pre-line text-left">
              {data?.letterBody || 'Solo tú tienes la clave única para abrir mi corazón...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
