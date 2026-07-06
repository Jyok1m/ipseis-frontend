import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Page non trouvée | IPSEIS",
	description: "La page que vous recherchez n'existe pas ou a été déplacée.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<div className="bg-support min-h-full flex flex-col items-center justify-center px-6 text-center">
			<h1 className="text-6xl font-bold text-univers mb-4">404</h1>
			<p className="text-xl text-univers/70 mb-8">La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
			<Link
				href="/"
				className="rounded-xl bg-univers px-6 py-3 text-support font-bold shadow-md hover:bg-univers/90 transition-all duration-200"
			>
				Retour à l&apos;accueil
			</Link>
		</div>
	);
}
