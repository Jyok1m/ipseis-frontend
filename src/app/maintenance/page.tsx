import type { Metadata } from "next";
import Image from "next/image";
import logoGreen from "@/_images/logo/logo_green.svg";

export const metadata: Metadata = {
	title: "Site en maintenance",
	description: "Le site IPSEIS est momentanément en maintenance. Nous revenons très prochainement.",
	robots: { index: false, follow: false },
};

export default function MaintenancePage() {
	return (
		<div className="bg-support min-h-full flex flex-col items-center justify-center px-6 py-16 text-center">
			<div className="flex max-w-xl flex-col items-center">
				<Image src={logoGreen} alt="IPSEIS" priority className="mb-10 h-auto w-48 sm:w-56" />

				<span className="mb-8 inline-block h-1 w-16 rounded-full bg-cohesion" />

				<h1 className="mb-5 text-3xl text-univers sm:text-4xl">Site en maintenance</h1>

				<p className="mb-8 text-base leading-relaxed text-univers/70 sm:text-lg">
					Nous réalisons actuellement une mise à jour complète de notre site afin de vous offrir une meilleure
					expérience. Il sera de nouveau accessible très prochainement. Merci de votre patience.
				</p>

				<a
					href="mailto:helenedm@ipseis.fr"
					className="text-sm font-semibold text-cohesion transition-colors hover:text-univers"
				>
					Une question&nbsp;? helenedm@ipseis.fr
				</a>
			</div>
		</div>
	);
}
