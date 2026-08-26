"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../fetcher";
import { type ActionState, toErrorState } from "./types";
import type { ContactMessage } from "../../types";

/** La messagerie est accessible depuis les trois espaces de rôle. */
function revalidateMessages() {
	for (const role of ["apprenant", "professionnel", "administrateur"]) {
		revalidatePath(`/espace-personnel/${role}/messages`);
	}
}

export async function sendInternalMessageAction(payload: {
	recipientUser: string;
	subject: string;
	content: string;
	parentMessage?: string;
}): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>("/internal-messages/send", { method: "POST", body: payload });
		revalidateMessages();
		return { ok: true, message: data.message ?? "Message envoyé." };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'envoi du message.");
	}
}

export async function markMessageReadAction(id: string): Promise<ActionState> {
	try {
		await serverFetch(`/internal-messages/${id}/read`, { method: "PATCH" });
		revalidateMessages();
		return { ok: true };
	} catch (error) {
		return toErrorState(error, "Erreur lors du marquage comme lu.");
	}
}

export async function archiveConversationAction(conversationId: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/internal-messages/conversation/${conversationId}/archive`, { method: "POST" });
		revalidateMessages();
		return { ok: true, message: data.message ?? "Conversation archivée." };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'archivage.");
	}
}

export async function unarchiveConversationAction(conversationId: string): Promise<ActionState> {
	try {
		const data = await serverFetch<{ message: string }>(`/internal-messages/conversation/${conversationId}/archive`, { method: "DELETE" });
		revalidateMessages();
		return { ok: true, message: data.message ?? "Conversation désarchivée." };
	} catch (error) {
		return toErrorState(error, "Erreur lors du désarchivage.");
	}
}

// ─── Messages de contact (admin) ────────────────────────────────────────────

const ADMIN_MESSAGES = "/espace-personnel/administrateur/messages";

export async function markContactMessageReadAction(id: string): Promise<ActionState> {
	try {
		await serverFetch(`/messages/admin/${id}/read`, { method: "PATCH" });
		revalidatePath(ADMIN_MESSAGES);
		return { ok: true };
	} catch (error) {
		return toErrorState(error, "Erreur lors du marquage comme lu.");
	}
}

/** Renvoie le message mis à jour : l'UI affiche le fil de réponses sans re-fetch. */
export async function replyToContactMessageAction(
	id: string,
	content: string
): Promise<ActionState & { contactMessage?: ContactMessage }> {
	try {
		const data = await serverFetch<{ message: string; contactMessage: ContactMessage }>(`/messages/admin/${id}/reply`, {
			method: "POST",
			body: { content },
		});
		revalidatePath(ADMIN_MESSAGES);
		return { ok: true, message: data.message ?? "Réponse envoyée.", contactMessage: data.contactMessage };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'envoi de la réponse.");
	}
}
