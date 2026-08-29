/**
 * Intitulés des deux colonnes du catalogue.
 *
 * Partagés entre le catalogue et son squelette de chargement : le squelette
 * calque la mise en page réelle pour éviter tout saut au remplacement, ce qui
 * suppose des titres identiques - deux copies auraient divergé à la première
 * reformulation.
 */
export const COLUMN_TITLES = {
	sante:
		"Formations pour les professionnels des établissements du secteur sanitaire, médico-social et social",
	transversal: "Formations transversales",
} as const;

/** Classes communes aux titres de colonne, squelette compris. */
export const COLUMN_TITLE_CLASS =
	"mb-6 max-w-[26rem] text-balance text-center text-base font-bold uppercase tracking-wider sm:mb-8 sm:text-lg lg:text-xl";
