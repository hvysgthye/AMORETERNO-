import React, { useState } from 'react';
import { TEMPLATES, CATEGORIES } from '../data/templates';
import { ArrowUpRight, ArrowRight, Heart, Search, Sparkles, Music2, LockKeyhole, Mail, Flower2, Orbit, Gift, Fingerprint, Car, BookHeart, DoorOpen, TreePine, Gem, Gamepad2, X } from 'lucide-react';
import KeepsakeArtwork from './templates/shared/KeepsakeArtwork';
import { getKeepsakeDesign } from '../data/keepsakeDesigns';
export function TemplateArtwork({ template, featured = false }) {
 const d = getKeepsakeDesign(template.id);
 return <div className={`keepsake-cover ${featured ? 'art-featured' : ''}`} data-family={d.family} aria-hidden="true"
   style={{'--gift-accent':d.accent,'--gift-ink':d.ink,'--gift-bg':d.background}}>
   <span className="cover-edition">AMOR ETERNO / {d.edition}</span><span className="cover-star">✧</span>
   <div className="cover-orbit" />
   <KeepsakeArtwork templateId={template.id} />
   <span className="cover-series">Una historia para guardar</span>
   <p className="art-quote">{d.quote}</p><span className="art-signature">De mi mundo, para el tuyo</span>
 </div>;
}

export default function Catalog({ onSelectTemplate }) {
 const [category, setCategory] = useState('Todos');
 const [query, setQuery] = useState('');
 const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
 const filtered = TEMPLATES.filter(t => (category === 'Todos' || t.category === category) && normalize(`${t.name} ${t.description} ${t.category}`).includes(normalize(query.trim())));
 const featured = TEMPLATES.find(t => t.id === 'carta') || TEMPLATES[0];
 return <div className="atelier-catalog">
  <section className="atelier-hero" aria-labelledby="catalog-title">
   <div className="hero-copy"><span className="atelier-eyebrow"><span /> EL ARTE DE REGALAR EMOCIONES</span>
    <h1 id="catalog-title">No es una página.<br />Es un <em>te quiero.</em></h1>
    <p>Convierte eso que sientes en algo que pueda abrir, escuchar y guardar. Una sorpresa tan única como su historia.</p>
    <a className="atelier-primary" href="#coleccion">Encuentra tu diseño <ArrowRight size={17} /></a>
    <div className="hero-details"><span><Heart size={14} /> A tu manera</span><span><Music2 size={14} /> Con su canción</span><span><Sparkles size={14} /> Un toque de magia</span></div>
   </div>
   <button className="hero-feature" onClick={() => onSelectTemplate(featured.id)} aria-label={`Personalizar ${featured.name}`}>
    <div className="feature-note">DE NUESTRA COLECCIÓN <span>01 / {TEMPLATES.length}</span></div><TemplateArtwork template={featured} featured />
    <div className="feature-caption"><div><span>PARA DECIRLO TODO</span><strong>Una carta. Mil sentimientos.</strong></div><span className="feature-arrow"><ArrowUpRight size={21} /></span></div>
    <span className="feature-sticker"><Heart size={17} /> Hecho con<br />mucho amor</span>
   </button>
  </section>
  <section className="ae-how" aria-label="Cómo crear tu regalo"><div><span>01</span><h2>Elige su sorpresa</h2><p>Explora la colección y encuentra un diseño que hable de ustedes.</p></div><div><span>02</span><h2>Hazla personal</h2><p>Escribe tu carta, agrega recuerdos y prueba la experiencia en el editor.</p></div><div><span>03</span><h2>Regala el momento</h2><p>Abre Compartir para revisar el enlace o descarga tu regalo como archivo.</p></div></section>
  <section id="coleccion" className="atelier-collection" aria-labelledby="collection-title">
   <div className="collection-heading"><div><span className="atelier-eyebrow">ENCUENTRA SU PRÓXIMO RECUERDO</span><h2 id="collection-title">Pequeños gestos,<br /><em>grandes historias.</em></h2></div><span className="collection-total">{TEMPLATES.length} diseños para sentir</span></div>
   <div className="collection-toolbar"><label className="atelier-search"><Search size={18} /><span className="sr-only">Buscar plantillas</span><input aria-label="Buscar plantillas" value={query} onChange={e => setQuery(e.target.value)} placeholder="¿Flores, una carta, el universo…?" />{query && <button onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={16} /></button>}</label><span className="toolbar-note">Tú pones la historia. Nosotros, la magia.</span></div>
   <div className="atelier-filters" role="group" aria-label="Categorías de plantillas">{CATEGORIES.map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c === 'Todos' ? 'Ver todo' : c}</button>)}</div>
   <p className="collection-results" role="status">{filtered.length} {filtered.length === 1 ? 'diseño para tu historia' : 'diseños para tu historia'}</p>
   <div className="atelier-grid">{filtered.map((tpl, index) => <article className="atelier-card" key={tpl.id}>
    <button className="art-link" aria-label={`Personalizar ${tpl.name}`} onClick={() => onSelectTemplate(tpl.id)}><TemplateArtwork template={tpl} /><span className="art-badge">{tpl.badge}</span><span className="art-open"><ArrowUpRight size={20} /></span></button>
    <div className="card-category"><span>{tpl.category}</span><span>{String(index + 1).padStart(2, '0')}</span></div><h3><button onClick={() => onSelectTemplate(tpl.id)}>{tpl.name}</button></h3><p className="card-description">{tpl.description}</p>
    <div className="card-bottom"><span><Music2 size={13} /> Personalízalo a tu manera</span><button onClick={() => onSelectTemplate(tpl.id)}>Crear sorpresa <ArrowRight size={15} /></button></div>
   </article>)}</div>
   {!filtered.length && <div className="atelier-empty"><Search size={32} /><h3>Tu historia necesita otro nombre.</h3><p>Prueba con «flores», «carta» o explora la colección completa.</p><button className="atelier-primary" onClick={() => { setQuery(''); setCategory('Todos'); }}>Ver todos los diseños <ArrowRight size={16} /></button></div>}
  </section>
  <div className="ae-note"><strong>Antes de enviarlo</strong><p>Prueba tu sorpresa como destinatario. Tus guardados permanecen en este navegador; conserva también una copia descargada de tu regalo.</p></div><div className="atelier-end"><Heart size={20} /><p>Las cosas más bonitas empiezan con un pequeño detalle.</p><span>EL TUYO ESTÁ AQUÍ.</span></div>
 </div>;
}
