"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

/** Seuil d'apparition : au-delà d'un écran, remonter à la main devient pénible. */
const SHOW_AFTER = 600;

/**
 * Bouton flottant de retour en haut de page.
 *
 * Le défilement appartient de nouveau au document depuis que l'en-tête n'est
 * plus figé : on écoute donc window, et non un conteneur interne.
 * Le défilement animé n'est appliqué que si l'utilisateur ne demande pas de
 * réduire les animations.
 */
export default function BackToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToTop = () => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
	};

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Revenir en haut de la page"
			// aria-hidden + tabIndex quand il est masqué : sans ça, il resterait
			// atteignable au clavier alors qu'il est invisible.
			aria-hidden={!visible}
			tabIndex={visible ? 0 : -1}
			className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-univers text-support shadow-lg ring-1 ring-support/20 transition-all duration-300 hover:bg-univers/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cohesion sm:bottom-8 sm:right-8 ${
				visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
			}`}
		>
			<ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
		</button>
	);
}
