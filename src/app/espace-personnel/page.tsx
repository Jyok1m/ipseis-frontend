import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/session";

/**
 * Aiguillage vers l'espace du rôle. La redirection est décidée côté serveur :
 * plus de spinner ni de saut de page pendant que le client interroge /auth/me.
 */
export default async function EspacePersonnelPage() {
	const user = await getCurrentUser();
	redirect(user ? `/espace-personnel/${user.role}` : "/espace-personnel/connexion");
}
