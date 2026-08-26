"use client";

import React, { useActionState, useRef } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { sendContactMessageAction } from "@/lib/server/actions/public";
import { idle } from "@/lib/server/actions/types";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import TrainingMultiSelect from "@/components/global/TrainingMultiSelect";
import SubmitButton from "@/components/espace-personnel/SubmitButton";
import type { ThemeWithTrainings } from "@/lib/types";

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
		<label htmlFor={htmlFor} className="text-sm sm:text-base leading-6 text-support font-bold block">
			{label}
			{required && <span className="text-cohesion ml-1">*</span>}
		</label>
		<div className="mt-1.5">{children}</div>
	</div>
);

const inputClass =
	"block w-full rounded-lg px-3.5 py-2 sm:py-2.5 text-univers bg-white border border-support/20 focus:border-cohesion focus:ring-2 focus:ring-cohesion/20 shadow-sm placeholder:text-univers/50 text-sm sm:text-base font-medium transition-all duration-200";

/**
 * Le formulaire poste vers une server action au lieu d'un axios navigateur :
 * l'URL du backend n'apparaît plus dans les requêtes réseau de la page, et la
 * soumission fonctionne sans JavaScript.
 *
 * Les thèmes sont rendus par le serveur (page en ISR) : plus de GET
 * /trainings/all au montage, et le select est peuplé dès le premier paint.
 */
export default function ContactForm({ themes }: { themes: ThemeWithTrainings[] }) {
	const formRef = useRef<HTMLFormElement>(null);
	const [state, formAction] = useActionState(sendContactMessageAction, idle);
	const feedback = useActionFeedback(state, {
		successTitle: "Merci !",
		errorTitle: "Zut...",
		onSuccess: () => formRef.current?.reset(),
	});

	return (
		<div className="relative isolate bg-maitrise p-4 sm:p-5 w-[92%] sm:w-4/5 lg:max-w-2xl rounded-2xl">
			{feedback}

			<div className="mx-auto">
				<div className="mb-5 p-3.5 bg-support/15 border border-support/30 rounded-xl">
					<div className="flex items-start gap-3">
						<ChatBubbleLeftRightIcon className="h-5 w-5 text-support mt-0.5 flex-shrink-0" />
						<div>
							<h3 className="text-support font-bold mb-1 text-sm sm:text-base">Contactez-nous directement</h3>
							<p className="text-support/90 text-xs sm:text-sm leading-relaxed font-medium">
								Une question sur nos formations ? Besoin d&apos;un devis personnalisé ? Notre équipe vous répond dans les plus brefs délais.
							</p>
						</div>
					</div>
				</div>

				<form ref={formRef} action={formAction} className="flex flex-col lg:flex-row">
					<div className="lg:flex-auto">
						<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:gap-y-5 sm:grid-cols-2">
							<InputWrapper label="Prénom" htmlFor="firstName" required>
								<input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="ex. Jean" className={inputClass} />
							</InputWrapper>
							<InputWrapper label="Nom de famille" htmlFor="lastName" required>
								<input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="ex. Dupont" className={inputClass} />
							</InputWrapper>
							<InputWrapper label="Email" htmlFor="email" className="col-span-full sm:col-span-2" required>
								<input id="email" name="email" type="email" autoComplete="email" placeholder="ex. jean.dupont@test.fr" className={inputClass} />
							</InputWrapper>
							<InputWrapper label="Message" htmlFor="message" className="col-span-full sm:col-span-2" required>
								<textarea
									id="message"
									name="message"
									rows={5}
									placeholder="ex. Bonjour, je souhaiterais plus d'informations sur vos formations..."
									className={`${inputClass} resize-vertical`}
								/>
							</InputWrapper>
							<InputWrapper label="Formations d'intérêt (optionnel)" htmlFor="interestedFormations" className="col-span-full sm:col-span-2">
								<TrainingMultiSelect themes={themes} />
							</InputWrapper>
						</div>

						<div className="mt-5 p-3 bg-support/10 border border-support/15 rounded-lg">
							<p className="text-support/80 text-xs sm:text-sm leading-relaxed font-medium">
								En soumettant ce formulaire, vous acceptez que vos données personnelles soient utilisées pour traiter votre demande et vous
								recontacter. Vos données sont traitées conformément à notre{" "}
								<a href="/mentions-legales" className="text-cohesion hover:underline font-semibold">
									politique de confidentialité
								</a>
								.
							</p>
						</div>

						<div className="mt-6">
							<SubmitButton
								className="w-full rounded-xl bg-univers px-5 py-3 sm:py-3.5 text-sm sm:text-base text-support font-bold shadow-md hover:bg-univers/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers transition-all duration-200"
								spinnerClassName="text-support"
							>
								<span className="flex justify-center items-center gap-2.5 text-support">
									<ChatBubbleLeftRightIcon className="h-5 w-5" />
									<span className="font-bold">Envoyer le message</span>
								</span>
							</SubmitButton>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
