import React, { useMemo, useState, useEffect } from 'react';
import { Music, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

/* ------------------------------------------------------------------
   Decoración premium compartida por todas las plantillas.
   - resolveText: respeta campos vacíos ("") cuando el usuario los borra.
   - resolvePhoto / resolvePhotos: respeta cuando el usuario quita las fotos.
   - AmbientLayer: estrellas titilantes, auroras y partículas flotantes.
   - MusicDisc: botón de música estilo vinilo con ecualizador.
   - LoveLetterCard: tarjeta de revelación de alta costura con foto/galería
     polaroid, máquina de escribir opcional, ornamentos y firma editable.
   - OrnamentDivider / CornerOrnament: filigranas SVG.
------------------------------------------------------------------- */

/**
 * Si `val` es `undefined` o `null`, usa `fallback`.
 * Si el usuario borró el campo (`val === ""`), devuelve `""` para ocultarlo!
 */
export function resolveText(val, fallback = '') {
  if (val === undefined || val === null) return fallback;
  return String(val);
}

/**
 * Devuelve la lista de fotos activas (sin fotos vacías).
 * Si `data.hidePhoto` es true o `data.photo === ''`, no fuerza foto por defecto.
 */
export function resolvePhotos(data, defaultPhoto = '') {
  if (data?.hidePhoto) return [];
  const extra = Array.isArray(data?.photos) ? data.photos.filter(Boolean) : [];
  let main = data?.photo !== undefined ? data.photo : defaultPhoto;
  const all = [main, ...extra].filter((u) => typeof u === 'string' && u.trim() !== '');
  return Array.from(new Set(all));
}

// Generador pseudoaleatorio determinista (evita saltos entre renders)
function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const SHAPES = {
  heart: (c) => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill={c}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  petal: (c) => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 2C7 6 5 11 7 16c1.5 3.5 3.5 5 5 6 1.5-1 3.5-2.5 5-6 2-5 0-10-5-14z" fill={c} opacity="0.9" />
      <path d="M12 4v16" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
    </svg>
  ),
  sparkle: (c) => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill={c}>
      <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
    </svg>
  ),
  bubble: (c) => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="1.2" opacity="0.8" />
      <circle cx="12" cy="12" r="10" fill={c} opacity="0.08" />
      <ellipse cx="8.5" cy="8" rx="3" ry="1.8" fill="white" opacity="0.6" transform="rotate(-35 8.5 8)" />
    </svg>
  ),
  leaf: (c) => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M4 20C4 9 11 3 21 3c0 10-6 17-17 17z" fill={c} />
      <path d="M4 20L16 8" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
    </svg>
  ),
  bat: (c) => (
    <svg viewBox="0 0 32 16" className="w-full h-full" fill={c}>
      <path d="M16 6c1-2 2-3 2-3l1 3c3-3 8-4 13-2-3 1-4 4-4 7-2-2-5-2-7 0-1-1-3-2-5-2s-4 1-5 2c-2-2-5-2-7 0 0-3-1-6-4-7 5-2 10-1 13 2l1-3s1 1 2 3z" />
    </svg>
  ),
  note: (c) => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill={c}>
      <path d="M9 3v12.3A3.5 3.5 0 1 0 11 18V8h6V3H9z" />
    </svg>
  ),
  snow: (c) => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
    </svg>
  ),
  dot: (c) => <div className="w-full h-full rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
};

export function AmbientLayer({
  particles = ['heart', 'sparkle'],
  colors = ['#fb7185', '#f9a8d4', '#fde68a'],
  motion = 'fall',
  count = 18,
  stars = 45,
  aurora = ['#e11d48', '#7c3aed'],
  seed = 7,
  className = 'z-0'
}) {
  const items = useMemo(() => {
    const r = seeded(seed * 97 + count);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: particles[i % particles.length],
      color: colors[Math.floor(r() * colors.length)],
      left: r() * 100,
      size: 9 + r() * 16,
      duration: 8 + r() * 11,
      delay: -r() * 20,
      drift: (r() - 0.5) * 130,
      spin: (r() > 0.5 ? 1 : -1) * (180 + r() * 360),
      opacity: 0.5 + r() * 0.45
    }));
  }, [particles.join(), colors.join(), count, seed]);

  const starItems = useMemo(() => {
    const r = seeded(seed * 31 + stars);
    return Array.from({ length: stars }, (_, i) => ({
      id: i,
      left: r() * 100,
      top: r() * 100,
      size: 1.2 + r() * 2.4,
      duration: 2 + r() * 3.5,
      delay: -r() * 5
    }));
  }, [stars, seed]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {aurora?.length > 0 && (
        <>
          <div
            className="absolute -top-1/4 -left-1/4 w-[85%] h-[65%] rounded-full blur-3xl opacity-35 dp-aurora"
            style={{ background: `radial-gradient(circle, ${aurora[0]}, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-[85%] h-[65%] rounded-full blur-3xl opacity-30 dp-aurora"
            style={{ background: `radial-gradient(circle, ${aurora[1] || aurora[0]}, transparent 70%)`, animationDelay: '-9s' }}
          />
        </>
      )}
      {starItems.map((s) => (
        <span
          key={`s${s.id}`}
          className="absolute rounded-full bg-white dp-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}
      {items.map((p) => (
        <span
          key={p.id}
          className={`dp-particle ${motion === 'rise' ? 'dp-rise' : 'dp-fall'}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
            filter: `drop-shadow(0 0 6px ${p.color}99)`
          }}
        >
          {(SHAPES[p.type] || SHAPES.dot)(p.color)}
        </span>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.52)_100%)]" />
    </div>
  );
}

