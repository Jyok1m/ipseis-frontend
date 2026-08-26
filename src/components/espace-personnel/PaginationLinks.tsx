import Link from "next/link";
import clsx from "clsx";
import type { Pagination } from "@/lib/types";

/**
 * Pagination par URL plutôt que par état local : la page courante devient
 * partageable et navigable, et c'est le serveur qui rend la bonne page au lieu
 * de refaire un fetch client à chaque clic.
 */
export default function PaginationLinks({ pagination, basePath, extraParams }: { pagination: Pagination; basePath: string; extraParams?: Record<string, string | undefined> }) {
	if (!pagination || pagination.pages <= 1) return null;

	const buildHref = (page: number) => {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(extraParams ?? {})) {
			if (value) params.set(key, value);
		}
		if (page > 1) params.set("page", String(page));
		const query = params.toString();
		return query ? `${basePath}?${query}` : basePath;
	};

	return (
		<div className="flex justify-center gap-2 mt-6">
			{Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
				<Link
					key={page}
					href={buildHref(page)}
					scroll={false}
					className={clsx(
						"px-3 py-1 rounded text-sm font-medium",
						pagination.page === page ? "bg-univers text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
					)}
				>
					{page}
				</Link>
			))}
		</div>
	);
}
