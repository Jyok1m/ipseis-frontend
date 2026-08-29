"use client";

import Image from "next/image";
import clsx from "clsx";
import starOrange from "@/_images/logo/star_orange.svg";
import type { Theme, ThemeWithTrainings } from "@/lib/types";
import { bubbleDiameter, polarPosition, WHEEL_RADIUS } from "./wheelGeometry";

type CatalogueTheme = Theme & ThemeWithTrainings;

/**
 * Roue de sélection des thématiques : les bulles sont disposées sur un cercle
 * autour de l'étoile Ipseis, reliées au moyeu par des rayons.
 *
 * Elle s'applique à toutes les tailles d'écran : avec quatre thématiques, le
 * cercle donne de lui-même la lecture en 2×2, et tout étant exprimé en
 * pourcentages du conteneur, la roue se réduit d'un bloc sur mobile.
 */
export default function ThemeWheel({ themes, onSelect }: { themes: CatalogueTheme[]; onSelect: (theme: CatalogueTheme) => void }) {
	const count = themes.length;
	const diameter = bubbleDiameter(count);
	const positions = themes.map((_, index) => polarPosition(index, count));

	return (
		<div className="relative mx-auto aspect-1 w-full max-w-[24rem] lg:max-w-[27rem]">
			{/* Rayons et cercle de guidage, en unités de pourcentage du conteneur. */}
			<svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
				<circle cx="50" cy="50" r={WHEEL_RADIUS} fill="none" stroke="#FF4E00" strokeOpacity="0.18" strokeWidth="0.3" strokeDasharray="1.6 2.2" />
				{positions.map((position, index) => (
					<line
						key={index}
						x1="50"
						y1="50"
						x2={position.x}
						y2={position.y}
						stroke="#FF4E00"
						strokeOpacity="0.22"
						strokeWidth="0.35"
					/>
				))}
			</svg>

			{/* Moyeu : l'étoile de la marque, posée par-dessus les rayons. */}
			<div className="absolute left-1/2 top-1/2 flex h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-support">
				<Image src={starOrange} alt="" aria-hidden className="h-3/4 w-3/4" />
			</div>

			{themes.map((theme, index) => {
				const position = positions[index];
				return (
					<button
						key={theme._id}
						type="button"
						onClick={() => onSelect(theme)}
						style={{
							left: `${position.x}%`,
							top: `${position.y}%`,
							width: `${diameter}%`,
							height: `${diameter}%`,
						}}
						className={clsx(
							"absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-support px-2 shadow-lg ring-2 ring-cohesion/30",
							"flex items-center justify-center transition duration-300",
							"hover:scale-105 hover:shadow-xl hover:ring-cohesion",
							"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cohesion"
						)}
					>
						<span className="text-balance hyphens-auto break-words text-center text-[0.7rem] font-semibold leading-tight text-univers sm:text-[0.78rem] lg:text-sm">
							{theme.title}
						</span>
					</button>
				);
			})}
		</div>
	);
}
