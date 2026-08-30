import type { Metadata } from "next";
import { Suspense } from "react";
import TitlePage from "@/components/global/TitlePage";
import JsonLd from "@/components/utils/JsonLd";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";
import { getCatalogue } from "@/lib/api";
import CatalogueClient from "./CatalogueClient";
import CatalogueSkeleton from "./CatalogueSkeleton";

export const metadata: Metadata = buildMetadata({
	title: "Catalogue de formations - Thématiques professionnelles",
	description:
		"Explorez le catalogue IPSEIS : formations innovantes, actives et sur mesure pour les équipes des établissements sanitaires, sociaux et médico-sociaux.",
	path: "/catalogue",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
	{ name: "Catalogue", path: "/catalogue" },
]);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ipseis.eu";

/** Liste ordonnée des formations visibles, pour que les moteurs les indexent depuis le catalogue. */
function buildCatalogueJsonLd(
	themes: Awaited<ReturnType<typeof getCatalogue>>,
) {
	const trainings = themes.flatMap((theme) =>
		theme.trainings.map((training) => ({ theme: theme.title, ...training })),
	);

	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Catalogue de formations IPSEIS",
		numberOfItems: trainings.length,
		itemListElement: trainings.map((training, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: training.title,
			url: `${SITE_URL}/catalogue/formation/${training._id}`,
		})),
	};
}

async function CatalogueServer() {
	const themes = await getCatalogue();

	return (
		<>
			<JsonLd data={buildCatalogueJsonLd(themes)} />
			<CatalogueClient themes={themes} />
		</>
	);
}

export default function CataloguePage() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />
			<TitlePage
				title="Catalogue de formations"
				descriptionNode={
					<>
						Découvrez nos secteurs d'activité et explorez les différentes
						thématiques que nous proposons pour répondre à vos besoins
						professionnels.
					</>
				}
			/>
			<Suspense fallback={<CatalogueSkeleton />}>
				<CatalogueServer />
			</Suspense>
		</div>
	);
}
