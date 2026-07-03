"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CONSENT_KEY, CONSENT_EVENT } from "@/components/global/AnalyticsGate";

export default function CookieBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!localStorage.getItem(CONSENT_KEY)) {
			setVisible(true);
		}
	}, []);

	const setConsent = (value: "accepted" | "refused") => {
		localStorage.setItem(CONSENT_KEY, value);
		// Notifie AnalyticsGate (même onglet) pour (dé)charger la mesure d'audience sans rechargement.
		window.dispatchEvent(new Event(CONSENT_EVENT));
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-univers/10 bg-support shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
			<div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-sm text-univers/80 text-center sm:text-left">
					Ce site utilise des cookies essentiels au fonctionnement du service ainsi que des cookies de mesure d&apos;audience
					(Vercel Analytics), déposés uniquement avec votre accord.{" "}
					<Link href="/politique-de-confidentialite" className="text-cohesion hover:underline font-medium">
						En savoir plus
					</Link>
				</p>
				<div className="flex shrink-0 items-center gap-3">
					<button
						onClick={() => setConsent("refused")}
						className="rounded-lg border border-univers/30 px-5 py-2.5 text-sm font-bold text-univers transition-colors duration-200 hover:bg-univers/5 cursor-pointer"
					>
						Refuser
					</button>
					<button
						onClick={() => setConsent("accepted")}
						className="rounded-lg bg-univers px-6 py-2.5 text-sm font-bold text-support shadow-sm transition-colors duration-200 hover:bg-univers/90 cursor-pointer"
					>
						Accepter
					</button>
				</div>
			</div>
		</div>
	);
}
