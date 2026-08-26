"use client";

import { useRouter, useSearchParams } from "next/navigation";

/**
 * Le filtre vit dans l'URL : la vue est partageable et c'est le serveur qui
 * rend la liste filtrée, sans refetch client.
 */
export default function ArchivedToggle({ basePath }: { basePath: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const checked = searchParams.get("archived") === "true";

	return (
		<label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				onChange={(event) => router.push(event.target.checked ? `${basePath}?archived=true` : basePath)}
				className="rounded border-gray-300 text-univers focus:ring-univers"
			/>
			Afficher les archivés
		</label>
	);
}
