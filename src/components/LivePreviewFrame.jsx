import TemplateStage from './templates/shared/TemplateStage';
import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import CandadoTemplate from './templates/CandadoTemplate';
import GalaxyTemplate from './templates/GalaxyTemplate';
import HuellasTemplate from './templates/HuellasTemplate';
import FloresTemplate from './templates/FloresTemplate';
import PuertasTemplate from './templates/PuertasTemplate';
import HotWheelsTemplate from './templates/HotWheelsTemplate';
import SpotifyTemplate from './templates/SpotifyTemplate';
import CartaTemplate from './templates/CartaTemplate';
import ProposeTemplate from './templates/ProposeTemplate';
import RegaloTemplate from './templates/RegaloTemplate';
import ArbolTemplate from './templates/ArbolTemplate';
import FlorAmarillaTemplate from './templates/FlorAmarillaTemplate';
import LatidosLuzTemplate from './templates/LatidosLuzTemplate';
import DynamicUniversalTemplate from './templates/DynamicUniversalTemplate';

export default function LivePreviewFrame({ templateId, data }) {
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'

  const renderTemplate = () => {
    switch (templateId) {
      case 'candado':
        return <CandadoTemplate data={data} />;
      case 'galaxy':
      case 'galaxia-infinita':
      case 'universe':
      case 'galaxy-gallery':
      case 'galaxy-gallery-flores-amarillas':
        return <GalaxyTemplate templateId={templateId} data={data} />;
      case 'lector-huellas':
        return <HuellasTemplate data={data} />;
      case 'flores-moradas':
      case 'flor-galaxy':
        return <FloresTemplate data={data} />;
      case 'flor-amarilla':
      case 'flor-amarilla-dia':
        return <FlorAmarillaTemplate data={data} />;
      case 'puertas-del-corazon':
        return <PuertasTemplate data={data} />;
      case 'hotwheels':
        return <HotWheelsTemplate data={data} />;
      case 'spotify-amor':
        return <SpotifyTemplate data={data} />;
      case 'carta':
        return <CartaTemplate data={data} />;
      case 'propose':
        return <ProposeTemplate data={data} />;
      case 'regalos-cumple':
        return <RegaloTemplate data={data} />;
      case 'arbol':
        return <ArbolTemplate data={data} />;
      case 'latidos-de-luz':
        return <LatidosLuzTemplate data={data} />;
      default:
        return <DynamicUniversalTemplate templateId={templateId} data={data} />;
    }
  };

  const getDeviceWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[400px] h-[780px] rounded-[40px] border-[10px] border-slate-800 shadow-2xl';
    if (deviceMode === 'tablet') return 'max-w-[720px] h-[820px] rounded-[30px] border-[10px] border-slate-800 shadow-2xl';
    return 'w-full h-full rounded-2xl border border-white/10';
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#070914] overflow-hidden">
      {/* Viewport Control Bar */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-white/10 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-300">
            Así recibirá tu regalo
          </span>
          <span className="hidden sm:inline text-[10px] text-slate-500">• Puedes probar el candado, tocar los botones y escuchar la música</span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg text-xs transition ${
              deviceMode === 'mobile' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista Móvil (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg text-xs transition ${
              deviceMode === 'tablet' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg text-xs transition ${
              deviceMode === 'desktop' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista Escritorio Completa"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-3 sm:p-6 bg-[#05060f]">
        <div className={`relative w-full overflow-hidden transition-all duration-300 bg-black flex flex-col shadow-2xl ${getDeviceWidth()}`}>
          {/* Mobile Speaker / Camera Notch Mock */}
          {deviceMode === 'mobile' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-50 pointer-events-none" />
          )}

          {/* Render Active Template */}
          <div className="flex-1 w-full overflow-y-auto">
            <TemplateStage key={templateId} templateId={templateId}>{renderTemplate()}</TemplateStage>
          </div>
        </div>
      </div>
    </div>
  );
}
