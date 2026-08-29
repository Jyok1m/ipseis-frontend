"use client";

import { useState } from "react";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { addWatermarkToPdf } from "@/lib/pdfWatermark";

interface PdfPreviewModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	pdfBlobUrl: string | null;
	loading: boolean;
	onDownload?: () => void;
	watermark?: { text: string; color: string };
}

export default function PdfPreviewModal({ open, onClose, title, pdfBlobUrl, loading, onDownload, watermark }: PdfPreviewModalProps) {
	const [printing, setPrinting] = useState(false);

	const handlePrint = async () => {
		if (!pdfBlobUrl) return;
		if (!watermark) {
			window.open(pdfBlobUrl);
			return;
		}
		setPrinting(true);
		try {
			const response = await fetch(pdfBlobUrl);
			const pdfBytes = await response.arrayBuffer();
			const blob = await addWatermarkToPdf(pdfBytes, watermark);
			const url = URL.createObjectURL(blob);
			window.open(url);
			setTimeout(() => URL.revokeObjectURL(url), 60000);
		} catch {
			window.open(pdfBlobUrl);
		} finally {
			setPrinting(false);
		}
	};

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onClose}
			width="90vw"
			centered
			destroyOnClose
			footer={
				pdfBlobUrl && !loading ? (
					<div className="flex justify-end gap-2">
						<button
							onClick={handlePrint}
							disabled={printing}
							className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{printing ? (
								<Spin indicator={<LoadingOutlined spin />} size="small" className="text-cohesion" />
							) : (
								<PrinterIcon className="h-4 w-4" />
							)}
							Imprimer
						</button>
						{onDownload && (
							<button
								onClick={onDownload}
								className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-univers text-white text-sm font-semibold hover:bg-univers/90 cursor-pointer transition-colors"
							>
								<ArrowDownTrayIcon className="h-4 w-4" />
								Télécharger
							</button>
						)}
					</div>
				) : null
			}
		>
			{loading ? (
				<div className="flex items-center justify-center h-[80vh]">
					<Spin indicator={<LoadingOutlined spin />} size="large" className="text-cohesion" />
				</div>
			) : pdfBlobUrl ? (
				<div className="relative">
					<iframe src={`${pdfBlobUrl}#toolbar=0`} className="w-full h-[80vh] border-0 rounded" />
					{watermark && (
						<div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center rounded">
							<span
								className="text-[4rem] font-bold whitespace-nowrap -rotate-[30deg] select-none"
								style={{ color: watermark.color, opacity: 0.15 }}
							>
								{watermark.text}
							</span>
						</div>
					)}
				</div>
			) : (
				<div className="flex items-center justify-center h-[80vh] text-gray-500">
					Impossible de charger le PDF.
				</div>
			)}
		</Modal>
	);
}
