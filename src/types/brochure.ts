export type BlockType = 'heading' | 'subheading' | 'body' | 'image' | 'qr' | 'logo' | 'icon';
export type LayoutStyle = 'flat';
export type PatternStyle = 'none' | 'dots' | 'grid' | 'lines' | 'waves' | 'custom';
export type TemplateCategory = 'brochure' | 'certificate' | 'cv' | 'brothers';

export interface PanelBackground {
    type: 'color' | 'pattern' | 'image' | 'gradient';
    value: string; // color hex, pattern id, image url, or gradient start color
    secondaryColor?: string; // for gradients
    gradientType?: 'linear' | 'radial';
    gradientShape?: 'circle' | 'linear'; // shape/direction control
    opacity?: number;
}

export interface BorderStyle {
    type: 'none' | 'solid' | 'dashed' | 'dotted';
    color: string;
    width: number;
    display?: 'full' | 'center';
    widthPercent?: number;
    opacity?: number;
}

export interface Block {
    id: string;
    type: BlockType;
    label: string;
    content?: string;
    icon?: string;
    src?: string;
    alt?: string;
    value?: string;
    placeholder?: string;
    isLink?: boolean;
    // Styling
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    fontSize?: number; // Now represents actual px size
    fontWeight?: 'normal' | 'bold' | 'black';
    iconAlign?: 'top' | 'center' | 'bottom';
    color?: string; // Custom text color
}

export interface Panel {
    id: string;
    blocks: Block[];
    background?: PanelBackground;
    borderTop?: BorderStyle;
    borderBottom?: BorderStyle;
    verticalAlign?: 'top' | 'center' | 'bottom';
}

export interface BrochureContent {
    themeColor: string;
    layout: LayoutStyle;
    globalBackground?: PanelBackground;
    front: {
        panels: Panel[];
    };
    back?: {
        panels: Panel[];
    };
}

export interface Template {
    id: string;
    name: string;
    category: TemplateCategory;
    themeColor: string;
    layout: LayoutStyle;
    content: BrochureContent;
    previewImage?: string;
}
