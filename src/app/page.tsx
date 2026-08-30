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
	url: "https://ipseis-formation.fr",
	description:
		"Organisme de formation innovant dédié aux professionnels du secteur sanitaire, social et médico-social.",
	publisher: {
		"@type": "Organization",
		name: "IPSEIS",
	},
};

export default function Accueil() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden bg-univers">
			<JsonLd data={webSiteJsonLd} />
			{/* Centrage vertical seulement à partir de sm : sur un téléphone haut,
			    justify-center dans une hauteur plein écran laissait près de 380 px
			    de vide au-dessus du titre et autant en dessous du bouton. Le contenu
			    part désormais du haut, le fond continuant de remplir l'écran. */}
			<div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-y-4 self-center px-5 py-10 sm:gap-y-5 sm:px-10 sm:py-4 sm:w-5/6 lg:w-3/5">
				{/* Gros titre */}

				<div className="text-2xl sm:text-4xl font-bold tracking-widest text-cohesion leading-snug">
					<h1>Vous êtes unique, nos formations et accompagnements aussi.</h1>
					<Image
						src={tiretHome}
						alt="tiret"
						className="my-2 sm:my-5 w-[75px] h-auto"
					/>
				</div>

				{/* Description */}

				<div className="flex flex-col gap-y-4 text-lg leading-relaxed text-support sm:gap-y-5 sm:text-xl">
					<p>
						Chez IPSEIS, nous croyons que l'apprentissage des professionnels
						passe par une alliance subtile entre théorie et pratique,
						transmission et expérimentation. Nous concevons des expériences
						pédagogiques sur-mesure, ancrées dans le réel, pour faire évoluer
						les pratiques quotidiennes et les comportements pour un meilleur
						fonctionnement d'équipe.
					</p>
					<p className="block md:hidden">
						Et si la formation devenait une expérience à vivre ?
					</p>
					<div className="w-full flex justify-start text-support mt-1 sm:mt-5">
						<Button href="/catalogue">
							<span className="md:block items-center text-center hidden">
								Et si la formation devenait une expérience à vivre ?
							</span>
							<span className="flex items-center gap-x-2 font-semibold text-center">
								<span className="hover:underline hover:underline-offset-8">
									Découvrir nos formations
								</span>
								<span className="mt-1">→</span>
							</span>
						</Button>
					</div>
				</div>
			</div>
			{/* Étoile décorative, derrière le contenu et hors du flux de clic : en
			    z-10 elle recouvrait le bouton « Découvrir nos formations », qui
			    devenait inatteignable. alt vide et aria-hidden, elle n'apporte
			    aucune information.

			    Sur mobile elle est centrée derrière le texte, en filigrane : posée
			    dans un coin, elle apparaissait à moitié coupée et sans lien avec la
			    composition. À partir de sm elle retrouve son débord en haut à
			    droite, où la largeur disponible lui laisse de la place. */}
			<Image
				src="/images/star_beige.svg"
				alt=""
				aria-hidden
				width={500}
				height={500}
				className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.03] sm:left-auto sm:right-[-7rem] sm:top-[-1.25rem] sm:w-[500px] sm:translate-x-0 sm:translate-y-0 sm:opacity-10 md:right-[-11rem] md:top-[-5rem] md:w-[750px] lg:right-[-15rem] lg:top-[-9rem] lg:w-[1000px]"
			/>
		</div>
	);
}
