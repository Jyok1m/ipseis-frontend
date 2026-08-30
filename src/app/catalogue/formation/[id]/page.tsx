import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import JsonLd from "@/components/utils/JsonLd";
import {
	buildMetadata,
	buildBreadcrumbJsonLd,
	truncate,
} from "@/components/utils/seo";
import { getTrainingById } from "@/lib/api";
import TrainingClient from "./_components/TrainingClient";
import TrainingSkeleton from "./_components/TrainingSkeleton";

/**
 * Aucune fiche n'est prérendue au build.
 *
 * La liste provenait d'un appel au backend, or BACKEND_URL n'est fournie qu'au
 * runtime : l'appel échouait pendant `next build` et retournait déjà [] via son
 * catch, sans que rien ne le signale. Autant l'assumer explicitement.
 *
 * `dynamicParams` vaut true par défaut : chaque fiche est donc rendue au
 * premier accès puis mise en cache, ce qui donne le même résultat qu'une
 * génération au build, étalée sur les premières visites.
 */
export async function generateStaticParams() {
	return [];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;

	try {
		const training = await getTrainingById(id);

		if (!training) {
			return buildMetadata({
				title: "Formation non trouvée - IPSEIS",
				description: "Cette formation n'existe pas ou n'est plus disponible.",
				path: `/catalogue/formation/${id}`,
			});
		}

		return buildMetadata({
			title: `${training.title} - Formation IPSEIS`,
			description: truncate(
				training.introduction?.trim() ||
					`Formation ${training.title} : ${training.program?.slice(0, 2).join(", ")}. Durée : ${training.duration}.`,
			),
			path: `/catalogue/formation/${id}`,
		});
	} catch (error) {
		return buildMetadata({
			title: "Formation professionnelle - IPSEIS",
			description:
				"Détails d'une formation IPSEIS : objectifs pédagogiques, programme, méthodes et modalités.",
			path: `/catalogue/formation/${id}`,
		});
	}
}

// Server Component pour les données pré-chargées
async function FormationServer({ id }: { id: string }) {
	const training = await getTrainingById(id);

	if (!training) {
		notFound();
	}

	const breadcrumbJsonLd = buildBreadcrumbJsonLd([
		{ name: "Catalogue", path: "/catalogue" },
		{ name: training.title, path: `/catalogue/formation/${training._id}` },
	]);

	// Le tarif est exprimé par journée d'intervention, pas comme un prix de
	// formation : le déclarer en offers reviendrait à annoncer un prix qui n'en
	// est pas un, donc on ne l'expose pas.
	const courseJsonLd = {
		"@context": "https://schema.org",
		"@type": "Course",
		name: training.title,
		description:
			training.introduction?.trim() ||
			training.pedagogical_objectives?.slice(0, 3).join(". ") ||
			training.title,
		inLanguage: "fr",
		url: `https://ipseis.eu/catalogue/formation/${training._id}`,
		teaches: training.pedagogical_objectives?.length
			? training.pedagogical_objectives
			: undefined,
		audience: training.audience
			? { "@type": "Audience", audienceType: training.audience }
			: undefined,
		coursePrerequisites: training.prerequisites || undefined,
		provider: {
			"@type": "EducationalOrganization",
			name: "IPSEIS",
			url: "https://ipseis.eu",
		},
		hasCourseInstance: {
			"@type": "CourseInstance",
			courseMode: "onsite",
			courseSchedule: training.duration
				? {
						"@type": "Schedule",
						repeatCount: 1,
						description: training.duration,
					}
				: undefined,
			instructor: training.trainer
				? { "@type": "Person", name: training.trainer }
				: undefined,
		},
	};

	return (
		<>
			<JsonLd data={breadcrumbJsonLd} />
			<JsonLd data={courseJsonLd} />
			<TrainingClient initialTraining={training} />
		</>
	);
}

export default async function FormationPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<Suspense fallback={<TrainingSkeleton />}>
			<FormationServer id={id} />
		</Suspense>
	);
}
