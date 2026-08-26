import clsx from "clsx";
import Image from "next/image";
import starOrange from "@/_images/logo/star_orange.svg";

type TitleSectionProps = {
	noPaddingVertical?: boolean;
	noPaddingTop?: boolean;
	noPaddingBottom?: boolean;
	centered?: boolean;
	tag?: string;
	title?: string;
	titleNode?: React.ReactNode;
	description?: string;
	paddingSide?: boolean;
};

export const TitleSection = ({
	noPaddingTop,
	noPaddingBottom,
	noPaddingVertical,
	centered,
	tag,
	title,
	titleNode,
	description,
	paddingSide = true,
}: TitleSectionProps) => {
	const verticalPadding = noPaddingVertical ? "py-0" : noPaddingTop ? "pt-0 pb-10" : noPaddingBottom ? "pt-10 pb-0" : "py-6 sm:py-10";

	return (
		<div
			className={clsx(
				"mx-auto max-w-7xl tracking-wider",
				paddingSide && "px-6 lg:px-8",
				// Un seul jeu de classes de padding vertical : la version précédente
				// ajoutait py-0 par-dessus py-10 en comptant sur l'ordre du littéral,
				// alors qu'à spécificité égale c'est l'ordre dans la feuille CSS qui
				// tranche. Tailwind émettant py-0 avant py-10, noPaddingVertical
				// n'avait aucun effet.
				verticalPadding
			)}
		>
			<div className={`text-2xl sm:text-4xl tracking-wider text-univers ${centered ? "text-center" : ""}`}>
				{tag && (
					<div className="flex items-center mb-3 text-base sm:text-lg font-semibold leading-6 text-cohesion">
						<Image src={starOrange} alt="Image de l'élément de tag" width={64} height={64} className="-ml-3 w-12 aspect-1 sm:-ml-4 sm:w-16" />
						<h2>{tag}</h2>
					</div>
				)}
				{titleNode ? titleNode : <p className="text-2xl sm:text-4xl tracking-wider font-semibold text-univers">{title}</p>}
				{description && <p className="mt-10 sm:mt-6 leading-6 text-base sm:text-lg">{description}</p>}
			</div>
		</div>
	);
};
