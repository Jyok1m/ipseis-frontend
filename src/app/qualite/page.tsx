import React from "react";
import TitlePage from "@/components/global/TitlePage";
import ContentHeading from "@/components/global/ContentHeading";
import Footer from "@/components/global/Footer";
import JsonLd from "@/components/utils/JsonLd";
import QualiopiCertificate from "@/components/sections/QualiopiCertificate";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "Qualité - IPSEIS certifié Qualiopi",
	description:
		"Engagement qualité, cadre réglementaire et certification Qualiopi d'IPSEIS, organisme de formation certifié dans la catégorie Actions de formation.",
	path: "/qualite",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Qualité", path: "/qualite" }]);

export default function Qualite() {
	return (
		<div className="bg-support min-h-full overflow-x-hidden">
			<JsonLd data={breadcrumbJsonLd} />
			<div className="mx-auto max-w-4xl px-6 lg:px-8 pb-10">
				<TitlePage
					title="Qualité"
					descriptionNode="Notre engagement, le cadre réglementaire et nos certifications"
					centered={true}
					paddingHorizontal={false}
					paddingBottom={false}
				/>

				<div className="mt-10 space-y-14 text-base sm:text-lg text-univers">
					{/* 1. Notre engagement qualité */}
					<section>
						<ContentHeading className="mb-4">1. Notre engagement qualité</ContentHeading>
						<div className="space-y-4">
							<p>
								Depuis sa création en 2024, IPSEIS est engagé dans une démarche globale d&apos;amélioration continue. Cet
								engagement a pour but de mobiliser tous les collaborateurs et tous les clients de l&apos;organisme dans cette
								dynamique.
							</p>
							<p>
								Dans cette perspective, les suggestions d&apos;amélioration émanant de toute personne impliquée au quotidien
								ou épisodiquement garantiront une optimisation continue de notre système qualité et des prestations
								proposées.
							</p>
						</div>
					</section>

					{/* 2. Le cadre réglementaire */}
					<section>
						<ContentHeading className="mb-4">2. Le cadre réglementaire</ContentHeading>
						<div className="space-y-4">
							<p>IPSEIS répond aux obligations de grands textes fondateurs :</p>
							<ul className="list-disc space-y-2 pl-6">
								<li>La loi du 5 septembre 2018 pour la liberté de choisir son avenir professionnel ;</li>
								<li>
									La loi du 5 mars 2014 relative à la formation professionnelle, à l&apos;emploi et à la démocratie sociale et
									les décrets qui jalonnent sa mise en application.
								</li>
							</ul>
							<p>
								IPSEIS s&apos;engage également vis-à-vis de sa conformité au Règlement Européen 2016/679 relatif à la
								Protection des Données Personnelles.
							</p>
							<p>
								Une veille réglementaire est en place afin d&apos;assurer la conformité vis-à-vis de toute nouvelle exigence,
								via la presse spécialisée et un accompagnement juridique.
							</p>
						</div>
					</section>

					{/* 3. Nos certifications */}
					<section>
						<ContentHeading className="mb-4">3. Nos certifications</ContentHeading>
						<div className="space-y-4">
							<p>
								IPSEIS est certifié QUALIOPI dans la catégorie «&nbsp;Actions de formation&nbsp;» depuis septembre 2024.
							</p>
							<p>
								Cette certification est non seulement un gage et une garantie supplémentaire quant à la qualité du processus
								de déroulement de nos actions de formation, mais c&apos;est aussi une reconnaissance de l&apos;implication au
								quotidien de nos équipes pédagogique, administrative et commerciale.
							</p>
						</div>

						<div className="mt-8 flex justify-center">
							<QualiopiCertificate />
						</div>
					</section>
				</div>
			</div>
			<Footer />
		</div>
	);
}
