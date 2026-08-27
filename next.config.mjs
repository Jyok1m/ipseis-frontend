/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	// `public/pdf` est lu au runtime pour n'afficher que les documents réellement
	// déposés (cf. src/lib/publicResources.ts). Le traceur de fichiers de Next ne
	// peut pas deviner cet accès : sans cette inclusion explicite, le dossier
	// serait absent du bundle serverless et la rubrique resterait vide en prod.
	outputFileTracingIncludes: {
		"/contact": ["./public/pdf/**"],
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "tailwindui.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

export default nextConfig;
