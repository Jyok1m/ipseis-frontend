"use server";

import { revalidatePath, updateTag } from "next/cache";
import { serverFetch } from "../fetcher";
import { type ActionState, toErrorState } from "./types";

const ADMIN = "/espace-personnel/administrateur";

// ─── Codes d'activation ─────────────────────────────────────────────────────

export async function createActivationCodeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const targetEmail = String(formData.get("targetEmail") ?? "").trim();
	const role = String(formData.get("role") ?? "apprenant");

	if (!targetEmail) return { ok: false, error: "Veuillez saisir l'adresse email." };

	try {
		const data = await serverFetch<{ message: string }>("/admin/activation-codes", { method: "POST", body: { targetEmail, role } });
		revalidatePath(`${ADMIN}/codes-activation`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la création.");
	}
}

export async function cancelActivationCodeAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/activation-codes/${id}/cancel`, { method: "PATCH" });
		revalidatePath(`${ADMIN}/codes-activation`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'annulation.");
	}
}

export async function archiveActivationCodeAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/activation-codes/${id}/archive`, { method: "PATCH" });
		revalidatePath(`${ADMIN}/codes-activation`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'archivage.");
	}
}

// ─── Utilisateurs ───────────────────────────────────────────────────────────

export async function updateUserAction(id: string, payload: Record<string, unknown>): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/users/${id}`, { method: "PUT", body: payload });
		revalidatePath(`${ADMIN}/utilisateurs`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la mise à jour.");
	}
}

export async function deleteUserAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" });
		revalidatePath(`${ADMIN}/utilisateurs`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la suppression.");
	}
}

// ─── Prospects ──────────────────────────────────────────────────────────────

export async function contactProspectAction(id: string, payload: { subject: string; message: string }): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/prospects/${id}/contact`, { method: "POST", body: payload });
		revalidatePath(`${ADMIN}/prospects`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'envoi.");
	}
}

export async function convertProspectAction(id: string, role: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/prospects/${id}/convert`, { method: "POST", body: { role } });
		revalidatePath(`${ADMIN}/prospects`);
		revalidatePath(`${ADMIN}/codes-activation`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la conversion.");
	}
}

export async function updateProspectStatusAction(id: string, status: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/prospects/${id}/status`, { method: "PATCH", body: { status } });
		revalidatePath(`${ADMIN}/prospects`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la mise à jour du statut.");
	}
}

// ─── Formations ─────────────────────────────────────────────────────────────

/**
 * Toute écriture sur une formation invalide aussi le catalogue public, qui est
 * servi en ISR : sans cette purge, une modification n'apparaîtrait sur le site
 * qu'à l'expiration du cache (jusqu'à 2 h).
 *
 * updateTag plutôt que revalidateTag : réservé aux server actions, il donne la
 * sémantique read-your-own-writes, donc l'admin voit sa modification dès le
 * rechargement au lieu d'attendre la prochaine requête.
 */
function revalidateTrainings() {
	revalidatePath(`${ADMIN}/formations`);
	for (const tag of ["themes", "trainings", "training", "all-trainings"]) updateTag(tag);
	revalidatePath("/catalogue");
}

export async function createTrainingAction(payload: Record<string, unknown>): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>("/admin/trainings", { method: "POST", body: payload });
		revalidateTrainings();
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la création de la formation.");
	}
}

export async function updateTrainingAction(id: string, payload: Record<string, unknown>): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/trainings/${id}`, { method: "PUT", body: payload });
		revalidateTrainings();
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la modification de la formation.");
	}
}

export async function deleteTrainingAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/trainings/${id}`, { method: "DELETE" });
		revalidateTrainings();
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la suppression.");
	}
}

export async function toggleTrainingVisibilityAction(id: string, isVisible: boolean): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/trainings/${id}/visibility`, { method: "PATCH", body: { isVisible } });
		revalidateTrainings();
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors du changement de visibilité.");
	}
}

// ─── Checklists ─────────────────────────────────────────────────────────────

export async function createChecklistAction(payload: Record<string, unknown>): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>("/admin/checklists", { method: "POST", body: payload });
		revalidatePath(`${ADMIN}/checklists`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la création de la checklist.");
	}
}

export async function updateChecklistAction(id: string, payload: Record<string, unknown>): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/checklists/${id}`, { method: "PUT", body: payload });
		revalidatePath(`${ADMIN}/checklists`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la modification.");
	}
}

export async function toggleChecklistItemAction(
	checklistId: string,
	itemId: string,
	payload: { isChecked?: boolean; notes?: string }
): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/checklists/${checklistId}/items/${itemId}`, { method: "PATCH", body: payload });
		revalidatePath(`${ADMIN}/checklists`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la mise à jour de l'item.");
	}
}

export async function deleteChecklistAction(id: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/admin/checklists/${id}`, { method: "DELETE" });
		revalidatePath(`${ADMIN}/checklists`);
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de la suppression.");
	}
}
