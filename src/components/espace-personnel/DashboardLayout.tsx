"use client";

import { useState } from "react";
import type { SessionUser } from "@/lib/types";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface NavItem {
	name: string;
	href: string;
	icon?: React.ReactNode;
}

interface DashboardLayoutProps {
	children: React.ReactNode;
	navItems: NavItem[];
	user: SessionUser;
}

/**
 * Reste client pour le seul état d'ouverture du menu mobile ; l'utilisateur
 * est fourni par le layout de rôle, rendu côté serveur.
 */
export default function DashboardLayout({ children, navItems, user }: DashboardLayoutProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar navItems={navItems} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
			<div className="md:ml-72 flex flex-col min-h-screen">
				<DashboardHeader user={user} onMobileMenuOpen={() => setMobileOpen(true)} />
				<main className="flex-1 p-4 sm:p-6">{children}</main>
			</div>
		</div>
	);
}
