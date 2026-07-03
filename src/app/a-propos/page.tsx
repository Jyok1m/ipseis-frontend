import React from "react";
import Image from "next/image";
import TitlePage from "@/components/global/TitlePage";
import ContentHeading from "@/components/global/ContentHeading";
import Footer from "@/components/global/Footer";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "À propos d'IPSEIS - Pédagogie immersive & active",
	description:
		"Découvrez la vision d'IPSEIS : innover dans la formation des professionnels de santé et du médico-social avec des approches expérientielles engageantes.",
	path: "/a-propos",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "À propos", path: "/a-propos" }]);

// TODO (IPSEIS) : chiffres clés 2025 à renseigner par Hélène.
const keyFigures2025: { value: string; label: string }[] = [
	{ value: "— %", label: "Taux de satisfaction" },
	{ value: "— / — %", label: "Formations Intra / Inter" },
	{ value: "—", label: "Heures de formation dispensées" },
	{ value: "—", label: "Stagiaires formés" },
];

export default function APropos() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />
			<div className="mx-auto max-w-7xl px-6 lg:px-8 pb-10">
				<TitlePage
					title="Bienvenue dans l’univers unique d’apprentissage d’IPSEIS"
					descriptionNode="Le mot de la fondatrice"
					centered={false}
					paddingHorizontal={false}
					paddingBottom={false}
				/>

				{/* Présentation de la société */}
				<section>
					<div className="border border-univers w-12 my-8"></div>
					<div>
						<p className="space-y-7 text-base sm:text-lg text-univers">
							<Image
								src="/images/about-image-hélène.jpg"
								alt="Photo d'Hélène de Montabert"
								sizes="(min-width: 1024px) 12rem, 8rem"
								width={200}
								height={220}
								className="rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 float-left m-4 max-w-xs w-[160px] h-[180px] sm:w-[200px] sm:h-[220px]"
							/>
							Madame, Monsieur, <br />
							<br />
							Face aux défis croissants du secteur sanitaire, social et médico-social (manque de ressources formées, turnover élevé, qualité des soins
							inégale dans certains établissements; manque de motivation d’une partie des employés, stress, fatigue….), il est essentiel de repenser la
							formation des professionnels et de leur apporter des outils appropriés pour réussir leurs missions. <br />
							<br />
							Depuis des années, j’observe un décalage entre les attentes des soignants, les formations proposées, leur efficacité et une motivation
							inégale des équipes à apprendre avec les approches de formations qui leurs sont proposées. <br />
							<br />
							C’est pour répondre à ces enjeux que j’ai créé IPSEIS en 2024, un organisme de formation continue aux méthodes innovantes, spécialisé
							pour les établissements sanitaires, sociaux et médico-sociaux et leurs professionnels. Le siège social d’IPSEIS est établi à
							Saint-Malo, et nous intervenons sur le Grand Ouest et, plus largement, sur l’ensemble du territoire national, DOM inclus.{" "}
							{/* TODO (IPSEIS) : confirmer la zone d’intervention exacte (Grand Ouest / Bretagne / national + DOM). */}
							<br />
							<br />
							Parce que vous êtes uniques, nous proposons des formations sur mesure, basées sur une pédagogie active et immersive. <br />
							<br />
							Notre ambition : offrir des formations qui font la différence sur le terrain, en favorisant l’engagement et la montée en compétences des
							soignants. <br />
							<br />
							Je suis à votre écoute pour construire, ensemble, des solutions adaptées à vos besoins. <br />
							<br />
							N’hésitez pas à me contacter ! <br />
							<br />
							Hélène de Montabert <br />
							<span className="font-bold">Directrice d’IPSEIS</span>
						</p>
					</div>
				</section>

				{/* Nos chiffres clés 2025 */}
				<section className="mt-16 clear-both">
					<ContentHeading>Nos chiffres clés 2025</ContentHeading>
					{/* TODO (IPSEIS) : remplacer les valeurs ci-dessous par les chiffres réels 2025. */}
					<p className="mt-2 text-sm text-univers/60">Chiffres en cours de consolidation pour l’année 2025.</p>
					<dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{keyFigures2025.map(({ value, label }) => (
							<div key={label} className="rounded-2xl border border-univers/15 bg-support px-6 py-8 text-center shadow-sm">
								<dt className="text-3xl sm:text-4xl font-bold text-cohesion">{value}</dt>
								<dd className="mt-2 text-sm sm:text-base text-univers/80">{label}</dd>
							</div>
						))}
					</dl>
				</section>
			</div>
			<Footer />
		</div>
	);
}
