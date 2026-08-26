import "server-only";
import { serverFetch } from "./fetcher";
import type { SessionUser } from "./session";

/** Forme de pagination renvoyée par toutes les listes du backend. */
export interface Pagination {
	page: number;
	limit: number;
	total: number;
	pages: number;
}

export interface Paginated<T> {
	pagination: Pagination;
	items: T[];
}

/** Le backend nomme le tableau d'après l'entité ; on normalise pour les appelants. */
function normalize<T>(payload: Record<string, unknown>, key: string): Paginated<T> {
	return {
		items: (payload[key] as T[]) ?? [],
		pagination: (payload.pagination as Pagination) ?? { page: 1, limit: 0, total: 0, pages: 1 },
	};
}

// ─── Admin : tableau de bord ────────────────────────────────────────────────

export interface DashboardStats {
	totalProspects: number;
	prospectsThisMonth: number;
	totalUsers: number;
	totalTrainings: number;
	totalMessages: number;
	totalCatalogueDownloads: number;
	sourceBreakdown: Record<string, number>;
	totalContracts: number;
	contractsByStatus: { draft: number; sent: number; signed: number; cancelled: number; rejected: number };
	recentContracts: Array<{ _id: string; title: string; recipientName: string; status: string; createdAt: string }>;
	recentUsers: Array<{ _id: string; firstName: string; lastName: string; role: string; createdAt: string }>;
	checklistsInProgress: number;
}

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
	return normalize<Record<string, unknown>>(payload, "codes");
}

// ─── Admin : prospects ──────────────────────────────────────────────────────

export interface Prospect {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	source: string;
	status: string;
	lastInteractionDate: string;
	interactionCount: number;
	hasCatalogueDownload: boolean;
	hasContactMessage: boolean;
	hasAccount: boolean;
	interactions: Array<Record<string, unknown>>;
	createdAt: string;
}

export async function getProspects(params: { page?: number; source?: string; search?: string } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/admin/prospects", { searchParams: { ...params, page: params.page ?? 1 } });
	return normalize<Prospect>(payload, "prospects");
}

// ─── Admin : formations et thèmes ───────────────────────────────────────────

export interface AdminTraining {
	_id: string;
	title: string;
	introduction?: string;
	pedagogical_objectives: string[];
	program: string[];
	pedagogical_methods: string[];
	evaluation_methods: string[];
	audience: string;
	prerequisites: string;
	trainer: string;
	number_of_trainees: string;
	duration: string;
	quote: string;
	accessibility?: string;
	isVisible?: boolean;
	themeId?: string;
	themeName?: string;
}

export const getAdminTrainings = async () => (await serverFetch<{ trainings: AdminTraining[] }>("/admin/trainings")).trainings;

export const getAdminThemes = async () =>
	(await serverFetch<{ themes: Array<{ _id: string; title: string; type: string }> }>("/admin/themes")).themes;

// ─── Admin : checklists ─────────────────────────────────────────────────────

export async function getChecklists(params: { page?: number } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/admin/checklists", { searchParams: { page: params.page ?? 1 } });
	return normalize<Record<string, unknown>>(payload, "checklists");
}

// ─── Contrats ───────────────────────────────────────────────────────────────

export interface Contract {
	_id: string;
	title: string;
	description?: string;
	status: "draft" | "sent" | "signed" | "cancelled" | "rejected";
	recipientUser?: { _id: string; firstName: string; lastName: string; email: string };
	pdfPath?: string;
	createdAt: string;
	signedAt?: string;
}

export async function getAdminContracts(params: { page?: number; status?: string } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/contracts/admin", { searchParams: { ...params, page: params.page ?? 1 } });
	return normalize<Contract>(payload, "contracts");
}

export async function getMyContracts(params: { page?: number } = {}) {
	const payload = await serverFetch<Record<string, unknown>>("/contracts/my", { searchParams: { page: params.page ?? 1 } });
	return normalize<Contract>(payload, "contracts");
}

// ─── Ressources ─────────────────────────────────────────────────────────────

export interface Resource {
	_id: string;
	title: string;
	description?: string;
	training?: { _id: string; title: string };
	allowedRoles?: string[];
	filePath?: string;
	createdAt: string;
}

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
