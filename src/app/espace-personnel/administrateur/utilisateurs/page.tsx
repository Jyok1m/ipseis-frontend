import { requireUser } from "@/lib/server/session";
import { getUsers } from "@/lib/server/queries";
import UtilisateursClient from "./UtilisateursClient";

export default async function UtilisateursPage({ searchParams }: { searchParams: Promise<{ page?: string; role?: string; search?: string }> }) {
	const { page, role, search } = await searchParams;
	const currentUser = await requireUser(["administrateur"]);

	// Sans filtre explicite, la vue masque les administrateurs — comportement
	// repris tel quel de la version client.
	const { items, pagination } = await getUsers({
		page: Number(page) || 1,
		role: role && role !== "all" ? role : undefined,
		excludeRole: role ? undefined : "administrateur",
		search,
	});

	return <UtilisateursClient currentUser={currentUser} users={items} pagination={pagination} filters={{ role, search }} />;
}
