import { getActivationCodes } from "@/lib/server/queries";
import CodesActivationClient from "./CodesActivationClient";

export default async function CodesActivationPage({ searchParams }: { searchParams: Promise<{ page?: string; archived?: string }> }) {
	const { page, archived } = await searchParams;
	const showArchived = archived === "true";
	const { items, pagination } = await getActivationCodes({ page: Number(page) || 1, archived: showArchived });

	return <CodesActivationClient codes={items} pagination={pagination} archived={showArchived} />;
}
