import { useState, useEffect, useRef } from 'react';
import { BrochureContent, Template, Block, LayoutStyle } from '../../types/brochure';
import { Panel } from './Panel';
import { cn } from '../../lib/utils';

interface BrochurePreviewProps {
    content: BrochureContent;
    template: Template;
    onSelectBlock: (side: 'front' | 'back', panelIndex: number, blockId: string) => void;
    onSelectPanel: (side: 'front' | 'back', panelIndex: number) => void;
    activeSide: 'front' | 'back';
    editingPanel: { side: 'front' | 'back', panelIndex: number } | null;
    themeColor: string;
    layout: LayoutStyle;
    isExporting?: boolean;
}

export function BrochurePreview({
    content,
    themeColor,
    layout,
    onSelectBlock,
    onSelectPanel,
    isExporting = false,
    activeSide = 'front',
    editingPanel
}: BrochurePreviewProps) {
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isExporting) return;

        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const brochureWidth = 1122; // approx width for A4 at 96dpi (297mm)
                const newScale = containerWidth / brochureWidth;
                setScale(Math.min(newScale, 1));
            }
        };

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateScale);
        };
    }, [isExporting]);

    const renderSide = (side: 'front' | 'back', id: string) => (
        <div
            id={id}
            className={cn(
                "bg-white print:m-0 print:p-0 relative overflow-hidden grid",
                content[side].panels.length === 1 ? "grid-cols-1" :
                    content[side].panels.length === 2 ? "grid-cols-2" : "grid-cols-3",
                isExporting ? "w-[297mm] h-[210mm]" : "w-[1122px] h-[794px] rounded-sm"
            )}
        >
            {content[side].panels.map((panel, idx) => (
                <Panel
                    key={panel.id}
                    panel={panel}
                    themeColor={themeColor}
                    layout={layout}
                    side={side}
                    panelIndex={idx}
                    onSelectBlock={onSelectBlock}
                    onSelectPanel={onSelectPanel}
                    isExporting={isExporting}
                    globalBackground={content.globalBackground}
                    isSelected={editingPanel?.side === side && editingPanel?.panelIndex === idx}
                />
            ))}
        </div>
    );

    if (isExporting) {
        return (
            <div className="space-y-0 print:space-y-0 flex flex-col gap-0">
                {renderSide('front', 'brochure-front')}
                {content.back && renderSide('back', 'brochure-back')}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full flex justify-center overflow-hidden">
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '1122px',
                    height: `${794 * scale}px`,
                    transition: 'transform 0.2s ease-out'
                }}
            >
                {activeSide === 'front' ? renderSide('front', 'brochure-front') : renderSide('back', 'brochure-back')}
            </div>
        </div>
    );
}
