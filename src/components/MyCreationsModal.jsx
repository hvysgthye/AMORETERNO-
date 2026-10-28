import React, { useState, useEffect } from 'react';
import { X, Heart, Clock, ExternalLink, Download, Trash2, Edit3, Sparkles } from 'lucide-react';
import { getSavedCreations, removeCreationLocally } from '../utils/shareHelper';
import { giftURL } from '../utils/cloudGifts';
import { TEMPLATES } from '../data/templates';
import { generateStandaloneHTML } from '../utils/htmlExporter';

export default function MyCreationsModal({ isOpen, onClose, onLoadCreation, onShareCreation }) {
  const [creations, setCreations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setCreations(getSavedCreations());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id) => {
    if (confirm('¿Deseas eliminar esta dedicatoria de tu historial?')) {
      removeCreationLocally(id);
      setCreations(getSavedCreations());
    }
  };

  const handleDownload = (item) => {
    const html = generateStandaloneHTML(item.templateId, item.data);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dedicatoria-${item.templateId}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0c1024] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-400 flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif-romance">
                Mis Dedicatorias Guardadas
              </h3>
              <p className="text-[11px] text-slate-400">
                Tus creaciones se guardan automáticamente en tu navegador para que nunca las pierdas
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

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {creations.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-rose-400 text-2xl">
                💌
              </div>
              <h4 className="text-sm font-bold text-slate-200">Aún no tienes dedicatorias guardadas</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Cuando personalices una plantilla y hagas clic en "Compartir" o "Descargar", se guardará aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {creations.map((item) => {
                const tpl = TEMPLATES.find((t) => t.id === item.templateId);
                const title = item.data?.title || tpl?.name || 'Dedicatoria de Amor';
                const shareUrl = item.shareId ? giftURL(item.shareId) : null;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-rose-500/40 transition flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                        <span className="font-semibold text-rose-300 px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30">
                          {tpl?.name || item.templateId}
                        </span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Clock className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white font-serif-romance truncate group-hover:text-rose-200 transition">
                        {title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.data?.lockTitle || item.data?.letterTitle || 'Regalo especial interactivo'}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-white/5 mt-3 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => {
                          onLoadCreation(item.templateId, item.data);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>

                      {shareUrl ? <a
                        href={shareUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Ver en pantalla completa"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      : <button onClick={() => {onClose();onShareCreation(item.templateId,item.data);}} title="Guardar en línea y compartir" className="p-1.5 rounded-lg bg-slate-800 text-slate-200"><ExternalLink className="w-3.5 h-3.5"/></button>}

                      <button
                        onClick={() => handleDownload(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Descargar archivo HTML"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition"
                        title="Eliminar de guardados"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
