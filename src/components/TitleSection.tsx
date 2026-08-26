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
	noPaddingVertical,
	centered,
	tag,
	title,
	titleNode,
	description,
	paddingSide = true,
}: TitleSectionProps) => {
	return (
		<div
			className={`mx-auto max-w-7xl ${paddingSide ? "px-6 lg:px-8" : ""} tracking-wider ${noPaddingTop ? "pt-0 pb-10" : "py-10"} ${
				noPaddingVertical ? "py-0" : ""
			}`}
		>
			<div className={`text-2xl sm:text-4xl tracking-wider text-univers ${centered ? "text-center" : ""}`}>
				{tag && (
					<div className="flex items-center mb-3 text-base sm:text-lg font-semibold leading-6 text-cohesion">
						<Image src={starOrange} alt="Image de l'élément de tag" width={64} height={64} className="-ml-4 w-16 aspect-1" />
						<h2>{tag}</h2>
					</div>
				)}
				{titleNode ? titleNode : <p className="text-2xl sm:text-4xl tracking-wider font-semibold text-univers">{title}</p>}
				{description && <p className="mt-10 sm:mt-6 leading-6 text-base sm:text-lg">{description}</p>}
			</div>
		</div>
	);
};
