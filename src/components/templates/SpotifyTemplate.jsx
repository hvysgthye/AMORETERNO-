import React, { useState } from 'react';
import { sound } from '../../utils/audioHelper';
import { Play, Pause, Heart, Disc, Sparkles, SkipBack, SkipForward, Music, Image } from 'lucide-react';
import { AmbientLayer, LoveLetterCard, resolveText, resolvePhotos } from './shared/Decor';

export default function SpotifyTemplate({ data }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(true);
  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'lyrics' | 'moments'

  const badgeText = resolveText(data?.badgeText, 'Spotify Romance Edition');
  const titleText = resolveText(data?.title, 'La Canción de Nuestra Historia');
  const subHeader = resolveText(data?.lockStatus ?? data?.lockTitle, 'Presiona Play para escuchar nuestra melodía');
  const songTitle = resolveText(data?.songTitle ?? data?.customAudioName ?? data?.musicTitle, 'Nuestra Canción Favorita');
  const songArtist = resolveText(data?.songArtist, 'Tú & Yo • En reproducción continua');
  const letterTitle = resolveText(data?.letterTitle, 'Eres mi canción favorita en repeat');
  const letterBody = resolveText(data?.letterText ?? data?.letterBody, 'Hay canciones que me hacen recordar tu sonrisa, tus ojos y la forma en que iluminas todo...');
  const signature = resolveText(data?.customSign, 'Con todo mi amor ❤️');
  const photoCaption = resolveText(data?.photoCaption, '');
  const photos = resolvePhotos(data);

  const togglePlay = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-b from-[#132a1f] via-[#09140f] to-[#050806] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['note', 'sparkle']} colors={['#1db954', '#86efac', '#ffffff']} aurora={['#15803d', '#0f766e']} seed={19} />

      {/* Top Header & Navigation Pills */}
      <div className="z-10 text-center max-w-md w-full mt-1">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1db954]/15 border border-[#1db954]/40 text-[#1ed760] text-xs font-bold mb-2">
            <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{badgeText}</span>
          </div>
        )}
        {titleText && (
          <h1 className="text-xl sm:text-2xl font-bold font-serif-romance text-white">
            {titleText}
          </h1>
        )}
        {subHeader && (
          <p className="text-xs text-emerald-200/75 mt-1">{subHeader}</p>
        )}

        {/* Interactive View Switcher */}
        <div className="mt-3 inline-flex bg-black/50 border border-white/10 rounded-full p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('player')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              activeTab === 'player' ? 'bg-[#1db954] text-black' : 'text-white/75 hover:text-white'
            }`}
          >
            Reproductor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lyrics')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              activeTab === 'lyrics' ? 'bg-[#1db954] text-black' : 'text-white/75 hover:text-white'
            }`}
          >
            Dedicatoria
          </button>
          {photos.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('moments')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'moments' ? 'bg-[#1db954] text-black' : 'text-white/75 hover:text-white'
              }`}
            >
              Momentos ({photos.length})
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SPOTIFY VINYL & GLASS PLAYER CARD */}
      {activeTab === 'player' && (
        <div className="my-auto z-10 w-full max-w-sm bg-gradient-to-b from-white/10 to-black/60 border border-white/15 rounded-3xl p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          {/* Album Cover / Spinning Vinyl */}
          <div
            onClick={togglePlay}
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.75)] border border-white/15 cursor-pointer group flex items-center justify-center bg-zinc-900"
          >
            {photos[0] ? (
              <img
                src={photos[0]}
                alt=""
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'group-hover:scale-105'}`}
              />
            ) : (
              <div
                className={`w-48 h-48 rounded-full border-4 border-zinc-800 flex items-center justify-center ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
                style={{
                  backgroundImage: 'repeating-radial-gradient(circle, #111 0, #111 2px, #1f1f1f 3px, #111 4px)'
                }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1db954] to-emerald-700 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            )}
          </div>

          {/* Track Metadata & Like */}
          <div className="w-full flex items-center justify-between mt-5">
            <div className="min-w-0 pr-3">
              {songTitle && <h2 className="text-base sm:text-lg font-bold text-white truncate">{songTitle}</h2>}
              {songArtist && <p className="text-xs text-emerald-300/80 truncate">{songArtist}</p>}
            </div>
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-[#1db954] text-[#1db954]' : 'text-white/60'}`} />
            </button>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full mt-4">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className={`h-full bg-[#1db954] rounded-full transition-all duration-700 ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
            </div>
            <div className="flex justify-between text-[10px] text-white/50 font-mono mt-1">
              <span>{isPlaying ? '1:42' : '0:58'}</span>
              <span>∞:∞</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="w-full flex items-center justify-center gap-6 mt-3">
            <button type="button" onClick={togglePlay} className="text-white/70 hover:text-white cursor-pointer">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-[0_0_25px_rgba(29,185,84,0.5)] active:scale-95 transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
            <button type="button" onClick={togglePlay} className="text-white/70 hover:text-white cursor-pointer">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Lyrics Preview Box (Spotify Lyrics Style) */}
          {(letterTitle || letterBody) && (
            <div
              onClick={() => setActiveTab('lyrics')}
              className="w-full mt-5 rounded-2xl bg-[#1db954]/20 border border-[#1db954]/30 p-3.5 cursor-pointer hover:bg-[#1db954]/25 transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#1ed760]">LETRA / DEDICATORIA</span>
                <span className="text-[10px] text-emerald-200 underline">Expandir</span>
              </div>
              {letterTitle && <p className="text-xs font-bold text-white mb-0.5">{letterTitle}</p>}
              {letterBody && <p className="text-xs text-emerald-100/90 line-clamp-2">{letterBody}</p>}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FULL DEDICATION CARD */}
      {activeTab === 'lyrics' && (
        <div className="w-full max-w-lg z-20 my-auto animate-fade-in">
          <LoveLetterCard
            variant="Flush"
            accent="#1db954"
            badge={songTitle}
            photo={photos[0] || ''}
            photos={photos}
            photoCaption={photoCaption}
            title={letterTitle}
            body={letterBody}
            signature={signature}
            typewriter={true}
            onReplay={() => setActiveTab('player')}
          />
        </div>
      )}

      {/* TAB 3: MOMENTS PHOTO GALLERY */}
      {activeTab === 'moments' && (
        <div className="w-full max-w-md z-20 my-auto bg-black/65 border border-white/15 rounded-3xl p-4 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-3">
            {photos.map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/15 aspect-square bg-zinc-900">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {photoCaption && <p className="text-center text-xs text-emerald-200 mt-3 italic">{photoCaption}</p>}
        </div>
      )}

      <div />
    </div>
  );
}
