/**
 * Habillage des intitulés oranges étoilés du site.
 *
 * Deux composants les rendent : `SectionHeading`, qui en fait un vrai niveau de
 * titre sur les pages de contenu (« Le mot de la fondatrice »), et le `tag` de
 * `TitleSection`, qui n'est qu'une étiquette au-dessus du titre de section
 * (« Notre approche », le thème sur une fiche formation). La sémantique diffère
 * - h2/h3 d'un côté, p de l'autre - mais l'apparence doit être la même : deux
 * jeux de classes séparés avaient déjà divergé d'une graisse et de deux crans
 * de taille.
 *
 * Module neutre et non `SectionHeading.tsx` : `TitleSection` est importé par des
 * composants « use client » (la fiche formation), et importer depuis le module
 * du composant y embarquerait `SectionHeading` pour trois chaînes de caractères.
 */

/** Conteneur : `items-start` garde l'étoile sur la première ligne d'un intitulé qui en fait deux. */
export const STARRED_LABEL_CLASS = "flex items-start gap-x-1 text-lg font-bold tracking-wider text-cohesion sm:text-2xl";

/** L'étoile déborde à gauche du texte, le SVG portant sa propre marge interne. */
export const STARRED_LABEL_STAR_CLASS = "-ml-3 w-11 shrink-0 aspect-1 sm:-ml-4 sm:w-14";

/** Compense le débord haut de l'étoile pour poser le texte sur son centre optique. */
export const STARRED_LABEL_TEXT_CLASS = "mt-1.5 sm:mt-2.5";
