import type { Metadata } from "next";
import { Suspense } from "react";
import TitlePage from "@/components/global/TitlePage";
import JsonLd from "@/components/utils/JsonLd";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";
import { getThemes } from "@/lib/api";
import CatalogueClient from "./CatalogueClient";
import CatalogueSkeleton from "./CatalogueSkeleton";

export const metadata: Metadata = buildMetadata({
	title: "Catalogue de formations - Thématiques professionnelles",
	description:
		"Explorez le catalogue IPSEIS : formations innovantes, actives et sur mesure pour les équipes des établissements sanitaires, sociaux et médico-sociaux.",
	path: "/catalogue",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Catalogue", path: "/catalogue" }]);

// Server Component pour les données pré-chargées
async function CatalogueServer() {
	const themes = await getThemes();

	return <CatalogueClient initialThemes={themes} />;
}

export default function CataloguePage() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />
			<TitlePage
				title="Catalogue de formations"
				descriptionNode={
					<>
						Découvrez nos secteurs d'activité et explorez les différentes thématiques que nous proposons pour répondre à vos besoins professionnels.
					</>
				}
			/>
			<Suspense fallback={<CatalogueSkeleton />}>
				<CatalogueServer />
			</Suspense>
		</div>
	);
}
