import Link from "next/link";
import TitlePage from "@/components/global/TitlePage";
import { buildMetadata } from "@/components/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
	title: "Politique de confidentialité",
	description:
		"Politique de confidentialité d’IPSEIS : traitement des données personnelles, cookies, droits RGPD, durées de conservation et sécurité des données.",
	path: "/politique-de-confidentialite",
});

export default function PolitiqueDeConfidentialitePage() {
	const lastUpdate = "18 février 2026";

	return (
		<main className="bg-support text-univers min-h-screen">
			{/* Hero */}
			<TitlePage title="Politique de confidentialité" centered={false} paddingBottom={false} />
			<section className="mx-auto max-w-7xl px-6 lg:px-8 pb-8">
				<div className="border border-univers w-12 my-8"></div>
				<p className="text-sm text-univers/70">Dernière mise à jour : {lastUpdate}</p>
			</section>

			{/* TOC */}
			<nav aria-label="Sommaire" className="mx-auto max-w-7xl px-6 lg:px-8 pb-6">
				<div className="rounded-2xl border border-univers/20 bg-white/50 p-4 sm:p-6">
					<h2 className="text-lg font-bold text-cohesion mb-4">Sommaire</h2>
					<ul className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
						{[
							["#responsable", "1. Responsable de traitement"],
							["#donnees-collectees", "2. Données collectées"],
							["#finalites", "3. Finalités et bases légales"],
							["#destinataires", "4. Destinataires"],
							["#durees", "5. Durées de conservation"],
							["#cookies", "6. Cookies"],
							["#droits", "7. Vos droits"],
							["#securite", "8. Sécurité"],
							["#transferts", "9. Transferts hors UE"],
							["#modifications", "10. Modifications"],
							["#contact-dpo", "11. Contact"],
						].map(([href, label]) => (
							<li key={href}>
								<a className="text-univers hover:text-cohesion hover:underline hover:underline-offset-4 transition-colors" href={href}>
									{label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</nav>

			{/* Content */}
			<article className="mx-auto max-w-7xl px-6 lg:px-8 pb-20 space-y-8">
				{/* Intro */}
				<section className="bg-white/30 rounded-2xl p-6">
					<div className="text-base leading-relaxed space-y-3">
						<p>
							La présente politique de confidentialité décrit la manière dont <strong>IPSEIS</strong> (ci-après &laquo;&nbsp;nous&nbsp;&raquo;) collecte, utilise et
							protège vos données personnelles lorsque vous utilisez le site{" "}
							<Link href="/" className="text-cohesion hover:underline underline-offset-4">
								www.ipseis.fr
							</Link>{" "}
							(ci-après &laquo;&nbsp;le Site&nbsp;&raquo;).
						</p>
						<p>
							Elle est rédigée conformément au Règlement Général sur la Protection des Données (RGPD &ndash; Règlement UE 2016/679) et à la loi
							Informatique et Libertés modifiée.
						</p>
					</div>
				</section>

				{/* 1. Responsable */}
				<section id="responsable" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">1. Responsable de traitement</h2>
					<div className="text-base leading-relaxed space-y-2">
						<p>Le responsable du traitement des données personnelles est :</p>
						<ul className="list-none space-y-1 text-univers/90">
							<li>
								<strong>IPSEIS</strong> &mdash; SARL au capital social, SIREN 931 671 606 R.C.S. Saint-Malo
							</li>
							<li>Siège social : 21 Rue de la Nation, 35400 Saint-Malo</li>
							<li>
								Représentante légale : <em className="text-univers/70">Hélène PAILLOT DE MONTABERT</em>
							</li>
							<li>
								Email de contact :{" "}
								<a href="mailto:helenedm@ipseis.fr" className="text-cohesion hover:underline underline-offset-4">
									helenedm@ipseis.fr
								</a>
							</li>
						</ul>
					</div>
				</section>

				{/* 2. Données collectées */}
				<section id="donnees-collectees" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">2. Données collectées</h2>
					<div className="text-base leading-relaxed space-y-4">
						<p>Nous collectons les données suivantes selon les contextes :</p>

						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">2.1. Formulaire de contact</h3>
							<p className="text-univers/90">Nom, prénom, email, téléphone, organisme, fonction, objet et contenu du message.</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">2.2. Téléchargement du catalogue</h3>
							<p className="text-univers/90">Nom, prénom, email, organisme, fonction.</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">2.3. Espace Personnel (compte utilisateur)</h3>
							<p className="text-univers/90">
								Nom, prénom, email, téléphone, organisme, poste, adresse, mot de passe (chiffré), rôle, historique de connexion.
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-maitrise mb-2">2.4. Données techniques</h3>
							<p className="text-univers/90">
								Adresse IP (anonymisée lorsque possible), type de navigateur, pages visitées, durée de visite, données de performance (Vercel Analytics &amp;
								Speed Insights).
							</p>
						</div>
					</div>
				</section>

				{/* 3. Finalités */}
				<section id="finalites" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">3. Finalités et bases légales</h2>
					<div className="text-base leading-relaxed">
						<div className="overflow-x-auto">
							<table className="w-full text-sm border-collapse">
								<thead>
									<tr className="border-b border-univers/20">
										<th className="text-left py-3 pr-4 font-semibold text-maitrise">Finalité</th>
										<th className="text-left py-3 font-semibold text-maitrise">Base légale</th>
									</tr>
								</thead>
								<tbody className="text-univers/90">
									<tr className="border-b border-univers/10">
										<td className="py-3 pr-4">Réponse aux demandes de contact et devis</td>
										<td className="py-3">Exécution de mesures précontractuelles</td>
									</tr>
									<tr className="border-b border-univers/10">
										<td className="py-3 pr-4">Envoi du catalogue de formations</td>
										<td className="py-3">Consentement</td>
									</tr>
									<tr className="border-b border-univers/10">
										<td className="py-3 pr-4">Gestion de l&apos;Espace Personnel (authentification, contrats, ressources, messagerie)</td>
										<td className="py-3">Exécution contractuelle</td>
									</tr>
									<tr className="border-b border-univers/10">
										<td className="py-3 pr-4">Prospection B2B et communication institutionnelle</td>
										<td className="py-3">Intérêt légitime (avec droit d&apos;opposition)</td>
									</tr>
									<tr>
										<td className="py-3 pr-4">Mesure d&apos;audience et amélioration du site</td>
										<td className="py-3">Intérêt légitime / Consentement</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>

				{/* 4. Destinataires */}
				<section id="destinataires" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">4. Destinataires</h2>
					<div className="text-base leading-relaxed space-y-3">
						<p>Vos données sont accessibles uniquement aux personnes et prestataires suivants :</p>
						<ul className="list-disc list-inside space-y-2 text-univers/90">
							<li>
								<strong>L&apos;équipe IPSEIS</strong> : pour le traitement de vos demandes et la gestion de votre Espace Personnel.
							</li>
							<li>
								<strong>Vercel Inc</strong> (hébergement du site web) : 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.
							</li>
							<li>
								<strong>OVHcloud</strong> (hébergement du serveur applicatif et de la base de données) : 2 rue Kellermann, 59100 Roubaix, France.
							</li>
							<li>
								<strong>Google (Gmail SMTP)</strong> : pour l&apos;envoi d&apos;emails transactionnels (réinitialisation de mot de passe, notifications).
							</li>
						</ul>
						<p>
							Ces prestataires agissent en qualité de sous-traitants au sens de l&apos;article 28 du RGPD, avec des garanties contractuelles
							adéquates.
						</p>
					</div>
				</section>

				{/* 5. Durées */}
				<section id="durees" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">5. Durées de conservation</h2>
					<div className="text-base leading-relaxed">
						<ul className="list-disc list-inside space-y-2 text-univers/90">
							<li>
								<strong>Demandes de contact</strong> : 3 ans à compter du dernier échange.
							</li>
							<li>
								<strong>Téléchargement du catalogue (prospects)</strong> : 3 ans à compter du dernier contact.
							</li>
							<li>
								<strong>Comptes utilisateurs (Espace Personnel)</strong> : durée de la relation contractuelle, puis 3 ans à compter de la
								dernière activité.
							</li>
							<li>
								<strong>Contrats et documents administratifs</strong> : durée légale applicable (5 à 10 ans selon obligation).
							</li>
							<li>
								<strong>Logs techniques et sécurité</strong> : 6 à 12 mois.
							</li>
							<li>
								<strong>Cookies</strong> : 13 mois maximum conformément aux recommandations de la CNIL.
							</li>
						</ul>
					</div>
				</section>

				{/* 6. Cookies */}
				<section id="cookies" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">6. Cookies</h2>
					<div className="text-base leading-relaxed space-y-4">
						<p>
							Un cookie est un petit fichier texte déposé sur votre navigateur. Le Site utilise les cookies suivants :
						</p>

						<div className="overflow-x-auto">
							<table className="w-full text-sm border-collapse">
								<thead>
									<tr className="border-b border-univers/20">
										<th className="text-left py-3 pr-4 font-semibold text-maitrise">Cookie</th>
										<th className="text-left py-3 pr-4 font-semibold text-maitrise">Finalité</th>
										<th className="text-left py-3 pr-4 font-semibold text-maitrise">Durée</th>
										<th className="text-left py-3 font-semibold text-maitrise">Type</th>
									</tr>
								</thead>
								<tbody className="text-univers/90">
									<tr className="border-b border-univers/10">
										<td className="py-3 pr-4 font-mono text-xs">token</td>
										<td className="py-3 pr-4">Authentification de l&apos;Espace Personnel</td>
										<td className="py-3 pr-4">7 ou 30 jours</td>
										<td className="py-3">Essentiel</td>
									</tr>
									<tr className="border-b border-univers/10">
										<td className="py-3 pr-4 font-mono text-xs">cookie-consent</td>
										<td className="py-3 pr-4">Mémorisation du consentement cookies</td>
										<td className="py-3 pr-4">13 mois</td>
										<td className="py-3">Essentiel</td>
									</tr>
									<tr>
										<td className="py-3 pr-4 font-mono text-xs">_vercel_*</td>
										<td className="py-3 pr-4">Analytics et performance (Vercel)</td>
										<td className="py-3 pr-4">Session</td>
										<td className="py-3">Performance</td>
									</tr>
								</tbody>
							</table>
						</div>

						<p>
							Les cookies essentiels sont exemptés de consentement car strictement nécessaires au fonctionnement du service. Vous pouvez
							à tout moment gérer vos préférences via les paramètres de votre navigateur.
						</p>
					</div>
				</section>

				{/* 7. Droits */}
				<section id="droits" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">7. Vos droits</h2>
					<div className="text-base leading-relaxed space-y-3">
						<p>Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
						<ul className="list-disc list-inside space-y-2 text-univers/90">
							<li>
								<strong>Droit d&apos;accès</strong> : obtenir la confirmation que vos données sont traitées et en recevoir une copie.
							</li>
							<li>
								<strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes.
							</li>
							<li>
								<strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données, sous réserve des obligations légales.
							</li>
							<li>
								<strong>Droit à la limitation</strong> : restreindre temporairement le traitement de vos données.
							</li>
							<li>
								<strong>Droit d&apos;opposition</strong> : vous opposer au traitement pour motifs légitimes, y compris la prospection.
							</li>
							<li>
								<strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible par machine.
							</li>
							<li>
								<strong>Droit de définir des directives post-mortem</strong> : organiser le sort de vos données après votre décès.
							</li>
						</ul>
						<p>
							Pour exercer vos droits, adressez votre demande à{" "}
							<a href="mailto:helenedm@ipseis.fr" className="text-cohesion hover:underline underline-offset-4">
								helenedm@ipseis.fr
							</a>{" "}
							en joignant un justificatif d&apos;identité si nécessaire. Nous nous engageons à répondre dans un délai d&apos;un mois.
						</p>
						<p>
							En cas de difficulté, vous pouvez introduire une réclamation auprès de la{" "}
							<a
								href="https://www.cnil.fr/fr/plaintes"
								target="_blank"
								rel="noopener noreferrer"
								className="text-cohesion hover:underline underline-offset-4"
							>
								CNIL
							</a>{" "}
							(Commission Nationale de l&apos;Informatique et des Libertés).
						</p>
					</div>
				</section>

				{/* 8. Sécurité */}
				<section id="securite" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">8. Sécurité</h2>
					<div className="text-base leading-relaxed space-y-3">
						<p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
						<ul className="list-disc list-inside space-y-2 text-univers/90">
							<li>Chiffrement des communications (HTTPS/TLS).</li>
							<li>Mots de passe chiffrés (hachage bcrypt).</li>
							<li>Authentification par jetons JWT dans des cookies httpOnly et sécurisés.</li>
							<li>Contrôle d&apos;accès par rôles (administrateur, apprenant, professionnel).</li>
							<li>Sauvegardes régulières de la base de données.</li>
							<li>Minimisation des données collectées.</li>
						</ul>
					</div>
				</section>

				{/* 9. Transferts */}
				<section id="transferts" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">9. Transferts hors UE</h2>
					<div className="text-base leading-relaxed space-y-3">
						<p>
							Certains de nos prestataires (Vercel, Google) sont basés aux États-Unis. Ces transferts sont encadrés par :
						</p>
						<ul className="list-disc list-inside space-y-2 text-univers/90">
							<li>Le Data Privacy Framework (DPF) UE-États-Unis pour les entreprises certifiées.</li>
							<li>Des clauses contractuelles types (CCT) approuvées par la Commission européenne.</li>
							<li>Des mesures complémentaires lorsque nécessaire.</li>
						</ul>
						<p>
							Le serveur applicatif et la base de données principale sont hébergés par OVHcloud en France.
						</p>
					</div>
				</section>

				{/* 10. Modifications */}
				<section id="modifications" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">10. Modifications</h2>
					<div className="text-base leading-relaxed">
						<p>
							La présente politique peut être mise à jour à tout moment pour refléter les évolutions légales, techniques ou opérationnelles. La
							date de dernière mise à jour en haut de page fait foi. Nous vous invitons à la consulter régulièrement.
						</p>
					</div>
				</section>

				{/* 11. Contact */}
				<section id="contact-dpo" className="scroll-mt-24 bg-white/30 rounded-2xl p-6">
					<h2 className="text-xl font-bold text-cohesion mb-4">11. Contact</h2>
					<div className="text-base leading-relaxed space-y-2">
						<p>Pour toute question relative à la protection de vos données personnelles :</p>
						<ul className="list-none space-y-1 text-univers/90">
							<li>
								Email :{" "}
								<a href="mailto:helenedm@ipseis.fr" className="text-cohesion hover:underline underline-offset-4">
									helenedm@ipseis.fr
								</a>
							</li>
							<li>Courrier : IPSEIS &mdash; 21 Rue de la Nation, 35400 Saint-Malo</li>
						</ul>
					</div>
				</section>

				{/* Back link */}
				<div className="text-center pt-4">
					<Link href="/mentions-legales" className="text-cohesion hover:underline underline-offset-4 font-medium">
						Voir aussi : Mentions légales
					</Link>
				</div>
			</article>
		</main>
	);
}
