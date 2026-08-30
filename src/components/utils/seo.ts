import type { Metadata } from "next";

const siteName = "IPSEIS";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ipseis.eu";

export const defaultOpenGraph: Metadata["openGraph"] = {
	type: "website",
	locale: "fr_FR",
	siteName,
	images: [
		{
			url: `${baseUrl}/images/banner-home.png`,
			width: 1200,
			height: 630,
			alt: "IPSEIS - Formations santé & accompagnement",
		},
	],
};

export const defaultTwitter: Metadata["twitter"] = {
	card: "summary_large_image",
	site: "@ipseis", // placeholder si compte futur
	creator: "@ipseis",
};

export function buildMetadata({
	title,
	description,
	path = "/",
	index = true,
	follow = true,
	image,
}: {
	title: string;
	description: string;
	path?: string;
	index?: boolean;
	follow?: boolean;
	image?: { url: string; width?: number; height?: number; alt?: string };
}): Metadata {
	const url = `${baseUrl}${path}`;
	return {
		title,
		description,
		alternates: {
			canonical: url,
		},
		robots: { index, follow },
		openGraph: {
			...defaultOpenGraph,
			title,
			description,
			url,
			images: image ? [image] : defaultOpenGraph?.images,
		},
		twitter: {
			...defaultTwitter,
			title,
			description,
			images: image
				? [image.url]
				: Array.isArray(defaultOpenGraph?.images)
					? (defaultOpenGraph?.images as any[]).map((img) =>
							typeof img === "string" ? img : img.url,
						)
					: typeof defaultOpenGraph?.images === "string"
						? [defaultOpenGraph.images as string]
						: undefined,
		},
	};
}

export function truncate(str: string, max = 155) {
	if (str.length <= max) return str;
	return str.slice(0, max - 1).trimEnd() + "…";
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: baseUrl },
			...items.map((item, i) => ({
				"@type": "ListItem",
				position: i + 2,
				name: item.name,
				item: `${baseUrl}${item.path}`,
			})),
		],
	};
}
