import Image from "next/image";
import starOrange from "@/_images/logo/star_orange.svg";
import { STARRED_LABEL_CLASS, STARRED_LABEL_STAR_CLASS, STARRED_LABEL_TEXT_CLASS } from "./starredLabel";

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
 *
 * Casse normale et non capitales : les intitulés oranges du site suivent tous
 * la même règle, celle des `tag` de TitleSection (« Notre approche »). Le
 * `uppercase` d'origine faisait diverger ces titres-ci du reste de la charte.
 */
const SectionHeading = ({ children, className = "", as: Tag = "h2" }: SectionHeadingProps) => {
	return (
		<Tag className={`${STARRED_LABEL_CLASS} ${className}`}>
			<Image src={starOrange} alt="" aria-hidden width={64} height={64} className={STARRED_LABEL_STAR_CLASS} />
			<span className={STARRED_LABEL_TEXT_CLASS}>{children}</span>
		</Tag>
	);
};

export default SectionHeading;
