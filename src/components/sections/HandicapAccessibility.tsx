import React from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import SectionHeading from "@/components/global/SectionHeading";
import { HANDICAP_REFERENT } from "@/lib/siteInfo";

/**
 * Accessibilité aux personnes en situation de handicap.
 *
 * Exigence Qualiopi (indicateur 26) : l'information et les coordonnées du
 * référent handicap doivent être accessibles au public, pas seulement
 * mentionnées au fil d'une fiche formation.
 */
export const HandicapAccessibilitySection = () => {
	return (
		<section className="mx-auto max-w-4xl px-5 pb-12 sm:px-6 lg:px-8">
			<SectionHeading className="mb-6">Accessibilité aux personnes en situation de handicap</SectionHeading>

			<div className="space-y-4 text-base text-univers sm:text-lg">
				<p>
					En cas de formations Inter, si vous êtes en situation de mobilité réduite, nous sommes vigilants à l’accessibilité des locaux
					et à l’ergonomie des salles de formation que nous sélectionnons afin qu’elles puissent vous accueillir dans les meilleures
					conditions.
				</p>
				<p>
					Nous proposons un accompagnement personnalisé à tout futur stagiaire en situation de handicap souhaitant participer à nos
					formations.
				</p>
				<p>
					Tout sera mis en œuvre, en amont de la formation, pour faciliter votre intégration et votre suivi, grâce au concours du
					réseau des acteurs œuvrant dans le champ du handicap.
				</p>
			</div>

			<div className="mt-8 rounded-2xl border border-cohesion/40 bg-white/40 p-5 sm:p-6">
				<h3 className="text-base font-bold text-univers sm:text-lg">Contactez notre référente handicap</h3>
				<p className="mt-1 text-base text-univers sm:text-lg">{HANDICAP_REFERENT.name}</p>
				{/* Adresse et numéro sont des liens actionnables : sur mobile, un
				    numéro en texte brut oblige à le recopier à la main. */}
				<div className="mt-3 flex flex-col gap-2 text-base sm:text-lg">
					<a
						href={`mailto:${HANDICAP_REFERENT.email}`}
						className="inline-flex w-fit items-center gap-2 font-semibold text-cohesion underline underline-offset-4 transition-colors hover:text-univers"
					>
						<EnvelopeIcon aria-hidden className="size-5 shrink-0" />
						{HANDICAP_REFERENT.email}
					</a>
					<a
						href={`tel:${HANDICAP_REFERENT.phoneHref}`}
						className="inline-flex w-fit items-center gap-2 font-semibold text-cohesion underline underline-offset-4 transition-colors hover:text-univers"
					>
						<PhoneIcon aria-hidden className="size-5 shrink-0" />
						{HANDICAP_REFERENT.phone}
					</a>
				</div>
			</div>
		</section>
	);
};
