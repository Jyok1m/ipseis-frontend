import React, { Suspense } from "react";
import TitlePage from "@/components/global/TitlePage";
import Divider from "@/components/global/Divider";
import { HealthPerimeterSection } from "@/components/sections/HealthPerimeter";
import CatalogueClient from "@/app/catalogue/CatalogueClient";
import CatalogueSkeleton from "@/app/catalogue/CatalogueSkeleton";
import { getThemes } from "@/lib/api";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

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
	const themes = await getThemes();

	return <CatalogueClient initialThemes={themes} />;
}

export default function Formations() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />

			<TitlePage
				title="Formations"
				descriptionNode={
					<>
						Des formations actives, immersives et sur mesure pour les équipes
						des établissements sanitaires, sociaux et médico-sociaux, ainsi que
						des formations transversales adaptées à tous les métiers.
					</>
				}
			/>

			{/* Notre périmètre */}

			<HealthPerimeterSection />

			{/* Catalogue de formations (transversales & santé) */}

			<Divider />
			<Suspense fallback={<CatalogueSkeleton />}>
				<CatalogueServer />
			</Suspense>
		</div>
	);
}
