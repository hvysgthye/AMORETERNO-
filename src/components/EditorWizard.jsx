import React, { useState, useRef, useEffect } from 'react';
import { TEMPLATES } from '../data/templates';
import {
  Sliders, FileText, Music, Image as ImageIcon, Sparkles, Check, RefreshCw, Upload,
  Play, Pause, Trash2, Volume2, AlertCircle, Loader2, Share2, Mic, MicOff, Radio
} from 'lucide-react';
import { sound } from '../utils/audioHelper';
import { compressImageFile, validateAudioFile } from '../utils/mediaOptimizer';
import { VoiceRecorder } from '../utils/voiceRecorder';
import { ROMANTIC_PRESETS, romanticAudio } from '../utils/romanticMelodies';

export default function EditorWizard({ currentTemplateId, data, onChange, onReset, onOpenShare }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingPresetId, setPlayingPresetId] = useState(null);
  const [isCompressingImg, setIsCompressingImg] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceRecorderInstance, setVoiceRecorderInstance] = useState(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const voiceAudioRef = useRef(null);

  const audioInputRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const currentTemplate = TEMPLATES.find(t => t.id === currentTemplateId) || TEMPLATES[0];

  const handleTextChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleComboChange = (index, value) => {
    const val = parseInt(value, 10) || 0;
    const nextCombo = [...(data.combo || [14, 2, 24])];
    nextCombo[index] = Math.min(31, Math.max(0, val));
    onChange({ ...data, combo: nextCombo });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsCompressingImg(true);
      const res = await compressImageFile(file, 1200, 0.82);
      onChange({
        ...data,
        photo: res.dataUrl,
        photoCompressedSize: (res.compressedSize / 1024).toFixed(0) + ' KB'
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al procesar la foto.');
    } finally {
      setIsCompressingImg(false);
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAudioError(null);
    const check = validateAudioFile(file, 25);
    if (!check.valid) {
      setAudioError(check.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        ...data,
        customAudio: reader.result,
        customAudioName: file.name,
        customAudioSize: check.sizeFormatted
      });
    };
    reader.readAsDataURL(file);
  };

  const removeCustomAudio = () => {
    if (isPlayingPreview) {
      sound.pauseCustomAudio();
      setIsPlayingPreview(false);
    }
    onChange({
      ...data,
      customAudio: null,
      customAudioName: null,
      customAudioSize: null
    });
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const toggleAudioPreview = () => {
    sound.toggleMusicTrack(data?.customAudio, setIsPlayingPreview);
  };

  // Preset Melodies test
  const handleTogglePreset = (presetId) => {
    if (playingPresetId === presetId) {
      romanticAudio.stop();
      setPlayingPresetId(null);
    } else {
      romanticAudio.playPreset(presetId);
      setPlayingPresetId(presetId);
      onChange({ ...data, presetMelody: presetId });
    }
  };

  // Voice recording handlers
  const handleStartRecording = async () => {
    try {
      setAudioError(null);
      const rec = new VoiceRecorder();
      await rec.start();
      setVoiceRecorderInstance(rec);
      setIsRecording(true);
      setRecordSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds(s => {
          if (s >= 45) {
            handleStopRecording();
            return 45;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setAudioError(err.message || 'No se pudo acceder al micrófono.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (!voiceRecorderInstance) return;

    try {
      const res = await voiceRecorderInstance.stop();
      setIsRecording(false);
      setVoiceRecorderInstance(null);
      onChange({
        ...data,
        voiceNote: res.audioDataUrl,
        voiceNoteDuration: `${recordSeconds}s`
      });
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const removeVoiceNote = () => {
    if (isPlayingVoice && voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      setIsPlayingVoice(false);
    }
    onChange({
      ...data,
      voiceNote: null,
      voiceNoteDuration: null
    });
  };

  const togglePlayVoiceNote = () => {
    if (!data.voiceNote) return;
    if (!voiceAudioRef.current) {
      voiceAudioRef.current = new Audio(data.voiceNote);
      voiceAudioRef.current.onended = () => setIsPlayingVoice(false);
    }

    if (isPlayingVoice) {
      voiceAudioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      voiceAudioRef.current.play();
      setIsPlayingVoice(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      romanticAudio.stop();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0e1d] border-r border-white/10 overflow-y-auto">
      {/* Editor Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md">
        <div>
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
            Editando plantilla
          </span>
          <h2 className="text-lg font-bold text-white font-serif-romance">
            {currentTemplate.name}
          </h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-300 p-2 rounded-xl hover:bg-white/5 transition"
          title="Restablecer valores por defecto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restablecer</span>
        </button>
      </div>

      {/* 3 Step Indicator Tabs */}
      <div className="grid grid-cols-3 p-2 bg-slate-950/60 border-b border-white/5 text-xs font-semibold">
        <button
          onClick={() => setActiveStep(1)}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeStep === 1
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. Estilo</span>
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeStep === 2
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>2. Mensaje</span>
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeStep === 3
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>3. Audio & Voz</span>
        </button>
      </div>

      {/* Form Steps Body */}
      <div className="p-4 sm:p-5 flex-1 space-y-5">
        {/* --- STEP 1: INTERACTIVIDAD Y CONFIGURACIÓN --- */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Título Principal de la Dedicatoria *
              </label>
              <input
                type="text"
                maxLength={50}
                value={data.title || ''}
                onChange={(e) => handleTextChange('title', e.target.value)}
                placeholder="Ej. Para el amor de mi vida"
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instrucción / Subtítulo inicial
              </label>
              <input
                type="text"
                maxLength={65}
                value={data.lockTitle || ''}
                onChange={(e) => handleTextChange('lockTitle', e.target.value)}
                placeholder="Ej. Gira los números para abrir mi corazón"
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* If template is Candado, show the 3 combo dials */}
            {currentTemplateId === 'candado' && (
              <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4">
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Combinación Secreta del Candado (3 números de 0 a 31) *
                </label>
                <p className="text-[11px] text-slate-400 mb-3">
                  Puedes usar su fecha de aniversario (ej: Día, Mes, Año: 14 - 02 - 24)
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map(idx => (
                    <div key={idx}>
                      <span className="block text-[10px] text-slate-400 mb-1">Dígito {idx + 1}</span>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={data.combo?.[idx] ?? 0}
                        onChange={(e) => handleComboChange(idx, e.target.value)}
                        className="w-full text-center bg-slate-950 border border-amber-500/40 rounded-xl py-2 font-mono text-base font-bold text-amber-300 focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mensaje de Éxito al Desbloquear
              </label>
              <input
                type="text"
                maxLength={45}
                value={data.unlockMsg || ''}
                onChange={(e) => handleTextChange('unlockMsg', e.target.value)}
                placeholder="Ej. ¡Desbloqueaste mi corazón!"
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Selector de Atmósfera y Efectos Mágicos */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Atmósfera y Efectos Flotantes</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'hearts', name: 'Corazones', icon: '💖' },
                  { id: 'stars', name: 'Estrellas', icon: '✨' },
                  { id: 'sakura', name: 'Sakura', icon: '🌸' },
                  { id: 'fireflies', name: 'Luciérnagas', icon: '🌟' },
                  { id: 'snow', name: 'Nieve Mágica', icon: '❄️' },
                ].map(fx => (
                  <button
                    key={fx.id}
                    type="button"
                    onClick={() => handleTextChange('ambientFx', fx.id)}
                    className={`p-2 rounded-xl text-left border text-xs flex items-center gap-2 transition cursor-pointer ${
                      (data.ambientFx || 'hearts') === fx.id
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-900/30'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{fx.icon}</span>
                    <span className="truncate">{fx.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: CARTA ROMÁNTICA & FOTOS --- */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Encabezado de la Carta Romántica
              </label>
              <input
                type="text"
                maxLength={50}
                value={data.letterTitle || ''}
                onChange={(e) => handleTextChange('letterTitle', e.target.value)}
                placeholder="Ej. Para la persona más especial..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Cuerpo de la Dedicatoria *
                </label>
                <span className="text-[10px] text-slate-400">
                  {(data.letterBody || '').length} / 1200 car.
                </span>
              </div>
              <textarea
                rows={5}
                maxLength={1200}
                value={data.letterBody || ''}
                onChange={(e) => handleTextChange('letterBody', e.target.value)}
                placeholder="Escribe aquí tus sentimientos más profundos, tus recuerdos inolvidables o tu promesa de amor..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition leading-relaxed"
              />
            </div>

            {/* Photo Upload with Client-Side Compression */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                  <span>Foto Especial (Optimizada Automáticamente)</span>
                </label>
                {data.photoCompressedSize && (
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    ✓ Comprimida a {data.photoCompressedSize}
                  </span>
                )}
              </div>

              {data.photo ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/20 group">
                  <img
                    src={data.photo}
                    alt="Foto de la dedicatoria"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <button
                      onClick={() => onChange({ ...data, photo: null, photoCompressedSize: null })}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition"
                    >
                      Cambiar foto
                    </button>
                  </div>
                </div>
              ) : (
                <label className="w-full h-28 border-2 border-dashed border-white/10 hover:border-rose-500/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-slate-900/40 hover:bg-slate-900/70 cursor-pointer transition">
                  {isCompressingImg ? (
                    <div className="flex items-center gap-2 text-rose-400 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Comprimiendo imagen con Canvas...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-rose-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        Sube una foto juntos (JPG, PNG, WebP)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Se auto-optimiza para que cargue al instante
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isCompressingImg}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Custom Signature / Free Watermark */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Firma Personal (100% Sin Costo)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                  Gratis
                </span>
              </div>
              <input
                type="text"
                maxLength={45}
                value={data.customSign || ''}
                onChange={(e) => handleTextChange('customSign', e.target.value)}
                placeholder="Ej. Hecho con amor eterno por Martín"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {/* --- STEP 3: MÚSICA PERSONALIZADA & NOTAS DE VOZ --- */}
        {activeStep === 3 && (
          <div className="space-y-4">
            {/* VOICE NOTE RECORDER (Exclusive Feature!) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Nota de Voz Romántica (Grabada con tu micrófono)
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ¡Nuevo!
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                Graba tu voz diciendo algo hermoso. Tu pareja podrá escuchar tu voz real con un toque al abrir la dedicatoria.
              </p>

              {/* Recorder Controls */}
              {!data.voiceNote ? (
                <div className="flex flex-col items-center gap-2.5 py-2">
                  {isRecording ? (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="flex items-center gap-3 text-rose-400 font-mono text-sm font-bold animate-pulse">
                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                        <span>Grabando audio: {recordSeconds}s / 45s</span>
                      </div>
                      <button
                        onClick={handleStopRecording}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Detener y Guardar Nota de Voz</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartRecording}
                      className="w-full py-3 px-4 border border-rose-500/50 hover:border-rose-400 rounded-xl flex items-center justify-center gap-2.5 bg-rose-950/30 hover:bg-rose-950/50 text-rose-200 text-xs font-bold cursor-pointer transition shadow-md"
                    >
                      <Mic className="w-4 h-4 text-rose-400" />
                      <span>Comenzar a Grabar Mi Voz (Hasta 45 seg)</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Recorded Voice Note Card */
                <div className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-3 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={togglePlayVoiceNote}
                      className="p-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/30 active:scale-95 transition cursor-pointer flex-shrink-0"
                      title={isPlayingVoice ? "Pausar" : "Escuchar tu voz"}
                    >
                      {isPlayingVoice ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-white truncate">Tu Mensaje de Voz Romántico</p>
                      <p className="text-[10px] text-rose-400">Duración: {data.voiceNoteDuration || '45s'} • Listo para emocionar</p>
                    </div>
                  </div>
                  <button
                    onClick={removeVoiceNote}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition cursor-pointer"
                    title="Eliminar y volver a grabar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Custom Audio Upload Box */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Canción de Fondo (MP3 / WAV)
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">Opcional</span>
              </div>

              {audioError && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{audioError}</span>
                </div>
              )}

              {!data.customAudio ? (
                <div>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="custom-audio-file-input"
                  />
                  <label
                    htmlFor="custom-audio-file-input"
                    className="w-full py-3.5 px-4 border border-dashed border-white/20 hover:border-rose-400 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 hover:bg-rose-950/20 cursor-pointer transition group"
                  >
                    <Upload className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
                    <span className="text-xs font-semibold text-rose-200">
                      Subir archivo de música desde tu teléfono o PC
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Cualquier canción MP3, WAV o M4A
                    </span>
                  </label>
                </div>
              ) : (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={toggleAudioPreview}
                      className="p-2.5 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/30 active:scale-95 transition cursor-pointer flex-shrink-0"
                      title={isPlayingPreview ? "Pausar" : "Escuchar prueba"}
                    >
                      {isPlayingPreview ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{data.customAudioName || 'Canción Personalizada'}</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        <span>{data.customAudioSize || 'Audio Listo'}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCustomAudio}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition cursor-pointer"
                    title="Eliminar canción"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* PRESET INSTRUMENTAL MELODIES (For users without an MP3 file) */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  <span>Melodías Románticas Integradas (Sin Archivos)</span>
                </span>
                <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  4 Variedades
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ¿No tienes un MP3 descargado? Elige una de estas hermosas melodías generadas en tiempo real:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {ROMANTIC_PRESETS.map((preset) => {
                  const isSelected = (data.presetMelody || 'music-box') === preset.id;
                  const isPlayingThis = playingPresetId === preset.id;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleTogglePreset(preset.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md shadow-rose-900/20'
                          : 'bg-slate-950 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-base">{preset.icon}</span>
                        <div className="overflow-hidden">
                          <p className="font-bold truncate text-[11px]">{preset.name}</p>
                          <p className="text-[9px] text-slate-400 truncate">{preset.desc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`p-1.5 rounded-full flex-shrink-0 transition ${
                          isPlayingThis ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                        title={isPlayingThis ? "Detener prueba" : "Escuchar"}
                      >
                        {isPlayingThis ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between">
        <button
          disabled={activeStep === 1}
          onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
        >
          ← Paso Anterior
        </button>

        {activeStep < 3 ? (
          <button
            onClick={() => setActiveStep(prev => Math.min(3, prev + 1))}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md shadow-rose-600/30 transition cursor-pointer"
          >
            Siguiente Paso →
          </button>
        ) : (
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir & QR →</span>
          </button>
        )}
      </div>
    </div>
  );
}
