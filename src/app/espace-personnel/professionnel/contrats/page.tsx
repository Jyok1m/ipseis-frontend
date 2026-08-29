import { getMyContracts } from "@/lib/server/queries";
import MyContractsList from "@/components/espace-personnel/MyContractsList";

const BASE_PATH = "/espace-personnel/professionnel/contrats";

export default async function ProfessionnelContratsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const { page } = await searchParams;
	const { items, pagination } = await getMyContracts({ page: Number(page) || 1 });

	return <MyContractsList contracts={items} pagination={pagination} basePath={BASE_PATH} />;
}
