import React from "react";
import TitlePage from "@/components/global/TitlePage";
import Divider from "@/components/global/Divider";
import Footer from "@/components/global/Footer";
import { ApproachSection } from "@/components/sections/Approach";
import { HealthMissionSection } from "@/components/sections/HealthMissions";
import { HealthVisionSection } from "@/components/sections/HealthVision";
import { HealthPromiseSection } from "@/components/sections/HealthPromise";
import { HealthValueSection } from "@/components/sections/HealthValues";
import { HealthTrainerSection } from "@/components/sections/HealthTrainers";
import { HealthPerimeterSection } from "@/components/sections/HealthPerimeter";
import CatalogueCtaSection from "@/components/sections/CatalogueCtaSection";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "IPSEIS Santé - Formations pour établissements sanitaires & médico-sociaux",
	description:
		"Formations professionnelles actives, immersives et sur mesure destinées aux équipes des établissements sanitaires, sociaux et médico-sociaux.",
	path: "/secteur-sante",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Secteur Santé", path: "/secteur-sante" }]);

export default function SecteurSante() {
	return (
		<div className="bg-support min-h-full">
			<JsonLd data={breadcrumbJsonLd} />

			<TitlePage
				title="Ipseis Santé"
				descriptionNode={
					<>
						<span className="font-bold text-cohesion">La raison d’être d’IPSEIS Santé</span> est de permettre aux soignants et professionnels de santé
						de renforcer leurs compétences dans un cadre innovant, collaboratif et respectueux, pour une pratique des soins plus efficace et plus
						humaine.
					</>
				}
			/>

			{/* Section approche */}

			<ApproachSection showWheel />

			{/* Section Mission */}

			<Divider />
			<HealthMissionSection />

			{/* Section Vision et promesse */}

			<Divider />
			<HealthVisionSection />
			<HealthPromiseSection />

			{/* Section Valeurs */}

			<Divider />
			<HealthValueSection />

			{/* Section Valeurs */}

			<Divider />
			<HealthTrainerSection />

			{/* Section Expertise */}
			<Divider />
			<HealthPerimeterSection />

			{/* CTA Catalogue */}
			<Divider />
			<div className="mx-auto max-w-7xl mt-20 rounded-3xl">
				<CatalogueCtaSection
					title="Explorez nos formations spécialisées santé"
					description="Découvrez notre offre complète de formations dédiées aux professionnels de santé et aux établissements sanitaires et médico-sociaux."
					className="mx-6 lg:mx-8"
				/>
			</div>

			<Footer />
		</div>
	);
}
