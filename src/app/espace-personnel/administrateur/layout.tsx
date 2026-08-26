import { HomeIcon, AcademicCapIcon, UsersIcon, ClipboardDocumentListIcon, DocumentTextIcon, UserGroupIcon, FolderIcon, KeyIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/server/session";
import { getContactUnreadCount, getUnreadCount } from "@/lib/server/queries";
import { SocketProvider } from "@/context/SocketContext";
import DashboardLayout from "@/components/espace-personnel/DashboardLayout";

const adminNavItems = [
	{ name: "Tableau de bord", href: "/espace-personnel/administrateur", icon: <HomeIcon className="h-5 w-5" /> },
	{ name: "Prospects", href: "/espace-personnel/administrateur/prospects", icon: <UserGroupIcon className="h-5 w-5" /> },
	{ name: "Utilisateurs", href: "/espace-personnel/administrateur/utilisateurs", icon: <UsersIcon className="h-5 w-5" /> },
	{ name: "Codes d'activation", href: "/espace-personnel/administrateur/codes-activation", icon: <KeyIcon className="h-5 w-5" /> },
	{ name: "Formations", href: "/espace-personnel/administrateur/formations", icon: <AcademicCapIcon className="h-5 w-5" /> },
	{ name: "Ressources", href: "/espace-personnel/administrateur/ressources", icon: <FolderIcon className="h-5 w-5" /> },
	{ name: "Contrats", href: "/espace-personnel/administrateur/contrats", icon: <DocumentTextIcon className="h-5 w-5" /> },
	{ name: "Checklists", href: "/espace-personnel/administrateur/checklists", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
	{ name: "Mes messages", href: "/espace-personnel/administrateur/messages", icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
	{ name: "Mon compte", href: "/espace-personnel/administrateur/mon-compte", icon: <UserCircleIcon className="h-5 w-5" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const user = await requireUser(["administrateur"]);

	// Compteurs de badges résolus en parallèle du rendu, pas après hydratation.
	const [unreadCount, contactUnreadCount] = await Promise.all([
		getUnreadCount().catch(() => 0),
		getContactUnreadCount().catch(() => 0),
	]);

	return (
		<SocketProvider user={user} initialUnreadCount={unreadCount} initialContactUnreadCount={contactUnreadCount}>
			<DashboardLayout navItems={adminNavItems} user={user}>
				{children}
			</DashboardLayout>
		</SocketProvider>
	);
}
