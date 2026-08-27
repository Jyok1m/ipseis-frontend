import React from "react";
import Link from "next/link";
import TitlePage from "@/components/global/TitlePage";
import Divider from "@/components/global/Divider";

import { PedagogyMethodologySection } from "@/components/sections/PedagogyMethodology";
import { ApproachSection } from "@/components/sections/Approach";
import { PedagogyFollowUpSection } from "@/components/sections/PedagogyFollowUp";
import { PedagogyTrainersSection } from "@/components/sections/PedagogyTrainers";
import { PedagogyQualityOutcomeSection } from "@/components/sections/PedagogyQualityOutcomes";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "Notre pédagogie - Apprentissage actif & immersif",
	description:
		"Une démarche pédagogique innovante combinant activité, coopération et expérimentation pour transformer durablement les pratiques professionnelles.",
	path: "/pedagogie",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
	{ name: "Pédagogie", path: "/pedagogie" },
]);

export default function Pedagogie() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />

			{/* Le titre n'est plus suivi d'une accroche ni d'un chapeau : les
			    sous-parties, identifiées par leur étoile rouge orangé, prennent la
			    suite directement. Deux phrases d'introduction se glissaient entre
			    les deux et repoussaient le contenu réel sous la ligne de flottaison. */}
			<TitlePage title="Pour former autrement et transformer durablement" />

			{/* Notre approche : la démarche d'élaboration de projet (roue) */}

			<ApproachSection
				hideList
				showWheel
				title="Une démarche d'élaboration de projet efficace, fluide, collaborative et de proximité"
				description=""
			/>

			{/* Une méthode participative qui engage et transforme */}

			<Divider />
			<PedagogyMethodologySection />

			{/* Un dispositif d'évaluation mobilisant des moyens permettant de mesurer les acquis */}

			<Divider />
			<PedagogyFollowUpSection />
			<div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 -mt-2 text-center">
				<Link
					href="/glossaire"
					className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-cohesion underline underline-offset-4 hover:text-univers transition-colors"
				>
					Consulter le glossaire
				</Link>
			</div>

			{/* Des formateurs sélectionnés pour leurs valeurs et expertise */}

			<Divider />
			<PedagogyTrainersSection />

			{/* Qualiopi et le catalogue ne figurent plus ici : la certification est
			    traitée dans l'onglet Qualité, où le certificat est consultable, et
			    le catalogue dans l'onglet Formations. Les répéter sur la pédagogie
			    faisait doublon sans rien apporter. */}

			<Divider />
			<PedagogyQualityOutcomeSection />
		</div>
	);
}
