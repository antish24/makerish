import { QRCodeSVG } from 'qrcode.react';

interface DynamicQRCodeProps {
    value: string;
    color: string;
    size?: number;
}

export function DynamicQRCode({ value, color, size = 120 }: DynamicQRCodeProps) {
    return (
        <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-sm">
            <QRCodeSVG
                value={value}
                size={size}
                fgColor={color}
                bgColor="#FFFFFF"
                level="L"
                includeMargin={false}
            />
        </div>
    );
}
