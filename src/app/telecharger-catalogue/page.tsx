import React from "react";
import TitlePage from "@/components/global/TitlePage";
import CatalogueDownloadForm from "./CatalogueDownloadForm";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "Télécharger le catalogue IPSEIS - Formations Santé",
	description:
		"Téléchargez gratuitement notre catalogue de formations dans le secteur de la santé et du médico-social. Formations certifiantes et qualifiantes.",
	path: "/telecharger-catalogue",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Télécharger le catalogue", path: "/telecharger-catalogue" }]);

export default function TelechargerCatalogue() {
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
			<CatalogueDownloadForm />
		</div>
	);
}
