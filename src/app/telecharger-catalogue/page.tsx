import React from "react";
import { notFound } from "next/navigation";
import TitlePage from "@/components/global/TitlePage";
import CatalogueDownloadForm from "./CatalogueDownloadForm";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";
import { getAllTrainings } from "@/lib/api";
import { CATALOGUE_PDF_ENABLED } from "@/lib/features";

export const metadata: Metadata = buildMetadata({
	title: "Télécharger le catalogue IPSEIS - Formations Santé",
	description:
		"Téléchargez gratuitement notre catalogue de formations dans le secteur de la santé et du médico-social. Formations certifiantes et qualifiantes.",
	path: "/telecharger-catalogue",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Télécharger le catalogue", path: "/telecharger-catalogue" }]);

export default async function TelechargerCatalogue() {
	// La page répond 404 quand le catalogue PDF est masqué : la masquer
	// seulement dans la navigation laisserait l'URL accessible, indexable, et
	// enverrait une demande de catalogue qu'IPSEIS ne peut pas honorer.
	if (!CATALOGUE_PDF_ENABLED) notFound();

	const { themes } = await getAllTrainings();

	return (
		<div className="bg-support min-h-full flex flex-col items-center pb-10">
			<JsonLd data={breadcrumbJsonLd} />
			<TitlePage
				title="Télécharger notre catalogue"
				descriptionNode={
					<>
						Découvrez l'ensemble de nos formations 2025 dans le secteur de la santé et du médico-social.
						<br />
						Renseignez vos informations ci-dessous pour recevoir gratuitement notre catalogue complet par email.
					</>
				}
			/>
			<CatalogueDownloadForm themes={themes} />
		</div>
	);
}
