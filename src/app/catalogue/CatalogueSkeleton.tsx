/**
 * Fallback du Suspense du catalogue.
 *
 * Il calque la mise en page réelle — deux colonnes, mêmes titres, bulles aux
 * mêmes diamètres — pour que le remplacement ne provoque aucun saut. L'ancienne
 * version dessinait une grille 3×3 avec une étoile centrale, sans rapport avec
 * ce qui s'affichait ensuite.
 *
 * Server Component sans antd : cet écran n'embarque aucun JavaScript.
 */

const BUBBLE_SIZE = "w-[min(9.5rem,40vw)] sm:w-[9.75rem] lg:w-[10.5rem]";

function SkeletonColumn({ title, count }: { title: string; count: number }) {
	return (
		<div className="flex flex-col items-center">
			<h2 className="mb-6 text-center text-base font-bold uppercase tracking-wider text-univers/30 sm:mb-8 sm:text-xl lg:text-2xl">{title}</h2>
			<div className="flex max-w-[19.5rem] flex-wrap items-center justify-center gap-4 sm:max-w-[21.5rem] sm:gap-6">
				{Array.from({ length: count }, (_, i) => (
					<div key={i} className={`${BUBBLE_SIZE} aspect-1 animate-pulse rounded-full bg-univers/5 ring-2 ring-cohesion/15`} />
				))}
			</div>
		</div>
	);
}

export default function CatalogueSkeleton() {
	return (
		<div className="mx-auto mt-2 max-w-7xl px-5 pb-12 sm:mt-4 sm:px-6 sm:pb-16 lg:px-8" aria-busy="true" aria-live="polite">
			<span className="sr-only">Chargement du catalogue…</span>
			<div className="grid grid-cols-1 divide-y divide-univers/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0 lg:divide-univers/15">
				<div className="pb-10 lg:pb-0 lg:pr-10">
					<SkeletonColumn title="Professionnels de la santé" count={4} />
				</div>
				<div className="pt-10 lg:pl-10 lg:pt-0">
					<SkeletonColumn title="Formations transversales" count={1} />
				</div>
			</div>
		</div>
	);
}
