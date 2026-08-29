import Image from "next/image";
import starOrange from "@/_images/logo/star_orange.svg";

type SectionHeadingProps = {
	children: React.ReactNode;
	className?: string;
	as?: "h2" | "h3";
};

/**
 * Titre de sous-section : étoile orange + libellé rouge orangé.
 *
 * Reprend l'habillage du `tag` de TitleSection, qui donnait son identité aux
 * pages marketing, mais en vrai niveau de titre : sur les pages de contenu
 * (bienvenue, qualité, formations) ces intitulés structurent la page et
 * doivent apparaître comme tels dans le plan du document et pour un lecteur
 * d'écran. `items-start` plutôt qu'`items-center` : sur deux lignes, un
 * centrage vertical décrochait l'étoile du premier mot.
 */
const SectionHeading = ({ children, className = "", as: Tag = "h2" }: SectionHeadingProps) => {
	return (
		<Tag className={`flex items-start gap-x-1 text-lg font-bold uppercase tracking-wider text-cohesion sm:text-2xl ${className}`}>
			<Image src={starOrange} alt="" aria-hidden width={64} height={64} className="-ml-3 w-11 shrink-0 aspect-1 sm:-ml-4 sm:w-14" />
			<span className="mt-1.5 sm:mt-2.5">{children}</span>
		</Tag>
	);
};

export default SectionHeading;
