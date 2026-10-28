import TemplateStage from './templates/shared/TemplateStage';
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Maximize2, Minimize2, Sparkles, Mic, Pause } from 'lucide-react';
import CandadoTemplate from './templates/CandadoTemplate';
import GalaxyTemplate from './templates/GalaxyTemplate';
import HuellasTemplate from './templates/HuellasTemplate';
import FloresTemplate from './templates/FloresTemplate';
import PuertasTemplate from './templates/PuertasTemplate';
import HotWheelsTemplate from './templates/HotWheelsTemplate';
import SpotifyTemplate from './templates/SpotifyTemplate';
import CartaTemplate from './templates/CartaTemplate';
import ProposeTemplate from './templates/ProposeTemplate';
import RegaloTemplate from './templates/RegaloTemplate';
import ArbolTemplate from './templates/ArbolTemplate';
import FlorAmarillaTemplate from './templates/FlorAmarillaTemplate';
import LatidosLuzTemplate from './templates/LatidosLuzTemplate';
import DynamicUniversalTemplate from './templates/DynamicUniversalTemplate';
import { romanticAudio } from '../utils/romanticMelodies';

export default function RecipientView({ templateId, data, onExitToEditor }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const voiceAudioRef = useRef(null);

  // Auto-init preset melody on first interaction if no custom MP3
  useEffect(() => {
    if (!data?.customAudio && data?.presetMelody) {
      const handleFirstClick = () => {
        romanticAudio.playPreset(data.presetMelody);
        window.removeEventListener('click', handleFirstClick);
      };
      window.addEventListener('click', handleFirstClick, { once: true });
    }
    return () => {
      romanticAudio.stop();
      if (voiceAudioRef.current) voiceAudioRef.current.pause();
    };
  }, [data?.customAudio, data?.presetMelody]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleVoiceNote = () => {
    if (!data?.voiceNote) return;
    if (!voiceAudioRef.current) {
      voiceAudioRef.current = new Audio(data.voiceNote);
      voiceAudioRef.current.onended = () => setIsPlayingVoice(false);
    }

    if (isPlayingVoice) {
      voiceAudioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      // Lower background music during voice note
      romanticAudio.stop();
      voiceAudioRef.current.play();
      setIsPlayingVoice(true);
    }
  };

  const renderTemplate = () => {
    switch (templateId) {
      case 'candado':
        return <CandadoTemplate data={data} />;
      case 'galaxy':
      case 'galaxia-infinita':
      case 'universe':
      case 'galaxy-gallery':
      case 'galaxy-gallery-flores-amarillas':
        return <GalaxyTemplate templateId={templateId} data={data} />;
      case 'lector-huellas':
        return <HuellasTemplate data={data} />;
      case 'flores-moradas':
      case 'flor-galaxy':
        return <FloresTemplate data={data} />;
      case 'flor-amarilla':
      case 'flor-amarilla-dia':
        return <FlorAmarillaTemplate data={data} />;
      case 'puertas-del-corazon':
        return <PuertasTemplate data={data} />;
      case 'hotwheels':
        return <HotWheelsTemplate data={data} />;
      case 'spotify-amor':
        return <SpotifyTemplate data={data} />;
      case 'carta':
        return <CartaTemplate data={data} />;
      case 'propose':
        return <ProposeTemplate data={data} />;
      case 'regalos-cumple':
        return <RegaloTemplate data={data} />;
      case 'arbol':
        return <ArbolTemplate data={data} />;
      case 'latidos-de-luz':
        return <LatidosLuzTemplate data={data} />;
      default:
        return <DynamicUniversalTemplate templateId={templateId} data={data} />;
    }
  };

  // Ambient Particles Icon & Count based on selected effect
  const ambientFx = data?.ambientFx || 'hearts';
  const getParticleSymbol = () => {
    switch (ambientFx) {
      case 'stars': return '✨';
      case 'sakura': return '🌸';
      case 'fireflies': return '🌟';
      case 'snow': return '❄️';
      default: return '❤️';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#070914] text-white overflow-x-hidden select-none">
      {/* Ambient Floating Particle System */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30 text-rose-400"
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              fontSize: `${12 + (i % 4) * 8}px`,
              animationDuration: `${6 + (i % 5) * 2}s`,
              animationDelay: `${(i * 0.7)}s`
            }}
          >
            {getParticleSymbol()}
          </div>
        ))}
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white shadow-lg transition"
          title={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {onExitToEditor && (
          <button
            onClick={onExitToEditor}
            aria-label="Personalizar esta dedicatoria"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-rose-300 hover:text-white shadow-lg transition"
          >
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Modo Editor</span>
          </button>
        )}
      </div>

      {/* Voice Note Floating Pill Player (If recorded by sender) */}
      {data?.voiceNote && (
        <div className="fixed top-4 right-4 z-40 animate-bounce">
          <button
            onClick={toggleVoiceNote}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md border transition cursor-pointer ${
              isPlayingVoice
                ? 'bg-rose-600 border-rose-400 text-white shadow-rose-600/50'
                : 'bg-black/70 hover:bg-rose-950/80 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white">
              {isPlayingVoice ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left pr-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Mensaje de Voz</p>
              <p className="text-[11px] font-semibold text-white">
                {isPlayingVoice ? 'Reproduciendo tu voz...' : 'Toca para escuchar mi voz'}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Main Fullscreen Interactive Canvas */}
      <main className="flex-1 w-full min-h-screen flex items-center justify-center z-10 relative">
        <div className="w-full min-h-screen max-w-xl mx-auto flex flex-col items-center justify-center py-6 px-3">
          <TemplateStage key={templateId} templateId={templateId}>{renderTemplate()}</TemplateStage>
        </div>
      </main>

      {/* Subtle Romantic Footer for Recipients */}
      <footer className="w-full py-3 px-4 bg-black/60 backdrop-blur-md border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 z-30 text-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          {data?.customSign ? (
            <span>{data.customSign}</span>
          ) : (
            <span>Hecho con amor en <strong>Amor Eterno</strong></span>
          )}
        </div>

      </footer>
    </div>
  );
}
