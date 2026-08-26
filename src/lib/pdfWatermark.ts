import { degrees, PDFDocument, rgb } from "pdf-lib";

function hexToRgb(hex: string) {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	return rgb(r, g, b);
}

/**
 * Applique un filigrane et renvoie directement un Blob PDF : les deux appelants
 * ne faisaient rien d'autre des octets, et cela évite de propager le
 * Uint8Array<ArrayBufferLike> de pdf-lib, que BlobPart refuse.
 */
export async function addWatermarkToPdf(pdfBytes: ArrayBuffer, watermark: { text: string; color: string }): Promise<Blob> {
	const pdfDoc = await PDFDocument.load(pdfBytes);
	const pages = pdfDoc.getPages();
	const color = hexToRgb(watermark.color);

	for (const page of pages) {
		const { width, height } = page.getSize();
		const fontSize = Math.min(width, height) * 0.07;
		const textWidth = watermark.text.length * fontSize * 0.45;
		const centerX = width / 2;
		const centerY = height / 2;
		const angle = (-30 * Math.PI) / 180;

		page.drawText(watermark.text, {
			x: centerX - (textWidth / 2) * Math.cos(angle),
			y: centerY + (textWidth / 2) * Math.sin(angle),
			size: fontSize,
			color,
			opacity: 0.15,
			rotate: degrees(-30),
		});
	}

	const bytes = await pdfDoc.save();

	// pdf-lib alloue toujours un Uint8Array adossé à un ArrayBuffer simple,
	// jamais à un SharedArrayBuffer : le cast est sûr et cantonné ici.
	return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}
