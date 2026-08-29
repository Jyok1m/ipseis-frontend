"use client";

import React, { useActionState, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { sendContactMessageAction } from "@/lib/server/actions/public";
import { idle } from "@/lib/server/actions/types";
import { useActionFeedback } from "@/components/utils/useActionFeedback";
import TrainingMultiSelect from "@/components/global/TrainingMultiSelect";
import SubmitButton from "@/components/espace-personnel/SubmitButton";
import { CONTACT_SUBJECTS } from "@/lib/contactSubjects";
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
	// Le motif conditionne l'affichage du choix de formations : demander à un
	// futur formateur vacataire quelles formations l'intéressent n'a pas de sens,
	// et la liste occupait la moitié du formulaire pour tout le monde.
	const [subject, setSubject] = useState<string>(CONTACT_SUBJECTS[0].value);
	// La sélection de formations vit dans l'état de TrainingMultiSelect, hors de
	// portée d'un form.reset() : sans remontage, les formations cochées
	// restaient sélectionnées après un envoi réussi et repartaient avec le
	// message suivant.
	const [sendCount, setSendCount] = useState(0);
	const feedback = useActionFeedback(state, {
		successTitle: "Merci !",
		errorTitle: "Zut...",
		onSuccess: () => {
			formRef.current?.reset();
			setSubject(CONTACT_SUBJECTS[0].value);
			setSendCount((count) => count + 1);
		},
	});

	return (
		<div className="relative isolate w-full rounded-2xl bg-maitrise p-4 sm:p-5">
			{feedback}

			<div className="mx-auto">
				<div className="mb-5 rounded-xl border border-support/30 bg-support/15 p-3.5">
					<div className="flex items-start gap-3">
						<ChatBubbleLeftRightIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-support" />
						<div>
							<h2 className="mb-1 text-sm font-bold text-support sm:text-base">
								Une question ? Nous rejoindre ? Une réclamation ? Contactez-nous
							</h2>
							<p className="text-xs font-medium leading-relaxed text-support/90 sm:text-sm">
								IPSEIS s&apos;engage à vous répondre dans un délai maximum de 72 heures.
							</p>
						</div>
					</div>
				</div>

				<form ref={formRef} action={formAction} className="flex flex-col">
					<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 sm:gap-y-5">
						<InputWrapper label="Prénom" htmlFor="firstName" required>
							<input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="ex. Jean" className={inputClass} />
						</InputWrapper>
						<InputWrapper label="Nom de famille" htmlFor="lastName" required>
							<input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="ex. Dupont" className={inputClass} />
						</InputWrapper>
						<InputWrapper label="Email" htmlFor="email" className="col-span-full sm:col-span-2" required>
							<input id="email" name="email" type="email" autoComplete="email" placeholder="ex. jean.dupont@test.fr" className={inputClass} />
						</InputWrapper>
						<InputWrapper label="Objet de votre demande" htmlFor="subject" className="col-span-full sm:col-span-2" required>
							<select
								id="subject"
								name="subject"
								value={subject}
								onChange={(event) => setSubject(event.target.value)}
								className={inputClass}
							>
								{CONTACT_SUBJECTS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
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
						{subject === "formation" && (
							<InputWrapper label="Formations d'intérêt (optionnel)" htmlFor="interestedFormations" className="col-span-full sm:col-span-2">
								<TrainingMultiSelect key={sendCount} themes={themes} />
							</InputWrapper>
						)}
					</div>

					<div className="mt-5 rounded-lg border border-support/15 bg-support/10 p-3">
						<p className="text-xs font-medium leading-relaxed text-support/80 sm:text-sm">
							En soumettant ce formulaire, vous acceptez que vos données personnelles soient utilisées pour traiter votre demande et vous
							recontacter. Vos données sont traitées conformément à notre{" "}
							<a href="/politique-de-confidentialite" className="font-semibold text-cohesion hover:underline">
								politique de confidentialité
							</a>
							.
						</p>
					</div>

					<div className="mt-6">
						<SubmitButton
							className="w-full rounded-xl bg-univers px-5 py-3 text-sm font-bold text-support shadow-md transition-all duration-200 hover:bg-univers/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers sm:py-3.5 sm:text-base"
							spinnerClassName="text-support"
						>
							<span className="flex items-center justify-center gap-2.5 text-support">
								<ChatBubbleLeftRightIcon className="h-5 w-5" />
								<span className="font-bold">Envoyer le message</span>
							</span>
						</SubmitButton>
					</div>
				</form>
			</div>
		</div>
	);
}
