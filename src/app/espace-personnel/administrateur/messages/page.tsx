import { requireUser } from "@/lib/server/session";
import MessagesPage from "@/components/espace-personnel/MessagesPage";

export default async function AdminMessagesPage() {
	const user = await requireUser(["administrateur"]);

	return <MessagesPage user={user} canComposeNew />;
}
