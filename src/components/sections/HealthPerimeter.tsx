import React from "react";
import { TitleSection } from "@/components/TitleSection";
import { FeatureBox } from "@/components/FeatureBox";
import { StarBulletPoint } from "@/components/StarBulletPoint";

const structures = [
	"Sanitaires : Hôpitaux, Cliniques, SSR, CCR, USLD, CMP, CATTP, EPSM, HDJ…",
	"Medico social : EHPAD EHPA SSIAD, Accueil de jour, Foyers de vie, ESAT, MAS SESSAD…",
	"Social : Service d’aide à la personne, familles d’accueil, Aidants…",
];

const collaborateurs = [
	"IDE, Psychologue, Ergothérapeute, Cadre de Santé…",
	"Agent de soin AS, ASG, ASH, AMP…",
	"Agent Administratif, Animatrice, Auxiliaire de vie…",
	"Nous adaptons nos formations afin d’accueillir les stagiaires en situation de handicap",
];

export const HealthPerimeterSection = () => {
	return (
		<>
			<TitleSection tag="Notre périmètre" title="Apporter notre expertise au personnel des structures en santé" noPaddingTop />
			<div className="pb-10 mx-auto max-w-4xl px-6 lg:px-8 tracking-wider">
				<div className="mx-auto max-w-4xl">
					<div className="mx-auto grid grid-cols-1 gap-8 text-base sm:text-lg text-univers sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
						<div className="sm:col-start-1 sm:row-start-1">
							<FeatureBox
								title="Structures"
								description={structures.map((structure, index) => (
									<StarBulletPoint key={index} dataNode={structure} />
								))}
								bgColor="support"
							/>
						</div>
						<div className="sm:col-start-2 sm:row-start-1">
							<FeatureBox
								title="Collaborateurs"
								description={collaborateurs.map((collaborateur, index) => (
									<StarBulletPoint key={index} dataNode={collaborateur} />
								))}
								bgColor="support"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
