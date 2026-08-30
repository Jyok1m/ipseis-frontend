/**
 * Coordonnées d'IPSEIS, source unique.
 *
 * Elles étaient jusqu'ici recopiées dans les mentions légales, le JSON-LD et
 * les pages de contenu : un déménagement ou un changement de ligne obligeait à
 * repasser sur chaque fichier, et une des copies finissait toujours oubliée.
 */
export const IPSEIS = {
	name: "IPSEIS",
	legalName: "IPSEIS",
	address: {
		street: "21 rue de la Nation",
		postalCode: "35400",
		city: "Saint-Malo",
		country: "France",
	},
	/** Format `tel:` - sans espaces, avec indicatif, pour les liens cliquables. */
	phoneHref: "+33630709978",
	/** Format lisible, celui qu'on affiche. */
	phone: "06 30 70 99 78",
	email: "hdemontabert@yahoo.fr",
} as const;

/**
 * Référent handicap (exigence Qualiopi, indicateur 26).
 * C'est aujourd'hui la fondatrice qui assure ce rôle.
 */
export const HANDICAP_REFERENT = {
	name: "Hélène Paillot de Montabert",
	role: "Référente handicap",
	email: IPSEIS.email,
	phone: IPSEIS.phone,
	phoneHref: IPSEIS.phoneHref,
} as const;
