import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { ApiError, serverFetch } from "./fetcher";

export type Role = "administrateur" | "apprenant" | "professionnel";

export interface SessionUser {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: Role;
	phone: string;
	company: string;
	position: string;
	address: string;
	isActive: boolean;
}

/**
 * Utilisateur courant, ou null si la session est absente/expirée.
 *
 * `cache()` déduplique l'appel sur la durée d'un rendu : le layout, la page et
 * les composants imbriqués peuvent tous l'appeler sans multiplier les GET /auth/me.
 *
 * Seules les erreurs d'authentification retournent null. Un backend injoignable
 * remonte l'exception : déconnecter l'utilisateur parce que l'API est tombée
 * masquerait la panne derrière un écran de connexion.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
	try {
		const { user } = await serverFetch<{ user: SessionUser }>("/auth/me");
		return user;
	} catch (error) {
		if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
			return null;
		}
		throw error;
	}
});

/**
 * Garde d'accès pour les Server Components de l'espace personnel.
 * Remplace le ProtectedRoute client : la redirection est décidée avant
 * le moindre octet de HTML, sans écran de chargement ni flash de contenu.
 */
export async function requireUser(allowedRoles?: Role[]): Promise<SessionUser> {
	const user = await getCurrentUser();

	if (!user) redirect("/espace-personnel/connexion");
	if (allowedRoles && !allowedRoles.includes(user.role)) redirect(`/espace-personnel/${user.role}`);

	return user;
}
