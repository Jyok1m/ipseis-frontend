"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Filtres portés par l'URL plutôt que par un état local.
 *
 * C'est le serveur qui rend la liste filtrée : la vue est partageable,
 * le retour navigateur fonctionne, et il n'y a plus de re-fetch client
 * après chaque changement de filtre.
 */
export function useUrlFilter() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (value) params.set(key, value);
				else params.delete(key);
			}
			// Changer un filtre invalide la pagination courante.
			params.delete("page");

			const query = params.toString();
			router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
		},
		[router, pathname, searchParams]
	);

	return { searchParams, setParams };
}
