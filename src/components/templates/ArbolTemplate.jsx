import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audioHelper';
import { Heart, Music, Sparkles, Calendar, Clock } from 'lucide-react';
import { AmbientLayer, MusicDisc } from './shared/Decor';

export default function ArbolTemplate({ data }) {
  const [bloomed, setBloomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeTogether, setTimeTogether] = useState({ days: 365, hours: 12, mins: 30 });

  // Anniversary date counter calculation
  useEffect(() => {
    const startDate = data?.anniversaryDate ? new Date(data.anniversaryDate) : new Date('2023-11-24');
    const updateCounter = () => {
      const now = new Date();
      const diff = Math.max(0, now - startDate);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      setTimeTogether({ days, hours, mins });
    };
    updateCounter();
    const timer = setInterval(updateCounter, 60000);
    return () => clearInterval(timer);
  }, [data?.anniversaryDate]);

  const handleBloom = () => {
    if (!bloomed) {
      setBloomed(true);
      sound.playUnlockSuccess();
      sound.toggleMusicTrack(data?.customAudio, setIsPlaying);

      try {
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#fb7185', '#f43f5e', '#fda4af', '#fcd34d', '#34d399']
        });
      } catch (e) {}
    }
  };

  const toggleMusic = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlaying);
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#12070e] via-[#240a1b] to-[#0d040a] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden isolate">
      <AmbientLayer className="-z-10" particles={['heart','petal']} colors={['#fb7185','#fda4af','#fde68a']} aurora={['#be123c','#065f46']} seed={17} />
      {/* Floating Music Control */}
      <MusicDisc isPlaying={isPlaying} onToggle={toggleMusic} accent="#fb7185" />

      {/* Top Header */}
      <div className="z-10 text-center max-w-md w-full mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>El Árbol de Nuestro Amor</span>
        </div>
        <h1 className="text-2xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
          {data?.title || 'Donde Crece Nuestro Amor'}
        </h1>

        {/* Live Anniversary Counter */}
        <div className="mt-2 inline-flex items-center gap-3 bg-slate-900/80 border border-rose-500/30 px-4 py-1.5 rounded-full text-xs text-rose-200 font-mono shadow-lg">
          <Calendar className="w-3.5 h-3.5 text-rose-400" />
          <span>Juntos hace: <strong>{timeTogether.days}</strong> días, <strong>{timeTogether.hours}</strong>h, <strong>{timeTogether.mins}</strong>m</span>
        </div>
      </div>

      {/* Interactive Growing Love Tree with Fluttering Hearts */}
      <div className="my-auto relative flex flex-col items-center cursor-pointer" onClick={handleBloom}>
        <div className="relative w-64 h-72 flex items-center justify-center">
          {/* Animated SVG Tree */}
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            {/* Tree Trunk */}
            <path
              d="M100 230 C90 190, 80 150, 95 120 C105 100, 70 80, 50 65 M95 120 C105 95, 130 80, 150 65 M95 120 L100 60"
              fill="transparent"
              stroke="#78350f"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Heart Leaves on Branches */}
            {[
              { cx: 50, cy: 65, color: '#f43f5e', delay: '0ms' },
              { cx: 150, cy: 65, color: '#ec4899', delay: '200ms' },
              { cx: 100, cy: 55, color: '#f43f5e', delay: '400ms' },
              { cx: 75, cy: 90, color: '#fda4af', delay: '100ms' },
              { cx: 125, cy: 90, color: '#fb7185', delay: '300ms' },
              { cx: 35, cy: 90, color: '#be123c', delay: '500ms' },
              { cx: 165, cy: 90, color: '#e11d48', delay: '250ms' },
              { cx: 100, cy: 30, color: '#f43f5e', delay: '350ms' },
            ].map((leaf, i) => (
              <g
                key={i}
                transform={`translate(${leaf.cx}, ${leaf.cy}) scale(${bloomed ? 1.3 : 0.8})`}
                className="transition-all duration-700 ease-out origin-center"
                style={{ transitionDelay: leaf.delay }}
              >
                <path
                  d="M0 0 C-4 -6, -10 -6, -10 0 C-10 6, 0 12, 0 14 C0 12, 10 6, 10 0 C10 -6, 4 -6, 0 0 Z"
                  fill={leaf.color}
                  className="animate-pulse"
                />
              </g>
            ))}
          </svg>
        </div>

        {!bloomed && (
          <span className="mt-2 text-xs font-semibold text-rose-300/90 bg-rose-950/70 px-4 py-1.5 rounded-full border border-rose-500/30 animate-pulse">
            Toca el árbol para hacer florecer los corazones 🌳❤️
          </span>
        )}
      </div>

      {/* Revealed Dedication Card */}
      {bloomed && (
        <div className="z-10 w-full max-w-md bg-slate-900/80 border border-rose-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-2xl mb-2 animate-float">
          {data?.photo && (
            <div className="rounded-2xl overflow-hidden mb-3 border border-rose-400/30 max-h-48">
              <img src={data.photo} alt="Árbol de Amor" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="font-semibold text-sm text-rose-200 mb-1">
            {data?.letterTitle || 'Raíces profundas, amor eterno'}
          </h2>
          <p className="text-xs text-rose-100/90 leading-relaxed font-light whitespace-pre-line">
            {data?.letterBody || 'Como un árbol que resiste las tormentas y florece en primavera, nuestro amor se hace más fuerte con cada día que pasa.'}
          </p>
        </div>
      )}
    </div>
  );
}
