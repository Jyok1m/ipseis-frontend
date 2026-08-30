import type { MetadataRoute } from "next";
import { getAllTrainings } from "@/lib/api";
import { CATALOGUE_PDF_ENABLED } from "@/lib/features";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ipseis.eu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${baseUrl}/catalogue`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/formations`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/pedagogie`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/qualite`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/a-propos`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/mentions-legales`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/politique-de-confidentialite`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	// Dynamic training pages
	let trainingPages: MetadataRoute.Sitemap = [];
	try {
		const { themes } = await getAllTrainings();
		trainingPages = themes.flatMap((theme) =>
			theme.trainings.map((training) => ({
				url: `${baseUrl}/catalogue/formation/${training._id}`,
				lastModified: new Date(),
				changeFrequency: "weekly" as const,
				priority: 0.7,
			})),
		);
	} catch {
		// Sitemap still works without dynamic pages
	}

	// La page de téléchargement du catalogue répond 404 tant que le catalogue
	// PDF est masqué : la déclarer ici enverrait les robots sur une impasse.
	const catalogueDownloadPage: MetadataRoute.Sitemap = CATALOGUE_PDF_ENABLED
		? [
				{
					url: `${baseUrl}/telecharger-catalogue`,
					lastModified: new Date(),
					changeFrequency: "monthly" as const,
					priority: 0.6,
				},
			]
		: [];

	return [...staticPages, ...catalogueDownloadPage, ...trainingPages];
}
