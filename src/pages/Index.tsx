"use client";

import { useBrochureEditor } from "../hooks/useBrochureEditor";
import { EditorLayout } from "../components/Editor/EditorLayout";
import { exportToPDF, exportToPNG } from "../utils/exportUtils";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BrochurePreview } from "../components/Brochure/BrochurePreview";

const Index = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');

  const {
    activeTemplate,
    content,
    editingBlock,
    editingPanel,
    setEditingBlock,
    setEditingPanel,
    selectTemplateById,
    updateBlock,
    updateThemeColor,
    updateLayout,
    updateGlobalBackground,
    updatePanelBackground,
    updatePanelBorder,
    updatePanelAlign,
    addBlock,
    removeBlock,
    applyPanelBackgroundToAll,
    handleLogoUpload,
    resetEditor,
    templates
  } = useBrochureEditor();

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (templateId) {
      selectTemplateById(templateId);
    }
  }, [templateId, selectTemplateById]);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-700">
      <Toaster position="top-center" expand={true} richColors />

      {content && activeTemplate ? (
        <EditorLayout
          template={activeTemplate}
          content={content}
          editingBlock={editingBlock}
          editingPanel={editingPanel}
          onSelectBlock={(side, panelIndex, blockId) => setEditingBlock({ side, panelIndex, blockId })}
          onSelectPanel={(side, panelIndex) => setEditingPanel({ side, panelIndex })}
          onUpdateBlock={updateBlock}
          onUpdateTheme={updateThemeColor}
          onUpdateLayout={updateLayout}
          onUpdateGlobalBackground={updateGlobalBackground}
          onUpdatePanelBackground={updatePanelBackground}
          onUpdatePanelBorder={updatePanelBorder}
          onUpdatePanelAlign={updatePanelAlign}
          onAddBlock={addBlock}
          onRemoveBlock={removeBlock}
          onApplyPanelBackgroundToAll={applyPanelBackgroundToAll}
          onUploadLogo={handleLogoUpload}
          onCloseSidebar={() => {
            setEditingBlock(null);
            setEditingPanel(null);
          }}
          onExport={async (format) => {
            if (!activeTemplate) return;
            setIsExporting(true);

            // Give the DOM a moment to render the hidden export panels
            setTimeout(async () => {
              try {
                if (format === 'pdf') {
                  const hasBack = !!content.back;
                  await exportToPDF(activeTemplate.name, 'brochure-front', hasBack ? 'brochure-back' : undefined);
                } else {
                  const hasBack = !!content.back;
                  await exportToPNG(activeTemplate.name, 'brochure-front', hasBack ? 'brochure-back' : undefined);
                }
              } finally {
                setIsExporting(false);
              }
            }, 500);
          }}
          onReset={resetEditor}
        />
      ) : null}

      {/* Hidden container for export */}
      {isExporting && content && activeTemplate && (
        <div className="fixed top-0 left-[-10000px] z-[-1]">
          <BrochurePreview
            content={content}
            template={activeTemplate}
            themeColor={content.themeColor}
            layout={content.layout}
            onSelectBlock={() => { }}
            onSelectPanel={() => { }}
            activeSide="front"
            editingPanel={null}
            isExporting={true}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
