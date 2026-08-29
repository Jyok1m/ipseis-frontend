"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../fetcher";
import { type ActionState, toErrorState } from "./types";

const ADMIN_CONTRACTS = "/espace-personnel/administrateur/contrats";

/** Les contrats portent un PDF : le FormData de l'action est relayé tel quel en multipart. */
export async function createContractAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>("/contracts/admin", { method: "POST", body: formData });
		revalidatePath(ADMIN_CONTRACTS);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la création du contrat.");
	}
}

export async function updateContractAction(id: string, formData: FormData): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/contracts/admin/${id}`, { method: "PUT", body: formData });
		revalidatePath(ADMIN_CONTRACTS);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la modification du contrat.");
	}
}

export async function sendContractAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/contracts/admin/${id}/send`, { method: "PATCH" });
		revalidatePath(ADMIN_CONTRACTS);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'envoi du contrat.");
	}
}

export async function cancelContractAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/contracts/admin/${id}/cancel`, { method: "PATCH" });
		revalidatePath(ADMIN_CONTRACTS);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'annulation du contrat.");
	}
}

export async function deleteContractAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/contracts/admin/${id}`, { method: "DELETE" });
		revalidatePath(ADMIN_CONTRACTS);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la suppression du contrat.");
	}
}

/** Côté destinataire : signature et refus, sur les trois espaces de rôle. */
function revalidateMyContracts() {
	for (const role of ["apprenant", "professionnel", "administrateur"]) {
		revalidatePath(`/espace-personnel/${role}/contrats`);
	}
}

export async function signContractAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/contracts/my/${id}/sign`, { method: "PATCH" });
		revalidateMyContracts();
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la signature du contrat.");
	}
}

export async function rejectContractAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/contracts/my/${id}/reject`, { method: "PATCH" });
		revalidateMyContracts();
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors du refus du contrat.");
	}
}
