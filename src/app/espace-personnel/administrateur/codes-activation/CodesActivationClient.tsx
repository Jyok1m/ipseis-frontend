"use client";

import { useActionState, useTransition } from "react";
import { ConfigProvider, Modal, notification } from "antd";
import { CheckCircleIcon, XCircleIcon, KeyIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { archiveActivationCodeAction, cancelActivationCodeAction, createActivationCodeAction } from "@/lib/server/actions/admin";
import { idle } from "@/lib/server/actions/types";
import type { ActivationCode, Pagination } from "@/lib/types";
import SubmitButton from "@/components/espace-personnel/SubmitButton";
import PaginationLinks from "@/components/espace-personnel/PaginationLinks";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import ArchivedToggle from "@/components/espace-personnel/admin/ArchivedToggle";

const BASE_PATH = "/espace-personnel/administrateur/codes-activation";

function getCodeStatus(code: ActivationCode) {
	if (code.isUsed) return { label: "Utilisé", className: "bg-green-50 text-green-700" };
	if (code.cancelled) return { label: "Annulé", className: "bg-red-50 text-red-700" };
	if (new Date(code.expiresAt) < new Date()) return { label: "Expiré", className: "bg-gray-100 text-gray-500" };
	return { label: "En attente", className: "bg-amber-50 text-amber-700" };
}

const canCancel = (code: ActivationCode) => !code.isUsed && !code.cancelled;
const canArchive = (code: ActivationCode) => code.isUsed || code.cancelled || new Date(code.expiresAt) < new Date();

const headers = ["Code", "Email", "Rôle", "Statut", "Expire", "Actions"];

export default function CodesActivationClient({ codes, pagination, archived }: { codes: ActivationCode[]; pagination: Pagination; archived: boolean }) {
	const [api, contextHolder] = notification.useNotification();
	const [, startTransition] = useTransition();
	const [createState, createAction] = useActionState(createActivationCodeAction, idle);
	// Notifie le résultat de la création dans un effet, jamais pendant le rendu.
	const createFeedback = useActionFeedback(createState, { successTitle: "Code créé" });

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

	const run = async (action: () => Promise<{ ok: boolean; error?: string; message?: string }>, successTitle: string, fallback: string) => {
		const result = await action();
		if (result.ok) {
			notify("success", successTitle, result.message ?? fallback);
			startTransition(() => {});
		} else {
			notify("error", "Erreur", result.error ?? "Une erreur est survenue.");
		}
	};

	const handleCancel = (code: ActivationCode) =>
		Modal.confirm({
			title: "Annuler ce code d'activation ?",
			content: `Le code ${code.code} pour ${code.targetEmail} ne pourra plus être utilisé pour s'inscrire.`,
			okText: "Annuler le code",
			cancelText: "Retour",
			okButtonProps: { danger: true },
			onOk: () => run(() => cancelActivationCodeAction(code._id), "Code annulé", "Le code a été annulé avec succès."),
		});

	const handleArchive = (code: ActivationCode) =>
		run(() => archiveActivationCodeAction(code._id), "Code archivé", "Le code a été archivé.");

	return (
		<div>
			<ConfigProvider theme={{ token: { colorBgElevated: "#ffffff", colorTextHeading: "#1a1a1a", colorText: "#374151", fontFamily: "Halibut" } }}>
				{contextHolder}
				{createFeedback}

				<h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
					<KeyIcon className="h-7 w-7 text-gray-400" />
					Codes d&apos;activation
				</h1>
				<p className="text-gray-500 mb-8">Créez et suivez les codes d&apos;invitation pour les nouveaux utilisateurs.</p>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
						<KeyIcon className="h-5 w-5 text-univers" />
						Créer un code d&apos;activation
					</h2>
					<p className="text-sm text-gray-500 mb-4">
						Saisissez l&apos;email du futur utilisateur et choisissez son rôle. Un code unique lui sera envoyé par email pour s&apos;inscrire.
					</p>
					<form action={createAction} className="flex flex-col sm:flex-row gap-3">
						<input
							type="email"
							name="targetEmail"
							placeholder="Email du destinataire"
							className="flex-1 rounded-lg px-4 py-2.5 text-gray-900 bg-white border border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20 shadow-sm placeholder:text-gray-400 text-sm font-medium transition-all duration-200"
						/>
						<select
							name="role"
							defaultValue="apprenant"
							className="rounded-lg px-4 py-2.5 pr-10 text-gray-900 bg-white border border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20 shadow-sm text-sm font-medium transition-all duration-200"
						>
							<option value="apprenant">Apprenant</option>
							<option value="professionnel">Professionnel</option>
						</select>
						<SubmitButton
							className="rounded-lg bg-univers px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-univers/90 transition-all duration-200 whitespace-nowrap text-sm"
							spinnerClassName="text-white"
						>
							Envoyer le code
						</SubmitButton>
					</form>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
							<KeyIcon className="h-5 w-5 text-maitrise" />
							Historique des codes
						</h2>
						<ArchivedToggle basePath={BASE_PATH} />
					</div>

					{codes.length > 0 ? (
						<>
							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<thead>
										<tr className="border-b border-gray-200">
											{headers.map((header) => (
												<th key={header} className="py-3 px-2 font-semibold text-gray-600 text-xs uppercase tracking-wide">
													{header}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{codes.map((code) => {
											const status = getCodeStatus(code);
											return (
												<tr key={code._id} className="border-b border-gray-100">
													<td className="py-3 px-2 font-mono text-sm text-gray-900">{code.code}</td>
													<td className="py-3 px-2 text-gray-700">{code.targetEmail}</td>
													<td className="py-3 px-2 text-gray-700 capitalize">{code.role}</td>
													<td className="py-3 px-2">
														<span className={clsx("px-2 py-1 rounded-full text-xs font-semibold", status.className)}>{status.label}</span>
													</td>
													<td className="py-3 px-2 text-gray-500">{new Date(code.expiresAt).toLocaleDateString("fr-FR")}</td>
													<td className="py-3 px-2">
														<div className="flex items-center gap-2">
															{canCancel(code) && (
																<button onClick={() => handleCancel(code)} className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline">
																	Annuler
																</button>
															)}
															{canArchive(code) && !code.archived && (
																<button onClick={() => handleArchive(code)} className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline">
																	Archiver
																</button>
															)}
															{code.archived && <span className="text-xs text-gray-400 italic">Archivé</span>}
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
							<PaginationLinks pagination={pagination} basePath={BASE_PATH} extraParams={{ archived: archived ? "true" : undefined }} />
						</>
					) : (
						<p className="text-gray-500 text-center py-4">Aucun code d&apos;activation.</p>
					)}
				</div>
			</ConfigProvider>
		</div>
	);
}
