import { requireUser } from "@/lib/server/session";
import MessagesPage from "@/components/espace-personnel/MessagesPage";

export default async function ProfessionnelMessagesPage() {
	const user = await requireUser(["professionnel"]);

	return <MessagesPage user={user} />;
}
