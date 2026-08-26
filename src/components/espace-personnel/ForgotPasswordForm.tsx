"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { forgotPasswordAction } from "@/lib/server/actions/auth";
import { idle } from "@/lib/server/actions/types";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import SubmitButton from "./SubmitButton";

const inputClass =
	"block w-full rounded-lg px-4 py-3 text-univers bg-white border-2 border-univers/20 focus:border-cohesion focus:ring-2 focus:ring-cohesion/20 shadow-sm placeholder:text-univers/50 text-base font-medium transition-all duration-200";

export default function ForgotPasswordForm() {
	const [state, formAction] = useActionState(forgotPasswordAction, idle);
	// L'état de succès de l'action remplace le useState submitted.
	const submitted = state.ok;
	const feedback = useActionFeedback(state, { successTitle: "Envoyé" });

	return (
		<div className="w-full max-w-md mx-auto">
			{feedback}

			<div className="bg-white rounded-2xl shadow-lg p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-univers">Mot de passe oublié</h1>
					<p className="text-univers/60 mt-2">Réinitialisez votre mot de passe</p>
				</div>

				{submitted ? (
					<div className="text-center space-y-4">
						<div className="bg-maitrise/10 border-2 border-maitrise/30 rounded-xl p-6">
							<CheckCircleIcon className="h-12 w-12 text-maitrise mx-auto mb-4" />
							<p className="text-univers font-medium">
								Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation dans quelques instants.
							</p>
							<p className="text-univers/60 text-sm mt-3">Pensez à vérifier vos spams.</p>
						</div>
						<Link href="/espace-personnel/connexion" className="inline-block text-cohesion hover:underline font-semibold text-sm mt-4">
							Retour à la connexion
						</Link>
					</div>
				) : (
					<>
						<form action={formAction} className="space-y-6">
							<div>
								<label htmlFor="email" className="text-base sm:text-lg leading-7 text-univers font-bold mb-1 block">
									Email<span className="text-cohesion ml-1">*</span>
								</label>
								<div className="mt-2">
									<input id="email" name="email" type="email" autoComplete="email" placeholder="ex. jean.dupont@email.fr" className={inputClass} />
								</div>
							</div>

							<SubmitButton className="w-full rounded-xl bg-univers px-6 py-4 text-support font-bold shadow-md hover:bg-univers/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers transition-all duration-200">
								Envoyer le lien
							</SubmitButton>
						</form>

						<p className="text-center mt-6 text-univers/60 text-sm">
							<Link href="/espace-personnel/connexion" className="text-cohesion hover:underline font-semibold">
								Retour à la connexion
							</Link>
						</p>
					</>
				)}
			</div>
		</div>
	);
}
