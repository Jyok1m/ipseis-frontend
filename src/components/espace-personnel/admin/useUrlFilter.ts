"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Filtres portés par l'URL plutôt que par un état local.
 *
 * C'est le serveur qui rend la liste filtrée : la vue est partageable,
 * le retour navigateur fonctionne, et il n'y a plus de re-fetch client
 * après chaque changement de filtre.
 *
 * La navigation est enveloppée dans une transition : `isPending` reste vrai
 * tant que le nouveau rendu serveur n'est pas arrivé, ce qui permet aux
 * contrôles d'afficher un état d'attente. Sans ça, changer un filtre ne
 * produisait aucun retour visuel pendant l'aller-retour.
 */
export function useUrlFilter() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

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
			startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
		},
		[router, pathname, searchParams]
	);

	return { searchParams, setParams, isPending };
}
