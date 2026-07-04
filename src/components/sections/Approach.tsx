import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiploma } from "@fortawesome/pro-regular-svg-icons";
import { TitleSection } from "@/components/TitleSection";

type ApproachItem = {
	name: string;
	src?: string;
	icon?: typeof faDiploma;
};

const dataList: ApproachItem[] = [
	{
		name: "Une pédagogie impactante, active et immersive",
		src: "/images/sante_features/1.png",
	},
	{
		name: "Une approche de proximité, humaine et coopérative",
		src: "/images/sante_features/2.png",
	},
	{
		name: "Des formations innovantes & sur mesure de qualité",
		src: "/images/sante_features/3.png",
	},
	{
		name: "Respect engagements  et réactivité",
		src: "/images/sante_features/4.png",
	},
	{
		name: "Des intervenants experts et engagés",
		src: "/images/sante_features/5.png",
	},
	{
		name: "Une qualité certifiée, exigeante et reconnue",
		icon: faDiploma,
	},
];

type ApproachSectionProps = {
	showWheel?: boolean;
};

export const ApproachSection = ({ showWheel = false }: ApproachSectionProps) => {
	return (
		<>
			<TitleSection
				tag="Notre approche"
				title="Choisir Ipseis c’est apprendre autrement pour progresser durablement"
				description="Participer à nos formations vous permettra d’acquérir, d’assimiler et de mettre en œuvre plus facilement les compétences clés pour exercer votre métier de soignant de manière plus efficace et plus sereine."
			/>
			<div className="pb-10 mx-auto max-w-7xl px-6 lg:px-8 tracking-wider">
				<dl className="mx-auto grid grid-cols-1 gap-8 text-base sm:text-lg text-univers sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
					{dataList.map((data) => (
						<div key={data.name} className="relative">
							<dt className="flex items-center gap-x-2 font-medium">
								{data.icon ? (
									<span className="flex w-[50px] justify-center">
										<FontAwesomeIcon icon={data.icon} className="text-cohesion text-[44px]" />
									</span>
								) : (
									<Image src={data.src!} alt={`Image de ${data.name}`} width={50} height={50} sizes="(max-width: 640px) 50px, 50px" />
								)}
								{data.name}
							</dt>
						</div>
					))}
				</dl>
				{showWheel && (
					<div className="mt-12 flex justify-center">
						<Image
							src="/images/roue-formation-ipseis.svg"
							alt="Roue de la démarche de formation IPSEIS"
							width={640}
							height={632}
							sizes="(max-width: 768px) 100vw, 640px"
							className="w-full max-w-2xl h-auto"
						/>
					</div>
				)}
			</div>
		</>
	);
};
