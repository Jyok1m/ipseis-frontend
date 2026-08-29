import React from "react";
import Link from "next/link";
import { DocumentArrowDownIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { TitleSection } from "@/components/TitleSection";

interface CatalogueCtaSectionProps {
	variant?: "default" | "compact";
	title?: string;
	description?: string;
	className?: string;
}

export default function CatalogueCtaSection({ variant = "default", title, description, className = "" }: CatalogueCtaSectionProps) {
	const defaultTitle = "Découvrez toutes nos formations";
	const defaultDescription =
		"Téléchargez gratuitement notre catalogue complet 2025 et explorez nos 30+ formations spécialisées dans le secteur de la santé.";

	if (variant === "compact") {
		return (
			<div className={`bg-gradient-to-r from-cohesion/10 to-maitrise/20 rounded-xl p-6 ${className}`}>
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex-shrink-0 w-12 h-12 bg-cohesion/20 rounded-full flex items-center justify-center">
							<DocumentArrowDownIcon className="w-6 h-6 text-cohesion" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-univers">{title || "Catalogue 2025"}</h3>
							<p className="text-base text-univers/80">Plus de 30 formations disponibles</p>
						</div>
					</div>
					<Link
						href="/telecharger-catalogue"
						className="inline-flex items-center gap-2 px-4 py-2 bg-cohesion hover:bg-cohesion/90 text-white rounded-lg font-medium transition-colors duration-200 text-base"
					>
						<DocumentArrowDownIcon className="w-4 h-4" />
						Télécharger
					</Link>
				</div>
			</div>
		);
	}

	return (
		<section className={`py-6 mt-10 mb-20 rounded-2xl border border-cohesion ${className}`}>
			<div className="mx-auto max-w-4xl px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<div className="flex justify-center mb-6">
						<div className="flex items-center justify-center w-16 h-16 bg-white/80 rounded-full shadow-lg">
							<AcademicCapIcon className="w-8 h-8 text-cohesion" />
						</div>
					</div>

					<TitleSection noPaddingTop centered title={title || defaultTitle} description={description || defaultDescription} />

					{/* Options d'action avec descriptions */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
						{/* Option Téléchargement */}
						<div className="bg-white/60 sm:text-lg backdrop-blur-sm rounded-xl p-6 border border-cohesion/20 hover:border-cohesion/40 transition-colors flex flex-col justify-between">
							<div>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-maitrise/20 rounded-full flex items-center justify-center">
										<DocumentArrowDownIcon className="w-5 h-5 text-maitrise" />
									</div>
									<h3 className="text-xl font-bold text-univers">Catalogue complet</h3>
								</div>
								<p className="text-base text-univers/70 mb-4">
									Téléchargez gratuitement notre catalogue PDF avec tous les détails : programmes, modalités, tarifs et calendrier des formations.
								</p>
							</div>

							<Link
								href="/telecharger-catalogue"
								className="inline-flex items-center gap-2 px-4 py-2 bg-maitrise hover:bg-maitrise/90 text-support rounded-lg font-semibold transition-all duration-200 w-full justify-center"
							>
								<DocumentArrowDownIcon className="w-4 h-4" />
								Télécharger gratuitement
							</Link>
						</div>

						{/* Option Contact */}
						<div className="bg-white/60 sm:text-lg backdrop-blur-sm rounded-xl p-6 border border-cohesion/20 hover:border-cohesion/40 transition-colors flex flex-col justify-between">
							<div>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-maitrise/20 rounded-full flex items-center justify-center">
										<svg className="w-5 h-5 text-maitrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
											/>
										</svg>
									</div>
									<h3 className="text-xl font-bold text-univers">Conseil personnalisé</h3>
								</div>
								<p className="text-base text-univers/70 mb-4">
									Échangez directement avec nos experts pour un accompagnement sur mesure, des devis personnalisés et des conseils adaptés à vos
									besoins.
								</p>
							</div>

							<Link
								href="/contact"
								className="inline-flex items-center gap-2 px-4 py-2 bg-maitrise hover:bg-maitrise/90 text-support rounded-lg font-semibold transition-all duration-200 w-full justify-center"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
								Nous contacter
							</Link>
						</div>
					</div>

					{/* Call-to-action secondaire */}
					<div className="text-center sm:text-lg">
						<p className="text-lg leading-8 text-univers/80 mb-8">Ou parcourez directement nos formations en ligne</p>
						<Link
							href="/catalogue"
							className="inline-flex items-center gap-2 px-4 py-2 bg-cohesion hover:bg-cohesion/90 text-support rounded-lg font-semibold transition-all duration-200 w-full justify-center"
						>
							<DocumentArrowDownIcon className="w-4 h-4" />
							Explorer le catalogue interactif
						</Link>
					</div>

					<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-base text-univers/70">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-cohesion rounded-full"></div>
							<span>Catalogue PDF complet</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-cohesion rounded-full"></div>
							<span>Envoi immédiat par email</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
