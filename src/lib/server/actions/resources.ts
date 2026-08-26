"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../fetcher";
import { type ActionState, toErrorState } from "./types";

const ADMIN_RESOURCES = "/espace-personnel/administrateur/ressources";

export async function createResourceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>("/resources/admin", { method: "POST", body: formData });
		revalidatePath(ADMIN_RESOURCES);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la création de la ressource.");
	}
}

export async function updateResourceAction(id: string, formData: FormData): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/resources/admin/${id}`, { method: "PUT", body: formData });
		revalidatePath(ADMIN_RESOURCES);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la modification de la ressource.");
	}
}

export async function deleteResourceAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/resources/admin/${id}`, { method: "DELETE" });
		revalidatePath(ADMIN_RESOURCES);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la suppression de la ressource.");
	}
}
