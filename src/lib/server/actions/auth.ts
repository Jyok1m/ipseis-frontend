"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { serverFetch } from "../fetcher";
import type { SessionUser } from "../session";
import { type ActionState, toErrorState } from "./types";

const SEVEN_DAYS = 7 * 24 * 60 * 60;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

/**
 * Connexion. Pose le cookie de session first-party puis redirige vers l'espace
 * correspondant au rôle. Remplace le POST client vers /api/proxy/auth/login :
 * le mot de passe ne transite plus par un fetch navigateur déclenché en JS, et
 * le formulaire fonctionne sans JavaScript.
 */
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const rememberMe = formData.get("rememberMe") === "on" || formData.get("rememberMe") === "true";

	if (!email || !password) {
		return { ok: false, error: "Veuillez remplir tous les champs." };
	}

	let role: SessionUser["role"];
	try {
		const data = await serverFetch<{ token: string; rememberMe: boolean; user: SessionUser }>("/auth/login", {
			method: "POST",
			body: { email, password, rememberMe },
		});

		(await cookies()).set("token", data.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: data.rememberMe ? THIRTY_DAYS : SEVEN_DAYS,
			path: "/",
		});

		role = data.user.role;
	} catch (error) {
		return toErrorState(error, "Erreur lors de la connexion. Veuillez réessayer.");
	}

	// Hors du try : redirect() lève une exception de contrôle que le catch avalerait.
	redirect(`/espace-personnel/${role}`);
}

export async function logoutAction(): Promise<void> {
	try {
		await serverFetch("/auth/logout", { method: "POST" });
	} catch {
		// Session déjà invalide côté backend : on purge le cookie quand même.
	}
	(await cookies()).delete("token");
	redirect("/");
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const payload = {
		firstName: String(formData.get("firstName") ?? "").trim(),
		lastName: String(formData.get("lastName") ?? "").trim(),
		email: String(formData.get("email") ?? "").trim(),
		password: String(formData.get("password") ?? ""),
		confirmPassword: String(formData.get("confirmPassword") ?? ""),
		phone: String(formData.get("phone") ?? "").trim(),
		company: String(formData.get("company") ?? "").trim(),
		position: String(formData.get("position") ?? "").trim(),
		address: String(formData.get("address") ?? "").trim(),
		activationCode: String(formData.get("activationCode") ?? "").trim(),
	};

	try {
		const data = await serverFetch<{ message: string }>("/auth/register", { method: "POST", body: payload });
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur lors de l'inscription. Veuillez réessayer.");
	}
}

export async function forgotPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const email = String(formData.get("email") ?? "").trim();
	if (!email) return { ok: false, error: "Veuillez fournir votre adresse email." };

	try {
		const data = await serverFetch<{ message: string }>("/auth/forgot-password", { method: "POST", body: { email } });
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur serveur. Veuillez réessayer.");
	}
}

export async function resetPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const token = String(formData.get("token") ?? "");
	const password = String(formData.get("password") ?? "");
	const confirmPassword = String(formData.get("confirmPassword") ?? "");

	try {
		const data = await serverFetch<{ message: string }>("/auth/reset-password", {
			method: "POST",
			body: { token, password, confirmPassword },
		});
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur serveur. Veuillez réessayer.");
	}
}

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const payload = {
		firstName: String(formData.get("firstName") ?? "").trim(),
		lastName: String(formData.get("lastName") ?? "").trim(),
		phone: String(formData.get("phone") ?? "").trim(),
		company: String(formData.get("company") ?? "").trim(),
		position: String(formData.get("position") ?? "").trim(),
		address: String(formData.get("address") ?? "").trim(),
	};

	try {
		const data = await serverFetch<{ message: string }>("/auth/profile", { method: "PUT", body: payload });
		// Le layout affiche le nom de l'utilisateur : il doit refléter la mise à jour.
		revalidatePath("/espace-personnel", "layout");
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur serveur.");
	}
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const payload = {
		currentPassword: String(formData.get("currentPassword") ?? ""),
		newPassword: String(formData.get("newPassword") ?? ""),
		confirmNewPassword: String(formData.get("confirmNewPassword") ?? ""),
	};

	try {
		const data = await serverFetch<{ message: string }>("/auth/change-password", { method: "PUT", body: payload });
		return { ok: true, message: data.message };
	} catch (error) {
		return toErrorState(error, "Erreur serveur.");
	}
}
