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

const INITIAL_PARSED = (() => {
  try {
    return decodeDedicationFromURL();
  } catch (e) {
    return { isRecipientMode: false, templateId: 'candado', data: null };
  }
})();

export default function App() {
  const [isRecipientMode, setIsRecipientMode] = useState(INITIAL_PARSED.isRecipientMode);
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

  // Dynamic document title
  useEffect(() => {
    if (isRecipientMode && templateData?.title) {
      document.title = `${templateData.title} — Dedicatoria Digital`;
    } else {
      document.title = 'Dedicapag NextGen — Crea Dedicatorias de Amor Inolvidables';
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

  // If in Recipient Presentation Mode (opened by partner/recipient via shared link)
  if (isRecipientMode) {
    return (
      <RecipientView
        templateId={selectedTemplateId}
        data={templateData}
        onExitToEditor={() => {
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
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'catalog' ? (
          <div className="w-full overflow-y-auto">
            <Catalog onSelectTemplate={handleSelectTemplate} />
          </div>
        ) : (
          /* Split Screen: Left Side Editor / Right Side Live Preview */
          <div className="w-full flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Panel: Reactive Editor Form */}
            <div className="w-full lg:w-[420px] xl:w-[460px] h-[45vh] lg:h-full flex-shrink-0 z-10 shadow-2xl">
              <EditorWizard
                currentTemplateId={selectedTemplateId}
                data={templateData}
                onChange={setTemplateData}
                onReset={handleResetDefaults}
                onOpenShare={() => setIsShareModalOpen(true)}
              />
            </div>

            {/* Right Panel: Ultra Fluid Real-time Preview 60fps */}
            <div className="w-full flex-1 h-[55vh] lg:h-full overflow-hidden">
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
      />
    </div>
  );
}
