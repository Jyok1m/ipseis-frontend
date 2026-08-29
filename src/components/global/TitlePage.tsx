type TitlePageProps = {
	title: string;
	descriptionNode?: React.ReactNode;
	centered?: boolean;
	paddingHorizontal?: boolean;
	paddingBottom?: boolean;
};

/**
 * En-tête de page : titre et accroche.
 *
 * La description était un <span> portant un mt-6 : une marge verticale sur un
 * élément inline est ignorée, l'espacement ne venait que de l'interlignage.
 * Elle n'a plus de largeur maximale propre : elle suit celle du conteneur de
 * page, unique pour tout le site. Une contrainte séparée décalait le texte à
 * gauche pendant que le titre occupait toute la largeur.
 */
const TitlePage = ({ title, descriptionNode, centered = true, paddingHorizontal = true, paddingBottom = true }: TitlePageProps) => {
	return (
		<div
			className={`mx-auto max-w-4xl ${paddingHorizontal ? "px-5 sm:px-6 lg:px-8" : ""} ${
				paddingBottom ? "pb-8 sm:pb-10" : "pb-0"
			} pt-8 sm:pt-10`}
		>
			<div className={`text-univers ${centered ? "text-center" : ""}`}>
				<h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-wider text-balance">{title}</h1>
				{descriptionNode && (
					<p className="mt-4 text-base font-bold leading-relaxed tracking-normal text-pretty sm:mt-6 sm:text-lg">
						{descriptionNode}
					</p>
				)}
			</div>
		</div>
	);
};

export default TitlePage;
