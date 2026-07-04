type ContentHeadingProps = {
	children: React.ReactNode;
	className?: string;
};

// Titre de sous-section « in-content » (pages de contenu : à propos, qualité…).
// Distinct de TitleSection (sections marketing pleine largeur, tag + étoile).
const ContentHeading = ({ children, className = "" }: ContentHeadingProps) => {
	return <h2 className={`text-xl sm:text-2xl font-bold text-univers ${className}`}>{children}</h2>;
};

export default ContentHeading;
