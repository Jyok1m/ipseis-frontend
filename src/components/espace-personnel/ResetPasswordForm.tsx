"use client";

import React, { useActionState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/server/actions/auth";
import { idle } from "@/lib/server/actions/types";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import SubmitButton from "./SubmitButton";

const inputClass =
	"block w-full rounded-lg px-4 py-3 text-univers bg-white border-2 border-univers/20 focus:border-cohesion focus:ring-2 focus:ring-cohesion/20 shadow-sm placeholder:text-univers/50 text-base font-medium transition-all duration-200";

/**
 * La correspondance des mots de passe et la longueur minimale sont vérifiées
 * par le backend (routes/auth.js), qui renvoie les mêmes messages : les
 * dupliquer ici ferait deux sources de vérité à maintenir en parallèle.
 */
export default function ResetPasswordForm({ token }: { token: string }) {
	const router = useRouter();
	const [state, formAction] = useActionState(resetPasswordAction, idle);

	// Laisse la notification de succès lisible avant de renvoyer sur la connexion.
	const onSuccess = useCallback(() => {
		const timer = setTimeout(() => router.push("/espace-personnel/connexion"), 2000);
		return () => clearTimeout(timer);
	}, [router]);

	const feedback = useActionFeedback(state, { successTitle: "Succès", onSuccess });

	return (
		<div className="w-full max-w-md mx-auto">
			{feedback}

			<div className="bg-white rounded-2xl shadow-lg p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-univers">Nouveau mot de passe</h1>
					<p className="text-univers/60 mt-2">Définissez votre nouveau mot de passe</p>
				</div>

				<form action={formAction} className="space-y-6">
					<input type="hidden" name="token" value={token} />

					<div>
						<label htmlFor="password" className="text-base sm:text-lg leading-7 text-univers font-bold mb-1 block">
							Nouveau mot de passe<span className="text-cohesion ml-1">*</span>
						</label>
						<div className="mt-2">
							<input id="password" name="password" type="password" autoComplete="new-password" placeholder="Minimum 8 caractères" className={inputClass} />
						</div>
					</div>

					<div>
						<label htmlFor="confirmPassword" className="text-base sm:text-lg leading-7 text-univers font-bold mb-1 block">
							Confirmer le mot de passe<span className="text-cohesion ml-1">*</span>
						</label>
						<div className="mt-2">
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								placeholder="Retapez le mot de passe"
								className={inputClass}
							/>
						</div>
					</div>

					<SubmitButton className="w-full rounded-xl bg-univers px-6 py-4 text-support font-bold shadow-md hover:bg-univers/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers transition-all duration-200">
						Réinitialiser
					</SubmitButton>
				</form>

				<p className="text-center mt-6 text-univers/60 text-sm">
					<Link href="/espace-personnel/connexion" className="text-cohesion hover:underline font-semibold">
						Retour à la connexion
					</Link>
				</p>
			</div>
		</div>
	);
}
