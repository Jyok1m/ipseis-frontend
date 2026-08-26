"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../fetcher";
import { type ActionState, toErrorState } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulaire de contact public. Le POST part du serveur Next et non du
 * navigateur : l'URL du backend n'est plus exposée dans les requêtes réseau
 * de la page, et le formulaire reste soumettable sans JavaScript.
 */
export async function sendContactMessageAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const firstName = String(formData.get("firstName") ?? "").trim();
	const lastName = String(formData.get("lastName") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const message = String(formData.get("message") ?? "").trim();
	const interestedFormations = formData.getAll("interestedFormations").map(String);

	if (!firstName || !lastName || !email || !message) {
		return { ok: false, error: "Veuillez remplir tous les champs obligatoires." };
	}
	if (!EMAIL_RE.test(email)) {
		return { ok: false, error: "Veuillez saisir une adresse email valide." };
	}

	try {
		const data = await serverFetch<{ message: string }>("/messages/new", {
			method: "POST",
			body: { firstName, lastName, email, message, interestedFormations },
		});
		// Un message de contact crée ou met à jour un prospect côté admin.
		revalidatePath("/espace-personnel/administrateur/prospects");
		revalidatePath("/espace-personnel/administrateur/messages");
		return { ok: true, message: data.message ?? "Message envoyé." };
	} catch (error) {
		return toErrorState(error, "Une erreur inattendue est survenue.");
	}
}

/**
 * Demande de catalogue PDF. Le backend expose un GET dont le paramètre
 * interestedFormations accepte un tableau répété ou une chaîne JSON
 * (cf. routes/messages.js) ; on envoie du JSON, plus simple à sérialiser.
 */
export async function requestCatalogueAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const firstName = String(formData.get("firstName") ?? "").trim();
	const lastName = String(formData.get("lastName") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const interestedFormations = formData.getAll("interestedFormations").map(String);

	if (!firstName || !lastName || !email) {
		return { ok: false, error: "Veuillez remplir tous les champs obligatoires." };
	}
	if (!EMAIL_RE.test(email)) {
		return { ok: false, error: "Veuillez saisir une adresse email valide." };
	}

	try {
		const data = await serverFetch<{ message: string }>("/messages/catalogue", {
			searchParams: {
				firstName,
				lastName,
				email,
				interestedFormations: interestedFormations.length ? JSON.stringify(interestedFormations) : undefined,
			},
		});
		revalidatePath("/espace-personnel/administrateur/prospects");
		return { ok: true, message: data.message ?? "Catalogue envoyé." };
	} catch (error) {
		return toErrorState(error, "Une erreur inattendue est survenue.");
	}
}
