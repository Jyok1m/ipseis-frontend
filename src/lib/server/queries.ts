import "server-only";
import { serverFetch } from "./fetcher";
import { groupResourcesByTraining } from "../types";
import type { ActivationCode, AdminTraining, Checklist, Contract, DashboardStats, Paginated, Pagination, Prospect, Resource, SessionUser } from "../types";

// Réexport : les composants importent leurs types depuis ce module métier,
// sans avoir à connaître le module neutre où ils sont déclarés.
export type { ActivationCode, AdminTraining, Checklist, Contract, DashboardStats, Paginated, Pagination, Prospect, Resource, ResourceGroup } from "../types";
export { groupResourcesByTraining };

/** Le backend nomme le tableau d'après l'entité ; on normalise pour les appelants. */
function normalize<T>(payload: Record<string, unknown>, key: string): Paginated<T> {
	return {
		items: (payload[key] as T[]) ?? [],
		pagination: (payload.pagination as Pagination) ?? { page: 1, limit: 0, total: 0, pages: 1 },
	};
}

// ─── Admin : tableau de bord ────────────────────────────────────────────────

export const getDashboardStats = () => serverFetch<DashboardStats>("/admin/dashboard/stats");

// ─── Admin : utilisateurs et codes d'activation ─────────────────────────────

export async function getUsers(params: { page?: number; role?: string; search?: string; excludeRole?: string } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/admin/users", { searchParams: { ...params, page: params.page ?? 1 } });
	return normalize<SessionUser & { createdAt: string }>(payload, "users");
}

export async function getActivationCodes(params: { page?: number; archived?: boolean } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/admin/activation-codes", {
		searchParams: { page: params.page ?? 1, archived: params.archived ? "true" : undefined },
	});
	return normalize<ActivationCode>(payload, "codes");
}

// ─── Admin : prospects ──────────────────────────────────────────────────────

export async function getProspects(params: { page?: number; source?: string; search?: string } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/admin/prospects", { searchParams: { ...params, page: params.page ?? 1 } });
	return normalize<Prospect>(payload, "prospects");
}

// ─── Admin : formations et thèmes ───────────────────────────────────────────

export const getAdminTrainings = async () => (await serverFetch<{ trainings: AdminTraining[] }>("/admin/trainings")).trainings;

export const getAdminThemes = async () =>
	(await serverFetch<{ themes: Array<{ _id: string; title: string; type: string }> }>("/admin/themes")).themes;

// ─── Admin : checklists ─────────────────────────────────────────────────────

export async function getChecklists(params: { page?: number } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/admin/checklists", { searchParams: { page: params.page ?? 1 } });
	return normalize<Checklist>(payload, "checklists");
}

// ─── Contrats ───────────────────────────────────────────────────────────────

export async function getAdminContracts(params: { page?: number; status?: string } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/contracts/admin", { searchParams: { ...params, page: params.page ?? 1 } });
	return normalize<Contract>(payload, "contracts");
}

export async function getMyContracts(params: { page?: number } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/contracts/my", { searchParams: { page: params.page ?? 1 } });
	return normalize<Contract>(payload, "contracts");
}

// ─── Ressources ─────────────────────────────────────────────────────────────

export async function getAdminResources(params: { page?: number; trainingId?: string } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/resources/admin", { searchParams: { ...params, page: params.page ?? 1 } });
	return normalize<Resource>(payload, "resources");
}

export const getMyResources = async () => (await serverFetch<{ resources: Resource[] }>("/resources/my")).resources;

// ─── Messagerie interne ─────────────────────────────────────────────────────

export async function getConversations(params: { page?: number; archived?: boolean } = {}) {
	const path = params.archived ? "/internal-messages/conversations/archived" : "/internal-messages/conversations";
	const payload = await serverFetch<Record<string, unknown>>(path, { searchParams: { page: params.page ?? 1 } });
	return normalize<Record<string, unknown>>(payload, "messages");
}

export const getUnreadCount = async () => (await serverFetch<{ count: number }>("/internal-messages/unread-count")).count;

export const getConversation = (conversationId: string) =>
	serverFetch<Record<string, unknown>>(`/internal-messages/conversation/${conversationId}`);

// ─── Messages de contact (admin) ────────────────────────────────────────────

export async function getContactMessages(params: { page?: number } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/messages/admin", { searchParams: { page: params.page ?? 1 } });
	return normalize<Record<string, unknown>>(payload, "messages");
}

export const getContactUnreadCount = async () => (await serverFetch<{ count: number }>("/messages/admin/unread-count")).count;
