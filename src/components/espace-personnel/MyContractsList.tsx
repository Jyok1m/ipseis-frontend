"use client";

import { useState, useTransition } from "react";
import { ConfigProvider, Modal, notification } from "antd";
import {
	CheckCircleIcon,
	XCircleIcon,
	DocumentTextIcon,
	ArrowDownTrayIcon,
	CheckIcon,
	EyeIcon,
	NoSymbolIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { downloadContractPdf } from "@/lib/authApi";
import { rejectContractAction, signContractAction } from "@/lib/server/actions/contracts";
import { addWatermarkToPdf } from "@/lib/pdfWatermark";
import type { Contract, Pagination } from "@/lib/types";
import PdfPreviewModal from "./PdfPreviewModal";
import PaginationLinks from "./PaginationLinks";

const statusLabels: Record<string, string> = {
	sent: "En attente de signature",
	signed: "Signé",
	cancelled: "Annulé",
	rejected: "Rejeté",
};

const statusColors: Record<string, string> = {
	sent: "bg-amber-50 text-amber-700 border-amber-200",
	signed: "bg-green-50 text-green-700 border-green-200",
	cancelled: "bg-red-50 text-red-700 border-red-200",
	rejected: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR");

function getContractWatermark(contract: Contract): { text: string; color: string } | undefined {
	switch (contract.status) {
		case "signed":
			return contract.signedAt ? { text: `Signé électroniquement le ${formatDate(contract.signedAt)}`, color: "#16a34a" } : undefined;
		case "cancelled":
			return contract.cancelledAt ? { text: `Annulé le ${formatDate(contract.cancelledAt)}`, color: "#dc2626" } : undefined;
		case "rejected":
			return contract.rejectedAt ? { text: `Rejeté le ${formatDate(contract.rejectedAt)}`, color: "#dc2626" } : undefined;
		case "sent":
			return { text: "En attente de signature", color: "#d97706" };
		default:
			return undefined;
	}
}

interface MyContractsListProps {
	contracts: Contract[];
	pagination: Pagination;
	/** Chemin de la page, dépendant du rôle, pour les liens de pagination. */
	basePath: string;
}

/**
 * Liste rendue par le serveur ; ce composant ne garde que l'interactivité :
 * confirmations modales, signature/refus via server actions, et
 * téléchargement/aperçu du PDF qui exigent des Blob côté navigateur.
 *
 * Après une action, revalidatePath côté serveur renvoie la liste à jour :
 * plus de rechargement manuel via loadContracts.
 */
export default function MyContractsList({ contracts, pagination, basePath }: MyContractsListProps) {
	const [api, contextHolder] = notification.useNotification();
	const [, startTransition] = useTransition();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
	const [previewContract, setPreviewContract] = useState<Contract | null>(null);

	const notify = (type: "success" | "error", title: string, message: string) => {
		api[type]({
			message: title,
			description: message,
			icon:
				type === "success" ? (
					<CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
				) : (
					<XCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />
				),
		});
	};

	const confirmAction = (
		contract: Contract,
		{ title, content, okText, danger, action, successTitle, successMessage }: {
			title: string;
			content: string;
			okText: string;
			danger?: boolean;
			action: (id: string) => Promise<{ ok: boolean; error?: string }>;
			successTitle: string;
			successMessage: string;
		}
	) => {
		Modal.confirm({
			title,
			content,
			okText,
			cancelText: "Annuler",
			okButtonProps: danger ? { danger: true } : { style: { backgroundColor: "#263C27" } },
			onOk: async () => {
				const result = await action(contract._id);
				if (result.ok) {
					notify("success", successTitle, successMessage);
					// Rejoue le rendu serveur pour refléter la revalidation.
					startTransition(() => {});
				} else {
					notify("error", "Erreur", result.error ?? "Une erreur est survenue.");
				}
			},
		});
	};

	const handleSign = (contract: Contract) =>
		confirmAction(contract, {
			title: "Signer le contrat ?",
			content: `En signant, vous acceptez les termes du contrat "${contract.title}". Votre adresse IP et la date seront enregistrées.`,
			okText: "Accepter et signer",
			action: signContractAction,
			successTitle: "Signé",
			successMessage: "Le contrat a été signé avec succès.",
		});

	const handleReject = (contract: Contract) =>
		confirmAction(contract, {
			title: "Rejeter le contrat ?",
			content: `Vous êtes sur le point de rejeter le contrat "${contract.title}". Cette action est irréversible.`,
			okText: "Rejeter",
			danger: true,
			action: rejectContractAction,
			successTitle: "Rejeté",
			successMessage: "Le contrat a été rejeté.",
		});

	const handleDownload = async (contract: Contract) => {
		try {
			const response = await downloadContractPdf(contract._id);
			const blob: Blob = response.data;
			const watermark = getContractWatermark(contract);
			const pdfBlob = watermark ? await addWatermarkToPdf(await blob.arrayBuffer(), watermark) : blob;
			const url = window.URL.createObjectURL(pdfBlob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${contract.title}.pdf`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch {
			notify("error", "Erreur", "Impossible de télécharger le PDF.");
		}
	};

	const handlePreview = async (contract: Contract) => {
		setPreviewContract(contract);
		setPreviewBlobUrl(null);
		setPreviewLoading(true);
		setPreviewOpen(true);
		try {
			const response = await downloadContractPdf(contract._id);
			setPreviewBlobUrl(window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
		} catch {
			notify("error", "Erreur", "Impossible de charger le PDF.");
		} finally {
			setPreviewLoading(false);
		}
	};

	const closePreview = () => {
		setPreviewOpen(false);
		if (previewBlobUrl) {
			window.URL.revokeObjectURL(previewBlobUrl);
			setPreviewBlobUrl(null);
		}
	};

	return (
		<div>
			<ConfigProvider
				theme={{ token: { colorBgElevated: "#ffffff", colorTextHeading: "#1a1a1a", colorText: "#374151", fontFamily: "Halibut" } }}
			>
				{contextHolder}
			</ConfigProvider>

			<h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
				<DocumentTextIcon className="h-7 w-7 text-gray-400" />
				Mes contrats
			</h1>
			<p className="text-gray-500 mb-8">Consultez et signez vos contrats.</p>

			{contracts.length > 0 ? (
				<>
					<div className="grid grid-cols-1 gap-4">
						{contracts.map((c) => (
							<div key={c._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
								<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
											<h3 className="font-bold text-gray-900 text-lg">{c.title}</h3>
											<span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap", statusColors[c.status])}>
												{statusLabels[c.status]}
											</span>
										</div>
										{c.description && <p className="text-gray-500 text-sm mb-3">{c.description}</p>}
										<div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
											{c.linkedTraining && (
												<span>
													<span className="font-medium text-gray-700">Formation :</span> {c.linkedTraining.title}
												</span>
											)}
											{(c.startDate || c.endDate) && (
												<span>
													<span className="font-medium text-gray-700">Période :</span>{" "}
													{c.startDate && formatDate(c.startDate)}
													{c.startDate && c.endDate && " → "}
													{c.endDate && formatDate(c.endDate)}
												</span>
											)}
											{c.amount > 0 && (
												<span>
													<span className="font-medium text-gray-700">Montant :</span> {c.amount.toLocaleString("fr-FR")} €
												</span>
											)}
											{c.signedAt && (
												<span>
													<span className="font-medium text-gray-700">Signé le :</span> {formatDate(c.signedAt)}
												</span>
											)}
											{c.rejectedAt && (
												<span>
													<span className="font-medium text-gray-700">Rejeté le :</span> {formatDate(c.rejectedAt)}
												</span>
											)}
										</div>
									</div>
									<div className="flex flex-wrap items-center gap-2 flex-shrink-0">
										{c.pdfUrl && (
											<>
												<button
													onClick={() => handlePreview(c)}
													className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors"
												>
													<EyeIcon className="h-4 w-4" />
													Consulter
												</button>
												<button
													onClick={() => handleDownload(c)}
													className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors"
												>
													<ArrowDownTrayIcon className="h-4 w-4" />
													PDF
												</button>
											</>
										)}
										{c.status === "sent" && (
											<>
												<button
													onClick={() => handleReject(c)}
													className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 cursor-pointer transition-colors"
												>
													<NoSymbolIcon className="h-4 w-4" />
													Rejeter
												</button>
												<button
													onClick={() => handleSign(c)}
													className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-univers text-white text-sm font-semibold hover:bg-univers/90 cursor-pointer transition-colors"
												>
													<CheckIcon className="h-4 w-4" />
													Accepter et signer
												</button>
											</>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
					<PaginationLinks pagination={pagination} basePath={basePath} />
				</>
			) : (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
					<DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500">Aucun contrat pour le moment.</p>
				</div>
			)}

			<PdfPreviewModal
				open={previewOpen}
				onClose={closePreview}
				title={previewContract?.title ?? ""}
				pdfBlobUrl={previewBlobUrl}
				loading={previewLoading}
				watermark={previewContract ? getContractWatermark(previewContract) : undefined}
			/>
		</div>
	);
}
