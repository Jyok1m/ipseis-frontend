import React from "react";
import TitlePage from "@/components/global/TitlePage";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "Glossaire des évaluations - IPSEIS",
	description:
		"Les dispositifs d'évaluation mobilisés par IPSEIS avant, pendant et après la formation : positionnement, acquis, satisfaction et impact.",
	path: "/glossaire",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
	{ name: "Glossaire", path: "/glossaire" },
]);

/**
 * Chaque entrée reprend le libellé employé ailleurs sur le site, le terme
 * technique venant en complément dans la définition.
 *
 * Les intitulés étaient auparavant les termes académiques seuls (diagnostique,
 * formative, sommative) : aucun n'apparaît sur la page /pedagogie ni sur les
 * fiches formation d'où provient le lecteur, si bien que le glossaire
 * définissait un vocabulaire que le site n'emploie pas. Les libellés suivent
 * désormais PedagogyFollowUp.tsx et les fiches formation.
 *
 * TODO (IPSEIS) : définitions à valider par Hélène.
 *
 * TODO (IPSEIS) : évaluation de fin de formation (dite sommative) - entrée
 * retirée en attendant confirmation. Le dispositif décrit sur /pedagogie ne
 * mentionne aucune mesure des acquis en fin de parcours : la colonne « Pendant »
 * s'arrête à l'évaluation continue, la colonne « Après » commence à l'à-froid.
 * Si IPSEIS en pratique une, l'ajouter ici ET dans pendantList
 * (PedagogyFollowUp.tsx) ; sinon laisser en l'état.
 */
const evaluations: { term: string; definition: string }[] = [
	{
		term: "Questionnaire de positionnement",
		definition:
			"Évaluation diagnostique réalisée en amont de la formation. Elle situe le niveau et les besoins de chaque stagiaire afin d'adapter le parcours avant son démarrage.",
	},
	{
		term: "Évaluation continue des acquis",
		definition:
			"Évaluation formative menée tout au long de la formation. Elle mesure la progression en cours de parcours et permet de réajuster la pédagogie sans attendre la fin.",
	},
	{
		term: "Évaluation de la satisfaction « à chaud »",
		definition:
			"Recueil de la satisfaction des stagiaires, et le cas échéant du commanditaire, à l'issue immédiate de la formation. Elle porte sur le déroulement et le ressenti, non sur les acquis.",
	},
	{
		term: "Évaluation de l'impact « à froid »",
		definition:
			"Évaluation conduite quelques semaines à quelques mois après la formation. Elle mesure ce qui a réellement été transféré en situation professionnelle, une fois le recul pris.",
	},
];

/**
 * Identifiant d'ancre lisible.
 *
 * La décomposition NFD sépare les diacritiques de leur lettre, qui sont alors
 * retirés avant le filtrage : sans elle, « Évaluation » devenait « valuation »
 * puisque « É » ne fait pas partie de [a-z0-9].
 */
const slugify = (term: string) =>
	term
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

export default function Glossaire() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />
			<div className="mx-auto max-w-4xl px-5 pb-10 sm:px-6 lg:px-8">
				<TitlePage
					title="Glossaire des évaluations"
					descriptionNode="Les dispositifs mobilisés avant, pendant et après la formation"
				/>

				{/* TODO (IPSEIS) : bandeau à retirer une fois les définitions validées. */}
				{/* <div className="mt-4 rounded-lg border border-maitrise/40 bg-maitrise/10 px-4 py-3 text-sm text-univers/80">
					Page en cours de finalisation&nbsp;: les définitions ci-dessous sont
					des propositions à valider et compléter par IPSEIS.
				</div> */}

				<dl className="mt-10 space-y-8 text-base sm:text-lg text-univers">
					{evaluations.map(({ term, definition }) => (
						<div
							key={term}
							id={slugify(term)}
							className="scroll-mt-24"
						>
							<dt className="font-bold text-univers">{term}</dt>
							<dd className="mt-1 text-univers/90">{definition}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
