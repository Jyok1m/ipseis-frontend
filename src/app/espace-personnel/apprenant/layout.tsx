import { HomeIcon, AcademicCapIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/server/session";
import { getUnreadCount } from "@/lib/server/queries";
import { SocketProvider } from "@/context/SocketContext";
import DashboardLayout from "@/components/espace-personnel/DashboardLayout";

const apprenantNavItems = [
	{ name: "Tableau de bord", href: "/espace-personnel/apprenant", icon: <HomeIcon className="h-5 w-5" /> },
	{ name: "Mes formations", href: "/espace-personnel/apprenant/formations", icon: <AcademicCapIcon className="h-5 w-5" /> },
	{ name: "Mes contrats", href: "/espace-personnel/apprenant/contrats", icon: <DocumentTextIcon className="h-5 w-5" /> },
	{ name: "Mes messages", href: "/espace-personnel/apprenant/messages", icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
	{ name: "Mon compte", href: "/espace-personnel/apprenant/mon-compte", icon: <UserCircleIcon className="h-5 w-5" /> },
];

export default async function ApprenantLayout({ children }: { children: React.ReactNode }) {
	const user = await requireUser(["apprenant"]);
	const unreadCount = await getUnreadCount().catch(() => 0);

	return (
		<SocketProvider user={user} initialUnreadCount={unreadCount} initialContactUnreadCount={0}>
			<DashboardLayout navItems={apprenantNavItems} user={user}>
				{children}
			</DashboardLayout>
		</SocketProvider>
	);
}
