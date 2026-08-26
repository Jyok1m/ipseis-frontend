"use client";

import { useActionState, useCallback, useState } from "react";
import { PencilSquareIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { changePasswordAction, updateProfileAction } from "@/lib/server/actions/auth";
import { idle } from "@/lib/server/actions/types";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import type { SessionUser } from "@/lib/types";
import SubmitButton from "./SubmitButton";

const inputClass =
	"block w-full rounded-lg px-4 py-2.5 text-gray-900 bg-white border border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20 shadow-sm placeholder:text-gray-400 text-sm font-medium transition-all duration-200";

const cancelClass = "px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors";
const saveClass = "px-4 py-2 rounded-lg text-sm font-bold text-white bg-univers shadow-sm hover:bg-univers/90 transition-all duration-200 flex items-center gap-2";

const Field = ({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue?: string; type?: string }) => (
	<div>
		<label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-1 block">
			{label}
		</label>
		<input id={name} name={name} type={type} defaultValue={defaultValue} className={inputClass} />
	</div>
);

/**
 * L'utilisateur vient du Server Component parent. Après updateProfileAction,
 * revalidatePath("/espace-personnel", "layout") relance le rendu serveur :
 * le profil affiché et le "Bonjour, X" de l'en-tête se mettent à jour sans
 * refreshUser() ni second aller-retour côté client.
 */
export default function ProfileEditSection({ user }: { user: SessionUser }) {
	const [editing, setEditing] = useState(false);
	const [changingPassword, setChangingPassword] = useState(false);

	const closeEdit = useCallback(() => setEditing(false), []);
	const closePassword = useCallback(() => setChangingPassword(false), []);

	const [profileState, profileAction] = useActionState(updateProfileAction, idle);
	const [passwordState, passwordAction] = useActionState(changePasswordAction, idle);

	const profileFeedback = useActionFeedback(profileState, { successTitle: "Profil mis à jour", onSuccess: closeEdit });
	const passwordFeedback = useActionFeedback(passwordState, { successTitle: "Mot de passe modifié", onSuccess: closePassword });

	return (
		<>
			{profileFeedback}
			{passwordFeedback}

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-gray-900 flex items-center gap-2">
						<PencilSquareIcon className="h-5 w-5 text-gray-400" />
						Mon profil
					</h3>
					{!editing && (
						<button onClick={() => setEditing(true)} className="text-sm text-univers hover:underline font-semibold">
							Modifier
						</button>
					)}
				</div>

				{editing ? (
					<form action={profileAction} className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Field label="Prénom" name="firstName" defaultValue={user.firstName} />
							<Field label="Nom" name="lastName" defaultValue={user.lastName} />
							<Field label="Téléphone" name="phone" defaultValue={user.phone} />
							<Field label="Entreprise" name="company" defaultValue={user.company} />
							<Field label="Poste" name="position" defaultValue={user.position} />
							<Field label="Adresse" name="address" defaultValue={user.address} />
						</div>
						<div className="flex justify-end gap-3 pt-2">
							<button type="button" onClick={closeEdit} className={cancelClass}>
								Annuler
							</button>
							<SubmitButton className={saveClass} spinnerClassName="text-white">
								Enregistrer
							</SubmitButton>
						</div>
					</form>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
						<div>
							<span className="text-gray-400">Email</span>
							<p className="text-gray-900 font-medium">{user.email}</p>
						</div>
						<div>
							<span className="text-gray-400">Téléphone</span>
							<p className="text-gray-900 font-medium">{user.phone || "—"}</p>
						</div>
						<div>
							<span className="text-gray-400">Prénom</span>
							<p className="text-gray-900 font-medium">{user.firstName}</p>
						</div>
						<div>
							<span className="text-gray-400">Nom</span>
							<p className="text-gray-900 font-medium">{user.lastName}</p>
						</div>
						<div>
							<span className="text-gray-400">Entreprise</span>
							<p className="text-gray-900 font-medium">{user.company || "—"}</p>
						</div>
						<div>
							<span className="text-gray-400">Poste</span>
							<p className="text-gray-900 font-medium">{user.position || "—"}</p>
						</div>
						<div className="sm:col-span-2">
							<span className="text-gray-400">Adresse</span>
							<p className="text-gray-900 font-medium">{user.address || "—"}</p>
						</div>
					</div>
				)}

				<div className="mt-6 pt-6 border-t border-gray-200">
					{changingPassword ? (
						<form action={passwordAction} className="space-y-4">
							<h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
								<LockClosedIcon className="h-4 w-4 text-gray-400" />
								Changer le mot de passe
							</h4>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<Field label="Mot de passe actuel" name="currentPassword" type="password" />
								<Field label="Nouveau mot de passe" name="newPassword" type="password" />
								<Field label="Confirmer" name="confirmNewPassword" type="password" />
							</div>
							<div className="flex justify-end gap-3">
								<button type="button" onClick={closePassword} className={cancelClass}>
									Annuler
								</button>
								<SubmitButton className={saveClass} spinnerClassName="text-white">
									Changer
								</SubmitButton>
							</div>
						</form>
					) : (
						<button
							onClick={() => setChangingPassword(true)}
							className="text-sm text-univers hover:underline font-semibold flex items-center gap-2"
						>
							<LockClosedIcon className="h-4 w-4" />
							Changer le mot de passe
						</button>
					)}
				</div>
			</div>
		</>
	);
}
