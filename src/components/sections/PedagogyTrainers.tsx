import React from "react";
import { TitleSection } from "@/components/TitleSection";
import { StarBulletPoint } from "@/components/StarBulletPoint";

const trainersList = [
	"Des experts reconnus, engagés et évalués",
	"5 ans d'expérience terrain minimum",
	"Évalués sur le contenu, la pédagogie et l'accompagnement à chaque session",
	"En veille continue sur leur domaine d'expertise, se formant régulièrement",
	"Utilisent des méthodes pédagogiques innovantes et interactives",
	"Conformes au Référentiel National Qualité (Qualiopi)",
	"Signent notre charte qualité de formateur",
];

export const PedagogyTrainersSection = () => {
	return (
		<>
			<TitleSection tag="Nos formateurs" title="Des formateurs sélectionnés pour leurs valeurs et expertise" />
			<div className="pb-10 mx-auto max-w-7xl px-6 lg:px-8 tracking-wider">
				<div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
					{trainersList.map((item, index) => (
						<StarBulletPoint key={index} dataNode={item} />
					))}
				</div>
			</div>
		</>
	);
};
