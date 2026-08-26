import React from "react";
import Image from "next/image";
import { FeatureBox } from "@/components/FeatureBox";
import { TitleSection } from "@/components/TitleSection";
import starGreen from "@/_images/logo/star_green.svg";

export const HealthValueSection = () => {
	return (
		<>
			<TitleSection tag="Nos valeurs" title="Des valeurs et des formateurs qui nous ressemblent et vous rassemblent" />
			<div className="pb-10 mx-auto max-w-4xl px-6 lg:px-8 tracking-wider">
				<div className="mx-auto max-w-4xl">
					{/* Grille 3x3 — cartes rapprochées de l’étoile */}
					<div className="relative grid grid-cols-1 gap-4 sm:gap-2 sm:[grid-template-columns:0.9fr_1fr_0.9fr] sm:[grid-template-rows:0.9fr_1fr_0.9fr] place-items-stretch">
						{/* (1,2) — haut centre */}
						<div className="sm:col-start-2 sm:row-start-1">
							<FeatureBox title="Créativité & Innovation" description="Oser penser différemment pour former autrement" bgColor="maitrise" centered />
						</div>

						{/* (2,1) — milieu gauche */}
						<div className="sm:col-start-1 sm:row-start-2 sm:translate-x-2">
							<FeatureBox
								title="Transmission & Partage"
								description="Faire circuler les savoirs pour faire grandir les équipes"
								bgColor="maitrise"
								centered
							/>
						</div>

						{/* (2,2) — centre : étoile */}
						<div className="sm:col-start-2 sm:row-start-2 justify-center items-center relative z-10 hidden sm:flex">
							<div className="relative z-20 sm:-mt-8 sm:-mb-8 sm:-mx-6">
								<Image src={starGreen} alt="Image de l'étoile d'Ipseis" width={48} height={48} className="w-60 h-60" />
							</div>
						</div>

						{/* (2,3) — milieu droite */}
						<div className="sm:col-start-3 sm:row-start-2 sm:-translate-x-2">
							<FeatureBox
								title="Transformer les pratiques"
								description="Accompagner les professionnels vers plus d’efficacité, de confiance et de bien-être au travail"
								bgColor="maitrise"
								centered
							/>
						</div>

						{/* (3,1) — bas gauche */}
						<div className="sm:col-start-1 sm:row-start-3 sm:translate-x-16 md:translate-x-32 lg:translate-x-36">
							<FeatureBox
								title="Professionnalisme & Qualité"
								description="Délivrer le meilleur en engageant, avec exigence et rigueur"
								bgColor="maitrise"
								centered
							/>
						</div>

						{/* (3,3) — bas droite */}
						<div className="sm:col-start-3 sm:row-start-3 sm:-translate-x-16 md:-translate-x-32 lg:-translate-x-36">
							<FeatureBox title="Respect & Intégrité" description="Faire de la confiance une évidence" bgColor="maitrise" centered />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
