"use client";

import Link from "next/link";
import { ChatBubbleLeftRightIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useSocket } from "@/context/SocketContext";
import InfoTooltip from "../InfoTooltip";

const MESSAGES_HREF = "/espace-personnel/administrateur/messages";

function SummaryCard({
	title,
	description,
	label,
	count,
	icon,
	iconWrapperClass,
}: {
	title: string;
	description: string;
	label: string;
	count: number;
	icon: React.ReactNode;
	iconWrapperClass: string;
}) {
	return (
		<InfoTooltip title={title} description={description}>
			<Link
				href={MESSAGES_HREF}
				className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-univers hover:shadow-md transition-all flex items-center gap-4"
			>
				<div className={iconWrapperClass}>{icon}</div>
				<div>
					<span className="text-sm font-medium text-gray-500">{label}</span>
					<p className="text-lg font-bold text-gray-900">{count > 0 ? `${count} non lu${count > 1 ? "s" : ""}` : "Aucun non lu"}</p>
				</div>
				{count > 0 && (
					<span className="ml-auto min-w-[24px] h-6 flex items-center justify-center rounded-full bg-cohesion text-white text-xs font-bold px-2">
						{count}
					</span>
				)}
			</Link>
		</InfoTooltip>
	);
}

/** Seuls les compteurs dépendent du socket ; le reste du tableau de bord est serveur. */
export default function MessagesSummaryCards() {
	const { unreadCount, contactUnreadCount } = useSocket();

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
			<SummaryCard
				title="Messages internes"
				description="Messages échangés avec les utilisateurs de la plateforme. Cliquez pour consulter."
				label="Messages internes"
				count={unreadCount}
				icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-univers" />}
				iconWrapperClass="p-2 rounded-lg bg-univers/10"
			/>
			<SummaryCard
				title="Messages du site"
				description="Messages envoyés depuis le formulaire de contact du site. Cliquez pour consulter."
				label="Messages du site"
				count={contactUnreadCount}
				icon={<GlobeAltIcon className="h-5 w-5 text-cohesion" />}
				iconWrapperClass="p-2 rounded-lg bg-cohesion/10"
			/>
		</div>
	);
}
