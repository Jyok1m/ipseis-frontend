import "server-only";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4001";

/** Erreur renvoyée par le backend, avec son code HTTP. */
export class ApiError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

type QueryValue = string | number | boolean | undefined | null;

interface ServerFetchOptions extends Omit<RequestInit, "body"> {
	/** Sérialisé en JSON, sauf FormData qui est transmis tel quel. */
	body?: unknown;
	/** Les entrées undefined/null sont ignorées. */
	searchParams?: Record<string, QueryValue>;
}

function buildUrl(path: string, searchParams?: Record<string, QueryValue>) {
	const url = new URL(`${BACKEND_URL}${path}`);
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
	}
	return url.toString();
}

/**
 * Appelle le backend depuis le serveur Next en réinjectant le cookie de session.
 *
 * Le backend authentifie via `req.cookies.token` (cf. middleware/authMiddleware.js) ;
 * on relaie donc le cookie first-party posé à la connexion. Lire les cookies rend la
 * route dynamique : c'est voulu ici, les données authentifiées ne doivent pas être
 * mises en cache. Les lectures publiques passent par src/lib/api.ts, qui garde l'ISR.
 */
export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
	const { body, searchParams, headers, ...init } = options;

	const token = (await cookies()).get("token")?.value;
	const requestHeaders = new Headers(headers);
	if (token) requestHeaders.set("Cookie", `token=${token}`);

	let payload: BodyInit | undefined;
	if (body instanceof FormData) {
		// Pas de Content-Type : fetch pose lui-même la boundary multipart.
		payload = body;
	} else if (body !== undefined) {
		requestHeaders.set("Content-Type", "application/json");
		payload = JSON.stringify(body);
	}

	const response = await fetch(buildUrl(path, searchParams), {
		...init,
		headers: requestHeaders,
		body: payload,
		cache: init.cache ?? "no-store",
	});

	if (!response.ok) {
		// Le backend répond systématiquement { error: "..." } ; on retombe sur le
		// statut si le corps n'est pas exploitable (502 d'un reverse proxy, etc.).
		let message = `Erreur ${response.status}`;
		try {
			const data = await response.json();
			if (typeof data?.error === "string") message = data.error;
		} catch {
			/* corps non JSON : on garde le message par défaut */
		}
		throw new ApiError(message, response.status);
	}

	if (response.status === 204) return undefined as T;

	return (await response.json()) as T;
}