/** Botón de música estilo disco de vinilo con ecualizador animado. */
export function MusicDisc({ isPlaying, onToggle, accent = '#f43f5e', label }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      title={label || 'Música'}
      className="absolute top-3.5 right-3.5 z-40 w-11 h-11 rounded-full p-[3px] bg-black/45 backdrop-blur-md border border-white/20 shadow-xl hover:scale-110 active:scale-95 transition"
    >
      <span
        className={`relative w-full h-full rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}
        style={{
          background: `repeating-radial-gradient(circle, #111 0 2px, #222 2px 4px)`,
          boxShadow: isPlaying ? `0 0 16px ${accent}` : 'none'
        }}
      >
        <span className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center" style={{ background: accent }}>
          {!isPlaying && <Music className="w-2.5 h-2.5 text-white" />}
        </span>
      </span>
      {isPlaying && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-2.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[2px] rounded-sm animate-pulse"
              style={{ background: accent, height: `${40 + ((i * 37) % 60)}%`, animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
            />
          ))}
        </span>
      )}
    </button>
  );
}

/** Filigrana divisoria dorada. */
export function OrnamentDivider({ color = '#fbbf24', className = '' }) {
  return (
    <svg viewBox="0 0 240 20" className={`w-48 h-4 mx-auto ${className}`} aria-hidden="true">
      <path d="M0 10 H95" stroke={color} strokeWidth="0.9" opacity="0.65" />
      <path d="M145 10 H240" stroke={color} strokeWidth="0.9" opacity="0.65" />
      <path d="M95 10 q8 -8 16 0 q-8 8 -16 0z M145 10 q-8 -8 -16 0 q8 8 16 0z" fill="none" stroke={color} strokeWidth="1" />
      <path
        d="M120 15.5l-1-0.9C115.4 11.4 113 9.3 113 6.8 113 4.8 114.6 3.2 116.6 3.2c1.1 0 2.2.5 2.9 1.4.7-.9 1.8-1.4 2.9-1.4 2 0 3.6 1.6 3.6 3.6 0 2.5-2.4 4.6-6 7.8l-1 .9z"
        fill={color}
      />
    </svg>
  );
}

