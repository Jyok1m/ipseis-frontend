/**
 * Géométrie de la roue de sélection, partagée entre la roue elle-même
 * (composant client) et son squelette de chargement (composant serveur).
 *
 * Module neutre volontairement : importer une valeur depuis un module
 * "use client" ferait basculer le squelette côté client alors qu'il n'a besoin
 * d'aucun JavaScript.
 *
 * Toutes les valeurs sont en pourcentage de la largeur du conteneur, ce qui
 * rend la roue redimensionnable d'un bloc sans media query.
 */

/** Rayon du cercle sur lequel sont posées les bulles. */
export const WHEEL_RADIUS = 34;

/**
 * Diamètre d'une bulle : on part de la corde séparant deux bulles voisines
 * (2·R·sin(π/n)) et on n'en garde que 72 % pour laisser respirer.
 */
export function bubbleDiameter(count: number) {
	if (count < 3) return WHEEL_RADIUS;
	return round(Math.min(2 * WHEEL_RADIUS * Math.sin(Math.PI / count) * 0.72, WHEEL_RADIUS));
}

/** Arrondi au centième : sans lui, le HTML porte des 50.00000000000001%. */
const round = (value: number) => Math.round(value * 100) / 100;

/** Position d'une bulle sur le cercle, premier élément au sommet. */
export function polarPosition(index: number, count: number) {
	const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
	return { x: round(50 + WHEEL_RADIUS * Math.cos(angle)), y: round(50 + WHEEL_RADIUS * Math.sin(angle)) };
}
