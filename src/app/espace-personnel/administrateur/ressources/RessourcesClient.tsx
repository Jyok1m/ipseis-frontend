"use client";

import { useState, useRef } from "react";
import { downloadResourcePdf } from "@/lib/authApi";
import { createResourceAction, deleteResourceAction, updateResourceAction } from "@/lib/server/actions/resources";
import type { ActionState } from "@/lib/server/actions/types";
import type { Pagination, Resource } from "@/lib/types";
import PaginationLinks from "@/components/espace-personnel/PaginationLinks";
import FilterSelect from "@/components/espace-personnel/admin/FilterSelect";
import { notification, ConfigProvider, Spin, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
	CheckCircleIcon,
	XCircleIcon,
	PlusIcon,
	PencilSquareIcon,
	TrashIcon,
	DocumentTextIcon,
	ArrowDownTrayIcon,
	EyeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import PdfPreviewModal from "@/components/espace-personnel/PdfPreviewModal";

type NotificationType = "success" | "error";

interface Training {
	_id: string;
	title: string;
}

const emptyResourceForm = {
	title: "",
	description: "",
	linkedTraining: "",
	targetApprenant: false,
	targetProfessionnel: false,
};

const inputBase =
	"block w-full rounded-lg px-4 py-2.5 text-gray-900 bg-white border shadow-sm placeholder:text-gray-400 text-sm font-medium transition-all duration-200";
const inputClass = inputBase + " border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20";
const selectClass = inputClass + " pr-10";
const labelClass = "text-sm font-semibold text-gray-700 mb-1 block";

const BASE_PATH = "/espace-personnel/administrateur/ressources";

interface RessourcesClientProps {
	resources: Resource[];
	pagination: Pagination;
	trainings: Training[];
	trainingFilter?: string;
}

/**
 * Liste, pagination et formations liables sont résolues côté serveur. Le
 * composant conserve le formulaire d'upload et l'aperçu PDF, qui manipulent
 * un File et un Blob côté navigateur.
 */
export default function RessourcesClient({ resources, pagination, trainings, trainingFilter }: RessourcesClientProps) {
	const [api, contextHolder] = notification.useNotification();
	const resourcesPagination = pagination;

	// Resource modal
	const [resModalOpen, setResModalOpen] = useState(false);
	const [resEditingId, setResEditingId] = useState<string | null>(null);
	const [resForm, setResForm] = useState(emptyResourceForm);
	const [resFile, setResFile] = useState<File | null>(null);
	const [resSaving, setResSaving] = useState(false);
	const resFileInputRef = useRef<HTMLInputElement>(null);

	// Resource delete
	const [resDeleteId, setResDeleteId] = useState<string | null>(null);
	const [resDeleting, setResDeleting] = useState(false);

	// PDF Preview
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
	const [previewTitle, setPreviewTitle] = useState("");

	const openNotification = (type: NotificationType, title: string, message: string) => {
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

	const run = async (action: () => Promise<ActionState>, successMessage: string, onDone?: () => void) => {
		const result = await action();
		if (result.ok) {
			openNotification("success", "Succès", result.message ?? successMessage);
			onDone?.();
		} else {
			openNotification("error", "Erreur", result.error ?? "Une erreur est survenue.");
		}
	};

	// ---- Handlers ----
	const openResCreateModal = () => {
		setResEditingId(null);
		setResForm({ ...emptyResourceForm, linkedTraining: trainings.length > 0 ? trainings[0]._id : "" });
		setResFile(null);
		if (resFileInputRef.current) resFileInputRef.current.value = "";
		setResModalOpen(true);
	};

	const openResEditModal = (resource: Resource) => {
		setResEditingId(resource._id);
		setResForm({
			title: resource.title,
			description: resource.description || "",
			linkedTraining: resource.linkedTraining?._id || "",
			targetApprenant: resource.targetRoles.includes("apprenant"),
			targetProfessionnel: resource.targetRoles.includes("professionnel"),
		});
		setResFile(null);
		if (resFileInputRef.current) resFileInputRef.current.value = "";
		setResModalOpen(true);
	};

	const handleResSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!resForm.title || !resForm.linkedTraining) {
			openNotification("error", "Erreur", "Le titre et la formation liée sont obligatoires.");
			return;
		}
		if (!resEditingId && !resFile) {
			openNotification("error", "Erreur", "Le fichier PDF est obligatoire.");
			return;
		}
		if (!resForm.targetApprenant && !resForm.targetProfessionnel) {
			openNotification("error", "Erreur", "Veuillez sélectionner au moins une cible (Apprenants ou Professionnels).");
			return;
		}

		setResSaving(true);
		try {
			const formData = new FormData();
			formData.append("title", resForm.title);
			formData.append("description", resForm.description);
			formData.append("linkedTraining", resForm.linkedTraining);
			const roles: string[] = [];
			if (resForm.targetApprenant) roles.push("apprenant");
			if (resForm.targetProfessionnel) roles.push("professionnel");
			formData.append("targetRoles", JSON.stringify(roles));
			if (resFile) formData.append("pdf", resFile);

			await run(
				() => (resEditingId ? updateResourceAction(resEditingId, formData) : createResourceAction({ ok: false }, formData)),
				resEditingId ? "Ressource modifiée avec succès." : "Ressource créée avec succès.",
				() => setResModalOpen(false)
			);
		} finally {
			setResSaving(false);
		}
	};

	const handleResDelete = async () => {
		if (!resDeleteId) return;
		setResDeleting(true);
		try {
			await run(() => deleteResourceAction(resDeleteId), "Ressource supprimée.", () => setResDeleteId(null));
		} finally {
			setResDeleting(false);
		}
	};

	const handleResDownload = async (resource: Resource) => {
		try {
			const response = await downloadResourcePdf(resource._id);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.download = resource.originalFileName || `${resource.title}.pdf`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch {
			openNotification("error", "Erreur", "Impossible de télécharger le fichier.");
		}
	};

	const handleResPreview = async (resource: Resource) => {
		setPreviewTitle(resource.title);
		setPreviewBlobUrl(null);
		setPreviewLoading(true);
		setPreviewOpen(true);
		try {
			const response = await downloadResourcePdf(resource._id);
			const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
			setPreviewBlobUrl(url);
		} catch {
			openNotification("error", "Erreur", "Impossible de charger le PDF.");
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

	const roleLabel = (roles: string[]) => {
		if (roles.includes("apprenant") && roles.includes("professionnel")) return "Tous";
		if (roles.includes("apprenant")) return "Apprenants";
		if (roles.includes("professionnel")) return "Professionnels";
		return "—";
	};

	const resourceToDelete = resDeleteId ? resources.find((r) => r._id === resDeleteId) : null;

	return (
		<div>
			<ConfigProvider
				theme={{
					token: {
						colorBgElevated: "#ffffff",
						colorTextHeading: "#1a1a1a",
						colorText: "#374151",
						fontFamily: "Halibut",
					},
					components: {
						Modal: {
							titleFontSize: 18,
							titleColor: "#1a1a1a",
							headerBg: "#ffffff",
							contentBg: "#ffffff",
						},
					},
				}}
			>
				{contextHolder}

				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
							<DocumentTextIcon className="h-7 w-7 text-gray-400" />
							Ressources PDF
						</h1>
						<p className="text-gray-500 mt-1">{resourcesPagination.total} ressource{resourcesPagination.total > 1 ? "s" : ""}</p>
					</div>
					<button
						onClick={openResCreateModal}
						disabled={trainings.length === 0}
						className="flex items-center gap-2 rounded-lg bg-univers px-5 py-3 text-white font-bold shadow-sm hover:bg-univers/90 transition-all duration-200 whitespace-nowrap"
					>
						<PlusIcon className="h-5 w-5" />
						Nouvelle ressource
					</button>
				</div>

				{/* Filter by training */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 sticky top-0 z-10">
					<FilterSelect
						paramName="trainingId"
						options={[{ value: "", label: "Toutes les formations" }, ...trainings.map((t) => ({ value: t._id, label: t.title }))]}
						className={clsx(selectClass, "sm:w-80")}
					/>
				</div>

				{/* Resources list */}
				{resources.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
						<DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">Aucune ressource pour le moment.</p>
					</div>
				) : (
					<>
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-gray-200 bg-gray-50">
											<th className="text-left px-4 py-3 font-semibold text-gray-700">Titre</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-700">Formation</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-700">Cible</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-700">Fichier</th>
											<th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
										</tr>
									</thead>
									<tbody>
										{resources.map((resource) => (
											<tr key={resource._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
												<td className="px-4 py-3">
													<p className="font-medium text-gray-900">{resource.title}</p>
													{resource.description && <p className="text-gray-500 text-xs mt-0.5 truncate max-w-xs">{resource.description}</p>}
												</td>
												<td className="px-4 py-3 text-gray-700">{resource.linkedTraining?.title || "—"}</td>
												<td className="px-4 py-3">
													<span className={clsx(
														"px-2 py-0.5 rounded-full text-xs font-semibold",
														resource.targetRoles.length === 2
															? "bg-univers/10 text-univers"
															: resource.targetRoles.includes("apprenant")
															? "bg-blue-50 text-blue-700"
															: "bg-purple-50 text-purple-700"
													)}>
														{roleLabel(resource.targetRoles)}
													</span>
												</td>
												<td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[150px]">{resource.originalFileName || "—"}</td>
												<td className="px-4 py-3">
													<div className="flex items-center justify-end gap-1">
														<button
															onClick={() => handleResPreview(resource)}
															title="Consulter"
															className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
														>
															<EyeIcon className="h-4 w-4" />
														</button>
														<button
															onClick={() => handleResDownload(resource)}
															title="Télécharger"
															className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
														>
															<ArrowDownTrayIcon className="h-4 w-4" />
														</button>
														<button
															onClick={() => openResEditModal(resource)}
															title="Modifier"
															className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
														>
															<PencilSquareIcon className="h-4 w-4" />
														</button>
														<button
															onClick={() => setResDeleteId(resource._id)}
															title="Supprimer"
															className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
														>
															<TrashIcon className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Pagination */}
						<PaginationLinks pagination={pagination} basePath={BASE_PATH} extraParams={{ trainingId: trainingFilter }} />
					</>
				)}

				{/* Create/Edit Modal */}
				<Modal
					title={resEditingId ? "Modifier la ressource" : "Nouvelle ressource"}
					open={resModalOpen}
					onCancel={() => !resSaving && setResModalOpen(false)}
					footer={null}
					width="min(560px, 95vw)"
					centered
					destroyOnClose
				>
					<form onSubmit={handleResSave} className="space-y-5 mt-4">
						<div>
							<label className={labelClass}>
								Titre<span className="text-red-400 ml-1">*</span>
							</label>
							<input
								type="text"
								value={resForm.title}
								onChange={(e) => setResForm((prev) => ({ ...prev, title: e.target.value }))}
								placeholder="Nom de la ressource"
								disabled={resSaving}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Description</label>
							<textarea
								value={resForm.description}
								onChange={(e) => setResForm((prev) => ({ ...prev, description: e.target.value }))}
								placeholder="Description optionnelle"
								disabled={resSaving}
								rows={2}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>
								Formation liée<span className="text-red-400 ml-1">*</span>
							</label>
							<select
								value={resForm.linkedTraining}
								onChange={(e) => setResForm((prev) => ({ ...prev, linkedTraining: e.target.value }))}
								disabled={resSaving}
								className={selectClass}
							>
								<option value="">Sélectionner une formation</option>
								{trainings.map((t) => (
									<option key={t._id} value={t._id}>
										{t.title}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className={labelClass}>
								Cible<span className="text-red-400 ml-1">*</span>
							</label>
							<div className="flex gap-6">
								<label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
									<input
										type="checkbox"
										checked={resForm.targetApprenant}
										onChange={(e) => setResForm((prev) => ({ ...prev, targetApprenant: e.target.checked }))}
										disabled={resSaving}
										className="rounded border-gray-300 text-univers focus:ring-univers"
									/>
									Apprenants
								</label>
								<label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
									<input
										type="checkbox"
										checked={resForm.targetProfessionnel}
										onChange={(e) => setResForm((prev) => ({ ...prev, targetProfessionnel: e.target.checked }))}
										disabled={resSaving}
										className="rounded border-gray-300 text-univers focus:ring-univers"
									/>
									Professionnels
								</label>
							</div>
						</div>
						<div>
							<label className={labelClass}>
								Fichier PDF{!resEditingId && <span className="text-red-400 ml-1">*</span>}
								{resEditingId && <span className="text-gray-400 font-normal ml-1">(laisser vide pour conserver le fichier actuel)</span>}
							</label>
							<input
								ref={resFileInputRef}
								type="file"
								accept="application/pdf"
								onChange={(e) => setResFile(e.target.files?.[0] || null)}
								disabled={resSaving}
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-univers/10 file:text-univers hover:file:bg-univers/20 transition-all"
							/>
						</div>

						<div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
							<button
								type="button"
								onClick={() => setResModalOpen(false)}
								disabled={resSaving}
								className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								Annuler
							</button>
							<button
								type="submit"
								disabled={resSaving}
								className={clsx(
									resSaving ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-univers/90",
									"px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-univers shadow-sm transition-all duration-200"
								)}
							>
								{resSaving ? (
									<Spin indicator={<LoadingOutlined spin className="text-base text-white" />} />
								) : resEditingId ? (
									"Enregistrer"
								) : (
									"Créer la ressource"
								)}
							</button>
						</div>
					</form>
				</Modal>

				{/* Delete confirmation modal */}
				<Modal
					title="Confirmer la suppression"
					open={!!resDeleteId}
					onCancel={() => !resDeleting && setResDeleteId(null)}
					footer={null}
					width="min(480px, 95vw)"
					centered
				>
					<div className="py-4">
						<p className="text-gray-700 mb-2">
							Êtes-vous sûr de vouloir supprimer la ressource :
						</p>
						<p className="font-bold text-gray-900 mb-4">
							{resourceToDelete?.title}
						</p>
						<p className="text-sm text-red-600 mb-6">
							Cette action est irréversible. Le fichier PDF sera également supprimé.
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setResDeleteId(null)}
								disabled={resDeleting}
								className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								Annuler
							</button>
							<button
								onClick={handleResDelete}
								disabled={resDeleting}
								className={clsx(
									resDeleting ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-red-700",
									"px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 shadow-sm transition-all duration-200"
								)}
							>
								{resDeleting ? <Spin indicator={<LoadingOutlined spin className="text-base text-white" />} /> : "Supprimer"}
							</button>
						</div>
					</div>
				</Modal>

				<PdfPreviewModal
					open={previewOpen}
					onClose={closePreview}
					title={previewTitle}
					pdfBlobUrl={previewBlobUrl}
					loading={previewLoading}
				/>
			</ConfigProvider>
		</div>
	);
}
