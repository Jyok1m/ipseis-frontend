"use client";

import { useState, useEffect, useCallback } from "react";
import {
	getAdminTrainings,
	getAdminThemes,
	createTraining,
	updateTraining,
	deleteTraining,
	toggleTrainingVisibility,
} from "@/lib/authApi";
import { notification, ConfigProvider, Spin, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
	CheckCircleIcon,
	XCircleIcon,
	PlusIcon,
	PencilSquareIcon,
	TrashIcon,
	AcademicCapIcon,
	XMarkIcon,
	EyeIcon,
	EyeSlashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

type NotificationType = "success" | "error";

interface Theme {
	_id: string;
	title: string;
	type: string;
}

interface Training {
	_id: string;
	title: string;
	introduction?: string;
	pedagogical_objectives: string[];
	program: string[];
	pedagogical_methods: string[];
	audience: string;
	prerequisites: string;
	evaluation_methods: string[];
	trainer: string;
	number_of_trainees: string;
	duration: string;
	quote: string;
	accessibility?: string;
	isVisible: boolean;
	themeId: string;
	themeName: string;
}

const emptyForm = {
	themeId: "",
	title: "",
	introduction: "",
	pedagogical_objectives: [""],
	program: [""],
	pedagogical_methods: [""],
	audience: "",
	prerequisites: "",
	evaluation_methods: [""],
	trainer: "",
	number_of_trainees: "",
	duration: "",
	quote: "",
	accessibility: "",
};

// Input styling constants
const inputBase =
	"block w-full rounded-lg px-4 py-2.5 text-gray-900 bg-white border shadow-sm placeholder:text-gray-400 text-sm font-medium transition-all duration-200";
const inputClass = inputBase + " border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20";
const inputErrorClass = inputBase + " border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200";
const selectClass = inputClass + " pr-10";
const selectErrorClass = inputErrorClass + " pr-10";
const labelClass = "text-sm font-semibold text-gray-700 mb-1 block";

function ArrayField({
	label,
	values,
	onChange,
	placeholder,
	disabled,
}: {
	label: string;
	values: string[];
	onChange: (values: string[]) => void;
	placeholder: string;
	disabled: boolean;
}) {
	const updateItem = (index: number, value: string) => {
		const updated = [...values];
		updated[index] = value;
		onChange(updated);
	};

	const addItem = () => onChange([...values, ""]);

	const removeItem = (index: number) => {
		if (values.length <= 1) return;
		onChange(values.filter((_, i) => i !== index));
	};

	return (
		<div>
			<label className={labelClass}>
				{label} <span className="text-gray-400 font-normal">({values.filter((v) => v.trim()).length})</span>
			</label>
			<div className="space-y-2">
				{values.map((value, index) => (
					<div key={index} className="flex gap-2">
						<input
							type="text"
							value={value}
							onChange={(e) => updateItem(index, e.target.value)}
							placeholder={placeholder}
							disabled={disabled}
							className={inputClass}
						/>
						{values.length > 1 && (
							<button
								type="button"
								onClick={() => removeItem(index)}
								disabled={disabled}
								className="px-2 text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
							>
								<XMarkIcon className="h-5 w-5" />
							</button>
						)}
					</div>
				))}
				<button
					type="button"
					onClick={addItem}
					disabled={disabled}
					className="text-sm text-gray-500 hover:text-gray-700 hover:underline font-medium flex items-center gap-1"
				>
					<PlusIcon className="h-4 w-4" /> Ajouter
				</button>
			</div>
		</div>
	);
}

export default function FormationsPage() {
	const [api, contextHolder] = notification.useNotification();

	const [trainings, setTrainings] = useState<Training[]>([]);
	const [themes, setThemes] = useState<Theme[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);
	const [formErrors, setFormErrors] = useState<Set<string>>(new Set());

	// Delete confirmation
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	// Search / filter
	const [search, setSearch] = useState("");
	const [themeFilter, setThemeFilter] = useState("");
	const [showHidden, setShowHidden] = useState(true);

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

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [trainingsRes, themesRes] = await Promise.all([getAdminTrainings(), getAdminThemes()]);
			setTrainings(trainingsRes.data.trainings);
			setThemes(themesRes.data.themes);
		} catch {
			openNotification("error", "Erreur", "Impossible de charger les données.");
		} finally {
			setLoading(false);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const openCreateModal = () => {
		setEditingId(null);
		setForm({ ...emptyForm, themeId: themes.length > 0 ? themes[0]._id : "" });
		setFormErrors(new Set());
		setModalOpen(true);
	};

	const openEditModal = (training: Training) => {
		setEditingId(training._id);
		setFormErrors(new Set());
		setForm({
			themeId: training.themeId || "",
			title: training.title,
			introduction: training.introduction || "",
			pedagogical_objectives: training.pedagogical_objectives.length > 0 ? [...training.pedagogical_objectives] : [""],
			program: training.program.length > 0 ? [...training.program] : [""],
			pedagogical_methods: training.pedagogical_methods.length > 0 ? [...training.pedagogical_methods] : [""],
			audience: training.audience,
			prerequisites: training.prerequisites,
			evaluation_methods: training.evaluation_methods.length > 0 ? [...training.evaluation_methods] : [""],
			trainer: training.trainer,
			number_of_trainees: training.number_of_trainees,
			duration: training.duration,
			quote: training.quote,
			accessibility: training.accessibility || "",
		});
		setModalOpen(true);
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		const requiredFields = ["themeId", "title", "audience", "prerequisites", "trainer", "number_of_trainees", "duration", "quote"] as const;
		const errors = new Set<string>();
		for (const field of requiredFields) {
			if (!form[field]) errors.add(field);
		}
		if (errors.size > 0) {
			setFormErrors(errors);
			openNotification("error", "Erreur", "Veuillez remplir tous les champs obligatoires.");
			return;
		}
		setFormErrors(new Set());

		setSaving(true);
		try {
			const payload = {
				...form,
				pedagogical_objectives: form.pedagogical_objectives.filter((v) => v.trim()),
				program: form.program.filter((v) => v.trim()),
				pedagogical_methods: form.pedagogical_methods.filter((v) => v.trim()),
				evaluation_methods: form.evaluation_methods.filter((v) => v.trim()),
			};

			if (editingId) {
				await updateTraining(editingId, payload);
				openNotification("success", "Succès", "Formation modifiée avec succès.");
			} else {
				await createTraining(payload);
				openNotification("success", "Succès", "Formation créée avec succès.");
			}

			setModalOpen(false);
			await loadData();
		} catch (error: any) {
			openNotification("error", "Erreur", error.response?.data?.error || "Erreur lors de la sauvegarde.");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		setDeleting(true);
		try {
			await deleteTraining(deleteId);
			openNotification("success", "Succès", "Formation supprimée.");
			setDeleteId(null);
			await loadData();
		} catch (error: any) {
			openNotification("error", "Erreur", error.response?.data?.error || "Erreur lors de la suppression.");
		} finally {
			setDeleting(false);
		}
	};

	const handleToggleVisibility = async (training: Training) => {
		try {
			const newValue = training.isVisible === false ? true : false;
			await toggleTrainingVisibility(training._id, newValue);
			openNotification("success", "Succès", `Formation ${newValue ? "visible" : "masquée"}.`);
			await loadData();
		} catch (error: any) {
			openNotification("error", "Erreur", error.response?.data?.error || "Erreur lors de la mise à jour.");
		}
	};

	const filteredTrainings = trainings.filter((t) => {
		const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.trainer.toLowerCase().includes(search.toLowerCase());
		const matchTheme = !themeFilter || (themeFilter === "none" ? !t.themeId : t.themeId === themeFilter);
		const matchVisibility = showHidden || t.isVisible !== false;
		return matchSearch && matchTheme && matchVisibility;
	});

	const trainingToDelete = deleteId ? trainings.find((t) => t._id === deleteId) : null;

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
							<AcademicCapIcon className="h-7 w-7 text-gray-400" />
							Gestion des formations
						</h1>
						<p className="text-gray-500 mt-1">{trainings.length} formation{trainings.length > 1 ? "s" : ""} au catalogue</p>
					</div>
					<button
						onClick={openCreateModal}
						disabled={loading || themes.length === 0}
						className="flex items-center gap-2 rounded-lg bg-univers px-5 py-3 text-white font-bold shadow-sm hover:bg-univers/90 transition-all duration-200 whitespace-nowrap"
					>
						<PlusIcon className="h-5 w-5" />
						Ajouter une formation
					</button>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center sticky top-0 z-10">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Rechercher par titre ou formateur..."
						className={clsx(inputClass, "flex-1")}
					/>
					<select
						value={themeFilter}
						onChange={(e) => setThemeFilter(e.target.value)}
						className={clsx(selectClass, "sm:w-64")}
					>
						<option value="">Tous les thèmes</option>
						<option value="none">Sans thème</option>
						{themes.map((theme) => (
							<option key={theme._id} value={theme._id}>
								{theme.title}
							</option>
						))}
					</select>
					<label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap cursor-pointer">
						<input
							type="checkbox"
							checked={showHidden}
							onChange={(e) => setShowHidden(e.target.checked)}
							className="rounded border-gray-300 text-univers focus:ring-univers"
						/>
						Afficher les masquées
					</label>
				</div>

				{/* List */}
				{loading ? (
					<div className="flex justify-center py-16">
						<Spin indicator={<LoadingOutlined spin />} size="large" className="text-cohesion" />
					</div>
				) : filteredTrainings.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
						<AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">{trainings.length === 0 ? "Aucune formation au catalogue." : "Aucune formation ne correspond à votre recherche."}</p>
					</div>
				) : (
					<div className="space-y-3">
						{filteredTrainings.map((training) => {
							const isHidden = training.isVisible === false;
							return (
								<div
									key={training._id}
									className={clsx(
										"bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4",
										isHidden ? "opacity-50 border-2 border-dashed border-gray-300" : "border border-gray-200"
									)}
								>
									<div className="flex-1 min-w-0">
										<h3 className="font-bold text-gray-900 truncate">{training.title}</h3>
										<div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
											<span className="inline-flex items-center gap-1">
												<span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", training.themeId ? "bg-gray-100 text-gray-700" : "bg-amber-100 text-amber-700")}>{training.themeName}</span>
											</span>
											<span>Formateur : {training.trainer}</span>
											<span>Durée : {training.duration}</span>
											<span>{training.number_of_trainees} stagiaires</span>
											{isHidden && (
												<span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">Masquée</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<button
											onClick={() => handleToggleVisibility(training)}
											title={isHidden ? "Rendre visible" : "Masquer"}
											className={clsx(
												"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
												isHidden ? "text-amber-600 bg-amber-50 hover:bg-amber-100" : "text-gray-500 bg-gray-50 hover:bg-gray-100"
											)}
										>
											{isHidden ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
										</button>
										<button
											onClick={() => openEditModal(training)}
											className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
										>
											<PencilSquareIcon className="h-4 w-4" />
											Modifier
										</button>
										<button
											onClick={() => setDeleteId(training._id)}
											className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
										>
											<TrashIcon className="h-4 w-4" />
											Supprimer
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Training Create/Edit Modal */}
				<Modal
					title={editingId ? "Modifier la formation" : "Nouvelle formation"}
					open={modalOpen}
					onCancel={() => !saving && setModalOpen(false)}
					footer={null}
					width="min(720px, 95vw)"
					centered
					destroyOnClose
				>
					<form onSubmit={handleSave} className="space-y-5 mt-4 max-h-[70vh] overflow-y-auto pr-2">
						{/* Thème + Titre */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className={labelClass}>
									Thème<span className="text-red-400 ml-1">*</span>
								</label>
								<select
									value={form.themeId}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, themeId: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("themeId"); return next; });
									}}
									disabled={saving}
									className={formErrors.has("themeId") ? selectErrorClass : selectClass}
								>
									<option value="">Sélectionner un thème</option>
									{themes.map((theme) => (
										<option key={theme._id} value={theme._id}>
											{theme.title}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className={labelClass}>
									Titre<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={form.title}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, title: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("title"); return next; });
									}}
									placeholder="Titre de la formation"
									disabled={saving}
									className={formErrors.has("title") ? inputErrorClass : inputClass}
								/>
							</div>
						</div>

						{/* Introduction */}
						<div>
							<label className={labelClass}>Introduction</label>
							<textarea
								value={form.introduction}
								onChange={(e) => setForm((prev) => ({ ...prev, introduction: e.target.value }))}
								placeholder="Texte d'introduction affiché en tête de la fiche formation"
								disabled={saving}
								rows={3}
								className={inputClass}
							/>
						</div>

						{/* Champs texte simples */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className={labelClass}>
									Public visé<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={form.audience}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, audience: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("audience"); return next; });
									}}
									placeholder="ex. Infirmiers, aides-soignants"
									disabled={saving}
									className={formErrors.has("audience") ? inputErrorClass : inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>
									Prérequis<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={form.prerequisites}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, prerequisites: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("prerequisites"); return next; });
									}}
									placeholder="ex. Aucun prérequis"
									disabled={saving}
									className={formErrors.has("prerequisites") ? inputErrorClass : inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>
									Formateur<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={form.trainer}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, trainer: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("trainer"); return next; });
									}}
									placeholder="Nom du formateur"
									disabled={saving}
									className={formErrors.has("trainer") ? inputErrorClass : inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>
									Nombre de stagiaires<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={form.number_of_trainees}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, number_of_trainees: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("number_of_trainees"); return next; });
									}}
									placeholder="ex. 6 à 12"
									disabled={saving}
									className={formErrors.has("number_of_trainees") ? inputErrorClass : inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>
									Durée<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={form.duration}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, duration: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("duration"); return next; });
									}}
									placeholder="ex. 2 jours (14h)"
									disabled={saving}
									className={formErrors.has("duration") ? inputErrorClass : inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>
									Tarif<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={form.quote}
									onChange={(e) => {
										setForm((prev) => ({ ...prev, quote: e.target.value }));
										setFormErrors((prev) => { const next = new Set(prev); next.delete("quote"); return next; });
									}}
									placeholder="ex. Sur devis"
									disabled={saving}
									className={formErrors.has("quote") ? inputErrorClass : inputClass}
								/>
							</div>
						</div>

						{/* Champs tableaux */}
						<ArrayField
							label="Objectifs pédagogiques"
							values={form.pedagogical_objectives}
							onChange={(values) => setForm((prev) => ({ ...prev, pedagogical_objectives: values }))}
							placeholder="Objectif pédagogique"
							disabled={saving}
						/>
						<ArrayField
							label="Programme"
							values={form.program}
							onChange={(values) => setForm((prev) => ({ ...prev, program: values }))}
							placeholder="Élément du programme"
							disabled={saving}
						/>
						<ArrayField
							label="Méthodes pédagogiques"
							values={form.pedagogical_methods}
							onChange={(values) => setForm((prev) => ({ ...prev, pedagogical_methods: values }))}
							placeholder="Méthode pédagogique"
							disabled={saving}
						/>
						<ArrayField
							label="Méthodes d'évaluation"
							values={form.evaluation_methods}
							onChange={(values) => setForm((prev) => ({ ...prev, evaluation_methods: values }))}
							placeholder="Méthode d'évaluation"
							disabled={saving}
						/>

						{/* Accessibilité Handicap */}
						<div>
							<label className={labelClass}>Accessibilité Handicap</label>
							<textarea
								value={form.accessibility}
								onChange={(e) => setForm((prev) => ({ ...prev, accessibility: e.target.value }))}
								placeholder="Laisser vide pour utiliser la mention standard d'accessibilité."
								disabled={saving}
								rows={3}
								className={inputClass}
							/>
							<p className="mt-1 text-xs text-gray-400">Si ce champ est vide, la mention standard d&apos;accessibilité est affichée automatiquement.</p>
						</div>

						{/* Submit */}
						<div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white py-3">
							<button
								type="button"
								onClick={() => setModalOpen(false)}
								disabled={saving}
								className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								Annuler
							</button>
							<button
								type="submit"
								disabled={saving}
								className={clsx(
									saving ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-univers/90",
									"px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-univers shadow-sm transition-all duration-200"
								)}
							>
								{saving ? (
									<Spin indicator={<LoadingOutlined spin />} size="small" className="text-white" />
								) : editingId ? (
									"Enregistrer"
								) : (
									"Créer la formation"
								)}
							</button>
						</div>
					</form>
				</Modal>

				{/* Delete confirmation modal */}
				<Modal
					title="Confirmer la suppression"
					open={!!deleteId}
					onCancel={() => !deleting && setDeleteId(null)}
					footer={null}
					width="min(480px, 95vw)"
					centered
				>
					<div className="py-4">
						<p className="text-gray-700 mb-2">
							Êtes-vous sûr de vouloir supprimer la formation :
						</p>
						<p className="font-bold text-gray-900 mb-4">
							{trainingToDelete?.title}
						</p>
						<p className="text-sm text-red-600 mb-6">
							Cette action est irréversible. La formation sera supprimée du catalogue et ne sera plus visible sur le site.
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setDeleteId(null)}
								disabled={deleting}
								className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								Annuler
							</button>
							<button
								onClick={handleDelete}
								disabled={deleting}
								className={clsx(
									deleting ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-red-700",
									"px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 shadow-sm transition-all duration-200"
								)}
							>
								{deleting ? <Spin indicator={<LoadingOutlined spin />} size="small" className="text-white" /> : "Supprimer"}
							</button>
						</div>
					</div>
				</Modal>
			</ConfigProvider>
		</div>
	);
}
