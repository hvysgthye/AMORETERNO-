import React from 'react';
import { getKeepsakeDesign } from '../../../data/keepsakeDesigns';

function Branch({ side }) {
  return <svg className={`keepsake-branch ${side}`} viewBox="0 0 140 300" fill="none" aria-hidden="true">
    <path d="M15 292C90 216 30 120 119 12" stroke="currentColor" strokeWidth="1"/>
    {[0,1,2,3,4,5].map(i=><g key={i} transform={`translate(${38+i*9} ${255-i*37}) rotate(${i%2?20:-20})`}>
      <path d="M0 0C-35-4-43-29-38-41-13-37-1-18 0 0Z" fill="currentColor" opacity=".6"/>
      <path d="M0 0C32-12 37-33 31-44 8-36-1-16 0 0Z" fill="currentColor" opacity=".4"/>
    </g>)}
  </svg>;
}

export default function TemplateStage({ templateId, children }) {
  const d = getKeepsakeDesign(templateId);
  return <section className="keepsake-stage" data-template={templateId} data-family={d.family}
    style={{'--gift-accent':d.accent,'--gift-ink':d.ink,'--gift-bg':d.background}}>
    <div className="keepsake-scenery" aria-hidden="true">
      {['botanical','stationery','jewel'].includes(d.family) && <><Branch side="left"/><Branch side="right"/></>}
    </div>
    <div className="keepsake-frame" aria-hidden="true"/>
    <div className="keepsake-content">{children}</div>
  </section>;
}
