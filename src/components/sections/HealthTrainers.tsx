import React from "react";
import { TitleSection } from "@/components/TitleSection";
import { StarBulletPoint } from "@/components/StarBulletPoint";

const dataList = [
	"Des experts reconnus, engagés et évalués,",
	"5 ans d’expérience terrain minimum",
	"Évalués sur le contenu, la pédagogie et l’accompagnement à chaque session",
	"En veille continue sur leur domaine d’expertise, se formant régulièrement",
	"Utilisent des méthodes pédagogiques innovantes et interactives",
	"Conformes au Référentiel National Qualité (Qualiopi)",
	"Signent notre charte qualité de formateur",
];

export const HealthTrainerSection = () => {
	return (
		<>
			<TitleSection tag="Notre expertise" title="Des formateurs sélectionnés pour leurs valeurs et expertise" />
			<div className="pb-10 mx-auto max-w-4xl px-6 lg:px-8">
				{dataList.map((node, index) => (
					<StarBulletPoint key={index} dataNode={node} />
				))}
			</div>
		</>
	);
};
