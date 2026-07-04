import React from "react";
import TitlePage from "@/components/global/TitlePage";
import Footer from "@/components/global/Footer";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "Glossaire des évaluations - IPSEIS",
	description:
		"Glossaire des dispositifs d'évaluation mobilisés par IPSEIS pour mesurer les acquis des stagiaires tout au long de la formation.",
	path: "/glossaire",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Glossaire", path: "/glossaire" }]);

// TODO (IPSEIS) : contenu à valider/compléter par Hélène.
// Chaque entrée décrit un dispositif d'évaluation. Les définitions ci-dessous sont des
// propositions de départ à relire et ajuster.
const evaluations: { term: string; definition: string }[] = [
	{
		term: "Évaluation diagnostique (pré-formation)",
		definition:
			"À COMPLÉTER — Évaluation réalisée en amont de la formation pour situer le niveau et les besoins des stagiaires et adapter le parcours.",
	},
	{
		term: "Évaluation formative (en cours de formation)",
		definition:
			"À COMPLÉTER — Évaluation continue tout au long de la formation permettant de mesurer la progression et de réajuster la pédagogie.",
	},
	{
		term: "Évaluation sommative (fin de formation)",
		definition:
			"À COMPLÉTER — Évaluation des acquis en fin de formation, au regard des objectifs pédagogiques.",
	},
	{
		term: "Évaluation de la satisfaction",
		definition:
			"À COMPLÉTER — Recueil de la satisfaction des stagiaires (et le cas échéant du commanditaire) à l'issue de la formation.",
	},
	{
		term: "Évaluation à froid",
		definition:
			"À COMPLÉTER — Évaluation réalisée quelques semaines/mois après la formation pour mesurer le transfert des acquis en situation professionnelle.",
	},
];

export default function Glossaire() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />
			<div className="mx-auto max-w-4xl px-6 lg:px-8 pb-10">
				<TitlePage
					title="Glossaire des évaluations"
					descriptionNode="Les dispositifs mobilisés pour mesurer les acquis"
				/>

				{/* TODO (IPSEIS) : bandeau à retirer une fois les définitions validées. */}
				<div className="mt-4 rounded-lg border border-maitrise/40 bg-maitrise/10 px-4 py-3 text-sm text-univers/80">
					Page en cours de finalisation&nbsp;: les définitions ci-dessous sont des propositions à valider et compléter par
					IPSEIS.
				</div>

				<dl className="mt-10 space-y-8 text-base sm:text-lg text-univers">
					{evaluations.map(({ term, definition }) => (
						<div
							key={term}
							id={term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
							className="scroll-mt-24"
						>
							<dt className="font-bold text-univers">{term}</dt>
							<dd className="mt-1 text-univers/90">{definition}</dd>
						</div>
					))}
				</dl>
			</div>
			<Footer />
		</div>
	);
}
