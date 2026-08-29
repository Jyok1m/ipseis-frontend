import { getProspects } from "@/lib/server/queries";
import ProspectsClient from "./ProspectsClient";

export default async function ProspectsPage({ searchParams }: { searchParams: Promise<{ page?: string; source?: string; search?: string }> }) {
	const { page, source, search } = await searchParams;
	const { items, pagination } = await getProspects({ page: Number(page) || 1, source, search });

	return <ProspectsClient prospects={items} pagination={pagination} filters={{ source, search }} />;
}
