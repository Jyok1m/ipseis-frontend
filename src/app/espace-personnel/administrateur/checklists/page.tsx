import { getChecklists, getProspects, getUsers } from "@/lib/server/queries";
import ChecklistsClient from "./ChecklistsClient";

export default async function ChecklistsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const { page } = await searchParams;

	// Les cibles possibles étaient chargées à l'ouverture de la modale, ce qui
	// laissait les selects vides le temps de la requête. Elles arrivent
	// maintenant avec la page.
	const [checklists, users, prospects] = await Promise.all([
		getChecklists({ page: Number(page) || 1 }),
		getUsers().then((r) => r.items).catch(() => []),
		getProspects().then((r) => r.items).catch(() => []),
	]);

	return (
		<ChecklistsClient
			initialChecklists={checklists.items}
			pagination={checklists.pagination}
			allUsers={users}
			allProspects={prospects}
		/>
	);
}
