import Link from "next/link";
import clsx from "clsx";
import {
	UsersIcon,
	AcademicCapIcon,
	DocumentTextIcon,
	ClockIcon,
	CheckCircleIcon,
	UserGroupIcon,
	ClipboardDocumentCheckIcon,
	EnvelopeIcon,
	FolderIcon,
} from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/server/session";
import { getDashboardStats } from "@/lib/server/queries";
import InfoTooltip from "@/components/espace-personnel/InfoTooltip";
import UnreadMessagesBanner from "@/components/espace-personnel/UnreadMessagesBanner";
import MessagesSummaryCards from "@/components/espace-personnel/admin/MessagesSummaryCards";
import UnreadTotalBadge from "@/components/espace-personnel/admin/UnreadTotalBadge";

const ADMIN = "/espace-personnel/administrateur";

const contractStatusLabels: Record<string, string> = {
	draft: "Brouillon",
	sent: "Envoyé",
	signed: "Signé",
	cancelled: "Annulé",
	rejected: "Refusé",
};

const contractStatusColors: Record<string, string> = {
	draft: "bg-gray-100 text-gray-700",
	sent: "bg-amber-50 text-amber-700",
	signed: "bg-green-50 text-green-700",
	cancelled: "bg-red-50 text-red-700",
	rejected: "bg-red-100 text-red-800",
};

const roleLabels: Record<string, string> = {
	administrateur: "Admin",
	apprenant: "Apprenant",
	professionnel: "Professionnel",
};

const roleColors: Record<string, string> = {
	administrateur: "bg-univers/10 text-univers",
	apprenant: "bg-maitrise/10 text-maitrise",
	professionnel: "bg-cohesion/10 text-cohesion",
};

const shortcuts = [
	{ href: `${ADMIN}/formations`, label: "Formations", icon: <AcademicCapIcon className="h-4 w-4" /> },
	{ href: `${ADMIN}/contrats`, label: "Contrats", icon: <DocumentTextIcon className="h-4 w-4" /> },
	{ href: `${ADMIN}/ressources`, label: "Ressources", icon: <FolderIcon className="h-4 w-4" /> },
	{ href: `${ADMIN}/utilisateurs`, label: "Utilisateurs", icon: <UsersIcon className="h-4 w-4" /> },
	{ href: `${ADMIN}/prospects`, label: "Prospects", icon: <UserGroupIcon className="h-4 w-4" /> },
	{ href: `${ADMIN}/checklists`, label: "Checklists", icon: <ClipboardDocumentCheckIcon className="h-4 w-4" /> },
];

const shortcutClass =
	"inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-univers hover:text-univers transition-colors";

function KpiCard({
	href,
	label,
	value,
	hint,
	icon,
	iconWrapperClass,
	cardClass = "bg-white border-gray-200 hover:border-univers",
	labelClass = "text-gray-500",
	valueClass = "text-gray-900",
}: {
	href: string;
	label: string;
	value: number;
	hint?: string;
	icon: React.ReactNode;
	iconWrapperClass: string;
	cardClass?: string;
	labelClass?: string;
	valueClass?: string;
}) {
	return (
		<Link href={href} className={clsx("rounded-xl shadow-sm border p-5 hover:shadow-md transition-all", cardClass)}>
			<div className="flex items-center gap-3 mb-2">
				<div className={iconWrapperClass}>{icon}</div>
				<span className={clsx("text-sm font-medium", labelClass)}>{label}</span>
			</div>
			<p className={clsx("text-2xl font-bold", valueClass)}>{value}</p>
			{hint && <p className="text-xs text-maitrise font-medium mt-1">{hint}</p>}
		</Link>
	);
}

/**
 * Tableau de bord admin en Server Component : les statistiques sont dans le
 * HTML initial, il n'y a plus d'écran de chargement pleine page pendant le
 * GET /admin/dashboard/stats. Ne restent en JavaScript que les compteurs de
 * messages, qui suivent le socket.
 */
