import type { Metadata } from "next";
import "./globals.css";
import AnalyticsGate from "@/components/global/AnalyticsGate";
import ConditionalHeader from "@/components/global/ConditionalHeader";
import CookieBanner from "@/components/global/CookieBanner";
import JsonLd from "@/components/utils/JsonLd";
import { defaultOpenGraph, defaultTwitter } from "@/components/utils/seo";

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.ipseis.fr"),
	title: {
		default: "IPSEIS - Formations innovantes santé & accompagnement",
		template: "%s | IPSEIS",
	},
	description:
		"IPSEIS est un organisme de formation innovant dédié aux professionnels du secteur sanitaire, social et médico-social : pédagogie active, immersive et sur mesure.",
	keywords: ["formation santé", "organisme de formation", "pédagogie active", "innovation pédagogique", "secteur médico-social", "réflexologie"],
	authors: [{ name: "IPSEIS" }],
	creator: "IPSEIS",
	publisher: "IPSEIS",
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		...defaultOpenGraph,
		title: "IPSEIS - Formations innovantes santé & accompagnement",
		description:
			"Organisme de formation certifié proposant des parcours sur mesure, actifs et immersifs pour les professionnels de santé et du médico-social.",
		url: "/",
	},
	twitter: {
		...defaultTwitter,
		title: "IPSEIS - Formations innovantes santé & accompagnement",
		description: "Parcours de formation actifs, immersifs et sur mesure pour les professionnels de santé et du médico-social.",
	},
	icons: {
		apple: [
			{ url: "/icons/apple-icon-57x57.png", sizes: "57x57" },
			{ url: "/icons/apple-icon-60x60.png", sizes: "60x60" },
			{ url: "/icons/apple-icon-72x72.png", sizes: "72x72" },
			{ url: "/icons/apple-icon-76x76.png", sizes: "76x76" },
			{ url: "/icons/apple-icon-114x114.png", sizes: "114x114" },
			{ url: "/icons/apple-icon-120x120.png", sizes: "120x120" },
			{ url: "/icons/apple-icon-144x144.png", sizes: "144x144" },
			{ url: "/icons/apple-icon-152x152.png", sizes: "152x152" },
			{ url: "/icons/apple-icon-180x180.png", sizes: "180x180" },
		],
		icon: [
			{ url: "/icons/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			{ url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
	},
	manifest: "/manifest.json",
};

const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "EducationalOrganization",
	name: "IPSEIS",
	url: "https://www.ipseis.fr",
	logo: "https://www.ipseis.fr/images/banner-home.png",
	description:
		"Organisme de formation innovant dédié aux professionnels du secteur sanitaire, social et médico-social.",
	address: {
		"@type": "PostalAddress",
		streetAddress: "21 Rue de la Nation",
		addressLocality: "Saint-Malo",
		postalCode: "35400",
		addressCountry: "FR",
	},
	email: "helenedm@ipseis.fr",
	sameAs: [],
	hasCredential: {
		"@type": "EducationalOccupationalCredential",
		credentialCategory: "Qualiopi",
		name: "Certification Qualiopi - Actions de Formation",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const maintenance = process.env.MAINTENANCE_MODE === "true";

	return (
		<html lang="fr" className="font-serif">
			<head>
				<JsonLd data={organizationJsonLd} />
			</head>
			<body className="flex flex-col justify-between min-h-screen max-w-screen bg-support overflow-x-hidden">
				{!maintenance && <ConditionalHeader />}
				<div className="bg-support">{children}</div>
				{!maintenance && (
					<>
						<CookieBanner />
						<AnalyticsGate />
					</>
				)}
			</body>
		</html>
	);
}
