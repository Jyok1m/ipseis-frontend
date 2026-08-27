import { bubbleDiameter, polarPosition, WHEEL_RADIUS } from "./wheelGeometry";
import { COLUMN_TITLES, COLUMN_TITLE_CLASS } from "./columnTitles";

/**
 * Fallback du Suspense du catalogue.
 *
 * Il calque la mise en page réelle - deux colonnes, mêmes titres, même roue aux
 * mêmes proportions - pour que le remplacement ne provoque aucun saut.
 *
 * Server Component sans antd : cet écran n'embarque aucun JavaScript.
 */

function SkeletonWheel({ count }: { count: number }) {
	const diameter = bubbleDiameter(count);

	return (
		<div className="relative mx-auto aspect-1 w-full max-w-[22rem]">
			<svg
				viewBox="0 0 100 100"
				className="absolute inset-0 h-full w-full"
				aria-hidden="true"
			>
				<circle
					cx="50"
					cy="50"
					r={WHEEL_RADIUS}
					fill="none"
					stroke="#FF4E00"
					strokeOpacity="0.12"
					strokeWidth="0.3"
					strokeDasharray="1.6 2.2"
				/>
			</svg>
			<div className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-univers/5" />
			{Array.from({ length: count }, (_, index) => {
				const position = polarPosition(index, count);
				return (
					<div
						key={index}
						style={{
							left: `${position.x}%`,
							top: `${position.y}%`,
							width: `${diameter}%`,
							height: `${diameter}%`,
						}}
						className="absolute -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-univers/5 ring-2 ring-cohesion/15"
					/>
				);
			})}
		</div>
	);
}

function SkeletonColumn({ title, count }: { title: string; count: number }) {
	return (
		<div className="flex h-full flex-col items-center">
			<h2 className={`${COLUMN_TITLE_CLASS} text-univers/30`}>{title}</h2>

			<SkeletonWheel count={count} />
		</div>
	);
}

export default function CatalogueSkeleton() {
	return (
		<div
			className="mx-auto mt-2 max-w-7xl px-5 pb-12 sm:mt-4 sm:px-6 sm:pb-16 lg:px-8"
			aria-busy="true"
			aria-live="polite"
		>
			<span className="sr-only">Chargement du catalogue…</span>
			<div className="grid grid-cols-1 divide-y divide-univers/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0 lg:divide-univers/15">
				<div className="pb-10 lg:pb-0 lg:pr-10">
					<SkeletonColumn title={COLUMN_TITLES.sante} count={4} />
				</div>
				<div className="pt-10 lg:pl-10 lg:pt-0">
					<SkeletonColumn title={COLUMN_TITLES.transversal} count={1} />
				</div>
			</div>
		</div>
	);
}
