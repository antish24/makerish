import { useState } from 'react';
import { Block, LayoutStyle, PanelBackground, Panel, BorderStyle, BlockType } from '../../types/brochure';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { X, Palette, Layout, Search, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, Minus, Bold, Image as ImageIcon, Copy, Globe, BoxSelect, FileText, Smile, Trash2, ListPlus, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
    editingBlock: { side: 'front' | 'back', panelIndex: number, blockId: string, block: Block } | null;
    editingPanel: { side: 'front' | 'back', panelIndex: number } | null;
    currentThemeColor: string;
    currentLayout: LayoutStyle;
    globalBackground?: PanelBackground;
    editingPanelData?: Panel;
    onUpdateBlock: (updates: Partial<Block>) => void;
    onUploadLogo: (file: File) => Promise<void>;
    onUpdateTheme: (color: string) => void;
    onUpdateLayout: (layout: LayoutStyle) => void;
    onUpdateGlobalBackground: (updates: Partial<PanelBackground>) => void;
    onUpdatePanelBackground: (side: 'front' | 'back', panelIndex: number, updates: Partial<PanelBackground> | null) => void;
    onUpdatePanelBorder: (side: 'front' | 'back', panelIndex: number, target: 'top' | 'bottom', updates: Partial<BorderStyle> | null) => void;
    onApplyPanelBackgroundToAll: (side: 'front' | 'back', panelIndex: number) => void;
    onUpdatePanelAlign: (side: 'front' | 'back', panelIndex: number, align: 'top' | 'center' | 'bottom') => void;
    onAddBlock: (side: 'front' | 'back', panelIndex: number, type: BlockType) => void;
    onRemoveBlock: (side: 'front' | 'back', panelIndex: number, blockId: string) => void;
    onClose: () => void;
    onExport: (format: 'pdf' | 'png') => void;
    onReset: () => void;
}

const THEME_COLORS = [
    '#FFFFFF', // White
    '#000000', // Black
    '#3B82F6', // Blue (Brand)
    '#1E40AF', // Deep Blue
    '#D4AF37', // Gold
    '#DC2626', // Red
    '#0F172A', // Slate 900
    '#475569', // Slate 600
    '#059669', // Emerald 600
    '#F59E0B', // Amber
];

const PATTERN_OPTIONS = [
    { id: 'none', name: 'None' },
    { id: 'dots', name: 'Dots' },
    { id: 'grid', name: 'Grid' },
    { id: 'lines', name: 'Lines' },
    { id: 'waves', name: 'Waves' },
    { id: 'custom', name: 'Premium' },
    { id: 'gradient', name: 'Gradient' },
];

const BORDER_TYPES: Array<BorderStyle['type']> = ['none', 'solid', 'dashed', 'dotted'];

