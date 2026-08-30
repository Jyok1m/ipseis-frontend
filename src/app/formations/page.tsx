import React, { Suspense } from "react";
import TitlePage from "@/components/global/TitlePage";
import Divider from "@/components/global/Divider";
import { HandicapAccessibilitySection } from "@/components/sections/HandicapAccessibility";
import CatalogueClient from "@/app/catalogue/CatalogueClient";
import CatalogueSkeleton from "@/app/catalogue/CatalogueSkeleton";
import CatalogueCtaSection from "@/components/sections/CatalogueCtaSection";
import { getCatalogue } from "@/lib/api";
import { CATALOGUE_PDF_ENABLED } from "@/lib/features";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

/**
 * Rendu à la demande plutôt qu'au build.
 *
 * Cette route interroge le backend, or BACKEND_URL n'est fournie qu'au runtime :
 * pendant `next build` le fetch échoue et le repli gracieux de lib/api.ts
 * renvoie une liste vide. La page serait donc figée vide dans l'image, et le
 * temps de revalidation la laisserait ainsi après chaque déploiement.
 *
 * Le coût est faible : les fetch de lib/api.ts portent `next: { revalidate }`,
 * donc le Data Cache continue de servir les réponses backend et seul le rendu
 * HTML est refait.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
	title: "Formations - Transversales & spécialisées santé",
	description:
		"Découvrez notre catalogue de formations : formations transversales et formations dédiées aux professionnels de santé et aux établissements sanitaires, sociaux et médico-sociaux.",
	path: "/formations",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
	{ name: "Formations", path: "/formations" },
]);

// Server Component pour les données pré-chargées du catalogue
async function CatalogueServer() {
	return <CatalogueClient themes={await getCatalogue()} />;
}

export default function Formations() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />

			{/* La section « Notre périmètre » (structures / collaborateurs) a été
			    retirée : elle énumérait des sigles d'établissements et de métiers
			    entre le titre et le catalogue, et repoussait les deux colonnes de
			    publics - la seule chose que le visiteur vient chercher ici. */}
			<TitlePage
				title="Formations"
				descriptionNode="Des formations actives, immersives et sur mesure, adaptées à votre métier."
			/>

			{/* Catalogue de formations (santé & transversales) */}

			<Suspense fallback={<CatalogueSkeleton />}>
				<CatalogueServer />
			</Suspense>

			<Divider />

			{/* Accessibilité handicap (Qualiopi, indicateur 26) */}

			<div className="pt-10">
				<HandicapAccessibilitySection />
			</div>

			{/* Le catalogue PDF n'est proposé que si IPSEIS en dispose vraiment :
			    NEXT_PUBLIC_CATALOGUE_PDF_ENABLED commande à la fois cet encart, la
			    page /telecharger-catalogue et sa présence dans le sitemap. */}
			{CATALOGUE_PDF_ENABLED && (
				<div className="mx-auto max-w-4xl rounded-3xl">
					<CatalogueCtaSection
						title="Découvrez toutes nos formations"
						description="Téléchargez notre catalogue complet et explorez l'ensemble de nos formations."
						className="mx-6 lg:mx-8"
					/>
				</div>
			)}
		</div>
	);
}
