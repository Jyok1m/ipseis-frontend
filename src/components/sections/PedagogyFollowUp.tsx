import React from "react";
import { FeatureBox } from "@/components/FeatureBox";
import { TitleSection } from "@/components/TitleSection";
import { StarBulletPoint } from "@/components/StarBulletPoint";

const avantList = ["Analyse des attentes et du contexte", "Questionnaire de positionnement", "Mise à disposition de connaissance introductive"];

const pendantList = [
	"Feedbacks réguliers",
	"Évaluation continue des acquis",
	"Questionnement collectif",
	"Questionnaire de satisfaction « à chaud »",
];

const aprèsList = ["Évaluation de l’impact « à froid »", "Débrief personnalisé avec la structure", "Recommandations pour aller plus loin"];

export const PedagogyFollowUpSection = () => {
	return (
		<>
			<TitleSection tag="Évaluation & suivi" title="Un accompagnement qualitatif sur-mesure pour le bénéfice des apprenants" />
			<div className="pb-10 mx-auto max-w-7xl px-6 lg:px-8 tracking-wider">
				<div className="mx-auto max-w-7xl">
					<div className="mx-auto grid grid-cols-1 gap-8 text-base sm:text-lg text-univers sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:gap-x-16">
						<div className="sm:col-start-1 sm:row-start-1">
							<FeatureBox
								title="Avant la formation"
								description={avantList.map((dataNode, index) => (
									<StarBulletPoint key={index} dataNode={dataNode} />
								))}
								bgColor="support"
							/>
						</div>
						<div className="sm:col-start-2 sm:row-start-1">
							<FeatureBox
								title="Pendant la formation"
								description={pendantList.map((dataNode, index) => (
									<StarBulletPoint key={index} dataNode={dataNode} />
								))}
								bgColor="support"
							/>
						</div>
						<div className="sm:col-start-3 sm:row-start-1">
							<FeatureBox
								title="Après la formation"
								description={aprèsList.map((dataNode, index) => (
									<StarBulletPoint key={index} dataNode={dataNode} />
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
