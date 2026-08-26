import { requireUser } from "@/lib/server/session";
import MessagesPage from "@/components/espace-personnel/MessagesPage";

export default async function ApprenantMessagesPage() {
	const user = await requireUser(["apprenant"]);

	return <MessagesPage user={user} />;
}
