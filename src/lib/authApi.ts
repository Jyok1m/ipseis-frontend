import axios from "axios";

/**
 * Client HTTP résiduel, passant par la route proxy first-party.
 *
 * L'essentiel des appels backend est passé côté serveur : lectures dans
 * src/lib/server/queries.ts, écritures dans src/lib/server/actions/. Ne
 * subsistent ici que les appels qui doivent partir du navigateur :
 *
 * - téléchargements et aperçus PDF, qui produisent un Blob et une URL objet ;
 * - lectures de la messagerie, rechargées par les événements socket et par les
 *   changements d'onglet ou de modale, donc hors du cycle de rendu serveur.
 *
 * Le proxy est indispensable dans les deux cas : le cookie de session est
 * httpOnly, illisible en JavaScript, et le backend est sur un autre domaine.
 */
const authApi = axios.create({
	baseURL: "/api/proxy",
	withCredentials: true,
});

// ─── Messagerie (rechargée par le socket, hors cycle serveur) ───────────────

export const getUsers = (page: number = 1, role?: string, search?: string, excludeRole?: string) =>
	authApi.get(
		`/admin/users?page=${page}${role ? `&role=${role}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}${excludeRole ? `&excludeRole=${excludeRole}` : ""}`
	);

export const getConversations = (page?: number) => authApi.get(`/internal-messages/conversations?page=${page || 1}`);
export const getArchivedConversations = (page?: number) => authApi.get(`/internal-messages/conversations/archived?page=${page || 1}`);
export const getConversation = (conversationId: string) => authApi.get(`/internal-messages/conversation/${conversationId}`);

export const getContactMessages = (page?: number) => authApi.get(`/messages/admin?page=${page || 1}`);
export const getContactMessage = (id: string) => authApi.get(`/messages/admin/${id}`);

// ─── Téléchargements binaires (Blob côté navigateur) ────────────────────────

export const downloadContractPdf = (id: string) => authApi.get(`/contracts/download/${id}`, { responseType: "blob" });

export const downloadResourcePdf = (id: string) => authApi.get(`/resources/download/${id}`, { responseType: "blob" });
