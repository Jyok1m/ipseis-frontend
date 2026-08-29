import DashboardSkeleton from "@/components/espace-personnel/DashboardSkeleton";

/**
 * Next enveloppe automatiquement les children du layout dans un Suspense
 * dont ceci est le fallback. La sidebar et l'en-tête partent immédiatement,
 * le contenu suit en streaming.
 */
export default function Loading() {
	return <DashboardSkeleton />;
}
