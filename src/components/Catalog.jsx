import React, { useState } from 'react';
import { TEMPLATES, CATEGORIES } from '../data/templates';
import { Sparkles, ArrowRight, Star, Heart, Search, Filter } from 'lucide-react';

export default function Catalog({ onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = TEMPLATES.filter(tpl => {
    const matchesCategory = selectedCategory === 'Todos' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Catálogo Oficial Completo • {TEMPLATES.length} Plantillas Románticas</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif-romance">
          Todas las Plantillas <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200">Reimaginadas</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2.5 leading-relaxed">
          Las 35 plantillas de Dedicapag perfeccionadas con físicas 3D, música a tu elección, animaciones fluidas y exportación 100% offline.
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre (ej: candado, flores, spotify, galaxia, anillo)..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 shadow-xl transition"
          />
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Count Indicator */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
        <span>Mostrando {filteredTemplates.length} de {TEMPLATES.length} plantillas disponibles</span>
        <span className="text-rose-400 font-semibold">• Todas admiten música propia (MP3/WAV)</span>
      </div>

      {/* Grid of 35 Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredTemplates.map(tpl => (
          <div
            key={tpl.id}
            className="group glass-card rounded-3xl p-6 flex flex-col justify-between glass-card-hover cursor-pointer relative overflow-hidden"
            onClick={() => onSelectTemplate(tpl.id)}
          >
            {/* Top Card Gradient Bar */}
            <div className={`h-2.5 w-full bg-gradient-to-r ${tpl.previewGradient} rounded-full mb-5`} />

            <div>
              {/* Badges */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-rose-300 border border-rose-500/20">
                  {tpl.badge}
                </span>
                <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{tpl.rating}</span>
                </div>
              </div>

              {/* Template Name */}
              <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition font-serif-romance">
                {tpl.name}
              </h3>
              <p className="text-xs text-rose-400/80 font-medium mt-0.5 mb-2.5">
                {tpl.category}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed line-clamp-3">
                {tpl.description}
              </p>

              {/* Key Features Pill List */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tpl.features.slice(0, 3).map((feat, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-900/60 border border-white/5 text-slate-300 px-2 py-0.5 rounded-md"
                  >
                    • {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Previsualización inmediata</span>
              <button
                className="flex items-center gap-1.5 text-xs font-bold text-rose-300 group-hover:text-white group-hover:translate-x-1 transition"
              >
                <span>Personalizar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
