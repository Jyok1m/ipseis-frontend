import Link from "next/link";
import clsx from "clsx";
import { DocumentTextIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { Contract, ResourceGroup, SessionUser } from "@/lib/types";
import MyResourcesList from "./MyResourcesList";
import InfoTooltip from "./InfoTooltip";
import UnreadMessagesBanner from "./UnreadMessagesBanner";

const statusLabels: Record<string, string> = {
	sent: "En attente",
	signed: "Signé",
	cancelled: "Annulé",
	rejected: "Refusé",
};

const statusColors: Record<string, string> = {
	sent: "bg-amber-50 text-amber-700",
	signed: "bg-green-50 text-green-700",
	cancelled: "bg-red-50 text-red-700",
	rejected: "bg-red-100 text-red-800",
};

interface RoleDashboardProps {
	user: SessionUser;
	/** Segment d'URL de l'espace : "apprenant" ou "professionnel". */
	role: string;
	heading: string;
	tagline: string;
	icon: React.ReactNode;
	/** Page listant les ressources : "formations" côté apprenant, "activite" côté professionnel. */
	resourcesHref: string;
	contracts: Contract[];
	resourceGroups: ResourceGroup[];
}

/**
 * Tableau de bord commun aux espaces apprenant et professionnel, qui ne
 * différaient que par l'icône, deux libellés et un lien — pour 179 lignes
 * dupliquées de part et d'autre.
 *
 * Server Component : contrats et ressources arrivent déjà résolus, il ne reste
 * comme JavaScript que le bandeau de messages non lus.
 */
export default function RoleDashboard({
	user,
	role,
	heading,
	tagline,
	icon,
	resourcesHref,
	contracts,
	resourceGroups,
}: RoleDashboardProps) {
	const pending = contracts.filter((c) => c.status === "sent").length;
	const active = contracts.filter((c) => c.status === "signed").length;
	const recentContracts = contracts.slice(0, 3);

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-6">{heading}</h1>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
				<div className="flex items-start gap-4">
					{icon}
					<div>
						<h2 className="text-xl font-bold text-gray-900 mb-1">
							Bienvenue, {user.firstName} {user.lastName}
						</h2>
						<p className="text-gray-500">{tagline}</p>
					</div>
				</div>
			</div>

			{pending > 0 && (
				<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0" />
						<p className="text-sm font-medium text-amber-800">
							Vous avez {pending} contrat{pending > 1 ? "s" : ""} en attente de signature.
						</p>
					</div>
					<Link
						href={`/espace-personnel/${role}/contrats`}
						className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors flex-shrink-0"
					>
						Signer mes contrats
					</Link>
				</div>
			)}

			<UnreadMessagesBanner messagesHref={`/espace-personnel/${role}/messages`} />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<InfoTooltip title="Contrats actifs" description="Contrats que vous avez signés et qui sont en vigueur.">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
						<div className="p-3 rounded-lg bg-green-50">
							<CheckCircleIcon className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<p className="text-2xl font-bold text-gray-900">{active}</p>
							<p className="text-sm text-gray-500">Contrats actifs</p>
						</div>
					</div>
				</InfoTooltip>
				<InfoTooltip title="En attente" description="Contrats qui vous ont été envoyés et qui nécessitent votre signature.">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
						<div className="p-3 rounded-lg bg-amber-50">
							<ClockIcon className="h-6 w-6 text-amber-600" />
						</div>
						<div>
							<p className="text-2xl font-bold text-gray-900">{pending}</p>
							<p className="text-sm text-gray-500">En attente de signature</p>
						</div>
					</div>
				</InfoTooltip>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-gray-900">Contrats récents</h3>
						<InfoTooltip title="Tous les contrats" description="Voir la liste complète de vos contrats, les signer ou les consulter.">
							<Link href={`/espace-personnel/${role}/contrats`} className="text-sm text-univers hover:underline font-semibold">
								Voir tous
							</Link>
						</InfoTooltip>
					</div>
					{recentContracts.length > 0 ? (
						<ul className="space-y-3">
							{recentContracts.map((c) => (
								<li key={c._id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
									<div className="flex items-center gap-3 min-w-0">
										<DocumentTextIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
										<span className="text-sm font-medium text-gray-900 truncate">{c.title}</span>
									</div>
									<span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0", statusColors[c.status])}>
										{statusLabels[c.status]}
									</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-gray-500">Aucun contrat pour le moment.</p>
					)}
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-gray-900">Ressources récentes</h3>
					<InfoTooltip title="Toutes les ressources" description="Accéder à l'ensemble de vos documents PDF et supports de formation.">
						<Link href={resourcesHref} className="text-sm text-univers hover:underline font-semibold">
							Voir toutes
						</Link>
					</InfoTooltip>
				</div>
				<MyResourcesList groups={resourceGroups} limit={3} />
			</div>
		</div>
	);
}
