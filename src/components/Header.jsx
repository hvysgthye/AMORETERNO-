import React, { useState } from 'react';
import { Heart, Sparkles, Download, Layers, Share2, Bookmark, Menu, X } from 'lucide-react';
export default function Header({ activeTab, setActiveTab, onExport, onOpenShare, onOpenCreations }) {
 const [menuOpen, setMenuOpen] = useState(false);
 const action = callback => () => { setMenuOpen(false); callback(); };
 return <header className="ae-header">
  <a className="ae-skip" href="#main-content">Saltar al contenido</a>
  <button className="ae-brand" onClick={action(() => setActiveTab('catalog'))} aria-label="Amor Eterno, ir al inicio"><span className="ae-brand-mark"><Heart aria-hidden="true" /></span><span><strong>Amor <em>Eterno</em></strong><small>Recuerdos que se regalan</small></span></button>
  <nav className="ae-nav" aria-label="Navegación principal"><button aria-current={activeTab === 'catalog' ? 'page' : undefined} onClick={action(() => setActiveTab('catalog'))}><Layers aria-hidden="true" /><span>Diseños</span></button><button aria-current={activeTab === 'editor' ? 'page' : undefined} onClick={action(() => setActiveTab('editor'))}><Sparkles aria-hidden="true" /><span>Personalizar</span></button></nav>
  <button className="ae-menu-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="creation-actions" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
  <div id="creation-actions" className={`ae-actions ${menuOpen ? 'is-open' : ''}`} onKeyDown={e => { if(e.key === 'Escape') setMenuOpen(false); }}><button onClick={action(onOpenCreations)}><Bookmark aria-hidden="true" /><span>Mis recuerdos</span></button><button onClick={action(onExport)}><Download aria-hidden="true" /><span>Descargar regalo</span></button><button className="ae-share" onClick={action(onOpenShare)}><Share2 aria-hidden="true" /><span>Compartir</span></button></div>
 </header>;
}
