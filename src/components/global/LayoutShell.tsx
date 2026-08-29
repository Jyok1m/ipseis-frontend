"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

/**
 * Le document défile de nouveau lui-même : l'en-tête n'est plus figé en haut
 * d'une zone de contenu à défilement interne, il s'en va avec la page.
 * overflow-x-hidden reste pour contenir les éléments décoratifs débordants.
 */
const mainClass = "flex flex-1 flex-col overflow-x-hidden";

export default function LayoutShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	// Espace personnel : pas de footer.
	if (pathname.startsWith("/espace-personnel")) {
		return <main className={mainClass}>{children}</main>;
	}

	// Home : footer sur fond sombre, dans le flux comme les autres pages.
	if (pathname === "/") {
		return (
			<>
				<main className={mainClass}>{children}</main>
				<Footer background="bg-univers" />
			</>
		);
	}

	// Autres pages : footer dans le flux, en bas du contenu scrollable.
	return (
		<main className={mainClass}>
			<div className="flex flex-1 flex-col">{children}</div>
			<Footer background="bg-support" />
		</main>
	);
}
