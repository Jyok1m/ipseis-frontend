"use client";

import React, { useActionState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/server/actions/auth";
import { idle } from "@/lib/server/actions/types";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import SubmitButton from "./SubmitButton";

const InputWrapper = ({
	label,
	htmlFor,
	children,
	className,
	required = false,
}: {
	label: string;
	htmlFor: string;
	children: React.ReactNode;
	className?: string;
	required?: boolean;
}) => (
	<div className={className}>
		<label htmlFor={htmlFor} className="text-base leading-7 text-univers font-bold mb-1 block">
			{label}
			{required && <span className="text-cohesion ml-1">*</span>}
		</label>
		<div className="mt-2">{children}</div>
	</div>
);

const inputClass =
	"block w-full rounded-lg px-4 py-3 text-univers bg-white border-2 border-univers/20 focus:border-cohesion focus:ring-2 focus:ring-cohesion/20 shadow-sm placeholder:text-univers/50 text-base font-medium transition-all duration-200";

// Le backend normalise déjà prénom et nom ; ce formatage au blur n'est là que
// pour montrer tout de suite à l'utilisateur la forme qui sera enregistrée.
const formatFirstName = (name: string) => name.trim().replace(/[a-zA-ZÀ-ÿ]+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
const formatLastName = (name: string) => name.trim().toUpperCase();

export default function RegisterForm() {
	const router = useRouter();
	const [state, formAction] = useActionState(registerAction, idle);

	const onSuccess = useCallback(() => {
		const timer = setTimeout(() => router.push("/espace-personnel/connexion"), 2000);
		return () => clearTimeout(timer);
	}, [router]);

	const feedback = useActionFeedback(state, { successTitle: "Inscription réussie", onSuccess });

	// Champs non contrôlés : on reformate la valeur du DOM, sans état React.
	const formatOnBlur = (format: (value: string) => string) => (event: React.FocusEvent<HTMLInputElement>) => {
		event.target.value = format(event.target.value);
	};

	return (
		<div className="w-full max-w-2xl mx-auto">
			{feedback}

			<div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-univers">Inscription</h1>
					<p className="text-univers/60 mt-2">Créez votre compte Espace Personnel</p>
				</div>

				<form action={formAction} className="space-y-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
						<InputWrapper label="Prénom" htmlFor="firstName" required>
							<input
								id="firstName"
								name="firstName"
								type="text"
								autoComplete="given-name"
								placeholder="ex. Jean-Pierre"
								onBlur={formatOnBlur(formatFirstName)}
								className={inputClass}
							/>
						</InputWrapper>

						<InputWrapper label="Nom" htmlFor="lastName" required>
							<input
								id="lastName"
								name="lastName"
								type="text"
								autoComplete="family-name"
								placeholder="ex. DUPONT"
								onBlur={formatOnBlur(formatLastName)}
								className={inputClass}
							/>
						</InputWrapper>

						<InputWrapper label="Email" htmlFor="email" className="sm:col-span-2" required>
							<input id="email" name="email" type="email" autoComplete="email" placeholder="ex. jean.dupont@email.fr" className={inputClass} />
						</InputWrapper>

						<InputWrapper label="Mot de passe" htmlFor="password" required>
							<input id="password" name="password" type="password" autoComplete="new-password" placeholder="Minimum 8 caractères" className={inputClass} />
						</InputWrapper>

						<InputWrapper label="Confirmer le mot de passe" htmlFor="confirmPassword" required>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								placeholder="Retapez le mot de passe"
								className={inputClass}
							/>
						</InputWrapper>

						<InputWrapper label="Téléphone" htmlFor="phone" required>
							<input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="ex. 06 12 34 56 78" className={inputClass} />
						</InputWrapper>

						<InputWrapper label="Entreprise / Établissement" htmlFor="company" required>
							<input id="company" name="company" type="text" autoComplete="organization" placeholder="ex. CHU de Rennes" className={inputClass} />
						</InputWrapper>

						<InputWrapper label="Poste / Fonction" htmlFor="position" required>
							<input id="position" name="position" type="text" autoComplete="organization-title" placeholder="ex. Infirmier(e)" className={inputClass} />
						</InputWrapper>

						<InputWrapper label="Adresse" htmlFor="address" required>
							<input
								id="address"
								name="address"
								type="text"
								autoComplete="street-address"
								placeholder="ex. 21 Rue de la Nation, 35400 Saint-Malo"
								title="Format : Numéro Rue, CP Ville"
								className={inputClass}
							/>
						</InputWrapper>

						<InputWrapper label="Code d'activation" htmlFor="activationCode" className="sm:col-span-2" required>
							<input id="activationCode" name="activationCode" type="text" autoComplete="off" placeholder="ex. AB12CD34" className={inputClass} />
						</InputWrapper>
					</div>

					<SubmitButton className="w-full rounded-xl bg-univers px-6 py-4 text-support font-bold shadow-md hover:bg-univers/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers transition-all duration-200">
						S'inscrire
					</SubmitButton>
				</form>

				<p className="text-center mt-6 text-univers/60 text-sm">
					Déjà inscrit ?{" "}
					<Link href="/espace-personnel/connexion" className="text-cohesion hover:underline font-semibold">
						Se connecter
					</Link>
				</p>
			</div>
		</div>
	);
}
