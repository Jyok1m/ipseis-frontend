import React from "react";
import Image from "next/image";
import { TitleSection } from "@/components/TitleSection";

const dataList = [
	{
		name: "Montée en compétences durable et contextualisée",
		src: "/images/pedagogy_outcomes/1.png",
	},
	{
		name: "Renforcement du collectif et de la coopération",
		src: "/images/pedagogy_outcomes/2.png",
	},
	{
		name: "Meilleure appropriation des savoirs et pratiques",
		src: "/images/pedagogy_outcomes/3.png",
	},
	{
		name: "Retour rapide sur investissement pédagogique",
		src: "/images/pedagogy_outcomes/4.png",
	},
	{
		name: "Implication renforcée grâce à des méthodes ludiques",
		src: "/images/pedagogy_outcomes/5.png",
	},
	{
		name: "Valorisation des professionnels et motivation accrue",
		src: "/images/pedagogy_outcomes/6.png",
	},
];

export const PedagogyQualityOutcomeSection = () => {
	return (
		<>
			<TitleSection tag="Notre engagement" title="Pour une meilleure qualité des soins et satisfaction des usagers" />
			<div className="pb-10 mx-auto max-w-7xl px-6 lg:px-8 tracking-wider">
				<dl className="mx-auto grid grid-cols-1 gap-8 text-base sm:text-lg text-univers sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
					{dataList.map((data) => (
						<div key={data.name} className="relative">
							<dt className="flex items-center gap-x-2 font-medium">
								<Image
									src={data.src}
									alt={`Image de ${data.name}`}
									width={50}
									height={50}
									sizes="(max-width: 640px) 50px, 50px"
									className="h-[50px] w-[50px] object-contain"
								/>
								{data.name}
							</dt>
						</div>
					))}
				</dl>
			</div>
		</>
	);
};