export default async function AdminDashboard() {
	const user = await requireUser(["administrateur"]);
	const stats = await getDashboardStats();

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
			<p className="text-gray-500 mb-8">Bienvenue, {user.firstName}. Vue d&apos;ensemble.</p>

			<UnreadMessagesBanner messagesHref={`${ADMIN}/messages`} />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
				<InfoTooltip title="Prospects" description="Personnes ayant téléchargé le catalogue ou envoyé un message via le site. Cliquez pour gérer.">
					<KpiCard
						href={`${ADMIN}/prospects`}
						label="Prospects"
						value={stats.totalProspects}
						hint={`+${stats.prospectsThisMonth} ce mois`}
						icon={<UserGroupIcon className="h-5 w-5 text-univers" />}
						iconWrapperClass="p-2 rounded-lg bg-univers/10"
					/>
				</InfoTooltip>

				<InfoTooltip title="Utilisateurs" description="Comptes inscrits sur la plateforme (admins, apprenants, professionnels). Cliquez pour gérer les comptes.">
					<KpiCard
						href={`${ADMIN}/utilisateurs`}
						label="Utilisateurs"
						value={stats.totalUsers}
						icon={<UsersIcon className="h-5 w-5 text-maitrise" />}
						iconWrapperClass="p-2 rounded-lg bg-maitrise/10"
					/>
				</InfoTooltip>

				<InfoTooltip title="Formations" description="Formations publiées au catalogue. Cliquez pour ajouter, modifier ou masquer des formations.">
					<KpiCard
						href={`${ADMIN}/formations`}
						label="Formations"
						value={stats.totalTrainings}
						icon={<AcademicCapIcon className="h-5 w-5 text-cohesion" />}
						iconWrapperClass="p-2 rounded-lg bg-cohesion/10"
					/>
				</InfoTooltip>

				<InfoTooltip title="Contrats" description="Nombre total de contrats (tous statuts confondus). Cliquez pour voir la liste complète.">
					<KpiCard
						href={`${ADMIN}/contrats`}
						label="Contrats"
						value={stats.totalContracts}
						icon={<DocumentTextIcon className="h-5 w-5 text-gray-500" />}
						iconWrapperClass="p-2 rounded-lg bg-gray-100"
					/>
				</InfoTooltip>

				<InfoTooltip title="En attente" description="Contrats envoyés mais pas encore signés par le destinataire. Cliquez pour les filtrer.">
					<KpiCard
						href={`${ADMIN}/contrats?status=sent`}
						label="En attente"
						value={stats.contractsByStatus.sent}
						icon={<ClockIcon className="h-5 w-5 text-amber-600" />}
						iconWrapperClass="p-2 rounded-lg bg-amber-100"
						cardClass="bg-amber-50 border-amber-200 hover:border-amber-400"
						labelClass="text-amber-700"
						valueClass="text-amber-900"
					/>
				</InfoTooltip>

				<InfoTooltip title="Signés" description="Contrats signés par les destinataires. Cliquez pour les filtrer.">
					<KpiCard
						href={`${ADMIN}/contrats?status=signed`}
						label="Signés"
						value={stats.contractsByStatus.signed}
						icon={<CheckCircleIcon className="h-5 w-5 text-green-600" />}
						iconWrapperClass="p-2 rounded-lg bg-green-100"
						cardClass="bg-green-50 border-green-200 hover:border-green-400"
						labelClass="text-green-700"
						valueClass="text-green-900"
					/>
				</InfoTooltip>
			</div>

			<MessagesSummaryCards />

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
				<h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Raccourcis rapides</h2>
				<div className="flex flex-wrap gap-3">
					{shortcuts.map((shortcut) => (
						<Link key={shortcut.href} href={shortcut.href} className={shortcutClass}>
							{shortcut.icon}
							{shortcut.label}
						</Link>
					))}
					<Link href={`${ADMIN}/messages`} className={shortcutClass}>
						<EnvelopeIcon className="h-4 w-4" />
						Messages
						<UnreadTotalBadge />
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-gray-900">Contrats récents</h3>
						<InfoTooltip title="Gestion des contrats" description="Voir, créer et envoyer tous les contrats depuis la page dédiée.">
							<Link href={`${ADMIN}/contrats`} className="text-sm text-univers hover:underline font-semibold">
								Voir tous
							</Link>
						</InfoTooltip>
					</div>
					{stats.recentContracts.length > 0 ? (
						<ul className="space-y-3">
							{stats.recentContracts.map((c) => (
								<li key={c._id}>
									<Link
										href={`${ADMIN}/contrats`}
										className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
									>
										<div className="min-w-0">
											<div className="flex items-center gap-2">
												<DocumentTextIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
												<span className="text-sm font-medium text-gray-900 truncate">{c.title}</span>
											</div>
											<p className="text-xs text-gray-500 ml-6">{c.recipientName}</p>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0">
											<span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", contractStatusColors[c.status])}>
												{contractStatusLabels[c.status] || c.status}
											</span>
											<span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</span>
										</div>
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-gray-500">Aucun contrat pour le moment.</p>
					)}
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-gray-900">Derniers inscrits</h3>
						<InfoTooltip title="Gestion des utilisateurs" description="Voir et modifier tous les comptes utilisateurs depuis la page dédiée.">
							<Link href={`${ADMIN}/utilisateurs`} className="text-sm text-univers hover:underline font-semibold">
								Voir tous
							</Link>
						</InfoTooltip>
					</div>
					{stats.recentUsers.length > 0 ? (
						<ul className="space-y-3">
							{stats.recentUsers.map((u) => (
								<li key={u._id}>
									<Link
										href={`${ADMIN}/utilisateurs`}
										className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
									>
										<div className="flex items-center gap-2">
											<UsersIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
											<span className="text-sm font-medium text-gray-900">
												{u.firstName} {u.lastName}
											</span>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0">
											<span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", roleColors[u.role])}>
												{roleLabels[u.role] || u.role}
											</span>
											<span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</span>
										</div>
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-gray-500">Aucun utilisateur pour le moment.</p>
					)}
				</div>
			</div>
		</div>
	);
}
