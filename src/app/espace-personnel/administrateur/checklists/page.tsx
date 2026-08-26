import { getChecklists, getProspectsForSelect, getUsersForSelect } from "@/lib/server/queries";
import ChecklistsClient from "./ChecklistsClient";

export default async function ChecklistsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const { page } = await searchParams;

	// Les cibles possibles étaient chargées à l'ouverture de la modale, ce qui
	// laissait les selects vides le temps de la requête. Elles arrivent
	// maintenant avec la page.
	const [checklists, users, prospects] = await Promise.all([
		getChecklists({ page: Number(page) || 1 }),
		getUsersForSelect().catch(() => []),
		getProspectsForSelect().catch(() => []),
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
