import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, MessageCircle, Send, QrCode, Download, ExternalLink, Sparkles, Heart, Smartphone } from 'lucide-react';
import { getWhatsAppShareURL, getTelegramShareURL, saveCreationLocally } from '../utils/shareHelper';
import { generateQRCodeSVG, downloadQRCodeCard } from '../utils/qrCodeGenerator';
import { publishGift } from '../utils/cloudGifts';

export default function ShareModal({ isOpen, onClose, templateId, data, onOpenRecipientMode }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link'); // 'link' | 'qr' | 'preview'
  const [partnerName, setPartnerName] = useState('Para Mi Amor');
  const [saveError, setSaveError] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const published = useRef(null);

  // A link exists only after all media and the selected template are persisted.
  useEffect(() => {
    if (!isOpen) return;
    setCopied(false); setError(''); setShareUrl(''); setStatus('Preparando el guardado…');
    if (published.current?.source === data && published.current?.templateId === templateId) {
      setShareUrl(published.current.url); setStatus('Regalo guardado en línea'); return;
    }
    const controller = new AbortController(); let cancelled = false;
    publishGift(templateId, data, { signal: controller.signal, onProgress: label => { if(!cancelled) setStatus(label); } })
      .then(result => {
        if(cancelled) return;
        published.current = { source: data, templateId, url: result.url };
        setSaveError(!saveCreationLocally(templateId, result.data, {shareId: result.id}));
        setShareUrl(result.url); setStatus('Regalo guardado en línea');
      }).catch(error => { if(!cancelled && error.name !== 'AbortError') { setStatus(''); setError(error.message); } });
    return () => { cancelled = true; controller.abort(); };
  }, [isOpen, templateId, data, attempt]);

  if (!isOpen) return null;

  const safeTitle = data?.title || 'Una Sorpresa Inolvidable';
  const qrSvg = shareUrl ? generateQRCodeSVG(shareUrl, 260, '#111827', '#ffffff') : null;

  const handleCopy = () => {
    if(!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => setError('No se pudo copiar. Selecciona el enlace y cópialo manualmente.'));
  };

  const handleDownloadQR = () => {
    if(!shareUrl || !qrSvg) return;
    downloadQRCodeCard({
      url: shareUrl,
      title: safeTitle,
      partnerName: partnerName || 'Para Ti'
    });
  };

  const handleOpenWhatsApp = () => {
    if(!shareUrl) return;
    const waUrl = getWhatsAppShareURL(shareUrl, safeTitle);
    window.open(waUrl, '_blank');
  };

  const handleOpenTelegram = () => {
    if(!shareUrl) return;
    const tgUrl = getTelegramShareURL(shareUrl, safeTitle);
    window.open(tgUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0c1024] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif-romance">
                Compartir Dedicatoria
              </h3>
              <p className="text-[11px] text-slate-400">
                Tu regalo digital está listo para emocionar a tu persona favorita
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-1.5 bg-slate-950/70 border-b border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('link')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'link'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enlace & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'qr'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Tarjeta QR Regalo</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'preview'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vista WhatsApp</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {status && <p role="status" className="text-sm text-emerald-200">{status}</p>}
          {error && <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-950/25 p-4 text-sm text-amber-100"><p>{error}</p>{!shareUrl && <button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-3 underline">Volver a intentar el guardado</button>}</div>}
          {saveError && <p role="alert" className="text-sm text-amber-200">No se pudo guardar en este navegador. Descarga tu regalo para conservar una copia; el almacenamiento puede estar lleno o bloqueado.</p>}
          {/* TAB 1: ENLACE & WHATSAPP */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              {/* Direct Link Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enlace directo para tu persona especial:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    aria-label="Enlace del regalo guardado"
                    placeholder={error ? 'El regalo aún no se ha guardado' : 'Guardando fotos, canción y dedicatoria…'}
                    value={shareUrl}
                    className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-rose-200 font-mono select-all focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={!shareUrl}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Instant Social Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleOpenWhatsApp}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </button>

                <button
                  onClick={handleOpenTelegram}
                  disabled={!shareUrl}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-600/25 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar por Telegram</span>
                </button>
              </div>

              {/* Fullscreen Test Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenRecipientMode) onOpenRecipientMode();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  <span>Ver cómo lo verá tu pareja (Pantalla Completa)</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-rose-200">Un regalo completo:</strong> Al terminar el guardado, el enlace y el QR abren la plantilla elegida con sus fotos y canción desde otro dispositivo. Cualquier persona que tenga el enlace podrá ver ese regalo; no hay un catálogo público de dedicatorias.
              </div>
            </div>
          )}

          {/* TAB 2: TARJETA QR PARA REGALOS */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <p className="text-xs text-slate-300 max-w-sm">
                Imprime o descarga esta tarjeta con código QR para colocarla en un ramo de flores, caja de chocolates o carta física.
              </p>

              {/* Custom dedication name for the card */}
              <div className="w-full max-w-xs">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 text-left">
                  Nombre o dedicatoria en la tarjeta:
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Ej. Para el amor de mi vida"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* QR Preview Display */}
              <div className="p-4 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-rose-500/40">
                {qrSvg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                    className="w-52 h-52 sm:w-60 sm:h-60"
                  />
                ) : (
                  <div role="status" className="w-52 h-52 flex items-center justify-center text-slate-900 text-xs p-4">
                    {shareUrl ? 'No se pudo generar el QR. Copia el enlace de tu regalo.' : 'El QR estará listo cuando se confirme el guardado de tu regalo.'}
                  </div>
                )}
              </div>

              {/* Download Card Button */}
              <button
                onClick={handleDownloadQR}
                disabled={!qrSvg}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-600/30 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Tarjeta de Regalo con QR (.PNG)</span>
              </button>

              <p className="text-[10px] text-slate-400">
                Cualquier persona puede escanearlo con la cámara de su celular sin necesidad de instalar apps.
              </p>
            </div>
          )}

          {/* TAB 3: SIMULADOR DE VISTA PREVIA EN WHATSAPP */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Esta es una simulación del mensaje. WhatsApp puede mostrar una vista previa distinta; el enlace abre el regalo completo guardado.
              </p>

              {/* WhatsApp Message Bubble Mockup */}
              <div className="max-w-sm mx-auto bg-[#0b141a] p-3 sm:p-4 rounded-2xl border border-emerald-900/50 shadow-2xl space-y-2">
                <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none shadow-md space-y-2 text-xs">
                  <div className="bg-[#025143] rounded-xl overflow-hidden border border-white/10">
                    {data?.photo ? (
                      <img
                        src={data.photo}
                        alt="Preview"
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-tr from-rose-600 to-amber-400 flex items-center justify-center text-3xl">
                        ❤️
                      </div>
                    )}
                    <div className="p-2.5">
                      <p className="font-bold text-white text-xs sm:text-sm truncate">
                        {safeTitle}
                      </p>
                      <p className="text-[10px] text-emerald-200 mt-0.5 line-clamp-2">
                        {data?.lockTitle || 'Una dedicatoria interactiva con música, animación y sorpresa especial.'}
                      </p>
                      <span className="text-[9px] text-emerald-300/70 block mt-1">dedicapag-nextgen.com</span>
                    </div>
                  </div>

                  <p className="text-emerald-50 text-[11px] leading-relaxed pt-1">
                    ❤️ Te preparé una sorpresa especial hecha con todo mi corazón... Toca el enlace para abrirla.
                  </p>
                  <span className="text-[9px] text-emerald-300 block text-right">12:00 ✓✓</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleOpenWhatsApp}
                  disabled={!shareUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir WhatsApp Ahora</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