/** Esquina ornamental (rotar para cada esquina). */
export function CornerOrnament({ color = '#d4a24c', className = '' }) {
  return (
    <svg viewBox="0 0 60 60" className={`w-10 h-10 absolute pointer-events-none ${className}`} aria-hidden="true">
      <path d="M2 58 V18 Q2 2 18 2 H58" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M8 58 V22 Q8 8 22 8 H58" fill="none" stroke={color} strokeWidth="0.6" opacity="0.6" />
      <circle cx="18" cy="18" r="3" fill={color} />
      <path d="M18 18 q10 -2 14 -10 M18 18 q-2 10 -10 14" fill="none" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/**
 * Tarjeta de carta revelada con soporte de foto única o galería de fotos,
 * pie de foto editable/removible, máquina de escribir opcional y firma removible.
 */
export function LoveLetterCard({
  title,
  body,
  photo,
  photos,
  signature,
  accent = '#fb7185',
  variant = 'dark',
  photoCaption,
  onReplay,
  typewriter = false
}) {
  const isPaper = variant === 'paper';

  // Construir lista de fotos limpiando vacíos
  const gallery = useMemo(() => {
    const list = [];
    if (typeof photo === 'string' && photo.trim() !== '') list.push(photo.trim());
    if (Array.isArray(photos)) {
      photos.forEach((p) => {
        if (typeof p === 'string' && p.trim() !== '' && !list.includes(p.trim())) {
          list.push(p.trim());
        }
      });
    }
    return list;
  }, [photo, photos]);

  const [photoIdx, setPhotoIdx] = useState(0);
  const safeIdx = gallery.length > 0 ? photoIdx % gallery.length : 0;

  // Efecto máquina de escribir opcional
  const cleanBody = body ?? '';
  const [typedLen, setTypedLen] = useState(typewriter ? 0 : cleanBody.length);

  useEffect(() => {
    if (!typewriter) {
      setTypedLen(cleanBody.length);
      return;
    }
    setTypedLen(0);
    if (!cleanBody) return;
    const step = Math.max(1, Math.ceil(cleanBody.length / 140));
    const timer = setInterval(() => {
      setTypedLen((prev) => {
        if (prev + step >= cleanBody.length) {
          clearInterval(timer);
          return cleanBody.length;
        }
        return prev + step;
      });
    }, 24);
    return () => clearInterval(timer);
  }, [cleanBody, typewriter]);

  const displayedBody = typewriter ? cleanBody.slice(0, typedLen) : cleanBody;
  const cleanTitle = title !== undefined && title !== null ? String(title).trim() : '';
  const cleanSignature = signature !== undefined && signature !== null ? String(signature).trim() : '';
  const cleanCaption = photoCaption !== undefined && photoCaption !== null ? String(photoCaption).trim() : '';

  return (
    <div
      onClick={() => {
        if (typewriter && typedLen < cleanBody.length) setTypedLen(cleanBody.length);
      }}
      className={`relative z-10 w-full max-w-md rounded-[30px] p-6 sm:p-8 shadow-2xl dp-reveal transition-all ${
        isPaper
          ? 'bg-[linear-gradient(165deg,#fffaf5_0%,#fceee9_58%,#f7dfd8_100%)] text-stone-800 border border-rose-300/60'
          : 'bg-slate-950/80 text-white border border-white/15 backdrop-blur-2xl'
      }`}
      style={{
        boxShadow: isPaper
          ? `0 28px 65px -12px rgba(80,20,35,0.45), inset 0 1px 0 rgba(255,255,255,0.9)`
          : `0 28px 65px -15px ${accent}66, inset 0 1px 0 rgba(255,255,255,0.14)`
      }}
    >
      <CornerOrnament color={isPaper ? '#b9853a' : accent} className="top-2.5 left-2.5" />
      <CornerOrnament color={isPaper ? '#b9853a' : accent} className="top-2.5 right-2.5 rotate-90" />
      <CornerOrnament color={isPaper ? '#b9853a' : accent} className="bottom-2.5 right-2.5 rotate-180" />
      <CornerOrnament color={isPaper ? '#b9853a' : accent} className="bottom-2.5 left-2.5 -rotate-90" />

      {/* Galería / Polaroid si el usuario dejó al menos 1 foto */}
      {gallery.length > 0 && (
        <div className="flex flex-col items-center mb-5">
          <figure
            className={`relative bg-white p-2.5 ${
              cleanCaption ? 'pb-8' : 'pb-3.5'
            } rounded-md shadow-2xl rotate-[-1.8deg] hover:rotate-0 transition-transform duration-500 w-full max-w-[260px] border border-stone-200/80`}
          >
            {/* Cinta washi decorativa */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-100/85 rotate-[3deg] shadow-sm border border-amber-200/50" />
            <div className="relative overflow-hidden rounded-sm aspect-[4/3] bg-stone-100 dp-shine">
              <img
                src={gallery[safeIdx]}
                alt={cleanCaption || 'Recuerdo especial'}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
                    }}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/80 transition"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoIdx((prev) => (prev + 1) % gallery.length);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/80 transition"
                    aria-label="Siguiente foto"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 bg-black/45 px-2 py-0.5 rounded-full">
                    {gallery.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoIdx(idx);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === safeIdx ? 'bg-white w-3.5' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {cleanCaption && (
              <figcaption className="absolute bottom-1.5 inset-x-2 text-center font-romantic text-lg text-stone-700 truncate">
                {cleanCaption}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      {cleanTitle && (
        <h2
          className={`text-center text-xl sm:text-2xl font-serif-romance font-bold leading-snug ${
            isPaper ? 'text-rose-900' : 'dp-gold-text'
          }`}
        >
          {cleanTitle}
        </h2>
      )}

      {(cleanTitle || cleanBody) && (
        <OrnamentDivider color={isPaper ? '#b9853a' : accent} className="my-3.5" />
      )}

      {cleanBody && (
        <div
          className={`text-sm sm:text-[15.5px] leading-relaxed whitespace-pre-line text-center max-h-[42vh] overflow-y-auto px-1 ${
            isPaper ? 'font-serif text-stone-800' : 'text-slate-100/95 font-light'
          }`}
        >
          {displayedBody}
          {typewriter && typedLen < cleanBody.length && (
            <span className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: accent }} />
          )}
        </div>
      )}

      {cleanSignature && (
        <div className="mt-5 pt-3 border-t border-current/10 text-center">
          <span
            className={`font-romantic text-2xl sm:text-3xl ${isPaper ? 'text-rose-800' : ''}`}
            style={!isPaper ? { color: accent } : undefined}
          >
            {cleanSignature}
          </span>
        </div>
      )}

      {onReplay && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReplay();
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition ${
              isPaper
                ? 'border-rose-300 text-rose-800 hover:bg-rose-100/60'
                : 'border-white/15 text-white/75 hover:text-white hover:bg-white/10'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Volver a ver escena
          </button>
        </div>
      )}
    </div>
  );
}
