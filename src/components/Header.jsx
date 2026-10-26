import React from 'react';
import { Heart, Sparkles, Download, Layers, Share2, Bookmark } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onExport, onOpenShare, onOpenCreations, creationsCount = 0 }) {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-rose-500/20 px-3 sm:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-600/30">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-serif-romance">
              Dedicapag <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">NextGen</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
              v2.0 Ultra
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Dedicatorias de amor interactivas sin cuotas ni servidores caídos
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="flex items-center gap-1.5 bg-slate-900/70 p-1 rounded-2xl border border-white/10">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Editor en Vivo</span>
        </button>
      </nav>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCreations}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs sm:text-sm font-semibold transition cursor-pointer"
          title="Ver tus dedicatorias guardadas en este navegador"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Mis Guardados</span>
        </button>

        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-600/25 active:scale-95 transition cursor-pointer"
          title="Compartir por WhatsApp, Enlace directo o descargar Tarjeta QR"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Compartir & QR</span>
          <span className="sm:hidden">Compartir</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition cursor-pointer"
          title="Descarga un archivo .html 100% autónomo para regalar sin pagar suscripciones"
        >
          <Download className="w-4 h-4 text-rose-400" />
          <span className="hidden md:inline">Descargar .HTML</span>
        </button>
      </div>
    </header>
  );
}
