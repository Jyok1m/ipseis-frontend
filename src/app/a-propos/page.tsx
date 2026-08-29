import React from "react";
import Image from "next/image";
import Link from "next/link";
import TitlePage from "@/components/global/TitlePage";
import SectionHeading from "@/components/global/SectionHeading";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "À propos d'IPSEIS - Pédagogie immersive & active",
	description:
		"Découvrez la vision d'IPSEIS : innover dans la formation continue des professionnels, avec une expertise du secteur sanitaire, social et médico-social et des formations transversales ouvertes à tous les métiers.",
	path: "/a-propos",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
	{ name: "À propos", path: "/a-propos" },
]);

// TODO (IPSEIS) : chiffres clés 2025 à renseigner par Hélène, avec la méthode de calcul associée.
const keyFigures2025: { value: string; label: string }[] = [
	{ value: "- %", label: "Taux de satisfaction" },
	{ value: "- / - %", label: "Formations Intra / Inter" },
	{ value: "-", label: "Heures de formation dispensées" },
	{ value: "-", label: "Stagiaires formés" },
];

export default function APropos() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />
			<div className="mx-auto max-w-4xl px-5 pb-16 sm:px-6 lg:px-8">
				<TitlePage
					title="Bienvenue dans l’univers unique d’apprentissage d’IPSEIS"
					centered={false}
					paddingHorizontal={false}
					paddingBottom={false}
				/>

				{/* 1. Le mot de la fondatrice */}
				<section className="mt-10 sm:mt-12">
					<SectionHeading className="mb-6">
						Le mot de la fondatrice
					</SectionHeading>

					{/* Les paragraphes étaient auparavant un unique <p> ponctué de <br/> :
					    l'espacement dépendait du nombre de sauts de ligne plutôt que d'une
					    règle, et le texte n'avait aucune structure exploitable. */}
					<div className="space-y-5 text-base text-univers sm:text-lg">
						<Image
							src="/images/about-image-hélène.jpg"
							alt="Photo d'Hélène Paillot de Montabert"
							sizes="(min-width: 640px) 200px, 160px"
							width={200}
							height={220}
							className="float-left m-4 ml-0 h-[180px] w-[160px] rounded-2xl bg-zinc-100 object-cover sm:h-[220px] sm:w-[200px]"
						/>
						<p>Madame, Monsieur,</p>
						<p>
							Face aux évolutions profondes du monde du travail et aux enjeux
							croissants auxquels sont confrontés les professionnels
							(transformation des pratiques, évolution des métiers, contraintes
							organisationnelles, manque de ressources, turnover, charge
							mentale, stress ou encore nécessité de maintenir la qualité des
							services), la formation continue constitue un véritable levier de
							développement des compétences, de qualité et d’engagement des
							équipes.
						</p>
						<p>
							Depuis plusieurs années, j’observe que les besoins des
							professionnels évoluent plus rapidement que les réponses qui leur
							sont proposées en matière de formation. Au-delà de l’acquisition
							de connaissances, les professionnels attendent aujourd’hui des
							formations concrètes, adaptées à leurs réalités de terrain,
							interactives et directement mobilisables dans leur pratique.
						</p>
						<p>
							C’est pour répondre à ces enjeux que j’ai créé IPSEIS en 2024, un
							organisme de formation continue qui place l’innovation
							pédagogique, l’adaptation aux besoins du terrain et
							l’accompagnement des professionnels au cœur de sa démarche.
						</p>
						<p>
							IPSEIS s’appuie sur une expertise particulière du secteur
							sanitaire, social et médico-social, et accompagne les
							établissements et leurs professionnels dans le développement de
							leurs compétences, l’évolution de leurs pratiques et
							l’amélioration de la qualité des accompagnements et des soins.
						</p>
						<p>
							Parce que de nombreux enjeux professionnels dépassent aujourd’hui
							les frontières entre secteurs d’activité, IPSEIS propose également
							des formations transversales accessibles à tous les
							professionnels, quel que soit leur domaine d’exercice :
							communication, gestion des situations difficiles, prévention et
							gestion du stress, travail en équipe, posture professionnelle,
							management, qualité de vie au travail ou encore développement des
							compétences relationnelles.
						</p>
						<p>
							Le siège social d’IPSEIS est établi à Saint-Malo. Nous intervenons
							sur le Grand Ouest et, plus largement, sur l’ensemble du
							territoire national, DOM inclus, en privilégiant des formations au
							plus près des réalités et des besoins de chaque structure.
						</p>
						<p>
							Je suis à votre écoute pour construire, ensemble, des solutions
							adaptées à vos besoins.
						</p>
						<p>
							N’hésitez pas à{" "}
							<Link
								href="/contact"
								className="font-semibold text-cohesion underline underline-offset-4 hover:text-univers transition-colors"
							>
								me contacter
							</Link>{" "}
							!
						</p>
						<p className="pt-2">
							Hélène de Montabert
							<br />
							<span className="font-bold">Directrice d’IPSEIS</span>
						</p>
					</div>
				</section>

				{/* 2. Nos chiffres clés 2025 */}
				<section className="mt-16 clear-both">
					<SectionHeading className="mb-4">
						Nos chiffres clés 2025
					</SectionHeading>
					{/* TODO (IPSEIS) : remplacer les valeurs ci-dessous par les chiffres réels 2025 et préciser leur mode de calcul. */}
					<p className="text-sm text-univers/60">
						Chiffres en cours de consolidation pour l’année 2025.
					</p>
					<dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{keyFigures2025.map(({ value, label }) => (
							<div
								key={label}
								className="rounded-2xl border border-univers/15 bg-support px-6 py-8 text-center shadow-sm"
							>
								<dt className="text-3xl font-bold text-cohesion sm:text-4xl">
									{value}
								</dt>
								<dd className="mt-2 text-sm text-univers/80 sm:text-base">
									{label}
								</dd>
							</div>
						))}
					</dl>
				</section>

				{/* 3. Délai d'accès */}
				<section className="mt-16">
					<SectionHeading className="mb-6">Délai d’accès</SectionHeading>
					<p className="text-base text-univers sm:text-lg">
						IPSEIS s’engage à vous répondre dans un délai maximum de 72 heures.
						Nous déterminerons la date de début de formation la plus adaptée à
						vos besoins, préférences et contraintes. En moyenne, le délai de
						mise en place de la formation est d’un mois.
					</p>
				</section>
			</div>
		</div>
	);
}
