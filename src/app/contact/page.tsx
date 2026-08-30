import React from "react";
import TitlePage from "@/components/global/TitlePage";
import SectionHeading from "@/components/global/SectionHeading";
import ContactForm from "@/components/home/ContactForm";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";
import { getAllTrainings } from "@/lib/api";
import { getAvailableResources } from "@/lib/publicResources";
import { IPSEIS } from "@/lib/siteInfo";
import {
	BuildingOffice2Icon,
	DocumentTextIcon,
	EnvelopeIcon,
	MapPinIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline";

/**
 * Rendu à la demande plutôt qu'au build.
 *
 * Cette route interroge le backend, or BACKEND_URL n'est fournie qu'au runtime :
 * pendant `next build` le fetch échoue et le repli gracieux de lib/api.ts
 * renvoie une liste vide. La page serait donc figée vide dans l'image, et le
 * temps de revalidation la laisserait ainsi après chaque déploiement.
 *
 * Le coût est faible : les fetch de lib/api.ts portent `next: { revalidate }`,
 * donc le Data Cache continue de servir les réponses backend et seul le rendu
 * HTML est refait.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
	title: "Contact IPSEIS - Demande d'information & devis",
	description:
		"Contactez IPSEIS pour toute question sur nos formations santé et médico-social : informations, devis, accompagnement personnalisé.",
	path: "/contact",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
	{ name: "Contact", path: "/contact" },
]);

export default async function Contact() {
	// Les thèmes du select sont rendus au serveur (ISR) plutôt que fetchés au montage.
	const { themes } = await getAllTrainings();
	// Seuls les documents réellement déposés dans public/pdf sont proposés :
	// un lien vers un livret d'accueil inexistant vaut moins que pas de lien.
	const resources = getAvailableResources();

	return (
		<div className="bg-support min-h-full pb-14">
			<JsonLd data={breadcrumbJsonLd} />
			<TitlePage
				title="Contact"
				descriptionNode="Une question sur nos formations, nos tarifs ou nos disponibilités ? Écrivez-nous, nous vous répondons sous 72 heures."
			/>

			{/* Deux colonnes à partir de lg : les coordonnées et les documents de
			    référence d'un côté, le formulaire de l'autre. En dessous, les deux
			    blocs s'empilent, coordonnées d'abord - c'est l'information qu'on
			    cherche en premier depuis un téléphone. */}
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
				<div className="space-y-10">
					{/* Coordonnées */}
					<section>
						<SectionHeading className="mb-6">Nous contacter</SectionHeading>
						<address className="space-y-4 text-base not-italic text-univers sm:text-lg">
							<p className="flex items-start gap-3">
								<BuildingOffice2Icon
									aria-hidden
									className="mt-0.5 size-6 shrink-0 text-cohesion"
								/>
								<span className="font-bold">{IPSEIS.name}</span>
							</p>
							<p className="flex items-start gap-3">
								<MapPinIcon
									aria-hidden
									className="mt-0.5 size-6 shrink-0 text-cohesion"
								/>
								<span>
									{IPSEIS.address.street}
									<br />
									{IPSEIS.address.postalCode} {IPSEIS.address.city}
								</span>
							</p>
							<p className="flex items-start gap-3">
								<PhoneIcon
									aria-hidden
									className="mt-0.5 size-6 shrink-0 text-cohesion"
								/>
								<a
									href={`tel:${IPSEIS.phoneHref}`}
									className="font-semibold underline underline-offset-4 transition-colors hover:text-cohesion"
								>
									{IPSEIS.phone}
								</a>
							</p>
							<p className="flex items-start gap-3">
								<EnvelopeIcon
									aria-hidden
									className="mt-0.5 size-6 shrink-0 text-cohesion"
								/>
								<a
									href={`mailto:${IPSEIS.email}`}
									className="font-semibold underline underline-offset-4 transition-colors hover:text-cohesion"
								>
									{IPSEIS.email}
								</a>
							</p>
						</address>
					</section>

					{/* Ressources utiles */}
					<section>
						<SectionHeading className="mb-6">Ressources utiles</SectionHeading>
						{resources.length > 0 ? (
							<ul className="space-y-3">
								{resources.map((resource) => (
									<li key={resource.file}>
										<a
											href={resource.href}
											target="_blank"
											rel="noopener"
											className="inline-flex items-center gap-3 rounded-lg border border-univers/15 bg-white/40 px-4 py-3 text-base font-semibold text-univers transition-colors hover:border-cohesion hover:text-cohesion sm:text-lg"
										>
											<DocumentTextIcon
												aria-hidden
												className="size-6 shrink-0 text-cohesion"
											/>
											{resource.label}
											<span className="text-sm font-normal text-univers/60">
												PDF
											</span>
										</a>
									</li>
								))}
							</ul>
						) : (
							/* TODO (IPSEIS) : déposer livret-accueil.pdf, cgv.pdf et
							   reglement-interieur.pdf dans public/pdf - les liens
							   apparaissent d'eux-mêmes (cf. src/lib/publicResources.ts). */
							<p className="text-base text-univers/70 sm:text-lg">
								Le livret d&apos;accueil, les conditions générales de vente et
								le règlement intérieur sont disponibles sur simple demande, en
								attendant leur mise en ligne.
							</p>
						)}
					</section>
				</div>

				<div className="lg:pt-2">
					<ContactForm themes={themes} />
				</div>
			</div>
		</div>
	);
}
