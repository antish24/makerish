import { useState, useCallback } from 'react';
import { BrochureContent, Template, Block, LayoutStyle, PanelBackground, BorderStyle, BlockType } from '../types/brochure';
import { templates } from '../templates/data';

export function useBrochureEditor() {
    const [activeTemplate, setActiveTemplate] = useState<Template | null>(templates[0] || null);
    const [content, setContent] = useState<BrochureContent | null>(templates[0]?.content ? JSON.parse(JSON.stringify(templates[0].content)) : null);
    const [editingBlock, setEditingBlock] = useState<{
        side: 'front' | 'back';
        panelIndex: number;
        blockId: string;
    } | null>(null);
    const [editingPanel, setEditingPanel] = useState<{
        side: 'front' | 'back';
        panelIndex: number;
    } | null>(null);

    const selectTemplate = useCallback((template: Template | null) => {
        setActiveTemplate(template);
        setContent(template ? JSON.parse(JSON.stringify(template.content)) : null);
        setEditingBlock(null);
        setEditingPanel(null);
    }, []);

    const updateBlock = useCallback((side: 'front' | 'back', panelIndex: number, blockId: string, updates: Partial<Block>) => {
        setContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sideData = newContent[side];
            const panel = sideData.panels[panelIndex];
            const blockIndex = panel.blocks.findIndex(b => b.id === blockId);

            if (blockIndex !== -1) {
                const newBlocks = [...panel.blocks];
                newBlocks[blockIndex] = { ...newBlocks[blockIndex], ...updates } as Block;

                const newPanels = [...sideData.panels];
                newPanels[panelIndex] = { ...panel, blocks: newBlocks };

                newContent[side] = { ...sideData, panels: newPanels };
            }

            return newContent;
        });
    }, []);

    const handleLogoUpload = useCallback(async (side: 'front' | 'back', panelIndex: number, blockId: string, file: File) => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                updateBlock(side, panelIndex, blockId, { src: base64 });
                resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }, [updateBlock]);

    // Find the actual block being edited for the sidebar
    const activeEditingBlock = editingBlock && content
        ? {
            ...editingBlock,
            block: content[editingBlock.side].panels[editingBlock.panelIndex].blocks.find(b => b.id === editingBlock.blockId) as Block
        }
        : null;

    const updateThemeColor = useCallback((color: string) => {
        setContent(prev => prev ? { ...prev, themeColor: color } : null);
    }, []);

    const updateLayout = useCallback((layout: LayoutStyle) => {
        setContent(prev => prev ? { ...prev, layout } : null);
    }, []);

    const updateGlobalBackground = useCallback((updates: Partial<PanelBackground>) => {
        setContent(prev => {
            if (!prev) return null;
            const current = prev.globalBackground || { type: 'pattern', value: 'none', opacity: 1 };
            return {
                ...prev,
                globalBackground: { ...current, ...updates }
            };
        });
    }, []);

    const updatePanelBackground = useCallback((side: 'front' | 'back', panelIndex: number, updates: Partial<PanelBackground> | null) => {
        setContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sideData = { ...newContent[side] };
            const panels = [...sideData.panels];
            const panel = panels[panelIndex];

            if (updates === null) {
                panels[panelIndex] = { ...panel, background: undefined };
            } else {
                const current = panel.background || { type: 'pattern', value: 'none', opacity: 1 };
                panels[panelIndex] = { ...panel, background: { ...current, ...updates } };
            }

            sideData.panels = panels;
            newContent[side] = sideData;
            return newContent;
        });
    }, []);

    const updatePanelBorder = useCallback((side: 'front' | 'back', panelIndex: number, target: 'top' | 'bottom', updates: Partial<BorderStyle> | null) => {
        setContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sideData = { ...newContent[side] };
            const panels = [...sideData.panels];
            const panel = panels[panelIndex];

            const borderKey = target === 'top' ? 'borderTop' : 'borderBottom';

            if (updates === null) {
                panels[panelIndex] = { ...panel, [borderKey]: undefined };
            } else {
                const current = panel[borderKey] || { type: 'none', color: '#000000', width: 0 };
                panels[panelIndex] = { ...panel, [borderKey]: { ...current, ...updates } };
            }

            sideData.panels = panels;
            newContent[side] = sideData;
            return newContent;
        });
    }, []);

    const applyPanelBackgroundToAll = useCallback((side: 'front' | 'back', panelIndex: number) => {
        setContent(prev => {
            if (!prev) return null;
            const sourcePanel = prev[side].panels[panelIndex];
            const background = sourcePanel.background;
            if (!background) return prev;

            const newContent = { ...prev };
            ['front', 'back'].forEach((s) => {
                const sideName = s as 'front' | 'back';
                newContent[sideName] = {
                    ...newContent[sideName],
                    panels: newContent[sideName].panels.map(p => ({ ...p, background: { ...background } }))
                };
            });
            return newContent;
        });
    }, []);

    const updatePanelAlign = useCallback((side: 'front' | 'back', panelIndex: number, verticalAlign: 'top' | 'center' | 'bottom') => {
        setContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sideData = { ...newContent[side] };
            const panels = [...sideData.panels];
            panels[panelIndex] = { ...panels[panelIndex], verticalAlign };
            sideData.panels = panels;
            newContent[side] = sideData;
            return newContent;
        });
    }, []);

    const addBlock = useCallback((side: 'front' | 'back', panelIndex: number, type: BlockType) => {
        setContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sideData = { ...newContent[side] };
            const panels = [...sideData.panels];
            const panel = { ...panels[panelIndex] };
            const blocks = [...panel.blocks];

            const defaults: Record<BlockType, Partial<Block>> = {
                heading: { label: 'Title', content: 'New Title', fontSize: 24, fontWeight: 'bold' },
                subheading: { label: 'Subtitle', content: 'New Subtitle', fontSize: 18, fontWeight: 'bold' },
                body: { label: 'Description', content: 'New description text goes here...', fontSize: 14, fontWeight: 'normal' },
                icon: { label: 'Icon', icon: 'Star', fontSize: 32 },
                qr: { label: 'QR Code', value: 'https://', fontSize: 100 },
                logo: { label: 'Logo', src: '', alt: 'Logo', fontSize: 120 },
                image: { label: 'Image', src: '', alt: 'Image', fontSize: 200 }
            };

            const newBlock: Block = {
                id: Math.random().toString(36).substr(2, 9),
                type,
                textAlign: 'left',
                ...defaults[type]
            } as Block;

            blocks.push(newBlock);
            panel.blocks = blocks;
            panels[panelIndex] = panel;
            sideData.panels = panels;
            newContent[side] = sideData;
            return newContent;
        });
    }, []);

    const removeBlock = useCallback((side: 'front' | 'back', panelIndex: number, blockId: string) => {
        setContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sideData = { ...newContent[side] };
            const panels = [...sideData.panels];
            const panel = { ...panels[panelIndex] };
            panel.blocks = panel.blocks.filter(b => b.id !== blockId);
            panels[panelIndex] = panel;
            sideData.panels = panels;
            newContent[side] = sideData;
            return newContent;
        });
        setEditingBlock(null);
    }, []);

    return {
        activeTemplate,
        content,
        editingBlock: activeEditingBlock,
        editingPanel,
        setEditingBlock: (val: any) => {
            setEditingBlock(val);
            if (val) setEditingPanel(null);
        },
        setEditingPanel: (val: any) => {
            setEditingPanel(val);
            if (val) setEditingBlock(null);
        },
        selectTemplate,
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
        resetEditor: () => selectTemplate(templates[0] || null),
        templates
    };
}
