import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Documents publics téléchargeables (exigences Qualiopi : information du
 * bénéficiaire avant l'entrée en formation).
 *
 * Les fichiers ne sont pas encore fournis. Plutôt que d'afficher des liens qui
 * répondraient 404, la liste est filtrée sur la présence réelle du PDF dans
 * `public/pdf` : déposer le fichier au bon nom suffit à faire apparaître le
 * lien, sans toucher au code.
 *
 * `next.config.mjs` force l'inclusion de `public/pdf` dans la trace de la route
 * /contact - sans quoi le dossier serait absent du bundle serverless en
 * production et aucun document ne serait jamais détecté.
 */
export type PublicResource = {
	label: string;
	/** Nom du fichier attendu dans `public/pdf`. */
	file: string;
};

export const PUBLIC_RESOURCES: PublicResource[] = [
	{ label: "Livret d'accueil", file: "livret-accueil.pdf" },
	{ label: "Conditions générales de vente", file: "cgv.pdf" },
	{ label: "Règlement intérieur", file: "reglement-interieur.pdf" },
];

const PDF_DIR = path.join(process.cwd(), "public", "pdf");

export function getAvailableResources(): (PublicResource & { href: string })[] {
	return PUBLIC_RESOURCES.filter((resource) => {
		try {
			return fs.statSync(path.join(PDF_DIR, resource.file)).isFile();
		} catch {
			return false;
		}
	}).map((resource) => ({ ...resource, href: `/pdf/${resource.file}` }));
}
