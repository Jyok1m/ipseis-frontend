import { HomeIcon, BriefcaseIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/server/session";
import { getUnreadCount } from "@/lib/server/queries";
import { SocketProvider } from "@/context/SocketContext";
import DashboardLayout from "@/components/espace-personnel/DashboardLayout";

const professionnelNavItems = [
	{ name: "Tableau de bord", href: "/espace-personnel/professionnel", icon: <HomeIcon className="h-5 w-5" /> },
	{ name: "Mon activité", href: "/espace-personnel/professionnel/activite", icon: <BriefcaseIcon className="h-5 w-5" /> },
	{ name: "Mes contrats", href: "/espace-personnel/professionnel/contrats", icon: <DocumentTextIcon className="h-5 w-5" /> },
	{ name: "Mes messages", href: "/espace-personnel/professionnel/messages", icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
	{ name: "Mon compte", href: "/espace-personnel/professionnel/mon-compte", icon: <UserCircleIcon className="h-5 w-5" /> },
];

export default async function ProfessionnelLayout({ children }: { children: React.ReactNode }) {
	// Lectures parallèles : le compteur de badge ne dépend pas de l'authentification.
	const [user, unreadCount] = await Promise.all([requireUser(["professionnel"]), getUnreadCount().catch(() => 0)]);

	return (
		<SocketProvider user={user} initialUnreadCount={unreadCount} initialContactUnreadCount={0}>
			<DashboardLayout navItems={professionnelNavItems} user={user}>
				{children}
			</DashboardLayout>
		</SocketProvider>
	);
}
