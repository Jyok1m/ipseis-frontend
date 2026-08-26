import { getAdminContracts, getAdminTrainings, getUsers } from "@/lib/server/queries";
import ContratsClient from "./ContratsClient";

export default async function ContratsPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
	const { page, status } = await searchParams;

	// Contrats, destinataires possibles et formations liables : trois lectures
	// indépendantes, résolues en parallèle plutôt qu'en cascade au montage.
	const [contracts, users, trainings] = await Promise.all([
		getAdminContracts({ page: Number(page) || 1, status }),
		getUsers().then((r) => r.items).catch(() => []),
		getAdminTrainings().catch(() => []),
	]);

	return (
		<ContratsClient
			contracts={contracts.items}
			pagination={contracts.pagination}
			statusFilter={status}
			allUsers={users}
			allTrainings={trainings}
		/>
	);
}