export function Sidebar({
    editingBlock,
    editingPanel,
    currentThemeColor,
    currentLayout,
    globalBackground,
    editingPanelData,
    onUpdateBlock,
    onUploadLogo,
    onUpdateTheme,
    onUpdateLayout,
    onUpdateGlobalBackground,
    onUpdatePanelBackground,
    onUpdatePanelBorder,
    onUpdatePanelAlign,
    onAddBlock,
    onRemoveBlock,
    onApplyPanelBackgroundToAll,
    onClose,
    onExport,
    onReset
}: SidebarProps) {
    const block = editingBlock?.block || null;

    const POPULAR_ICONS = [
        'User', 'Mail', 'Phone', 'MapPin', 'Calendar', 'Clock', 'Globe', 'Briefcase',
        'Star', 'Heart', 'Camera', 'Video', 'Music', 'Cloud', 'Settings', 'Shield',
        'Trophy', 'Lightbulb', 'Target', 'Zap', 'Smile', 'Box', 'Award', 'CheckCircle',
        'AlertCircle', 'Info', 'HelpCircle', 'MessageSquare', 'Share2', 'ExternalLink',
        'Home', 'Search', 'ShoppingBag', 'CreditCard', 'Download', 'Upload', 'Eye', 'Trash2',
        'Plus', 'Minus', 'ChevronRight', 'ChevronDown', 'Facebook', 'Twitter', 'Instagram', 'Linkedin'
    ];

    const SectionHeader = ({ icon: Icon, title, onAction, actionLabel }: { icon: any, title: string, onAction?: () => void, actionLabel?: string }) => (
        <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{title}</span>
            </div>
            {onAction && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-[9px] font-bold text-red-500 hover:text-red-700 hover:bg-transparent"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );

    const OpacityControl = ({ value, type, onChange }: { value?: number, type: 'pattern' | 'image' | 'color' | 'gradient', onChange: (val: number) => void }) => {
        const defaultVal = type === 'image' ? 0.7 : 0.05;
        const currentVal = value ?? defaultVal;

        return (
            <div className="space-y-2 mt-3">
                <div className="flex justify-between items-center px-1">
                    <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Visibility</Label>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{Math.round(currentVal * 100)}%</span>
                </div>
                <div className="flex items-center bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden h-9">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-full w-9 rounded-none text-gray-400 hover:text-red-500"
                        onClick={() => onChange(Math.max(currentVal - 0.05, 0))}
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                        type="number"
                        value={Math.round(currentVal * 100)}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                                onChange(Math.min(Math.max(val, 0), 100) / 100);
                            } else if (e.target.value === '') {
                                onChange(0);
                            }
                        }}
                        className="flex-1 h-full border-0 bg-transparent text-[11px] font-black text-center focus-visible:ring-0"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-full w-9 rounded-none text-gray-400 hover:text-blue-500"
                        onClick={() => onChange(Math.min(currentVal + 0.05, 1))}
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-80 h-full bg-white flex flex-col z-30 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: currentThemeColor }} />
                    <h2 className="font-black text-gray-900 uppercase tracking-tighter text-[13px]">Brochure Editor</h2>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full md:hidden">
                        <X className="w-4 h-4" />
                    </Button>
                    {(editingBlock || editingPanel) && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hidden md:flex hover:bg-gray-50">
                            <X className="w-4 h-4 text-gray-400" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
                {!block && !editingPanel ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        {/* Global Canvas Section */}
                        <div>
                            <SectionHeader icon={Globe} title="Canvas Design" />

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Background Pattern</Label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {PATTERN_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => {
                                                    if (opt.id === 'gradient') {
                                                        onUpdateGlobalBackground({
                                                            type: 'gradient',
                                                            value: currentThemeColor,
                                                            secondaryColor: '#FFFFFF',
                                                            gradientType: 'linear'
                                                        });
                                                    } else {
                                                        onUpdateGlobalBackground({ type: 'pattern', value: opt.id });
                                                    }
                                                }}
                                                className={cn(
                                                    "py-2 rounded-lg border text-[10px] font-bold uppercase transition-all",
                                                    (globalBackground?.type === 'gradient' && opt.id === 'gradient') ||
                                                        (globalBackground?.type === 'pattern' && globalBackground?.value === opt.id)
                                                        ? "bg-gray-900 border-gray-900 text-white shadow-md"
                                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                                                )}
                                            >
                                                {opt.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {globalBackground?.type === 'gradient' && (
                                    <div className="space-y-4 pt-1 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Gradient Colors</Label>
                                            <div className="flex gap-2 items-start">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {THEME_COLORS.map(c => (
                                                            <button
                                                                key={c}
                                                                onClick={() => onUpdateGlobalBackground({ value: c })}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-full ring-offset-1 transition-all",
                                                                    globalBackground.value === c ? "ring-2 ring-gray-900" : "ring-1 ring-gray-100"
                                                                )}
                                                                style={{ backgroundColor: c }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-1.5 items-center">
                                                        <Input
                                                            type="text"
                                                            value={globalBackground.value || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                                    onUpdateGlobalBackground({ value });
                                                                }
                                                            }}
                                                            placeholder="#1E40AF"
                                                            className="flex-1 h-7 text-[10px] font-mono uppercase"
                                                        />
                                                        <input
                                                            type="color"
                                                            value={globalBackground.value || '#000000'}
                                                            onChange={(e) => onUpdateGlobalBackground({ value: e.target.value })}
                                                            className="w-7 h-7 rounded border border-gray-200 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-px h-20 bg-gray-100 mx-1" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {THEME_COLORS.map(c => (
                                                            <button
                                                                key={c}
                                                                onClick={() => onUpdateGlobalBackground({ secondaryColor: c })}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-full ring-offset-1 transition-all",
                                                                    globalBackground.secondaryColor === c ? "ring-2 ring-gray-900" : "ring-1 ring-gray-100"
                                                                )}
                                                                style={{ backgroundColor: c }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-1.5 items-center">
                                                        <Input
                                                            type="text"
                                                            value={globalBackground.secondaryColor || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                                    onUpdateGlobalBackground({ secondaryColor: value });
                                                                }
                                                            }}
                                                            placeholder="#FFFFFF"
                                                            className="flex-1 h-7 text-[10px] font-mono uppercase"
                                                        />
                                                        <input
                                                            type="color"
                                                            value={globalBackground.secondaryColor || '#FFFFFF'}
                                                            onChange={(e) => onUpdateGlobalBackground({ secondaryColor: e.target.value })}
                                                            className="w-7 h-7 rounded border border-gray-200 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Gradient Shape</Label>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {[
                                                    { id: 'linear', name: 'Linear', type: 'linear' },
                                                    { id: 'radial', name: 'Radial', type: 'radial' }
                                                ].map(s => (
                                                    <Button
                                                        key={s.id}
                                                        variant="outline"
                                                        size="sm"
                                                        className={cn(
                                                            "h-8 text-[9px] font-black uppercase transition-all",
                                                            (globalBackground.gradientType || 'linear') === s.type ? "bg-gray-900 border-gray-900 text-white" : "text-gray-400 hover:bg-gray-50"
                                                        )}
                                                        onClick={() => onUpdateGlobalBackground({ gradientType: s.type as any })}
                                                    >
                                                        {s.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {globalBackground && (
                                    <OpacityControl
                                        type={globalBackground.type}
                                        value={globalBackground.opacity}
                                        onChange={(val) => onUpdateGlobalBackground({ opacity: val })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Brand Identity */}
                        <div>
                            <SectionHeader icon={Palette} title="Brand Identity" />
                            <div className="space-y-3">
                                <div className="grid grid-cols-4 gap-2 px-1">
                                    {THEME_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => onUpdateTheme(color)}
                                            className={cn(
                                                "w-full aspect-square rounded-full border-[3px] transition-all hover:scale-110 active:scale-95 shadow-sm",
                                                currentThemeColor === color ? "border-white ring-2 ring-gray-900" : "border-white ring-1 ring-gray-100/50"
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <div className="px-1">
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Custom Color</Label>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="text"
                                            value={currentThemeColor}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                    onUpdateTheme(value);
                                                }
                                            }}
                                            placeholder="#1E40AF"
                                            className="flex-1 h-9 text-[11px] font-mono uppercase"
                                        />
                                        <input
                                            type="color"
                                            value={currentThemeColor}
                                            onChange={(e) => onUpdateTheme(e.target.value)}
                                            className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : editingPanel ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="bg-blue-50/50 -mx-4 -mt-4 px-4 py-2 border-b border-blue-100/50 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 block mb-0.5">Selected Slide</span>
                            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[14px]">Panel {editingPanel.panelIndex + 1} ({editingPanel.side})</h3>
                        </div>

                        {/* Panel Background Section */}
                        <div>
                            <SectionHeader
                                icon={Palette}
                                title="Background Overlay"
                                onAction={(editingPanelData?.background || editingPanelData?.borderTop || editingPanelData?.borderBottom) ? () => {
                                    onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, null);
                                    onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', null);
                                    onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', null);
                                } : undefined}
                                actionLabel="Reset"
                            />

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Patterns</Label>
                                    <div className="grid grid-cols-5 gap-1">
                                        {(['none', 'dots', 'grid', 'lines', 'gradient'] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => {
                                                    if (p === 'gradient') {
                                                        onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, {
                                                            type: 'gradient',
                                                            value: currentThemeColor,
                                                            secondaryColor: '#FFFFFF',
                                                            gradientType: 'linear'
                                                        });
                                                    } else {
                                                        onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { type: 'pattern', value: p });
                                                    }
                                                }}
                                                className={cn(
                                                    "py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all",
                                                    (editingPanelData?.background?.type === 'gradient' && p === 'gradient') ||
                                                        (editingPanelData?.background?.type === 'pattern' && editingPanelData.background.value === p)
                                                        ? "bg-gray-900 border-gray-900 text-white shadow-md"
                                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-9 rounded-lg text-[10px] font-black uppercase border-gray-100 hover:bg-gray-50 shadow-sm"
                                            onClick={() => document.getElementById('panel-bg-upload-side')?.click()}
                                        >
                                            <ImageIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                            Image
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 px-3 rounded-lg text-[10px] font-black uppercase bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                            onClick={() => onApplyPanelBackgroundToAll(editingPanel.side, editingPanel.panelIndex)}
                                            title="Apply to all panels"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </Button>
                                        <input id="panel-bg-upload-side" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { type: 'image', value: ev.target?.result as string, opacity: 0.7 });
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </div>
                                </div>

                                {editingPanelData?.background && editingPanelData.background.type === 'gradient' && (
                                    <div className="space-y-4 pt-1 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Gradient Colors</Label>
                                            <div className="flex gap-2 items-start">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {THEME_COLORS.map(c => (
                                                            <button
                                                                key={c}
                                                                onClick={() => onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { value: c })}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-full ring-offset-1 transition-all",
                                                                    editingPanelData.background?.value === c ? "ring-2 ring-gray-900" : "ring-1 ring-gray-100"
                                                                )}
                                                                style={{ backgroundColor: c }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-1.5 items-center">
                                                        <Input
                                                            type="text"
                                                            value={editingPanelData.background?.value || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                                    onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { value });
                                                                }
                                                            }}
                                                            placeholder="#1E40AF"
                                                            className="flex-1 h-7 text-[10px] font-mono uppercase"
                                                        />
                                                        <input
                                                            type="color"
                                                            value={editingPanelData.background?.value || '#000000'}
                                                            onChange={(e) => onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { value: e.target.value })}
                                                            className="w-7 h-7 rounded border border-gray-200 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-px h-20 bg-gray-100 mx-1" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {THEME_COLORS.map(c => (
                                                            <button
                                                                key={c}
                                                                onClick={() => onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { secondaryColor: c })}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-full ring-offset-1 transition-all",
                                                                    editingPanelData.background?.secondaryColor === c ? "ring-2 ring-gray-900" : "ring-1 ring-gray-100"
                                                                )}
                                                                style={{ backgroundColor: c }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-1.5 items-center">
                                                        <Input
                                                            type="text"
                                                            value={editingPanelData.background?.secondaryColor || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                                    onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { secondaryColor: value });
                                                                }
                                                            }}
                                                            placeholder="#FFFFFF"
                                                            className="flex-1 h-7 text-[10px] font-mono uppercase"
                                                        />
                                                        <input
                                                            type="color"
                                                            value={editingPanelData.background?.secondaryColor || '#FFFFFF'}
                                                            onChange={(e) => onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { secondaryColor: e.target.value })}
                                                            className="w-7 h-7 rounded border border-gray-200 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Gradient Shape</Label>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {[
                                                    { id: 'linear', name: 'Linear', type: 'linear' },
                                                    { id: 'radial', name: 'Radial', type: 'radial' }
                                                ].map(s => (
                                                    <Button
                                                        key={s.id}
                                                        variant="outline"
                                                        size="sm"
                                                        className={cn(
                                                            "h-8 text-[9px] font-black uppercase transition-all",
                                                            (editingPanelData.background?.gradientType || 'linear') === s.type ? "bg-gray-900 border-gray-900 text-white" : "text-gray-400 hover:bg-gray-50"
                                                        )}
                                                        onClick={() => onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { gradientType: s.type as any })}
                                                    >
                                                        {s.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editingPanelData?.background && (
                                    <OpacityControl
                                        type={editingPanelData.background.type}
                                        value={editingPanelData.background.opacity}
                                        onChange={(val) => onUpdatePanelBackground(editingPanel.side, editingPanel.panelIndex, { opacity: val })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Alignment & Content Management */}
                        <div>
                            <SectionHeader icon={ListPlus} title="Slide Content" />
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Vertical Alignment</Label>
                                    <div className="flex bg-gray-50/50 p-1 rounded-lg border border-gray-100 gap-1">
                                        {[
                                            { id: 'top', icon: AlignVerticalJustifyStart },
                                            { id: 'center', icon: AlignVerticalJustifyCenter },
                                            { id: 'bottom', icon: AlignVerticalJustifyEnd }
                                        ].map((align) => (
                                            <Button
                                                key={align.id}
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "flex-1 h-8 rounded-md transition-all",
                                                    (editingPanelData?.verticalAlign || 'top') === align.id
                                                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                                                        : "text-gray-400 hover:text-gray-600"
                                                )}
                                                onClick={() => onUpdatePanelAlign(editingPanel.side, editingPanel.panelIndex, align.id as any)}
                                            >
                                                <align.icon className="w-4 h-4" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Add New Element</Label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {[
                                            { id: 'heading', label: 'Title', icon: Type },
                                            { id: 'subheading', label: 'Subtitle', icon: AlignLeft },
                                            { id: 'body', label: 'Description', icon: FileText },
                                            { id: 'icon', label: 'Icon', icon: Smile },
                                            { id: 'qr', label: 'QR', icon: BoxSelect },
                                            { id: 'logo', label: 'Logo', icon: ImageIcon },
                                            { id: 'image', label: 'Image', icon: ImageIcon },
                                        ].map((item) => (
                                            <Button
                                                key={item.id}
                                                variant="outline"
                                                size="sm"
                                                className="h-[52px] rounded-lg border-gray-100 flex-col py-1.5 gap-1 hover:bg-gray-50 hover:border-blue-100 group transition-all"
                                                onClick={() => onAddBlock(editingPanel.side, editingPanel.panelIndex, item.id as any)}
                                            >
                                                <item.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                                                <span className="text-[7.5px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-blue-600 leading-none">
                                                    {item.label}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Borders */}
                        <div>
                            <SectionHeader icon={BoxSelect} title="Panel Borders" />

                            <div className="space-y-6">
                                {/* Top Border */}
                                <div className="space-y-3">
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Top Border</Label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {BORDER_TYPES.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { type })}
                                                className={cn(
                                                    "py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all",
                                                    (editingPanelData?.borderTop?.type || 'none') === type
                                                        ? "bg-gray-900 border-gray-900 text-white shadow-md"
                                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {(editingPanelData?.borderTop?.type || 'none') !== 'none' && (
                                        <div className="space-y-3 pt-3 px-2.5 pb-2.5 rounded-xl bg-gray-50/50 border border-gray-100">
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[9px] font-bold uppercase text-gray-400">Mode</Label>
                                                    <div className="flex bg-white p-1 rounded-lg border border-gray-100 gap-1 shadow-sm">
                                                        {(['full', 'center'] as const).map((d) => (
                                                            <Button
                                                                key={d}
                                                                variant="ghost"
                                                                size="sm"
                                                                className={cn(
                                                                    "flex-1 h-7 rounded-md text-[9px] font-black uppercase transition-all px-0",
                                                                    (editingPanelData?.borderTop?.display || 'full') === d
                                                                        ? "bg-gray-100 text-gray-900"
                                                                        : "text-gray-400"
                                                                )}
                                                                onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { display: d })}
                                                            >
                                                                {d}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-bold uppercase text-gray-400">Weight</Label>
                                                    <Input
                                                        type="number"
                                                        value={editingPanelData?.borderTop?.width || 0}
                                                        onChange={(e) => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { width: parseInt(e.target.value) || 0 })}
                                                        className="h-9 text-[11px] rounded-lg bg-white border-gray-100 shadow-sm font-black text-center"
                                                    />
                                                </div>
                                            </div>

                                            {editingPanelData?.borderTop?.display === 'center' && (
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Inner Width %</Label>
                                                    <div className="flex items-center bg-white rounded-lg border border-gray-100 overflow-hidden h-9 shadow-sm">
                                                        <Button variant="ghost" className="h-full w-9 px-0" onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { widthPercent: Math.max((editingPanelData?.borderTop?.widthPercent || 50) - 5, 0) })}>
                                                            <Minus className="w-3 h-3 text-gray-400" />
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            value={editingPanelData?.borderTop?.widthPercent || 50}
                                                            onChange={(e) => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { widthPercent: Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100) })}
                                                            className="flex-1 h-full border-0 bg-transparent text-[10px] font-black text-center"
                                                        />
                                                        <Button variant="ghost" className="h-full w-9 px-0" onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { widthPercent: Math.min((editingPanelData?.borderTop?.widthPercent || 50) + 5, 100) })}>
                                                            <Plus className="w-3 h-3 text-gray-400" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2.5 flex-wrap pt-1">
                                                {THEME_COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { color: c })}
                                                        className={cn(
                                                            "w-5 h-5 rounded-full ring-offset-2 transition-all active:scale-90",
                                                            editingPanelData?.borderTop?.color === c ? "ring-2 ring-gray-900" : "ring-1 ring-gray-100"
                                                        )}
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>
                                            <OpacityControl
                                                type="color"
                                                value={editingPanelData?.borderTop?.opacity}
                                                onChange={(val) => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'top', { opacity: val })}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Border */}
                                <div className="space-y-3">
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Bottom Border</Label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {BORDER_TYPES.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { type })}
                                                className={cn(
                                                    "py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all",
                                                    (editingPanelData?.borderBottom?.type || 'none') === type
                                                        ? "bg-gray-900 border-gray-900 text-white shadow-md"
                                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {(editingPanelData?.borderBottom?.type || 'none') !== 'none' && (
                                        <div className="space-y-3 pt-3 px-2.5 pb-2.5 rounded-xl bg-gray-50/50 border border-gray-100">
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[9px] font-bold uppercase text-gray-400">Mode</Label>
                                                    <div className="flex bg-white p-1 rounded-lg border border-gray-100 gap-1 shadow-sm">
                                                        {(['full', 'center'] as const).map((d) => (
                                                            <Button
                                                                key={d}
                                                                variant="ghost"
                                                                size="sm"
                                                                className={cn(
                                                                    "flex-1 h-7 rounded-md text-[9px] font-black uppercase transition-all px-0",
                                                                    (editingPanelData?.borderBottom?.display || 'full') === d
                                                                        ? "bg-gray-100 text-gray-900"
                                                                        : "text-gray-400"
                                                                )}
                                                                onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { display: d })}
                                                            >
                                                                {d}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-bold uppercase text-gray-400">Weight</Label>
                                                    <Input
                                                        type="number"
                                                        value={editingPanelData?.borderBottom?.width || 0}
                                                        onChange={(e) => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { width: parseInt(e.target.value) || 0 })}
                                                        className="h-9 text-[11px] rounded-lg bg-white border-gray-100 shadow-sm font-black text-center"
                                                    />
                                                </div>
                                            </div>

                                            {editingPanelData?.borderBottom?.display === 'center' && (
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Inner Width %</Label>
                                                    <div className="flex items-center bg-white rounded-lg border border-gray-100 overflow-hidden h-9 shadow-sm">
                                                        <Button variant="ghost" className="h-full w-9 px-0" onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { widthPercent: Math.max((editingPanelData?.borderBottom?.widthPercent || 50) - 5, 0) })}>
                                                            <Minus className="w-3 h-3 text-gray-400" />
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            value={editingPanelData?.borderBottom?.widthPercent || 50}
                                                            onChange={(e) => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { widthPercent: Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100) })}
                                                            className="flex-1 h-full border-0 bg-transparent text-[10px] font-black text-center"
                                                        />
                                                        <Button variant="ghost" className="h-full w-9 px-0" onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { widthPercent: Math.min((editingPanelData?.borderBottom?.widthPercent || 50) + 5, 100) })}>
                                                            <Plus className="w-3 h-3 text-gray-400" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2.5 flex-wrap pt-1">
                                                {THEME_COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { color: c })}
                                                        className={cn(
                                                            "w-5 h-5 rounded-full ring-offset-2 transition-all active:scale-90",
                                                            editingPanelData?.borderBottom?.color === c ? "ring-2 ring-gray-900" : "ring-1 ring-gray-100"
                                                        )}
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>
                                            <OpacityControl
                                                type="color"
                                                value={editingPanelData?.borderBottom?.opacity}
                                                onChange={(val) => onUpdatePanelBorder(editingPanel.side, editingPanel.panelIndex, 'bottom', { opacity: val })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="bg-gray-50/80 -mx-4 -mt-4 px-4 py-2 border-b border-gray-100 flex items-center justify-between mb-2">
                            <div className="space-y-0.5 min-w-0">
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 block">Content Element</span>
                                <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[14px] truncate pr-2">{block?.label}</h3>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-lg p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={() => onRemoveBlock(editingBlock!.side, editingBlock!.panelIndex, editingBlock!.blockId)}
                                    title="Delete Block"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-lg p-0 text-gray-400"
                                    onClick={onClose}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Typography Section */}
                        {(block?.type === 'heading' || block?.type === 'subheading' || block?.type === 'body') && (
                            <div>
                                <SectionHeader icon={Type} title="Typography" />

                                <div className="space-y-1">
                                    <div className="flex bg-gray-50/80 p-1 rounded-xl border border-gray-100 gap-1.5 shadow-inner">
                                        {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                                            <Button
                                                key={align}
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "flex-1 h-10 rounded-lg transition-all",
                                                    (block.textAlign || 'left') === align
                                                        ? "bg-white shadow-md text-gray-900 ring-1 ring-black/5"
                                                        : "text-gray-400 hover:text-gray-600"
                                                )}
                                                onClick={() => onUpdateBlock({ textAlign: align })}
                                            >
                                                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                                                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                                                {align === 'right' && <AlignRight className="w-4 h-4" />}
                                                {align === 'justify' && <AlignJustify className="w-4 h-4" />}
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Size (px)</Label>
                                            <div className="flex items-center bg-gray-50/80 rounded-xl border border-gray-100 overflow-hidden h-10 shadow-inner">
                                                <Button variant="ghost" className="h-full w-9 px-0" onClick={() => onUpdateBlock({ fontSize: Math.max((block.fontSize || 12) - 1, 6) })}>
                                                    <Minus className="w-3 h-3 text-gray-400" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={block.fontSize || 16}
                                                    onChange={(e) => onUpdateBlock({ fontSize: parseInt(e.target.value) || 12 })}
                                                    className="flex-1 h-full border-0 bg-transparent text-[11px] font-black text-center"
                                                />
                                                <Button variant="ghost" className="h-full w-9 px-0" onClick={() => onUpdateBlock({ fontSize: Math.min((block.fontSize || 12) + 1, 100) })}>
                                                    <Plus className="w-3 h-3 text-gray-400" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Weight</Label>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-10 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm",
                                                    block.fontWeight === 'bold' ? "bg-gray-900 border-gray-900 text-white" : "bg-white text-gray-400 border-gray-100"
                                                )}
                                                onClick={() => onUpdateBlock({ fontWeight: block.fontWeight === 'bold' ? 'normal' : 'bold' })}
                                            >
                                                <Bold className="w-3.5 h-3.5 mr-2" />
                                                Bold
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Text Color</Label>
                                        <div className="space-y-2">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {THEME_COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => onUpdateBlock({ color: c })}
                                                        className={cn(
                                                            "w-6 h-6 rounded-full ring-offset-1 transition-all",
                                                            block.color === c ? "ring-2 ring-gray-900" : "ring-1 ring-gray-100"
                                                        )}
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    type="text"
                                                    value={block.color || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                            onUpdateBlock({ color: value });
                                                        }
                                                    }}
                                                    placeholder="#000000"
                                                    className="flex-1 h-9 text-[11px] font-mono uppercase"
                                                />
                                                <input
                                                    type="color"
                                                    value={block.color || '#000000'}
                                                    onChange={(e) => onUpdateBlock({ color: e.target.value })}
                                                    className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Input */}
                        <div>
                            <SectionHeader icon={FileText} title="Content" />
                            {(block?.type === 'heading' || block?.type === 'subheading' || block?.type === 'body') ? (
                                <Textarea
                                    value={block.content || ''}
                                    onChange={(e) => onUpdateBlock({ content: e.target.value })}
                                    className="min-h-[140px] rounded-xl border-gray-100 focus:ring-blue-500/10 text-[13px] bg-gray-50/30 font-medium leading-relaxed resize-none p-3"
                                    placeholder="Enter content..."
                                />
                            ) : (block?.type === 'icon' || block?.type === 'logo' || block?.type === 'image') ? (
                                <div className="space-y-3">
                                    {(block?.type === 'logo' || block?.type === 'image') && (
                                        <Button
                                            variant="outline"
                                            className="w-full h-10 rounded-xl border-gray-100 bg-white hover:bg-gray-900 hover:text-white transition-all font-black uppercase text-[10px] shadow-sm"
                                            onClick={() => document.getElementById('logo-upload-side')?.click()}
                                        >
                                            <ImageIcon className="w-4 h-4 mr-2 text-gray-400" />
                                            {block?.type === 'logo' ? 'Change Logo' : 'Change Image'}
                                        </Button>
                                    )}

                                    {block?.type === 'icon' && (
                                        <div className="grid grid-cols-6 gap-1.5 p-2 border border-gray-50 rounded-xl bg-gray-50/30 overflow-y-auto max-h-[160px] custom-scrollbar">
                                            {POPULAR_ICONS.map((iconName) => {
                                                const Icon = (LucideIcons as any)[iconName];
                                                return (
                                                    <Button
                                                        key={iconName}
                                                        variant={block.icon === iconName ? "default" : "ghost"}
                                                        className="aspect-square p-0 h-8 min-w-0"
                                                        onClick={() => onUpdateBlock({ icon: iconName })}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Input
                                    value={block?.value || ''}
                                    onChange={(e) => onUpdateBlock({ value: e.target.value })}
                                    className="rounded-lg border-gray-100 h-9 bg-gray-50/30 text-sm font-medium"
                                />
                            )}
                        </div>

                        {/* Icon Accent Section */}
                        {(block?.type === 'heading' || block?.type === 'subheading' || block?.type === 'body') && (
                            <div className="pt-2">
                                <SectionHeader
                                    icon={Smile}
                                    title="Icon Accent"
                                    onAction={!block.icon ? () => onUpdateBlock({ icon: 'HelpCircle' }) : undefined}
                                    actionLabel="Enable"
                                />

                                {block.icon ? (
                                    <div className="space-y-3">
                                        <div className="flex bg-gray-50/80 p-1 rounded-xl border border-gray-100 gap-1.5 shadow-inner">
                                            {(['top', 'center', 'bottom'] as const).map((vAlign) => (
                                                <Button
                                                    key={vAlign}
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        "flex-1 h-9 rounded-lg transition-all capitalize text-[10px] font-black tracking-tighter",
                                                        (block.iconAlign || 'top') === vAlign
                                                            ? "bg-white shadow-md text-blue-600 ring-1 ring-black/5"
                                                            : "text-gray-400 hover:text-gray-600"
                                                    )}
                                                    onClick={() => onUpdateBlock({ iconAlign: vAlign })}
                                                >
                                                    {vAlign}
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-6 gap-1.5 p-2.5 border border-blue-50/50 rounded-2xl bg-white shadow-sm overflow-y-auto max-h-[280px] custom-scrollbar">
                                            <Button
                                                variant="outline"
                                                className="aspect-square p-0 rounded-lg border-red-50 hover:bg-red-50 group h-9 min-w-0"
                                                onClick={() => onUpdateBlock({ icon: undefined })}
                                                title="Remove Icon"
                                            >
                                                <X className="w-4 h-4 text-gray-300 group-hover:text-red-500" />
                                            </Button>
                                            {POPULAR_ICONS.map((iconName) => {
                                                const Icon = (LucideIcons as any)[iconName];
                                                if (!Icon) return null;
                                                return (
                                                    <Button
                                                        key={iconName}
                                                        variant={block.icon === iconName ? "default" : "outline"}
                                                        className={cn(
                                                            "aspect-square p-0 rounded-lg transition-all h-9 min-w-0",
                                                            block.icon === iconName
                                                                ? "bg-gray-900 border-gray-900 text-white"
                                                                : "bg-white border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-gray-500"
                                                        )}
                                                        onClick={() => onUpdateBlock({ icon: iconName })}
                                                    >
                                                        <Icon className="w-4.5 h-4.5" />
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 px-4 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">
                                        Icon is hidden
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <input
                    type="file"
                    id="logo-upload-side"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            onUploadLogo(file);
                            e.target.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
}
