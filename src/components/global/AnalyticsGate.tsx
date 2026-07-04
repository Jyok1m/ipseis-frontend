"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const CONSENT_KEY = "cookie-consent";
export const CONSENT_EVENT = "cookie-consent-changed";

// Consentement accepté : valeur actuelle "accepted" ou valeur historique "true".
function hasConsent(): boolean {
	if (typeof window === "undefined") return false;
	const value = localStorage.getItem(CONSENT_KEY);
	return value === "accepted" || value === "true";
}

/**
 * Ne charge Vercel Analytics / Speed Insights qu'après consentement explicite.
 * Sans consentement (ou refus), aucun script de mesure n'est injecté → conformité CNIL.
 */
export default function AnalyticsGate() {
	const [consented, setConsented] = useState(false);

	useEffect(() => {
		setConsented(hasConsent());
		const update = () => setConsented(hasConsent());
		window.addEventListener(CONSENT_EVENT, update);
		return () => window.removeEventListener(CONSENT_EVENT, update);
	}, []);

	if (!consented) return null;

	return (
		<>
			<Analytics />
			<SpeedInsights />
		</>
	);
}
