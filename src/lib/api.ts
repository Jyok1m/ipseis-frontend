// Service API optimisé avec cache Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4001";

// Interface des données
export interface Theme {
	_id: string;
	title: string;
	type?: string;
}

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
		const response = await fetch(`${API_BASE_URL}/themes/list`, {
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
		const response = await fetch(`${API_BASE_URL}/trainings/by-theme/${themeId}`, {
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
		const response = await fetch(`${API_BASE_URL}/trainings/by-id/${trainingId}`, {
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
		const response = await fetch(`${API_BASE_URL}/trainings/all`, {
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

// Fonction pour purger le cache (utile pour l'admin)
export async function revalidateCache(tag?: string) {
	if (typeof window !== "undefined") {
		// Côté client, on ne peut pas faire de revalidation
		return;
	}

	try {
		const { revalidateTag } = await import("next/cache");
		if (tag) {
			revalidateTag(tag);
		} else {
			// Revalider tous les tags
			["themes", "trainings", "training", "all-trainings"].forEach(revalidateTag);
		}
	} catch (error) {
		console.error("Error revalidating cache:", error);
	}
}
