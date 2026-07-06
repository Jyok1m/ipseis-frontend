import React from "react";
import Image from "next/image";
import Button from "@/components/global/Button";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata } from "@/components/utils/seo";
import tiretHome from "@/_images/tiret-home.png";

export const metadata: Metadata = buildMetadata({
	title: "Accueil - Organisme de formation innovant santé & médico-social",
	description:
		"IPSEIS conçoit des formations actives, immersives et sur mesure pour les professionnels de la santé, du social et médico-social. Découvrez notre approche pédagogique unique.",
	path: "/",
});

const webSiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "IPSEIS",
	url: "https://www.ipseis.fr",
	description:
		"Organisme de formation innovant dédié aux professionnels du secteur sanitaire, social et médico-social.",
	publisher: {
		"@type": "Organization",
		name: "IPSEIS",
	},
};

export default function Accueil() {
	return (
		<div className="relative flex min-h-full flex-col bg-univers overflow-hidden">
			<JsonLd data={webSiteJsonLd} />
			<div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-y-1 sm:gap-y-5 px-5 py-4 sm:px-10 sm:w-5/6 lg:w-3/5 self-center">
				{/* Gros titre */}

				<div className="text-xl sm:text-4xl font-bold tracking-widest text-cohesion leading-snug">
					<h1>Vous êtes unique, nos formations et accompagnements aussi.</h1>
					<Image src={tiretHome} alt="tiret" className="my-2 sm:my-5 w-[75px] h-auto" />
				</div>

				{/* Description */}

				<div className="flex flex-col text-sm sm:text-xl text-support gap-y-1 sm:gap-y-5">
					<p>
						Chez IPSEIS, nous croyons que l'apprentissage des professionnels passe par une alliance subtile entre théorie et pratique, transmission et
						expérimentation. Nous concevons des expériences pédagogiques sur-mesure, ancrées dans le réel, pour faire évoluer les pratiques
						quotidiennes et les comportements pour un meilleur fonctionnement d'équipe.
					</p>
					<p className="block md:hidden">Et si la formation devenait une expérience à vivre ?</p>
					<div className="w-full flex justify-start text-support mt-1 sm:mt-5">
						<Button href="/catalogue">
							<span className="md:block items-center text-center hidden">Et si la formation devenait une expérience à vivre ?</span>
							<span className="flex items-center gap-x-2 font-semibold text-center">
								<span className="hover:underline hover:underline-offset-8">Découvrir nos formations</span>
								<span className="mt-1">→</span>
							</span>
						</Button>
					</div>
				</div>
			</div>
			<Image
				src="/images/star_beige.svg"
				alt="Étoile Ipseis"
				width={500}
				height={500}
				className="absolute z-10 opacity-10 top-5 -right-28 sm:-top-5 md:w-[750px] md:-top-20 md:-right-44 lg:w-[1000px] lg:-top-36 lg:-right-60"
			/>
		</div>
	);
}
