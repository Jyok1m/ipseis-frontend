import Link from "next/link";

import TitlePage from "@/components/global/TitlePage";
import { buildMetadata } from "@/components/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
	title: "Mentions légales & RGPD",
	description:
		"Mentions légales, politique de confidentialité et informations RGPD d'IPSEIS : responsable de publication, hébergeur, données personnelles, cookies, droits RGPD.",
	path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
	const lastUpdate = "18 février 2026";

	return (
		<main className="bg-support text-univers min-h-screen">
			{/* Hero */}
			<TitlePage title="Mentions légales & RGPD" centered={false} paddingBottom={false} />
			<section className="mx-auto max-w-7xl px-6 lg:px-8 pb-8">
				<div className="border border-univers w-12 my-8"></div>
				<p className="text-sm text-univers/70">Dernière mise à jour : {lastUpdate}</p>
			</section>

			{/* TOC */}
			<nav aria-label="Sommaire" className="mx-auto max-w-7xl px-6 lg:px-8 pb-6">
				<div className="rounded-2xl border border-univers/20 bg-white/50 p-4 sm:p-6">
					<h2 className="text-lg font-bold text-cohesion mb-4">Sommaire</h2>
					<ul className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#editeur">
								1. Éditeur du site
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#hebergeur">
								2. Hébergeur
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#contact">
								3. Contact
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#objet">
								4. Objet du site
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#propriete">
								5. Propriété intellectuelle
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#donnees">
								6. Données personnelles (RGPD)
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#cookies">
								7. Cookies
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#droits">
								8. Droits des personnes
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#securite">
								9. Sécurité
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#responsabilites">
								10. Responsabilités
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#modifs">
								11. Modifications
							</a>
						</li>
						<li>
							<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href="#droit">
								12. Droit applicable
							</a>
						</li>
					</ul>
				</div>
			</nav>

			{/* Content */}
			<article className="mx-auto max-w-7xl px-6 lg:px-8 pb-20 space-y-8">
				<section id="editeur" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">1. Éditeur du site</h2>
					<div className="text-base leading-relaxed space-y-2">
						<p>
							<Link href="/" className="hover:underline underline-offset-4 text-cohesion">
								IPSEIS
							</Link>{" "}
							— Organisme de formation. <br />
							<br />
							Forme juridique / SIREN : <em className="text-univers/70">Société à responsabilité limitée (931 671 606 R.C.S. Saintmalo)</em>. <br />
							Siège social : <em className="text-univers/70">21 Rue de la Nation, 35400 Saint-Malo</em>. <br />
							Représentation : <em className="text-univers/70">Hélène PAILLOT DE MONTABERT</em>. <br />
							N° TVA intracommunautaire : <em className="text-univers/70">FR85931671606</em>. <br />
							Enregistré en tant qu'organisme de formation : <em className="text-univers/70">8559A (Formation continue d'adultes)</em>.
							<br />
							<br />
							Création du site web par :{" "}
							<Link href="https://www.linkedin.com/in/joachim-jasmin/" target="_blank" className="hover:underline underline-offset-4 text-cohesion">
								Joachim Jasmin
							</Link>
							.
							<br />
							Design du site web par :{" "}
							<Link
								href="https://www.malt.fr/profile/titouanguignouard/"
								target="_blank"
								className="hover:underline underline-offset-4 text-cohesion"
							>
								Titouan Gignouard
							</Link>
							.
						</p>
					</div>
				</section>

				<section id="hebergeur" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">2. Hébergeur</h2>
					<div className="text-base leading-relaxed space-y-4">
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">Site web (frontend)</h3>
							<p>
								Nom : <em className="text-univers/70">Vercel Inc</em>. <br />
								Adresse : <em className="text-univers/70">440 N Barranca Avenue #4133, Covina, CA 91723, United States</em>. <br />
								Email : <em className="text-univers/70">privacy@vercel.com</em>.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">Serveur applicatif et base de données (backend)</h3>
							<p>
								Hébergeur : <em className="text-univers/70">OVHcloud</em>. <br />
								Adresse : <em className="text-univers/70">2 rue Kellermann, 59100 Roubaix, France</em>. <br />
								Géré par : <em className="text-univers/70">Joachim Alexandre Jasmin</em>. <br />
								Email : <em className="text-univers/70">
									<a href="mailto:joachim.jasmin-dev@proton.me" className="text-cohesion hover:underline hover:underline-offset-4">
										joachim.jasmin-dev@proton.me
									</a>
								</em>.
							</p>
						</div>
					</div>
				</section>

				<section id="contact" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">3. Contact</h2>
					<div className="text-base leading-relaxed">
						<p>
							Pour toute question, vous pouvez nous écrire à :{" "}
							<a href="mailto:helenedm@ipseis.fr" className="text-cohesion hover:underline hover:underline-offset-4">
								helenedm@ipseis.fr
							</a>
							.
						</p>
					</div>
				</section>

				<section id="objet" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">4. Objet du site</h2>
					<div className="text-base leading-relaxed">
						<p>
							Le site présente l'activité de formation et d'accompagnement d'IPSEIS, ainsi que ses contenus éditoriaux. Les informations publiées le
							sont à titre informatif et peuvent être mises à jour sans préavis.
						</p>
					</div>
				</section>

				<section id="propriete" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">5. Propriété intellectuelle</h2>
					<div className="text-base leading-relaxed">
						<p>
							L'ensemble des contenus (textes, images, logos, éléments graphiques, vidéos, documents téléchargeables) présents sur ce site sont
							protégés par le droit d'auteur et/ou le droit des marques. Toute reproduction, représentation, modification, publication ou adaptation
							est interdite sans accord écrit préalable d'IPSEIS.
						</p>
					</div>
				</section>

				<section id="donnees" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">6. Données personnelles (RGPD)</h2>
					<div className="text-base leading-relaxed space-y-4">
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">6.1. Responsable de traitement</h3>
							<p>
								IPSEIS est responsable des traitements de données effectués via le site. Contact :{" "}
								<a href="mailto:helenedm@ipseis.fr" className="text-cohesion hover:underline hover:underline-offset-4">
									helenedm@ipseis.fr
								</a>{" "}
								(ou le contact officiel désigné).
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">6.2. Finalités & bases légales</h3>
							<ul className="list-disc list-inside space-y-1 text-univers/90">
								<li>Gestion des demandes via formulaires (intérêt légitime et/ou exécution de mesures précontractuelles).</li>
								<li>Prospection B2B et communication institutionnelle (intérêt légitime, avec droit d'opposition).</li>
								<li>Mesure d'audience et amélioration du site (consentement lorsque requis).</li>
								<li>Gestion des candidatures / partenariats (intérêt légitime / exécution contractuelle).</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">6.3. Données traitées</h3>
							<p>
								Données d'identification (nom, fonction, email pro, téléphone), contenu du message, métadonnées techniques (journalisation,
								anonymisées lorsque possible), statistiques d'usage.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">6.4. Destinataires</h3>
							<p>
								Équipe IPSEIS et prestataires habilités (hébergement, outils CRM/analytics) agissant en qualité de sous-traitants au sens de l'article
								28 RGPD, sur instructions contractuelles et avec des garanties adéquates.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">6.5. Durées de conservation</h3>
							<ul className="list-disc list-inside space-y-1 text-univers/90">
								<li>Demandes de contact : jusqu'à 3 ans après le dernier échange.</li>
								<li>Prospection B2B : 3 ans à compter du dernier contact.</li>
								<li>Logs techniques / sécurité : 6 à 12 mois.</li>
								<li>Candidatures : 2 ans (hors obligation légale contraire).</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">6.6. Transferts hors UE</h3>
							<p>
								Le cas échéant, les transferts sont encadrés par des mécanismes conformes (clauses contractuelles types, décision d'adéquation,
								mesures complémentaires).
							</p>
						</div>
					</div>
				</section>

				<section id="cookies" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">7. Cookies</h2>
					<div className="text-base leading-relaxed space-y-4">
						<p>
							Le site peut déposer des cookies et technologies similaires pour assurer son fonctionnement, mesurer l'audience et améliorer
							l'expérience. Lorsqu'exigé, votre consentement est recueilli via un bandeau de préférence. Vous pouvez le retirer à tout moment.
						</p>
						<ul className="list-disc list-inside space-y-1 text-univers/90">
							<li>Cookies nécessaires : exemptés de consentement, strictement limités au fonctionnement.</li>
							<li>Mesure d'audience / performance : soumis au consentement si non-exemptés.</li>
							<li>Marketing / tiers : soumis au consentement préalable.</li>
						</ul>
						<p>
							<Link href="/politique-de-confidentialite#cookies" className="text-cohesion hover:underline hover:underline-offset-4">
								Consultez notre politique de confidentialité
							</Link>{" "}
							pour le détail des cookies utilisés, ou{" "}
							<Link href="#droits" className="text-cohesion hover:underline hover:underline-offset-4">
								voir vos droits
							</Link>{" "}
							pour gérer vos préférences.
						</p>
					</div>
				</section>

				<section id="droits" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">8. Droits des personnes</h2>
					<div className="text-base leading-relaxed space-y-4">
						<p>
							Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits d'accès, rectification, effacement, limitation,
							opposition, portabilité, et du droit de définir des directives post-mortem. Pour exercer vos droits :{" "}
							<a href="mailto:helenedm@ipseis.fr" className="text-cohesion hover:underline hover:underline-offset-4">
								helenedm@ipseis.fr
							</a>{" "}
							(joindre tout justificatif utile).
						</p>
						<p>Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
					</div>
				</section>

				<section id="securite" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">9. Sécurité</h2>
					<div className="text-base leading-relaxed">
						<p>
							IPSEIS met en œuvre des mesures techniques et organisationnelles adaptées pour protéger les données (contrôle d'accès, chiffrement en
							transit, sauvegardes, journalisation, minimisation, sensibilisation des personnels).
						</p>
					</div>
				</section>

				<section id="responsabilites" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">10. Responsabilités</h2>
					<div className="text-base leading-relaxed">
						<p>
							IPSEIS ne saurait être tenu responsable de l'indisponibilité du site, d'erreurs typographiques, d'omissions ou de l'utilisation faite
							des informations publiées. Des liens sortants peuvent renvoyer vers des sites tiers ; IPSEIS n'en contrôle pas le contenu.
						</p>
					</div>
				</section>

				<section id="modifs" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">11. Modifications</h2>
					<div className="text-base leading-relaxed">
						<p>
							La présente page peut être modifiée à tout moment pour tenir compte des évolutions légales, techniques ou opérationnelles. La date de
							mise à jour fait foi.
						</p>
					</div>
				</section>

				<section id="droit" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">12. Droit applicable</h2>
					<div className="text-base leading-relaxed">
						<p>Droit français. En cas de litige et à défaut d'accord amiable, compétence des tribunaux français compétents.</p>
					</div>
				</section>
				{/* Cross-link */}
				<div className="text-center pt-4">
					<Link href="/politique-de-confidentialite" className="text-cohesion hover:underline underline-offset-4 font-medium">
						Voir aussi : Politique de confidentialité
					</Link>
				</div>
			</article>
		</main>
	);
}
