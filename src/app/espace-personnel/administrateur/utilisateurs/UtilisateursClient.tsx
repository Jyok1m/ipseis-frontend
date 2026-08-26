"use client";

import { useState } from "react";
import { ConfigProvider, Modal, notification, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CheckCircleIcon, XCircleIcon, UsersIcon, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { deleteUserAction, updateUserAction } from "@/lib/server/actions/admin";
import { sendInternalMessageAction } from "@/lib/server/actions/messages";
import type { ActionState } from "@/lib/server/actions/types";
import type { Pagination, SessionUser } from "@/lib/types";
import PaginationLinks from "@/components/espace-personnel/PaginationLinks";
import SearchInput from "@/components/espace-personnel/admin/SearchInput";
import FilterSelect from "@/components/espace-personnel/admin/FilterSelect";

const BASE_PATH = "/espace-personnel/administrateur/utilisateurs";

const inputClass =
	"block w-full rounded-lg px-4 py-2.5 text-gray-900 bg-white border border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20 shadow-sm placeholder:text-gray-400 text-sm font-medium transition-all duration-200";
const selectClass = inputClass + " pr-10";

const cancelClass = "px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors";

const roleFilterOptions = [
	{ value: "", label: "Apprenants & Professionnels" },
	{ value: "all", label: "Tous les rôles" },
	{ value: "administrateur", label: "Administrateur" },
	{ value: "apprenant", label: "Apprenant" },
	{ value: "professionnel", label: "Professionnel" },
];

const roleBadgeClass = (role: string) =>
	role === "administrateur" ? "bg-univers/10 text-univers" : role === "apprenant" ? "bg-maitrise/10 text-maitrise" : "bg-cohesion/10 text-cohesion";

type AdminUser = SessionUser & { createdAt: string };

interface UtilisateursClientProps {
	currentUser: SessionUser;
	users: AdminUser[];
	pagination: Pagination;
	/** Repris dans les liens de pagination pour ne pas perdre le filtrage. */
	filters: { role?: string; search?: string };
}

/**
 * La liste et sa pagination viennent du serveur ; ce composant ne garde que
 * les modales et les mutations. Après une action, revalidatePath renvoie la
 * liste à jour, ce qui remplace les appels manuels à loadUsers().
 */
export default function UtilisateursClient({ currentUser, users, pagination, filters }: UtilisateursClientProps) {
	const [api, contextHolder] = notification.useNotification();

	const [editUser, setEditUser] = useState<AdminUser | null>(null);
	const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
	const [messageUser, setMessageUser] = useState<AdminUser | null>(null);
	const [busy, setBusy] = useState(false);

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

	const run = async (action: () => Promise<ActionState>, successMessage: string, onDone: () => void) => {
		setBusy(true);
		try {
			const result = await action();
			if (result.ok) {
				notify("success", "Succès", result.message ?? successMessage);
				onDone();
			} else {
				notify("error", "Erreur", result.error ?? "Une erreur est survenue.");
			}
		} finally {
			setBusy(false);
		}
	};

	const handleEditSave = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!editUser) return;
		const data = new FormData(event.currentTarget);
		const payload = {
			firstName: String(data.get("firstName") ?? ""),
			lastName: String(data.get("lastName") ?? ""),
			phone: String(data.get("phone") ?? ""),
			company: String(data.get("company") ?? ""),
			position: String(data.get("position") ?? ""),
			address: String(data.get("address") ?? ""),
			role: String(data.get("role") ?? ""),
			isActive: data.get("isActive") === "true",
		};
		run(() => updateUserAction(editUser._id, payload), "Utilisateur mis à jour.", () => setEditUser(null));
	};

	const handleDelete = () => {
		if (!deleteUser) return;
		run(() => deleteUserAction(deleteUser._id), "Utilisateur supprimé.", () => setDeleteUser(null));
	};

	const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!messageUser) return;
		const data = new FormData(event.currentTarget);
		const subject = String(data.get("subject") ?? "").trim();
		const content = String(data.get("content") ?? "").trim();
		if (!subject || !content) {
			notify("error", "Erreur", "Veuillez remplir tous les champs.");
			return;
		}
		run(() => sendInternalMessageAction({ recipientUser: messageUser._id, subject, content }), "Message envoyé avec succès.", () => setMessageUser(null));
	};

	const saving = busy;
	const spinner = <Spin indicator={<LoadingOutlined spin className="text-base text-white" />} />;

	return (
		<div>
			<ConfigProvider
				theme={{
					token: { colorBgElevated: "#ffffff", colorTextHeading: "#1a1a1a", colorText: "#374151", fontFamily: "Halibut" },
					components: { Modal: { titleFontSize: 18, titleColor: "#1a1a1a", headerBg: "#ffffff", contentBg: "#ffffff" } },
				}}
			>
				{contextHolder}

				<h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
					<UsersIcon className="h-7 w-7 text-gray-400" />
					Gestion des utilisateurs
				</h1>
				<p className="text-gray-500 mb-8">Consultez et gérez les comptes des utilisateurs inscrits.</p>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
						<FilterSelect paramName="role" options={roleFilterOptions} />
					</div>

					<SearchInput placeholder="Rechercher par nom, email, entreprise..." />

					{users.length > 0 ? (
						<>
							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<thead>
										<tr className="border-b border-gray-200">
											{["Nom", "Email", "Rôle", "Entreprise", "Inscrit le", "Actions"].map((header) => (
												<th key={header} className="py-3 px-2 font-semibold text-gray-600 text-xs uppercase tracking-wide">
													{header}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{users.map((u) => (
											<tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setEditUser(u)}>
												<td className="py-3 px-2 font-medium text-gray-900">
													{u.firstName} {u.lastName}
												</td>
												<td className="py-3 px-2 text-gray-700">{u.email}</td>
												<td className="py-3 px-2">
													<span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold capitalize", roleBadgeClass(u.role))}>{u.role}</span>
												</td>
												<td className="py-3 px-2 text-gray-700">{u.company}</td>
												<td className="py-3 px-2 text-gray-500">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
												<td className="py-3 px-2">
													<div className="flex items-center gap-1">
														<button
															onClick={(e) => {
																e.stopPropagation();
																setEditUser(u);
															}}
															className="p-1.5 rounded-lg text-gray-500 hover:text-univers hover:bg-gray-100 transition-colors"
															title="Modifier"
														>
															<PencilSquareIcon className="h-4 w-4" />
														</button>
														{u._id !== currentUser._id && (
															<>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		setMessageUser(u);
																	}}
																	className="p-1.5 rounded-lg text-gray-500 hover:text-maitrise hover:bg-gray-100 transition-colors"
																	title="Envoyer un message"
																>
																	<ChatBubbleLeftRightIcon className="h-4 w-4" />
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		setDeleteUser(u);
																	}}
																	className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
																	title="Supprimer"
																>
																	<TrashIcon className="h-4 w-4" />
																</button>
															</>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<PaginationLinks pagination={pagination} basePath={BASE_PATH} extraParams={filters} />
						</>
					) : (
						<p className="text-gray-500 text-center py-4">Aucun utilisateur trouvé.</p>
					)}
				</div>

				<Modal
					title={`Modifier ${editUser?.firstName} ${editUser?.lastName}`}
					open={!!editUser}
					onCancel={() => !saving && setEditUser(null)}
					footer={null}
					width="min(600px, 95vw)"
					centered
					destroyOnHidden
				>
					{/* key : remonte le formulaire à chaque utilisateur, pour que les
					    defaultValue des champs non contrôlés soient réinitialisés. */}
					<form key={editUser?._id} onSubmit={handleEditSave} className="space-y-4 mt-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Prénom</label>
								<input type="text" name="firstName" defaultValue={editUser?.firstName} disabled={saving} className={inputClass} />
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Nom</label>
								<input type="text" name="lastName" defaultValue={editUser?.lastName} disabled={saving} className={inputClass} />
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Téléphone</label>
								<input type="text" name="phone" defaultValue={editUser?.phone} disabled={saving} className={inputClass} />
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Entreprise</label>
								<input type="text" name="company" defaultValue={editUser?.company} disabled={saving} className={inputClass} />
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Poste</label>
								<input type="text" name="position" defaultValue={editUser?.position} disabled={saving} className={inputClass} />
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Adresse</label>
								<input type="text" name="address" defaultValue={editUser?.address} disabled={saving} className={inputClass} />
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Rôle</label>
								<select name="role" defaultValue={editUser?.role} disabled={saving} className={selectClass}>
									<option value="administrateur">Administrateur</option>
									<option value="apprenant">Apprenant</option>
									<option value="professionnel">Professionnel</option>
								</select>
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">Statut</label>
								<select name="isActive" defaultValue={editUser?.isActive === false ? "false" : "true"} disabled={saving} className={selectClass}>
									<option value="true">Actif</option>
									<option value="false">Désactivé</option>
								</select>
							</div>
						</div>
						<p className="text-xs text-gray-400">Email : {editUser?.email} (non modifiable)</p>
						<div className="flex justify-end gap-3 pt-2">
							<button type="button" onClick={() => setEditUser(null)} disabled={saving} className={cancelClass}>
								Annuler
							</button>
							<button
								type="submit"
								disabled={saving}
								className={clsx(
									saving ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-univers/90",
									"px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-univers shadow-sm transition-all duration-200 flex items-center gap-2"
								)}
							>
								{saving ? spinner : "Enregistrer"}
							</button>
						</div>
					</form>
				</Modal>

				<Modal
					title="Confirmer la suppression"
					open={!!deleteUser}
					onCancel={() => !saving && setDeleteUser(null)}
					footer={null}
					width="min(480px, 95vw)"
					centered
				>
					<div className="py-4">
						<p className="text-gray-700 mb-2">Êtes-vous sûr de vouloir supprimer le compte de :</p>
						<p className="font-bold text-gray-900 mb-1">
							{deleteUser?.firstName} {deleteUser?.lastName}
						</p>
						<p className="text-sm text-gray-500 mb-4">{deleteUser?.email}</p>
						<p className="text-sm text-red-600 mb-6">
							Cette action est irréversible. L&apos;utilisateur ne pourra plus se connecter et toutes ses données seront perdues.
						</p>
						<div className="flex justify-end gap-3">
							<button onClick={() => setDeleteUser(null)} disabled={saving} className={cancelClass}>
								Annuler
							</button>
							<button
								onClick={handleDelete}
								disabled={saving}
								className={clsx(
									saving ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-red-700",
									"px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 shadow-sm transition-all duration-200 flex items-center gap-2"
								)}
							>
								{saving ? spinner : "Supprimer"}
							</button>
						</div>
					</div>
				</Modal>

				<Modal
					title={`Envoyer un message à ${messageUser?.firstName} ${messageUser?.lastName}`}
					open={!!messageUser}
					onCancel={() => !saving && setMessageUser(null)}
					footer={null}
					width="min(600px, 95vw)"
					centered
					destroyOnHidden
				>
					<form key={messageUser?._id} onSubmit={handleSendMessage} className="space-y-4 mt-4">
						<div>
							<label className="text-sm font-semibold text-gray-700 mb-1 block">Destinataire</label>
							<p className="text-sm text-gray-500">
								{messageUser?.firstName} {messageUser?.lastName} ({messageUser?.email})
							</p>
						</div>
						<div>
							<label className="text-sm font-semibold text-gray-700 mb-1 block">
								Sujet<span className="text-red-400 ml-1">*</span>
							</label>
							<input type="text" name="subject" placeholder="Sujet du message" disabled={saving} className={inputClass} />
						</div>
						<div>
							<label className="text-sm font-semibold text-gray-700 mb-1 block">
								Message<span className="text-red-400 ml-1">*</span>
							</label>
							<textarea name="content" placeholder="Votre message..." rows={6} disabled={saving} className={clsx(inputClass, "resize-none")} />
						</div>
						<div className="flex justify-end gap-3 pt-2">
							<button type="button" onClick={() => setMessageUser(null)} disabled={saving} className={cancelClass}>
								Annuler
							</button>
							<button
								type="submit"
								disabled={saving}
								className={clsx(
									saving ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-univers/90",
									"px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-univers shadow-sm transition-all duration-200 flex items-center gap-2"
								)}
							>
								{saving ? (
									spinner
								) : (
									<>
										<PaperAirplaneIcon className="h-4 w-4" />
										Envoyer
									</>
								)}
							</button>
						</div>
					</form>
				</Modal>
			</ConfigProvider>
		</div>
	);
}
