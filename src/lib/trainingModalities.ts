/**
 * Modalités Intra / Inter, communes à la fiche affichée et au PDF téléchargeable.
 *
 * Le modèle `Training` ne porte qu'un tarif et qu'un effectif, saisis en admin :
 * ce sont les valeurs Intra. IPSEIS ne commercialise pas encore d'Inter, mais la
 * modalité doit apparaître - d'où des libellés fixes côté Inter plutôt qu'un
 * champ vide.
 *
 * TODO (IPSEIS) : le champ « nombre de participants » de chaque formation
 * décrit l'effectif Intra. Hélène doit le passer en « Entre 6 et 12 personnes »
 * depuis l'espace administrateur ; il n'est pas figé ici pour rester modifiable
 * formation par formation.
 */
export const MODALITIES = {
	intraLabel: "Intra",
	interLabel: "Inter",
	/** Aucun tarif Inter publié tant que la modalité n'est pas ouverte. */
	interQuote: "Nous consulter",
	interCapacity: "À partir de 5 participants",
	/** Précision de transparence tarifaire demandée pour l'affichage du prix. */
	priceNote: "Tarif hors frais de déplacement du formateur (coût pédagogique).",
} as const;
