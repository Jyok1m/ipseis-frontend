/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
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
