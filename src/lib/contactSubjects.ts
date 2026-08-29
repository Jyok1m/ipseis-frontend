/**
 * Motifs de contact proposés dans le formulaire.
 *
 * La liste est partagée entre le formulaire et la server action : la valeur
 * reçue est validée contre ces identifiants avant d'être recopiée dans le
 * message, sinon n'importe quel texte posté à la main se retrouverait en tête
 * des emails envoyés à IPSEIS.
 */
export const CONTACT_SUBJECTS = [
	{
		value: "formation",
		label: "Vous recherchez une formation en particulier ou souhaitez un devis",
	},
	{
		value: "formateur",
		label: "Vous souhaitez rejoindre notre équipe de formateurs vacataires",
	},
	{
		value: "reclamation",
		label: "Vous souhaitez faire part d'une remarque, d'une suggestion, d'une réclamation",
	},
] as const;

export type ContactSubjectValue = (typeof CONTACT_SUBJECTS)[number]["value"];

/** Libellé associé à un motif, ou `null` si la valeur n'en est pas un. */
export function subjectLabel(value: string): string | null {
	return CONTACT_SUBJECTS.find((subject) => subject.value === value)?.label ?? null;
}
