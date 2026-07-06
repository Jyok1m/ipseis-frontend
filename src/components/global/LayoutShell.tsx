"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const mainClass = "min-h-0 flex-1 overflow-y-auto overflow-x-hidden";

export default function LayoutShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	// Espace personnel : pas de footer.
	if (pathname.startsWith("/espace-personnel")) {
		return <main className={mainClass}>{children}</main>;
	}

	// Home : footer fixe, hors de la zone scrollable (toujours visible).
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
		<main className={`${mainClass} flex flex-col`}>
			<div className="flex flex-1 flex-col">{children}</div>
			<Footer background="bg-support" />
		</main>
	);
}
