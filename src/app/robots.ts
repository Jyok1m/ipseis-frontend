import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ipseis.eu";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/espace-personnel/", "/api/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
