import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template, BrochureContent, Block, LayoutStyle, PanelBackground, BorderStyle, BlockType } from '../../types/brochure';
import { BrochurePreview } from '../Brochure/BrochurePreview';
import { Sidebar } from './Sidebar';
import { Button } from '../ui/button';
import { ArrowLeft, Settings2, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface EditorLayoutProps {
    template: Template;
    content: BrochureContent;
    editingBlock: { side: 'front' | 'back', panelIndex: number, blockId: string, block: Block } | null;
    editingPanel: { side: 'front' | 'back', panelIndex: number } | null;
    onUpdateBlock: (side: 'front' | 'back', panelIndex: number, blockId: string, updates: Partial<Block>) => void;
    onSelectBlock: (side: 'front' | 'back', panelIndex: number, blockId: string) => void;
    onSelectPanel: (side: 'front' | 'back', panelIndex: number) => void;
    onUpdateTheme: (color: string) => void;
    onUpdateLayout: (layout: LayoutStyle) => void;
    onUpdateGlobalBackground: (updates: Partial<PanelBackground>) => void;
    onUpdatePanelBackground: (side: 'front' | 'back', panelIndex: number, updates: Partial<PanelBackground> | null) => void;
    onUpdatePanelBorder: (side: 'front' | 'back', panelIndex: number, target: 'top' | 'bottom', updates: Partial<BorderStyle> | null) => void;
    onApplyPanelBackgroundToAll: (side: 'front' | 'back', panelIndex: number) => void;
    onCloseSidebar: () => void;
    onUploadLogo: (side: 'front' | 'back', panelIndex: number, blockId: string, file: File) => Promise<void>;
    onUpdatePanelAlign: (side: 'front' | 'back', panelIndex: number, align: 'top' | 'center' | 'bottom') => void;
    onAddBlock: (side: 'front' | 'back', panelIndex: number, type: BlockType) => void;
    onRemoveBlock: (side: 'front' | 'back', panelIndex: number, blockId: string) => void;
    onExport: (format: 'pdf' | 'png') => void;
    onReset: () => void;
}

export function EditorLayout({
    template,
    content,
    editingBlock,
    editingPanel,
    onUpdateBlock,
    onSelectBlock,
    onSelectPanel,
    onUpdateTheme,
    onUpdateLayout,
    onUpdateGlobalBackground,
    onUpdatePanelBackground,
    onUpdatePanelBorder,
    onApplyPanelBackgroundToAll,
    onCloseSidebar,
    onUploadLogo,
    onUpdatePanelAlign,
    onAddBlock,
    onRemoveBlock,
    onExport,
    onReset
}: EditorLayoutProps) {
    const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleReset = () => {
        onReset();
        setIsResetDialogOpen(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50/50 overflow-hidden">
            {/* Header / Top Bar */}
            <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-gray-900 font-bold"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Gallery
                    </Button>
                    <div className="w-[1px] h-6 bg-gray-100 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsResetDialogOpen(true)}
                        className="text-gray-500 hover:text-red-600 font-bold transition-colors"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                </div>
                <div className="flex bg-gray-100/80 p-1.5 rounded-xl shadow-inner select-none">
                    <button
                        onClick={() => setActiveSide('front')}
                        className={cn(
                            "px-4 md:px-6 py-2 rounded-lg text-xs font-black transition-all uppercase tracking-tighter",
                            activeSide === 'front'
                                ? "bg-white shadow-sm ring-1 ring-black/5"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                        style={activeSide === 'front' ? { color: content.themeColor } : {}}
                    >
                        Front
                    </button>
                    {content.back && (
                        <button
                            onClick={() => setActiveSide('back')}
                            className={cn(
                                "px-4 md:px-6 py-2 rounded-lg text-xs font-black transition-all uppercase tracking-tighter",
                                activeSide === 'back'
                                    ? "bg-white shadow-sm ring-1 ring-black/5"
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                            style={activeSide === 'back' ? { color: content.themeColor } : {}}
                        >
                            Back
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="hidden md:flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onExport('png')}
                            className="text-gray-600 hover:text-gray-900 font-bold h-10"
                        >
                            PNG
                        </Button>
                        <Button
                            onClick={() => onExport('pdf')}
                            className="text-white shadow-lg shadow-blue-500/20 rounded-xl px-5 font-bold h-10 transition-all active:scale-95 border-0"
                            style={{ backgroundColor: content.themeColor }}
                        >
                            PDF
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={cn("h-10 w-10 rounded-xl", isSidebarOpen ? "bg-gray-100 text-blue-600" : "text-gray-400")}
                    >
                        <Settings2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc] custom-scrollbar scroll-smooth">
                    <div className="max-w-[1200px] mx-auto min-h-full flex flex-col justify-center">
                        <BrochurePreview
                            content={content}
                            template={template}
                            themeColor={content.themeColor}
                            layout={content.layout}
                            onSelectBlock={onSelectBlock}
                            onSelectPanel={onSelectPanel}
                            activeSide={activeSide}
                            editingPanel={editingPanel}
                        />
                    </div>
                </main>

                {/* Overlay for mobile - outside the sidebar container to cover the whole screen */}
                {isSidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Right Sidebar - Desktop and Mobile Drawer */}
                <div className={cn(
                    "fixed md:relative inset-y-0 right-0 z-40 transition-all duration-300 md:duration-500 transform border-l border-gray-100",
                    isSidebarOpen ? "translate-x-0 w-[85vw] md:w-80" : "translate-x-full w-0"
                )}>
                    <Sidebar
                        editingBlock={editingBlock}
                        editingPanel={editingPanel}
                        currentThemeColor={content.themeColor}
                        currentLayout={content.layout}
                        globalBackground={content.globalBackground}
                        editingPanelData={editingPanel ? content[editingPanel.side].panels[editingPanel.panelIndex] : (editingBlock ? content[editingBlock.side].panels[editingBlock.blockId ? editingBlock.panelIndex : 0] : undefined)}
                        onUpdateBlock={(updates) => {
                            if (editingBlock) {
                                onUpdateBlock(editingBlock.side, editingBlock.panelIndex, editingBlock.blockId, updates);
                            }
                        }}
                        onUpdateTheme={onUpdateTheme}
                        onUpdateLayout={onUpdateLayout}
                        onUpdateGlobalBackground={onUpdateGlobalBackground}
                        onUpdatePanelBackground={onUpdatePanelBackground}
                        onUpdatePanelBorder={onUpdatePanelBorder}
                        onUpdatePanelAlign={onUpdatePanelAlign}
                        onAddBlock={onAddBlock}
                        onRemoveBlock={onRemoveBlock}
                        onApplyPanelBackgroundToAll={onApplyPanelBackgroundToAll}
                        onUploadLogo={(file) => {
                            if (editingBlock) {
                                return onUploadLogo(editingBlock.side, editingBlock.panelIndex, editingBlock.blockId, file);
                            }
                            return Promise.resolve();
                        }}
                        onClose={() => {
                            onCloseSidebar();
                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }}
                        onExport={onExport}
                        onReset={() => setIsResetDialogOpen(true)}
                    />
                </div>
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset all changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will discard all your customizations and restore the template to its original state. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReset}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Reset Everything
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
