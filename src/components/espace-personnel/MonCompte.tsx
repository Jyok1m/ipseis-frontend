import { UserCircleIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/server/session";
import ProfileEditSection from "./ProfileEditSection";

/**
 * Page « Mon compte », identique pour les trois rôles. Server Component :
 * le profil est déjà dans le HTML, il n'y a plus de GET /auth/me au montage.
 */
export default async function MonCompte() {
	const user = await requireUser();

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
				<UserCircleIcon className="h-7 w-7 text-gray-400" />
				Mon compte
			</h1>
			<p className="text-gray-500 mb-8">Modifiez vos informations personnelles et votre mot de passe.</p>
			<ProfileEditSection user={user} />
		</div>
	);
}
