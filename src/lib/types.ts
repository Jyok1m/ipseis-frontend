/**
 * Types partagés entre serveur et client.
 *
 * Volontairement dans un module neutre : src/lib/server/* est marqué
 * `server-only` et ne doit pas être importé depuis un composant client, même
 * en `import type`. Un tel import ne survit pas à la compilation aujourd'hui,
 * mais deviendrait une erreur obscure le jour où quelqu'un le transforme en
 * import de valeur.
 */

export type Role = "administrateur" | "apprenant" | "professionnel";

export interface SessionUser {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: Role;
	phone: string;
	company: string;
	position: string;
	address: string;
	isActive: boolean;
}

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

export interface Contract {
	_id: string;
	title: string;
	description: string;
	status: "draft" | "sent" | "signed" | "cancelled" | "rejected";
	linkedTraining: { _id: string; title: string } | null;
	startDate: string | null;
	endDate: string | null;
	amount: number;
	pdfUrl: string;
	recipientUser?: { _id: string; firstName: string; lastName: string; email: string };
	signedAt: string | null;
	rejectedAt: string | null;
	cancelledAt: string | null;
	createdAt: string;
}

export interface Resource {
	_id: string;
	title: string;
	description: string;
	pdfUrl: string;
	originalFileName: string;
	linkedTraining: { _id: string; title: string } | null;
	targetRoles: string[];
	/** Peuplé uniquement sur les routes admin. */
	createdBy?: { firstName: string; lastName: string } | null;
	createdAt: string;
}

/** Ressources d'un utilisateur regroupées par formation, pour l'affichage. */
export interface ResourceGroup {
	training: { _id: string; title: string };
	resources: Resource[];
}

/**
 * Le regroupement par formation se fait ici plutôt que dans le composant :
 * c'est du calcul pur, autant le faire une fois côté serveur.
 * Les ressources sans formation liée sont ignorées, comme avant.
 */
export function groupResourcesByTraining(resources: Resource[]): ResourceGroup[] {
	const groups = new Map<string, ResourceGroup>();
	for (const resource of resources) {
		if (!resource.linkedTraining) continue;
		const key = resource.linkedTraining._id;
		if (!groups.has(key)) groups.set(key, { training: resource.linkedTraining, resources: [] });
		groups.get(key)!.resources.push(resource);
	}
	return Array.from(groups.values());
}

export interface ActivationCode {
	_id: string;
	code: string;
	role: "apprenant" | "professionnel";
	targetEmail: string;
	isUsed: boolean;
	usedAt: string | null;
	expiresAt: string;
	cancelled: boolean;
	cancelledAt: string | null;
	archived: boolean;
	createdAt: string;
}

// ─── Messagerie ─────────────────────────────────────────────────────────────

export interface MessageUser {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
}

export interface InternalMessage {
	_id: string;
	senderUser: MessageUser;
	recipientUser: MessageUser;
	subject: string;
	content: string;
	isRead: boolean;
	parentMessage: string | null;
	conversationId: string | null;
	threadCount?: number;
	unreadInThread?: number;
	createdAt: string;
}

export interface ContactReply {
	_id: string;
	content: string;
	sentBy: { _id: string; firstName: string; lastName: string } | null;
	sentAt: string;
}

export interface ContactMessage {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	message: string;
	interestedFormations: string[];
	isRead: boolean;
	replies: ContactReply[];
	createdAt: string;
}

/** Thème du catalogue public avec ses formations visibles. */
export interface ThemeWithTrainings {
	_id: string;
	title: string;
	trainings: Array<{ _id: string; title: string }>;
}

/** Thématique du catalogue. `type` porte le secteur (« Santé », transversal…). */
export interface Theme {
	_id: string;
	title: string;
	type?: string;
}

// ─── Checklists ─────────────────────────────────────────────────────────────

export interface ChecklistItem {
	_id: string;
	text: string;
	isChecked: boolean;
	notes: string;
}

export interface Checklist {
	_id: string;
	title: string;
	description: string;
	items: ChecklistItem[];
	linkedUserId: { _id: string; firstName: string; lastName: string; email: string } | null;
	linkedProspectId: { _id: string; firstName: string; lastName: string; email: string } | null;
	createdBy: { _id: string; firstName: string; lastName: string } | null;
	createdAt: string;
}
