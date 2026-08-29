import React from "react";
import { TitleSection } from "@/components/TitleSection";
import { StarBulletPoint } from "@/components/StarBulletPoint";

const dataList = [
	<span>
		<span className="font-bold">Formations continues</span> pour développer les compétences essentielles dans les pratiques de soin, d’accompagnement
		et de management en santé
	</span>,
	<span>
		<span className="font-bold">Durées adaptatives</span>, de la demi-journée à 3 jours avec un format recommandé à 2+1 jours en présentiel,
		distanciel ou hybride. En intra (dans vos locaux) ou dans des lieux inspirants
	</span>,
	<span>
		Un <span className="font-bold">dispositif de formation souple</span> avec un planning ajusté à vos besoins, des groupes adaptés à votre réalité
		terrain et des supports accessibles avant et après la formation
	</span>,
	<span>
		Des <span className="font-bold">modules ciblés</span> sur des besoins fondamentaux en Gériatrie, Accueil, Communication, Relation d’aide, pour
		aider les soignants au quotidien dans leur pratique
	</span>,
	<span>
		<span className="font-bold">Accompagnements personnalisés et analyse de la pratique</span> : Individuels ou collectifs, sur mesure selon vos
		besoins, vos objectifs, vos contraintes de temps et de lieu.
	</span>,
	<span>
		<span className="font-bold">Création de scénarios pédagogiques spécifiques</span> pour amener les apprenants à acquérir, assimiler et appliquer
		les connaissances dans leur quotidien
	</span>,
	<span>
		<span className="font-bold">Ressources et outils</span> mis à disposition : Supports numériques, capsules vidéo, Bibliothèque thématique, fiches
		mémo, supports illustrés…
	</span>,
];

export const PedagogyUSPSection = () => {
	return (
		<>
			<TitleSection tag="Nos formations" title="Des formations variées et adaptatives pour plus d’efficacité" />
			<div className="pb-10 mx-auto max-w-4xl px-6 lg:px-8">
				{dataList.map((node, index) => (
					<StarBulletPoint key={index} dataNode={node} />
				))}
			</div>
		</>
	);
};
