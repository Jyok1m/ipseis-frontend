"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/server/actions/auth";
import { idle } from "@/lib/server/actions/types";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import SubmitButton from "./SubmitButton";

const InputWrapper = ({ label, htmlFor, children, required = false }: { label: string; htmlFor: string; children: React.ReactNode; required?: boolean }) => (
	<div>
		<label htmlFor={htmlFor} className="text-base sm:text-lg leading-7 text-univers font-bold mb-1 block">
			{label}
			{required && <span className="text-cohesion ml-1">*</span>}
		</label>
		<div className="mt-2">{children}</div>
	</div>
);

const inputClass =
	"block w-full rounded-lg px-4 py-3 text-univers bg-white border-2 border-univers/20 focus:border-cohesion focus:ring-2 focus:ring-cohesion/20 shadow-sm placeholder:text-univers/50 text-base font-medium transition-all duration-200";

/**
 * Le formulaire soumet directement la server action : les identifiants ne
 * transitent plus par un fetch navigateur, le cookie de session est posé côté
 * serveur et la redirection vers l'espace du rôle se fait dans l'action.
 * Champs non contrôlés : la valeur est lue depuis le FormData.
 */
export default function LoginForm() {
	const [state, formAction] = useActionState(loginAction, idle);
	const feedback = useActionFeedback(state);

	return (
		<div className="w-full max-w-md mx-auto">
			{feedback}

			<div className="bg-white rounded-2xl shadow-lg p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-univers">Connexion</h1>
					<p className="text-univers/60 mt-2">Accédez à votre Espace Personnel</p>
				</div>

				<form action={formAction} className="space-y-6">
					<InputWrapper label="Email" htmlFor="email" required>
						<input id="email" name="email" type="email" autoComplete="email" placeholder="ex. jean.dupont@email.fr" className={inputClass} />
					</InputWrapper>

					<InputWrapper label="Mot de passe" htmlFor="password" required>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							placeholder="Votre mot de passe"
							className={inputClass}
						/>
					</InputWrapper>

					<div className="flex items-center justify-between">
						<label className="flex items-center gap-2 cursor-pointer select-none">
							<input
								type="checkbox"
								name="rememberMe"
								className="h-4 w-4 rounded border-univers/30 text-univers focus:ring-univers/20 cursor-pointer accent-univers"
							/>
							<span className="text-sm text-univers/70 font-medium">Rester connecté</span>
						</label>
						<Link href="/espace-personnel/mot-de-passe-oublie" className="text-sm text-cohesion hover:underline font-medium">
							Mot de passe oublié ?
						</Link>
					</div>

					<SubmitButton className="w-full rounded-xl bg-univers px-6 py-4 text-support font-bold shadow-md hover:bg-univers/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers transition-all duration-200">
						Se connecter
					</SubmitButton>
				</form>

				<p className="text-center mt-6 text-univers/60 text-sm">
					Pas encore de compte ?{" "}
					<Link href="/espace-personnel/inscription" className="text-cohesion hover:underline font-semibold">
						S'inscrire
					</Link>
				</p>
			</div>
		</div>
	);
}
