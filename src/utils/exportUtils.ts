import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export const exportToPDF = async (fileName: string, frontId: string, backId: string) => {
    const frontElement = document.getElementById(frontId);
    const backElement = document.getElementById(backId);

    if (!frontElement || !backElement) {
        toast.error('Could not find brochure elements for export');
        return;
    }

    try {
        toast.info('Preparing PDF export...');

        const scale = 2; // Higher scale for better quality

        // Front Side
        const frontCanvas = await html2canvas(frontElement, { scale, useCORS: true, logging: false });
        const frontImgData = frontCanvas.toDataURL('image/png');

        // Back Side
        const backCanvas = await html2canvas(backElement, { scale, useCORS: true, logging: false });
        const backImgData = backCanvas.toDataURL('image/png');

        // Create PDF (A4 is 297x210mm in landscape)
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Page 1: Front
        pdf.addImage(frontImgData, 'PNG', 0, 0, 297, 210);

        // Page 2: Back
        pdf.addPage();
        pdf.addImage(backImgData, 'PNG', 0, 0, 297, 210);

        pdf.save(`${fileName}.pdf`);
        toast.success('Brochure PDF exported successfully!');
    } catch (error) {
        console.error('PDF export failed:', error);
        toast.error('Failed to export PDF');
    }
};

export const exportToPNG = async (fileName: string, frontId: string, backId: string) => {
    const frontElement = document.getElementById(frontId);
    const backElement = document.getElementById(backId);

    if (!frontElement || !backElement) {
        toast.error('Could not find brochure elements for export');
        return;
    }

    try {
        toast.info('Preparing PNG export...');

        const scale = 3; // High resolution for print

        // Front Side
        const frontCanvas = await html2canvas(frontElement, { scale, useCORS: true, logging: false });
        const frontLink = document.createElement('a');
        frontLink.download = `${fileName}-front.png`;
        frontLink.href = frontCanvas.toDataURL('image/png');
        frontLink.click();

        // Back Side
        const backCanvas = await html2canvas(backElement, { scale, useCORS: true, logging: false });
        const backLink = document.createElement('a');
        backLink.download = `${fileName}-back.png`;
        backLink.href = backCanvas.toDataURL('image/png');
        backLink.click();

        toast.success('Brochure PNGs exported successfully!');
    } catch (error) {
        console.error('PNG export failed:', error);
        toast.error('Failed to export PNG');
    }
};
