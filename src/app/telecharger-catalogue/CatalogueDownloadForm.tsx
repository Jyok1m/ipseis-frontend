"use client";

import React, { useActionState, useRef } from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { requestCatalogueAction } from "@/lib/server/actions/public";
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
		<label htmlFor={htmlFor} className="text-base sm:text-lg leading-7 text-support font-bold block">
			{label}
			{required && <span className="text-cohesion ml-1">*</span>}
		</label>
		<div className="mt-2">{children}</div>
	</div>
);

const inputClass =
	"block w-full rounded-lg px-4 py-3 text-univers bg-white border border-support/20 focus:border-cohesion focus:ring-2 focus:ring-cohesion/20 shadow-sm placeholder:text-univers/50 text-base font-medium transition-all duration-200";

/**
 * La demande de catalogue passe par une server action. La validation email est
 * portée par l'action, côté serveur, plutôt que dupliquée ici.
 */
export default function CatalogueDownloadForm({ themes }: { themes: ThemeWithTrainings[] }) {
	const formRef = useRef<HTMLFormElement>(null);
	const [state, formAction] = useActionState(requestCatalogueAction, idle);
	const feedback = useActionFeedback(state, {
		successTitle: "Parfait !",
		errorTitle: "Zut...",
		onSuccess: () => formRef.current?.reset(),
	});

	return (
		<div className="relative isolate bg-maitrise p-4 sm:p-5 w-[92%] sm:w-4/5 lg:max-w-3xl rounded-2xl">
			{feedback}

			<div className="mx-auto max-w-xl">
				<div className="mb-8 p-5 sm:p-6 bg-support/15 border-2 border-support/30 rounded-xl">
					<div className="flex items-start gap-4">
						<DocumentArrowDownIcon className="h-7 w-7 sm:h-8 sm:w-8 text-support mt-1 flex-shrink-0" />
						<div>
							<h3 className="text-support font-bold mb-3 text-lg sm:text-xl">Notre catalogue de formations 2025</h3>
							<p className="text-support/90 text-base sm:text-lg leading-relaxed font-medium">
								Découvrez plus de 30 formations spécialisées dans le secteur de la santé et du médico-social. Le catalogue sera envoyé directement
								dans votre boîte email au format PDF.
							</p>
						</div>
					</div>
				</div>

				<form ref={formRef} action={formAction} className="flex flex-col gap-8 sm:gap-y-20 lg:flex-row">
					<div className="lg:flex-auto">
						<div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:gap-y-8 sm:grid-cols-2">
							<InputWrapper label="Prénom" htmlFor="firstName" required>
								<input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="ex. Jean" className={inputClass} />
							</InputWrapper>
							<InputWrapper label="Nom de famille" htmlFor="lastName" required>
								<input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="ex. Dupont" className={inputClass} />
							</InputWrapper>
							<InputWrapper label="Email" htmlFor="email" className="col-span-full sm:col-span-2" required>
								<input id="email" name="email" type="email" autoComplete="email" placeholder="ex. jean.dupont@test.fr" className={inputClass} />
							</InputWrapper>
							<InputWrapper label="Formations d'intérêt (optionnel)" htmlFor="interestedFormations" className="col-span-full sm:col-span-2">
								<TrainingMultiSelect themes={themes} />
							</InputWrapper>
						</div>

						<div className="mt-8 p-4 sm:p-5 bg-support/10 border-2 border-support/15 rounded-lg">
							<p className="text-support/80 text-sm sm:text-base leading-relaxed font-medium">
								En soumettant ce formulaire, vous acceptez que vos données personnelles soient utilisées pour vous envoyer le catalogue et vous tenir
								informé de nos formations. Vos données sont traitées conformément à notre{" "}
								<a href="/mentions-legales" className="text-cohesion hover:underline font-semibold">
									politique de confidentialité
								</a>
								.
							</p>
						</div>

						<div className="mt-10">
							<SubmitButton
								className="w-full rounded-xl bg-univers px-6 py-4 sm:py-5 sm:text-lg text-support font-bold shadow-md hover:bg-univers/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers transition-all duration-200"
								spinnerClassName="text-support"
							>
								<span className="flex justify-center items-center gap-3 text-support">
									<DocumentArrowDownIcon className="h-6 w-6 sm:h-7 sm:w-7" />
									<span className="font-bold">Télécharger le catalogue</span>
								</span>
							</SubmitButton>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
