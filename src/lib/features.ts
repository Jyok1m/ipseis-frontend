/**
 * Interrupteurs de fonctionnalités.
 *
 * `NEXT_PUBLIC_*` est inliné au build : la valeur est lisible côté serveur
 * comme côté navigateur, ce qui permet d'utiliser le même drapeau dans un
 * composant serveur, dans un composant client et dans le sitemap.
 *
 * Le catalogue PDF (page /telecharger-catalogue, encarts de téléchargement et
 * envoi par email) est masqué tant qu'IPSEIS n'a pas de catalogue à envoyer :
 * proposer un téléchargement qui n'aboutit pas est pire que de ne rien
 * proposer. Repasser la variable à "true" le fait réapparaître partout.
 */
export const CATALOGUE_PDF_ENABLED = process.env.NEXT_PUBLIC_CATALOGUE_PDF_ENABLED === "true";
