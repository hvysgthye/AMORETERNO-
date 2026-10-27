import React, { useState, useEffect } from 'react';
import {
  Sparkles, Lock, Mail, Music, Image as ImageIcon, Share2, Download,
  CheckCircle2, Sliders, Play, Pause, Trash2, Upload, Eye, EyeOff,
  Calendar, MessageSquareHeart, Plus, X
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { ROMANTIC_PRESETS, romanticAudio } from '../utils/romanticMelodies';
const MUSIC_TRACKS = ROMANTIC_PRESETS.map(track => ({ ...track, duration: 'Melodía continua' }));
const LOVE_PHRASES_AI = [
  'Mi lugar favorito siempre será ese momento en el que estamos juntos.',
  'Gracias por llenar de pequeños motivos para sonreír mis días.',
  'Si pudiera guardar un instante para siempre, elegiría uno contigo.'
];

// Helper para comprimir imágenes subidas y que quepan en URL / LocalStorage sin problema
function compressUploadedImage(file, maxDim = 900, quality = 0.78) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(ev.target.result);
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

const COUNTER_TEMPLATES = new Set([
  'arbol', 'contador-amor', 'camino-juntos', 'reloj-arena', 'galaxy', 'star-map', 'universo-iluminado'
]);

const PHRASE_TEMPLATES = new Set([
  'galaxy', 'flor-amarilla', 'flores-moradas', 'arbol', 'ramo-rosas',
  'tulipanes-eternidad', 'girasoles-sunset', 'jardin-mariposas',
  'caja-bombones', 'caja-sorpresas', 'globos-cielo', 'farolillos-cielo'
]);

const CHOICE_TEMPLATES = new Set([
  'propose', 'love-choice', 'date-invitation', 'ruleta-amor'
]);

const MUSIC_CARD_TEMPLATES = new Set([
  'spotify-amor', 'cassette-retro'
]);

export default function EditorWizard({
  template: providedTemplate,
  currentTemplateId,
  data,
  onChange,
  onReset,
  onOpenShare,
  onExportHTML
}) {
  const template = providedTemplate || TEMPLATES.find(t => t.id === currentTemplateId) || TEMPLATES[0];
  const [step, setStep] = useState(1);
  useEffect(() => () => romanticAudio.stop(), []);
  const [playingPreviewTrack, setPlayingPreviewTrack] = useState(null);

  const handleFieldChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
      ...({ letterText: 'letterBody', lockStatus: 'lockTitle', actionHint: 'lockTitle', customAudioDataUrl: 'customAudio' }[field] ? { [{ letterText: 'letterBody', lockStatus: 'lockTitle', actionHint: 'lockTitle', customAudioDataUrl: 'customAudio' }[field]]: value } : {})
    });
  };

  const handleBulkChange = (patch) => {
    onChange({
      ...data,
      ...patch,
      ...('customAudioDataUrl' in patch ? { customAudio: patch.customAudioDataUrl } : {})
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressUploadedImage(file);
    handleBulkChange({
      photo: dataUrl,
      hidePhoto: false
    });
  };

  const handleExtraPhotosUpload = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    if (!files.length) return;
    const compressed = await Promise.all(files.map((f) => compressUploadedImage(f, 800, 0.75)));
    const existing = Array.isArray(data.photos) ? data.photos : [];
    const nextPhotos = [...existing, ...compressed].slice(0, 6);
    handleBulkChange({
      photos: nextPhotos,
      hidePhoto: false,
      photo: data.photo || nextPhotos[0] || ''
    });
  };

  const removeExtraPhoto = (idx) => {
    const existing = Array.isArray(data.photos) ? data.photos : [];
    const next = existing.filter((_, i) => i !== idx);
    handleFieldChange('photos', next);
  };

  const handleCustomAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleBulkChange({
        customAudioDataUrl: ev.target.result,
        customAudio: ev.target.result,
        customAudioName: file.name,
        enableMusic: true
      });
    };
    reader.readAsDataURL(file);
  };

  const injectAIPhrase = (phrase) => {
    const current = (data.letterText ?? data.letterBody) ? (data.letterText ?? data.letterBody) + '\n\n' : '';
    handleFieldChange('letterText', current + phrase);
  };

  const toggleMusicPreview = (track) => {
    romanticAudio.stop();
    if (playingPreviewTrack === track.id) {
      setPlayingPreviewTrack(null);
    } else {
      romanticAudio.playPreset(track.id);
      setPlayingPreviewTrack(track.id);
      handleBulkChange({ musicTrackId: track.id, musicTitle: track.name });
    }
  };

  const isCounterTemplate = COUNTER_TEMPLATES.has(template.id);
  const isPhraseTemplate = PHRASE_TEMPLATES.has(template.id);
  const isChoiceTemplate = CHOICE_TEMPLATES.has(template.id);
  const isMusicCardTemplate = MUSIC_CARD_TEMPLATES.has(template.id);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border-r border-white/10 select-none">
      {/* Header Info */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
            {template.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base leading-tight">{template.name}</h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Editable
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cualquier campo se puede cambiar o dejar vacío para ocultarlo
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-white/10"
          title="Restaurar valores de ejemplo"
        >
          Restaurar
        </button>
      </div>

      {/* Stepper */}
      <div className="px-5 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10">
          {[
            { id: 1, label: '1. Portada y Escena', icon: Lock },
            { id: 2, label: '2. Carta y Fotos', icon: Mail },
            { id: 3, label: '3. Música y Envío', icon: Music }
          ].map((s) => {
            const Icon = s.icon;
            const active = step === s.id;
            const completed = step > s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/25'
                    : completed
                    ? 'bg-white/5 text-rose-300 hover:bg-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200 flex items-center justify-between gap-2">
              <span>💡 <strong>Tip:</strong> Si no quieres que aparezca algún texto o etiqueta, pulsa <strong>"× Ocultar"</strong> al lado del campo.</span>
            </div>

            {/* Etiqueta Superior / Badge (Opcional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Etiqueta Superior (Opcional)
                </label>
                {data.badgeText !== '' && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange('badgeText', '')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5 font-medium"
                  >
                    <X className="w-3 h-3" /> Ocultar etiqueta
                  </button>
                )}
              </div>
              <input
                type="text"
                maxLength={45}
                value={data.badgeText ?? ''}
                onChange={(e) => handleFieldChange('badgeText', e.target.value)}
                placeholder="Dejar vacío para no mostrar etiqueta superior..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Título Principal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Título Principal de Portada
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{(data.title || '').length}/60</span>
                  {data.title !== '' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('title', '')}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" /> Ocultar
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                maxLength={60}
                value={data.title ?? ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Ej: Siempre Elijo Amarte"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Subtítulo / Estado */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Subtítulo o Frase de Portada
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{(data.lockStatus || '').length}/80</span>
                  {data.lockStatus !== '' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('lockStatus', '')}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                    >
                      <X className="w-3 h-3" /> Ocultar
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                maxLength={80}
                value={data.lockStatus ?? ''}
                onChange={(e) => handleFieldChange('lockStatus', e.target.value)}
                placeholder="Dejar vacío si no deseas subtítulo..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Texto del botón / Instrucción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Texto del Botón / Pista
                  </label>
                  {data.actionHint !== '' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('actionHint', '')}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      × Ocultar
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={40}
                  value={data.actionHint ?? ''}
                  onChange={(e) => handleFieldChange('actionHint', e.target.value)}
                  placeholder="Ej: Toca para abrir ✨"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Mensaje al Desbloquear
                  </label>
                  {data.unlockMsg !== '' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('unlockMsg', '')}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      × Ocultar
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={40}
                  value={data.unlockMsg ?? ''}
                  onChange={(e) => handleFieldChange('unlockMsg', e.target.value)}
                  placeholder="Ej: ¡Eres mi llave! ❤️"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>

            {/* Configuración exclusiva de Candado */}
            {template.id === 'candado' && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-300">
                  🔐 Combinación Secreta del Candado (0 al 31)
                </label>
                <p className="text-xs text-slate-300">
                  El destinatario girará las 3 ruedas hasta formar estos números (ej: día, mes y año especial).
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'combo1', label: 'Rueda 1' },
                    { key: 'combo2', label: 'Rueda 2' },
                    { key: 'combo3', label: 'Rueda 3' }
                  ].map((wheel) => (
                    <div key={wheel.key} className="text-center">
                      <span className="text-[11px] text-slate-400 block mb-1">{wheel.label}</span>
                      <input
                        type="number"
                        min={0}
                        max={31}
                        value={data[wheel.key] ?? 0}
                        onChange={(e) =>
                          handleFieldChange(wheel.key, Math.min(31, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-full py-2.5 rounded-xl bg-slate-950 border border-rose-500/30 text-white text-center font-mono text-lg font-bold focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-rose-200 mb-1">
                      Texto de Estrellas al Abrir (Cielo)
                    </label>
                    <input
                      type="text"
                      maxLength={22}
                      value={data.skyText ?? 'TE AMO'}
                      onChange={(e) => handleFieldChange('skyText', e.target.value)}
                      placeholder="Ej: TE AMO / I LOVE YOU"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-200 mb-1">
                      Pista Opcional (Vacío = Sin pista)
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={data.lockHint ?? ''}
                      onChange={(e) => handleFieldChange('lockHint', e.target.value)}
                      placeholder="Ej: Pista: Nuestro aniversario"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contador de Tiempo Juntos / Fecha Especial (Editable y Desactivable) */}
            {(isCounterTemplate || data.showCounter !== undefined) && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                      Contador de Tiempo / Fecha Especial
                    </span>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-indigo-200">
                    <input
                      type="checkbox"
                      checked={data.showCounter !== false}
                      onChange={(e) => handleFieldChange('showCounter', e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    Mostrar contador
                  </label>
                </div>

                {data.showCounter !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        Fecha de Inicio / Aniversario
                      </label>
                      <input
                        type="date"
                        value={data.anniversaryDate || '2024-02-14'}
                        onChange={(e) => handleFieldChange('anniversaryDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-slate-300">
                          Título del Contador / Coordenada
                        </label>
                        {data.subHeader !== '' && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange('subHeader', '')}
                            className="text-[10px] text-rose-400"
                          >
                            × Quitar
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={50}
                        value={data.subHeader ?? ''}
                        onChange={(e) => handleFieldChange('subHeader', e.target.value)}
                        placeholder="Ej: Nuestro tiempo juntos..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Frases Flotantes / Pétalos / Estrellas (Editable) */}
            {isPhraseTemplate && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
                    <MessageSquareHeart className="w-4 h-4 text-purple-400" />
                    Frases en Pétalos / Estrellas / Toques
                  </label>
                  {data.floatingPhrases !== '' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('floatingPhrases', '')}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      × Ocultar frases
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Separa cada frase con una coma (,). Aparecerán al tocar los pétalos, flores o estrellas.
                </p>
                <textarea
                  rows={2}
                  value={
                    data.floatingPhrases ??
                    'Eres mi persona favorita, Te elijo cada día, Gracias por existir, Contigo todo es magia, Mi corazón es tuyo, Te amo infinito'
                  }
                  onChange={(e) => handleFieldChange('floatingPhrases', e.target.value)}
                  placeholder="Escribe tus frases separadas por coma..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            )}

            {/* Botones Sí / No para Propuestas */}
            {isChoiceTemplate && (
              <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/25 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-200">
                  💍 Personalizar Botones "¡Sí!" y "No"
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Texto Botón Aceptar</label>
                    <input
                      type="text"
                      maxLength={25}
                      value={data.yesText ?? '¡SÍ, ACEPTO! 💖'}
                      onChange={(e) => handleFieldChange('yesText', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Frases del Botón "No" (separadas por coma)</label>
                    <input
                      type="text"
                      value={
                        data.noPhrases ??
                        '¿Segura?, ¡Piénsalo bien!, ¡Di que sí por favor!, ¡No me rompas el corazón!, ¡Anda di que síii!'
                      }
                      onChange={(e) => handleFieldChange('noPhrases', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Canción / Playlist para Spotify & Cassette */}
            {isMusicCardTemplate && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300">
                  🎧 Datos de la Canción / Playlist
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Nombre de Canción Destacada</label>
                    <input
                      type="text"
                      maxLength={40}
                      value={data.songTitle ?? 'Nuestra Canción Especial'}
                      onChange={(e) => handleFieldChange('songTitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Artista / Dedicatoria Corta</label>
                    <input
                      type="text"
                      maxLength={40}
                      value={data.songArtist ?? 'Para mi lugar favorito'}
                      onChange={(e) => handleFieldChange('songArtist', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Saludo de la Carta */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Encabezado / Saludo de la Carta
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{(data.letterTitle || '').length}/50</span>
                  {data.letterTitle !== '' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('letterTitle', '')}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      × Ocultar saludo
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                maxLength={50}
                value={data.letterTitle ?? ''}
                onChange={(e) => handleFieldChange('letterTitle', e.target.value)}
                placeholder="Ej: Para la persona más especial de mi vida"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Cuerpo de la Carta */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Mensaje de la Dedicatoria
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{(data.letterText || '').length}/1800</span>
                  {data.letterText !== '' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('letterText', '')}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      × Vaciar
                    </button>
                  )}
                </div>
              </div>
              <textarea
                rows={6}
                maxLength={1800}
                value={data.letterText ?? data.letterBody ?? ''}
                onChange={(e) => handleFieldChange('letterText', e.target.value)}
                placeholder="Escribe desde el corazón todo lo que sientes..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm leading-relaxed focus:outline-none focus:border-rose-500 transition resize-none"
              />

              {/* AI Inspiration */}
              <div className="mt-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Inspiración Instantánea (Toca para agregar párrafo):</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5">
                  {LOVE_PHRASES_AI.map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => injectAIPhrase(phrase)}
                      className="shrink-0 text-[11px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border border-purple-500/25 rounded-lg px-2.5 py-1.5 transition max-w-[210px] truncate"
                      title={phrase}
                    >
                      + "{phrase}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Firma Final (Editable y Opcional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Firma Final (Opcional)
                </label>
                {data.customSign !== '' && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange('customSign', '')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" /> Quitar firma
                  </button>
                )}
              </div>
              <input
                type="text"
                maxLength={45}
                value={data.customSign ?? ''}
                onChange={(e) => handleFieldChange('customSign', e.target.value)}
                placeholder="Dejar vacío para enviar sin firma (Ej: Con todo mi amor, Alex ♥)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Sección de Fotos 100% Controlable (Con botón claro para Enviar Sin Fotos) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-rose-400" />
                  Fotos de la Dedicatoria
                </label>

                <button
                  type="button"
                  onClick={() =>
                    handleBulkChange({
                      hidePhoto: !data.hidePhoto,
                      ...(data.hidePhoto ? {} : { photo: '', photos: [] })
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    data.hidePhoto || (!data.photo && (!data.photos || data.photos.length === 0))
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                  }`}
                >
                  {data.hidePhoto || (!data.photo && (!data.photos || data.photos.length === 0)) ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Enviando SIN fotos (Toca para activar fotos)
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" /> Quitar todas las fotos (Enviar sin foto)
                    </>
                  )}
                </button>
              </div>

              {!data.hidePhoto && (
                <>
                  {/* Foto Principal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    {data.photo ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/15 h-32 bg-black flex items-center justify-center">
                        <img src={data.photo} alt="Principal" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photo', '')}
                          className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-lg"
                        >
                          <Trash2 className="w-3 h-3" /> Quitar
                        </button>
                      </div>
                    ) : (
                      <div className="h-32 rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center text-slate-500 text-xs p-3 text-center">
                        Sin foto principal (No se mostrará marco de foto)
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition text-xs font-bold text-rose-200">
                        <Upload className="w-4 h-4 text-rose-400" />
                        <span>{data.photo ? 'Cambiar Foto Principal' : 'Subir Foto Principal'}</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>

                      <label className="w-full py-2.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 flex items-center justify-center gap-2 cursor-pointer transition text-xs font-bold text-purple-200">
                        <Plus className="w-4 h-4 text-purple-400" />
                        <span>Agregar Fotos Extra (Galería/Juegos)</span>
                        <input type="file" accept="image/*" multiple onChange={handleExtraPhotosUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Miniaturas de Fotos Extra */}
                  {Array.isArray(data.photos) && data.photos.length > 0 && (
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1.5">
                        Galería de Recuerdos ({data.photos.length} fotos):
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {data.photos.map((imgUrl, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 shrink-0">
                            <img src={imgUrl} alt={`Extra ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExtraPhoto(idx)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/80 text-rose-400 flex items-center justify-center text-xs font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pie de Foto Polaroid (Opcional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Pie de Foto Polaroid (Opcional — bórralo para no mostrar texto en la foto)
                      </label>
                      {data.photoCaption && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoCaption', '')}
                          className="text-[11px] text-rose-400"
                        >
                          × Quitar pie de foto
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={40}
                      value={data.photoCaption ?? ''}
                      onChange={(e) => handleFieldChange('photoCaption', e.target.value)}
                      placeholder="Vacío = sin texto debajo de la foto (Ej: Nuestro momento ♡)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Música de Fondo */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Music className="w-5 h-5 text-rose-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Música Romántica de Fondo</h3>
                    <p className="text-xs text-slate-400">Suena automáticamente al interactuar con la página</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={data.enableMusic !== false}
                  onChange={(e) => handleFieldChange('enableMusic', e.target.checked)}
                  className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                />
              </div>

              {data.enableMusic !== false && (
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <label className="block text-xs font-semibold text-slate-400">
                    Selecciona una melodía del catálogo:
                  </label>
                  <div className="space-y-2">
                    {MUSIC_TRACKS.map((track) => {
                      const isSelected = (data.musicTrackId || 'music-box') === track.id && !data.customAudioDataUrl;
                      const isPlaying = playingPreviewTrack === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            handleBulkChange({ musicTrackId: track.id, customAudioDataUrl: null, customAudioName: null });
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            isSelected
                              ? 'bg-rose-500/15 border-rose-500/40 text-white'
                              : 'bg-slate-900/70 border-white/5 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMusicPreview(track);
                              }}
                              className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 hover:bg-rose-400 transition"
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>
                            <div className="truncate">
                              <p className="text-xs font-bold truncate">{track.name}</p>
                              <p className="text-[10px] text-slate-400">{track.duration} • Romántica</p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Subir MP3 propio gratis */}
                  <div className="pt-2">
                    <label className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/60 flex items-center justify-center gap-2 cursor-pointer transition text-xs font-bold text-purple-200">
                      <Upload className="w-4 h-4 text-purple-300" />
                      <span>
                        {data.customAudioName ? `🎵 ${data.customAudioName}` : 'Subir mi propio archivo MP3 (Gratis)'}
                      </span>
                      <input type="file" accept="audio/*" onChange={handleCustomAudioUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Enlace Personalizado */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  🔗 Alias Personalizado del Enlace
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GRATIS ILIMITADO
                </span>
              </div>
              <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
                <span className="px-3 py-2.5 text-xs text-slate-500 bg-slate-950 border-r border-white/10 select-none">
                  /p/
                </span>
                <input
                  type="text"
                  maxLength={40}
                  value={data.customSlug || ''}
                  onChange={(e) =>
                    handleFieldChange('customSlug', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))
                  }
                  placeholder="nuestro-aniversario"
                  className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation & Actions */}
      <div className="p-4 border-t border-white/10 bg-slate-950/90 flex items-center justify-between gap-2">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
          >
            ← Anterior
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition"
            >
              Siguiente Paso →
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onExportHTML}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Descargar HTML</span>
              </button>
              <button
                type="button"
                onClick={onOpenShare}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Publicar y Compartir QR</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
