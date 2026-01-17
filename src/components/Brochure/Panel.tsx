import { Block, Panel as PanelType, LayoutStyle, PanelBackground, BorderStyle } from '../../types/brochure';
import { DynamicQRCode } from '../QR/DynamicQRCode';
import { cn } from '../../lib/utils';
import * as LucideIcons from 'lucide-react';

interface PanelProps {
    panel: PanelType;
    themeColor: string;
    layout: LayoutStyle;
    side: 'front' | 'back';
    panelIndex: number;
    onSelectBlock: (side: 'front' | 'back', panelIndex: number, blockId: string) => void;
    onSelectPanel: (side: 'front' | 'back', panelIndex: number) => void;
    isExporting?: boolean;
    globalBackground?: PanelBackground;
    isSelected?: boolean;
}

function BackgroundLayer({ background, themeColor, isGlobal = false }: { background?: PanelBackground, themeColor: string, isGlobal?: boolean }) {
    if (!background || background.value === 'none') return null;

    const opacity = background.opacity ?? (
        background.type === 'image'
            ? (isGlobal ? 0.35 : 0.6)
            : (isGlobal ? 0.03 : 0.05)
    );

    if (background.type === 'image') {
        return (
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                    backgroundImage: `url(${background.value})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: opacity
                }}
            />
        );
    }

    if (background.type === 'gradient') {
        const startColor = background.value;
        const endColor = background.secondaryColor || themeColor;
        const isRadial = background.gradientType === 'radial';
        const isCircle = background.gradientShape === 'circle';

        const gradientStyle = isRadial
            ? `radial-gradient(${isCircle ? 'circle' : 'ellipse'} at center, ${startColor}, ${endColor})`
            : `linear-gradient(135deg, ${startColor}, ${endColor})`;

        return (
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-700"
                style={{
                    background: gradientStyle,
                    opacity: opacity
                }}
            />
        );
    }

    if (background.type === 'pattern') {
        const color = themeColor;

        switch (background.value) {
            case 'dots':
                return (
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
                        <svg width="100%" height="100%">
                            <pattern id={`dots-${isGlobal}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.5" fill={color} />
                            </pattern>
                            <rect width="100%" height="100%" fill={`url(#dots-${isGlobal})`} />
                        </svg>
                    </div>
                );
            case 'grid':
                return (
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
                        <svg width="100%" height="100%">
                            <pattern id={`grid-${isGlobal}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill={`url(#grid-${isGlobal})`} />
                        </svg>
                    </div>
                );
            case 'lines':
                return (
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
                        <svg width="100%" height="100%">
                            <pattern id={`lines-${isGlobal}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="40" stroke={color} strokeWidth="2" />
                            </pattern>
                            <rect width="100%" height="100%" fill={`url(#lines-${isGlobal})`} />
                        </svg>
                    </div>
                );
            case 'waves':
                return (
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
                        <svg width="100%" height="100%">
                            <pattern id={`waves-${isGlobal}`} x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                                <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke={color} strokeWidth="2" />
                            </pattern>
                            <rect width="100%" height="100%" fill={`url(#waves-${isGlobal})`} />
                        </svg>
                    </div>
                );
            case 'custom': // Premium
                return (
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
                        <svg width="100%" height="100%">
                            <pattern id={`premium-${isGlobal}`} x="0" y="0" width="46" height="80" patternUnits="userSpaceOnUse">
                                <path d="M23 0L46 13.5V40.5L23 54L0 40.5V13.5L23 0Z" fill="none" stroke={color} strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill={`url(#premium-${isGlobal})`} />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    }

    return null;
}

export function Panel({
    panel,
    themeColor,
    layout,
    side,
    panelIndex,
    onSelectBlock,
    onSelectPanel,
    isExporting = false,
    globalBackground,
    isSelected
}: PanelProps) {
    const isCover = panel.blocks.some(b => b.label === 'Industry Label');

    const containerClasses = cn(
        "flex flex-col h-full bg-white relative overflow-hidden transition-all duration-300",
        !isExporting && "shadow-sm border border-gray-100/50",
        !isExporting && isSelected && "ring-2 ring-blue-500 ring-inset z-20",
        isCover && "justify-center px-4 md:px-8"
    );

    const containerStyles: React.CSSProperties = {};

    const renderBorder = (border?: BorderStyle, position: 'top' | 'bottom' = 'top') => {
        if (!border || border.type === 'none') return null;

        const actualBorder = border;

        if (!actualBorder || actualBorder.type === 'none') return null;

        const isCenter = actualBorder.display === 'center';
        const width = isCenter ? `${actualBorder.widthPercent || 50}%` : '100%';

        return (
            <div
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none",
                    position === 'top' ? "top-0" : "bottom-0"
                )}
                style={{
                    width,
                    [position === 'top' ? 'borderTop' : 'borderBottom']: `${actualBorder.width}px ${actualBorder.type} ${actualBorder.color || themeColor}`,
                    opacity: actualBorder.opacity ?? 1
                }}
            />
        );
    };

    return (
        <div
            className={containerClasses}
            style={containerStyles}
            onClick={(e) => {
                if (!isExporting && e.target === e.currentTarget) {
                    onSelectPanel(side, panelIndex);
                }
            }}
        >
            {/* Custom Borders */}
            {renderBorder(panel.borderTop, 'top')}
            {renderBorder(panel.borderBottom, 'bottom')}
            {/* Global Background Layer - Hidden if panel has its own background */}
            {(!panel.background || panel.background.value === 'none') && (
                <BackgroundLayer background={globalBackground} themeColor={themeColor} isGlobal={true} />
            )}

            {/* Panel Specific Background Layer */}
            <BackgroundLayer background={panel.background} themeColor={themeColor} />

            <div className={cn(
                "flex-1 flex flex-col relative z-10 p-10 md:p-14 md:gap-6 gap-4",
                isCover
                    ? "items-center justify-center text-center"
                    : panel.verticalAlign === 'center'
                        ? "justify-center"
                        : panel.verticalAlign === 'bottom'
                            ? "justify-end"
                            : "justify-start"
            )}
                onClick={(e) => {
                    // Also trigger panel selection when clicking on the padding areas
                    if (!isExporting && e.target === e.currentTarget) {
                        onSelectPanel(side, panelIndex);
                    }
                }}
            >
                {panel.blocks.map((block) => (
                    <div
                        key={block.id}
                        onClick={(e) => {
                            if (!isExporting) {
                                e.stopPropagation();
                                onSelectBlock(side, panelIndex, block.id);
                            }
                        }}
                        className={cn(
                            "group relative rounded-2xl transition-all duration-300",
                            !isExporting && "hover:bg-black/5 cursor-pointer p-2 -m-2 ring-1 ring-transparent hover:ring-black/10"
                        )}
                    >
                        {renderBlock(block, themeColor, layout)}

                        {!isExporting && (
                            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                <span className="text-[8px] uppercase font-black tracking-widest px-2 py-1 rounded-lg bg-gray-900 text-white shadow-xl">
                                    {block.label}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderBlock(block: Block, themeColor: string, layout: LayoutStyle) {
    const isCentered = block.textAlign === 'center';

    const IconComponent = (name?: string, customSize?: number) => {
        if (!name) return null;
        const Icon = (LucideIcons as any)[name];
        if (!Icon) return null;
        const defaultSize = "w-5 h-5";
        return <Icon className={customSize ? "" : defaultSize} style={{ color: themeColor, fontSize: customSize ? `${customSize}px` : undefined }} strokeWidth={1.5} />;
    };

    const textStyle: React.CSSProperties = {
        textAlign: block.textAlign as any || 'left',
        fontWeight: block.fontWeight === 'bold' ? 700 : block.fontWeight === 'black' ? 900 : 400,
        fontSize: block.fontSize ? `${block.fontSize}px` : undefined,
        lineHeight: 1.2,
        color: block.color || undefined
    };

    switch (block.type) {
        case 'heading':
            return (
                <div style={{ textAlign: textStyle.textAlign }} className="w-full">
                    {block.icon && (
                        <div className={cn("mb-2 flex", isCentered ? "justify-center" : "justify-start")}>
                            {IconComponent(block.icon)}
                        </div>
                    )}
                    <h1 className="tracking-tighter text-gray-950 break-words uppercase" style={textStyle}>
                        {block.content}
                    </h1>
                </div>
            );

        case 'subheading':
            return (
                <div
                    style={{ textAlign: textStyle.textAlign }}
                    className={cn(
                        "w-full flex gap-3",
                        isCentered
                            ? "flex-col items-center gap-1.5"
                            : cn(
                                "flex-row",
                                block.iconAlign === 'center' ? "items-center" : block.iconAlign === 'bottom' ? "items-end" : "items-start"
                            )
                    )}
                >
                    {block.icon && <div className={cn(!isCentered && (!block.iconAlign || block.iconAlign === 'top') ? "mt-1" : "")}>{IconComponent(block.icon)}</div>}
                    <h3 className="tracking-tight leading-tight text-gray-800" style={{ ...textStyle, color: themeColor }}>
                        {block.content}
                    </h3>
                </div>
            );

        case 'body':
            return (
                <div
                    style={{ textAlign: textStyle.textAlign }}
                    className={cn(
                        "w-full flex gap-3",
                        isCentered
                            ? "flex-col items-center gap-2"
                            : cn(
                                "flex-row",
                                block.iconAlign === 'center' ? "items-center" : block.iconAlign === 'bottom' ? "items-end" : "items-start"
                            )
                    )}
                >
                    {block.icon && <div className={cn(!isCentered && (!block.iconAlign || block.iconAlign === 'top') ? "mt-0.5" : "")}>{IconComponent(block.icon)}</div>}
                    <div className="text-gray-600/90 whitespace-pre-wrap break-words font-medium leading-relaxed flex-1" style={textStyle}>
                        {block.content?.split('\n').map((line, i) => {
                            const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
                            if (isListItem) {
                                return (
                                    <div key={i} className={cn("flex gap-2 mt-1 first:mt-0", isCentered && "justify-center")}>
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColor }} />
                                        <span>{line.trim().substring(2)}</span>
                                    </div>
                                );
                            }
                            return <div key={i}>{line}</div>;
                        })}
                    </div>
                </div>
            );

        case 'icon':
            return (
                <div className={cn("flex py-2", isCentered ? "justify-center" : "justify-start")} style={{ textAlign: textStyle.textAlign }}>
                    {IconComponent(block.icon, block.fontSize)}
                </div>
            );

        case 'logo':
            return (
                <div className="flex mb-3 md:mb-4 justify-center">
                    {block.src ? (
                        <img src={block.src} alt={block.alt} className="max-h-20 md:max-h-28 w-auto object-contain" />
                    ) : (
                        <div
                            className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-2 border-dashed rounded-3xl"
                            style={{ borderColor: `${themeColor}22`, backgroundColor: `${themeColor}05` }}
                        >
                            <LucideIcons.CloudUpload className="w-8 h-8 opacity-10" style={{ color: themeColor }} />
                        </div>
                    )}
                </div>
            );

        case 'qr':
            return (
                <div className="flex justify-center p-2 md:p-4 w-full">
                    <div className="p-2 md:p-3 bg-white shadow-xl border border-gray-100">
                        <DynamicQRCode value={block.value} color={themeColor} size={block.fontSize || 120} />
                    </div>
                </div>
            );

        case 'image':
            return (
                <div className="w-full bg-gray-100 overflow-hidden border border-gray-100 shadow-lg relative aspect-[16/9]">
                    {block.src ? (
                        <img src={block.src} alt={block.alt} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <LucideIcons.Image className="w-12 h-12" />
                        </div>
                    )}
                </div>
            );

        default:
            return null;
    }
}

