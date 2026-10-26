import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audioHelper';
import { Play, Pause, Heart, Disc, Music, Sparkles, Volume2 } from 'lucide-react';
import { AmbientLayer } from './shared/Decor';

export default function SpotifyTemplate({ data }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  const togglePlay = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#0c1410] via-[#081f14] to-[#040806] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['note','sparkle']} colors={['#1db954','#86efac','#ffffff']} aurora={['#15803d','#0f766e']} seed={19} />
      {/* Glow Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
          <span>Spotify Romance Edition</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif-romance text-white">
          {data?.title || 'La Canción de Nuestra Historia'}
        </h1>
        <p className="text-xs text-emerald-300/70 mt-1">
          {isPlaying ? 'Reproduciendo tu tema favorito...' : (data?.lockTitle || 'Presiona Play para escuchar la melodía')}
        </p>
      </div>

      {/* Spinning Vinyl Record Player with Photo Album Art */}
      <div className="my-auto relative flex flex-col items-center">
        {/* Vinyl Disc */}
        <div
          onClick={togglePlay}
          className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-black via-zinc-900 to-black border-4 border-zinc-800 shadow-2xl flex items-center justify-center cursor-pointer transition-transform duration-700 ${
            isPlaying ? 'animate-spin-slow shadow-emerald-500/30' : 'hover:scale-105'
          }`}
          style={{
            backgroundImage: 'repeating-radial-gradient(circle, #111 0, #111 2px, #181818 3px, #111 4px)'
          }}
        >
          {/* Inner Album Art */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-zinc-950 shadow-inner relative flex items-center justify-center">
            {data?.photo ? (
              <img src={data.photo} alt="Álbum" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
            )}
            {/* Center Spindle Hole */}
            <div className="absolute w-4 h-4 rounded-full bg-black border-2 border-white/40" />
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="mt-6 w-full max-w-xs bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <button
            onClick={() => setLiked(!liked)}
            className="p-2 text-slate-400 hover:text-rose-500 transition cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-white truncate max-w-[140px]">
              {data?.customAudioName || data?.musicTitle || 'Nuestra Melodía'}
            </span>
            <span className="text-[10px] text-emerald-400">En reproducción continua</span>
          </div>

          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/30 active:scale-95 transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Love Letter Card (Revealed below) */}
      <div className="z-10 w-full max-w-md bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-2xl mb-2">
        <h2 className="font-semibold text-sm text-emerald-300 mb-1">
          {data?.letterTitle || 'Eres mi canción favorita en repeat'}
        </h2>
        <p className="text-xs text-emerald-100/90 leading-relaxed font-light whitespace-pre-line">
          {data?.letterBody || 'Hay canciones que me hacen recordar tu sonrisa, tus ojos y la forma en que iluminas todo...'}
        </p>
      </div>
    </div>
  );
}
