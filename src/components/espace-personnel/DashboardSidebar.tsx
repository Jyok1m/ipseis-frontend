"use client";

import logoBeige from "@/_images/logo/logo_beige.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { ArrowRightStartOnRectangleIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavItem {
	name: string;
	href: string;
	icon?: React.ReactNode;
}

interface DashboardSidebarProps {
	navItems: NavItem[];
	mobileOpen: boolean;
	onMobileClose: () => void;
}

export default function DashboardSidebar({ navItems, mobileOpen, onMobileClose }: DashboardSidebarProps) {
	const pathname = usePathname();
	const { logout } = useAuth();
	const { unreadCount, contactUnreadCount } = useSocket();
	const totalUnread = unreadCount + contactUnreadCount;

	const sidebarContent = (
		<>
			<div className="p-6">
				<Link href="/espace-personnel" onClick={onMobileClose}>
					<Image src={logoBeige} alt="Logo IPSEIS" height={50} />
				</Link>
			</div>

			<nav className="flex-1 px-4 space-y-1">
				{navItems.map((item, index) => {
					const isActive = index === 0 ? pathname === item.href : pathname.startsWith(item.href);
					const isMessages = item.name === "Mes messages";
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onMobileClose}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
								isActive ? "bg-maitrise text-white" : "text-support/80 hover:bg-white/10 hover:text-support"
							}`}
						>
							{item.icon}
							{item.name}
							{isMessages && totalUnread > 0 && (
								<span className="ml-auto min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-cohesion text-white text-xs font-bold px-1.5">
									{totalUnread}
								</span>
							)}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-white/20 space-y-1">
				<Link
					href="/"
					onClick={onMobileClose}
					className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-support/80 hover:bg-white/10 hover:text-support text-base font-medium transition-colors"
				>
					<ArrowTopRightOnSquareIcon className="h-5 w-5" />
					Voir le site
				</Link>
				<button
					onClick={logout}
					className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-support/80 hover:bg-white/10 hover:text-support text-base font-medium transition-colors"
				>
					<ArrowRightStartOnRectangleIcon className="h-5 w-5" />
					Déconnexion
				</button>
			</div>
		</>
	);

	return (
		<>
			{/* Mobile overlay */}
			{mobileOpen && (
				<div className="fixed inset-0 z-40 md:hidden">
					<div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
					<div className="fixed inset-y-0 left-0 w-72 bg-univers flex flex-col z-50 overflow-y-auto">
						<button
							onClick={onMobileClose}
							className="absolute top-4 right-4 text-support/80 hover:text-support"
						>
							<XMarkIcon className="h-6 w-6" />
						</button>
						{sidebarContent}
					</div>
				</div>
			)}

			{/* Desktop sidebar */}
			<aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-univers">
				{sidebarContent}
			</aside>
		</>
	);
}
