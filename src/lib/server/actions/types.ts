/**
 * État renvoyé par les server actions, consommé par useActionState.
 * Doit rester sérialisable : pas d'Error, pas de Date, pas de fonction.
 */
export interface ActionState {
	ok: boolean;
	/** Message de succès à afficher. */
	message?: string;
	/** Message d'erreur remonté par le backend. */
	error?: string;
}

export const idle: ActionState = { ok: false };

/** Normalise une exception d'action en ActionState affichable. */
export function toErrorState(error: unknown, fallback: string): ActionState {
	return { ok: false, error: error instanceof Error ? error.message : fallback };
}
