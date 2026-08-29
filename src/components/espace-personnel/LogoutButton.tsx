"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/lib/server/actions/auth";

/**
 * Déconnexion en <form action> : la server action purge le cookie côté serveur
 * et redirige. Fonctionne sans JavaScript, contrairement au onClick précédent.
 */
export default function LogoutButton({ className, children }: { className?: string; children: React.ReactNode }) {
	return (
		<form action={logoutAction} className="contents">
			<SubmitButton className={className}>{children}</SubmitButton>
		</form>
	);
}

function SubmitButton({ className, children }: { className?: string; children: React.ReactNode }) {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending} className={className}>
			{children}
		</button>
	);
}
