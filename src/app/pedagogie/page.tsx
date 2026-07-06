import React from "react";
import Link from "next/link";
import TitlePage from "@/components/global/TitlePage";
import Divider from "@/components/global/Divider";

import { PedagogyMethodologySection } from "@/components/sections/PedagogyMethodology";
import { ApproachSection } from "@/components/sections/Approach";
import { PedagogyFollowUpSection } from "@/components/sections/PedagogyFollowUp";
import { PedagogyTrainersSection } from "@/components/sections/PedagogyTrainers";
import { QualiopiSection } from "@/components/sections/Qualiopi";
import { PedagogyQualityOutcomeSection } from "@/components/sections/PedagogyQualityOutcomes";
import CatalogueCtaSection from "@/components/sections/CatalogueCtaSection";
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

			<TitlePage
				title="Pour former autrement et transformer durablement"
				descriptionNode="Notre démarche pédagogique"
			/>

			{/* Introduction de la démarche pédagogique (approche expérientielle) */}
			<div className="mx-auto max-w-3xl px-6 lg:px-8">
				<p className="text-base sm:text-lg text-univers text-center">
					Notre approche expérientielle repose sur l&apos;activité, la
					coopération, la participation et l&apos;anticipation.
				</p>
			</div>

			{/* Notre approche : la démarche d'élaboration de projet (roue) */}

			{/* <Divider /> */}
			<ApproachSection
				hideList
				showWheel
				title="Une démarche d'élaboration de projet efficace, fluide, collaborative et de proximité"
				description=""
			/>

			{/* Une méthode participative qui engage et transforme */}

			<Divider />
			<PedagogyMethodologySection />

			{/* 3. Un dispositif d'évaluation mobilisant des moyens permettant de mesurer les acquis */}

			<Divider />
			<PedagogyFollowUpSection />
			<div className="mx-auto max-w-5xl px-6 lg:px-8 -mt-2 text-center">
				<Link
					href="/glossaire"
					className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-cohesion underline underline-offset-4 hover:text-univers transition-colors"
				>
					Consulter le glossaire
				</Link>
			</div>

			{/* 4. Des formateurs sélectionnés pour leurs valeurs et expertise */}

			<Divider />
			<PedagogyTrainersSection />

			{/* Qualiopi */}

			<Divider />
			<QualiopiSection />

			<Divider />
			<PedagogyQualityOutcomeSection />

			{/* CTA Catalogue */}
			<Divider />
			<div className="mx-auto max-w-7xl mt-20 rounded-3xl">
				<CatalogueCtaSection
					title="Découvrez nos formations innovantes"
					description="Explorez notre pédagogie active appliquée à travers plus de 30 formations conçues pour transformer durablement vos pratiques professionnelles."
					className="mx-6 lg:mx-8"
				/>
			</div>

		</div>
	);
}
