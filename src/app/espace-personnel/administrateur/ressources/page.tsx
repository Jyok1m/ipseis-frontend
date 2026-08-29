import { getAdminResources, getAdminTrainings } from "@/lib/server/queries";
import RessourcesClient from "./RessourcesClient";

export default async function RessourcesPage({ searchParams }: { searchParams: Promise<{ page?: string; trainingId?: string }> }) {
	const { page, trainingId } = await searchParams;

	const [resources, trainings] = await Promise.all([
		getAdminResources({ page: Number(page) || 1, trainingId }),
		getAdminTrainings().catch(() => []),
	]);

	return (
		<RessourcesClient
			resources={resources.items}
			pagination={resources.pagination}
			trainings={trainings}
			trainingFilter={trainingId}
		/>
	);
}
