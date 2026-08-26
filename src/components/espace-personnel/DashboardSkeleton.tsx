/**
 * Squelette affiché pendant que le contenu de page est rendu côté serveur.
 *
 * Placé derrière un loading.tsx, il permet à Next d'envoyer immédiatement la
 * coquille du tableau de bord (sidebar et en-tête, rendus par le layout) puis
 * de streamer le contenu. Sans lui, la page attendait la fin de toutes ses
 * requêtes avant d'émettre le moindre octet.
 *
 * Server Component : zéro JavaScript envoyé pour cet écran.
 */
export default function DashboardSkeleton() {
	return (
		<div className="animate-pulse" aria-busy="true" aria-live="polite">
			<span className="sr-only">Chargement en cours…</span>

			<div className="h-7 w-64 rounded bg-gray-200" />
			<div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />

			<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
						<div className="flex items-center gap-3">
							<div className="h-9 w-9 rounded-lg bg-gray-200" />
							<div className="h-4 w-24 rounded bg-gray-100" />
						</div>
						<div className="mt-4 h-7 w-16 rounded bg-gray-200" />
					</div>
				))}
			</div>

			<div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
				<div className="h-5 w-40 rounded bg-gray-200" />
				<div className="mt-5 space-y-3">
					{Array.from({ length: 4 }, (_, i) => (
						<div key={i} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0">
							<div className="h-4 w-1/2 rounded bg-gray-100" />
							<div className="h-4 w-20 rounded bg-gray-100" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
