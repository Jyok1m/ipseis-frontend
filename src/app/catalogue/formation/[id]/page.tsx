import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Footer from "@/components/global/Footer";
import JsonLd from "@/components/utils/JsonLd";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";
import { getTrainingById, getAllTrainings } from "@/lib/api";
import TrainingClient from "./_components/TrainingClient";
import TrainingSkeleton from "./_components/TrainingSkeleton";

// Génération statique des pages les plus populaires
export async function generateStaticParams() {
	try {
		const { themes } = await getAllTrainings();

		// Extraire tous les IDs de formation
		const trainingIds = themes.flatMap((theme) =>
			theme.trainings.map((training) => ({
				id: training._id,
			}))
		);

		// On peut limiter à un certain nombre pour éviter de générer trop de pages
		// Par exemple, les 20 premières formations
		return trainingIds.slice(0, 20);
	} catch (error) {
		console.error("Error generating static params:", error);
		return [];
	}
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
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
			description: `Formation ${training.title} : ${training.program?.slice(0, 2).join(", ")}...`,
			path: `/catalogue/formation/${id}`,
		});
	} catch (error) {
		return buildMetadata({
			title: "Formation professionnelle - IPSEIS",
			description: "Détails d'une formation IPSEIS : objectifs pédagogiques, programme, méthodes et modalités.",
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

	const courseJsonLd = {
		"@context": "https://schema.org",
		"@type": "Course",
		name: training.title,
		description: training.pedagogical_objectives?.slice(0, 3).join(". ") || training.title,
		provider: {
			"@type": "Organization",
			name: "IPSEIS",
			url: "https://www.ipseis.fr",
		},
		hasCourseInstance: {
			"@type": "CourseInstance",
			courseMode: "onsite",
			instructor: training.trainer ? { "@type": "Person", name: training.trainer } : undefined,
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

export default async function FormationPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return (
		<>
			<Suspense fallback={<TrainingSkeleton />}>
				<FormationServer id={id} />
			</Suspense>
			<Footer />
		</>
	);
}
