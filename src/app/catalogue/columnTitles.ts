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

/**
 * Grille des deux colonnes, et sous-grille d'une colonne.
 *
 * À partir de lg, chaque colonne devient une sous-grille de deux rangées
 * calquée sur la grille parente : les deux titres partagent la hauteur de la
 * première rangée et les deux roues démarrent donc au même y. En flex, le titre
 * santé tenant sur quatre lignes contre une seule pour le titre transversal,
 * une roue partait trois lignes plus bas que l'autre.
 *
 * `items-start` empêche la roue d'être recentrée verticalement dans la seconde
 * rangée, dont la hauteur est celle de la plus haute des deux colonnes.
 */
export const COLUMN_GRID_CLASS =
	"grid grid-cols-1 divide-y divide-univers/10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:divide-x lg:divide-y-0 lg:divide-univers/15";

export const COLUMN_SUBGRID_CLASS = "lg:grid lg:row-span-2 lg:grid-rows-subgrid lg:items-start";

/** Classes communes aux titres de colonne, squelette compris. */
export const COLUMN_TITLE_CLASS =
	"mx-auto mb-6 max-w-[26rem] text-balance text-center text-base font-bold uppercase tracking-wider sm:mb-8 sm:text-lg lg:text-xl";
