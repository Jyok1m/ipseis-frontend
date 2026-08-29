import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Espace Personnel",
	description: "Accédez à votre Espace Personnel IPSEIS.",
	robots: { index: false, follow: false },
};

/**
 * Server Component sans provider : l'utilisateur vient désormais du serveur via
 * requireUser() dans chaque layout de rôle, et SocketProvider descend au même
 * niveau. Connexion et inscription n'ont donc plus besoin d'être dynamiques.
 */
export default function EspacePersonnelLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
