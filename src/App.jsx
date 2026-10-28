import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Catalog from './components/Catalog';
import EditorWizard from './components/EditorWizard';
import LivePreviewFrame from './components/LivePreviewFrame';
import ShareModal from './components/ShareModal';
import MyCreationsModal from './components/MyCreationsModal';
import RecipientView from './components/RecipientView';
import { TEMPLATES } from './data/templates';
import { generateStandaloneHTML } from './utils/htmlExporter';
import { decodeDedicationFromURL } from './utils/shareHelper';
import { fetchGift } from './utils/cloudGifts';

const INITIAL_PARSED = (() => {
  try {
    const parsed = decodeDedicationFromURL();
    if(parsed.templateId && !TEMPLATES.some(t => t.id === parsed.templateId)) return {error:'La plantilla de este enlace no está disponible.',templateId:null,isRecipientMode:false,data:null};
    return parsed;
  } catch (e) {
    return { isRecipientMode: false, templateId: 'candado', data: null };
  }
})();

export default function App() {
  const [isRecipientMode, setIsRecipientMode] = useState(INITIAL_PARSED.isRecipientMode);
  const [giftLoading, setGiftLoading] = useState(!!INITIAL_PARSED.giftId);
  const [giftError, setGiftError] = useState(INITIAL_PARSED.error || '');
  const [giftAttempt, setGiftAttempt] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreationsModalOpen, setIsCreationsModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(INITIAL_PARSED.templateId || 'candado');
  const [activeTab, setActiveTab] = useState(INITIAL_PARSED.templateId ? 'editor' : 'catalog');

  // Initialize with decoded URL data or template defaults
  const [templateData, setTemplateData] = useState(() => {
    const tpl = TEMPLATES.find(t => t.id === (INITIAL_PARSED.templateId || 'candado')) || TEMPLATES[0];
    if (INITIAL_PARSED.data) {
      return { ...tpl.defaults, ...INITIAL_PARSED.data };
    }
    return { ...tpl.defaults };
  });

  useEffect(() => {
    if(!INITIAL_PARSED.giftId) return;
    const controller = new AbortController(); let cancelled = false;
    setGiftLoading(true); setGiftError('');
    fetchGift(INITIAL_PARSED.giftId, {signal:controller.signal}).then(gift => {
      if(cancelled) return;
      const template = TEMPLATES.find(t => t.id === gift.templateId);
      if(!template) throw new Error('La plantilla de este regalo no está disponible.');
      setSelectedTemplateId(gift.templateId);
      setTemplateData({...template.defaults,...gift.data});
      setIsRecipientMode(true); setGiftLoading(false);
    }).catch(error => {if(!cancelled && error.name !== 'AbortError') {setGiftLoading(false);setGiftError(error.message);}});
    return () => {cancelled=true;controller.abort();};
  }, [giftAttempt]);

  // Dynamic document title
  useEffect(() => {
    if (isRecipientMode && templateData?.title) {
      document.title = `${templateData.title} — Dedicatoria Digital`;
    } else {
      document.title = 'Amor Eterno — Crea Dedicatorias de Amor Inolvidables';
    }
  }, [isRecipientMode, templateData?.title]);

  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id);
    const tpl = TEMPLATES.find(t => t.id === id);
    if (tpl) {
      setTemplateData({ ...tpl.defaults });
    }
    setActiveTab('editor');
  };

  const handleResetDefaults = () => {
    const tpl = TEMPLATES.find(t => t.id === selectedTemplateId);
    if (tpl) {
      setTemplateData({ ...tpl.defaults });
    }
  };

  const handleLoadSavedCreation = (tplId, savedData) => {
    setSelectedTemplateId(tplId);
    setTemplateData(savedData);
    setActiveTab('editor');
  };

  const handleExportHTML = () => {
    const htmlContent = generateStandaloneHTML(selectedTemplateId, templateData);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dedicatoria-${selectedTemplateId}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if(giftLoading || giftError) return <main className="min-h-screen flex items-center justify-center p-6 bg-[#101119] text-[#f7f0e8]">
    <div className="max-w-md text-center space-y-5">
      <h1 className="text-3xl font-serif-romance">{giftLoading ? 'Abriendo tu sorpresa…' : 'No pudimos abrir este regalo'}</h1>
      <p role={giftError ? 'alert' : 'status'} className="leading-relaxed text-slate-300">{giftError || 'Estamos recuperando la dedicatoria y sus recuerdos guardados.'}</p>
      {giftError && INITIAL_PARSED.giftId && <button onClick={() => setGiftAttempt(value => value + 1)} className="px-5 py-3 rounded-xl bg-rose-700">Volver a intentar</button>}
      {giftError && <a className="block underline" href={window.location.pathname}>Ver diseños</a>}
    </div>
  </main>;

  // If in Recipient Presentation Mode (opened by partner/recipient via shared link)
  if (isRecipientMode) {
    return (
      <RecipientView
        templateId={selectedTemplateId}
        data={templateData}
        onExitToEditor={INITIAL_PARSED.isRecipientMode || INITIAL_PARSED.giftId ? undefined : () => {
          setIsRecipientMode(false);
          setActiveTab('editor');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070914] text-slate-100">
      {/* Top Main Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExportHTML}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenCreations={() => setIsCreationsModalOpen(true)}
      />

      {/* Main Body */}
      <main id="main-content" tabIndex={-1} className={`flex-1 flex min-w-0 ${activeTab === 'editor' ? 'ae-editor-main' : ''}`}>
        {activeTab === 'catalog' ? (
          <div className="w-full overflow-y-auto">
            <Catalog onSelectTemplate={handleSelectTemplate} />
          </div>
        ) : (
          /* Split Screen: Left Side Editor / Right Side Live Preview */
          <div className="w-full flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Panel: Reactive Editor Form */}
            <div className="w-full lg:w-[420px] xl:w-[460px] ae-editor-panel flex-shrink-0 z-10 shadow-2xl">
              <EditorWizard
                currentTemplateId={selectedTemplateId}
                onExportHTML={handleExportHTML}
                data={templateData}
                onChange={setTemplateData}
                onReset={handleResetDefaults}
                onOpenShare={() => setIsShareModalOpen(true)}
              />
            </div>

            {/* Right Panel: Ultra Fluid Real-time Preview 60fps */}
            <div className="w-full flex-1 ae-preview-panel overflow-hidden">
              <LivePreviewFrame
                templateId={selectedTemplateId}
                data={templateData}
              />
            </div>
          </div>
        )}
      </main>

      {/* Share & QR Code Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        templateId={selectedTemplateId}
        data={templateData}
        onOpenRecipientMode={() => setIsRecipientMode(true)}
      />

      {/* Saved Creaciones Modal */}
      <MyCreationsModal
        isOpen={isCreationsModalOpen}
        onClose={() => setIsCreationsModalOpen(false)}
        onLoadCreation={handleLoadSavedCreation}
        onShareCreation={(id, saved) => {handleLoadSavedCreation(id, saved);setIsShareModalOpen(true);}}
      />
    </div>
  );
}
