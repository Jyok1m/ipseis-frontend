// Service API optimisé avec cache Next.js
// Lu à chaque appel et non au chargement du module : `next build` importe ce
// fichier pour prérendre les pages, une constante de module figerait la valeur
// du build dans l'image.
const apiBaseUrl = () => process.env.BACKEND_URL || "http://localhost:3098";

// Interface des données
export type { Theme } from "./types";
import type { Theme, ThemeWithTrainings } from "./types";

export interface Training {
	_id: string;
	title: string;
	description?: string;
	introduction?: string;
	theme?: string;
	themeId?: string;
	pedagogical_objectives: string[];
	program: string[];
	pedagogical_methods: string[];
	evaluation_methods: string[];
	audience: string;
	prerequisites: string;
	trainer: string;
	number_of_trainees: string;
	duration: string;
	quote: string;
	accessibility?: string;
}

// Mention standard d'accessibilité (repli pour les fiches créées avant l'ajout du champ).
export const DEFAULT_ACCESSIBILITY =
	"IPSEIS demande à être informé sur les situations de handicap des stagiaires afin d'adapter les modalités pédagogiques aux objectifs de la formation, et de prendre en compte les moyens de compensation du handicap.";

// Cache et revalidation pour les thèmes (données assez statiques)
export async function getThemes(): Promise<Theme[]> {
	try {
		const response = await fetch(`${apiBaseUrl()}/themes/list`, {
			next: {
				revalidate: 3600, // Cache 1 heure
				tags: ["themes"],
			},
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch themes: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching themes:", error);
		return []; // Fallback gracieux
	}
}

// Cache plus court pour les formations par thème
export async function getTrainingsByTheme(themeId: string): Promise<Training[]> {
	try {
		const response = await fetch(`${apiBaseUrl()}/trainings/by-theme/${themeId}`, {
			next: {
				revalidate: 1800, // Cache 30 minutes
				tags: ["trainings", `theme-${themeId}`],
			},
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch trainings: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching trainings by theme:", error);
		return [];
	}
}

// Cache et revalidation pour les formations individuelles
export async function getTrainingById(trainingId: string): Promise<Training | null> {
	try {
		const response = await fetch(`${apiBaseUrl()}/trainings/by-id/${trainingId}`, {
			next: {
				revalidate: 3600, // Cache 1 heure
				tags: ["training", `training-${trainingId}`],
			},
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			if (response.status === 404) {
				return null; // Formation non trouvée
			}
			throw new Error(`Failed to fetch training: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error(`Error fetching training by id (${trainingId}):`, error);
		return null;
	}
}

// Cache pour toutes les formations (pour generateStaticParams)
export async function getAllTrainings(): Promise<{ themes: Array<{ _id: string; title: string; trainings: Training[] }> }> {
	try {
		const response = await fetch(`${apiBaseUrl()}/trainings/all`, {
			next: {
				revalidate: 7200, // Cache 2 heures
				tags: ["all-trainings"],
			},
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch all trainings: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching all trainings:", error);
		return { themes: [] };
	}
}

/**
 * Catalogue complet : thématiques (avec leur secteur) et formations visibles.
 *
 * /themes/list porte le champ `type` qui distingue santé et transversal ;
 * /trainings/all porte les formations filtrées sur isVisible. Les deux lectures
 * sont mises en cache par l'ISR, on les recolle ici pour que le client reçoive
 * un catalogue complet et n'ait plus rien à fetcher, y compris à l'ouverture
 * des modales par thématique.
 */
export async function getCatalogue(): Promise<Array<Theme & ThemeWithTrainings>> {
	const [themes, allTrainings] = await Promise.all([getThemes(), getAllTrainings()]);
	const trainingsByTheme = new Map(allTrainings.themes.map((theme) => [theme._id, theme.trainings]));

	return themes.map((theme) => ({ ...theme, trainings: trainingsByTheme.get(theme._id) ?? [] }));
}
