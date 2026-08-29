"use client";

import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useSocket } from "@/context/SocketContext";

/**
 * Îlot client minimal : seul ce bandeau a besoin du compteur temps réel du
 * socket. Le reste du tableau de bord est rendu côté serveur.
 */
export default function UnreadMessagesBanner({ messagesHref }: { messagesHref: string }) {
	const { unreadCount } = useSocket();

	if (unreadCount === 0) return null;

	return (
		<div className="bg-univers/5 border border-univers/20 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
			<div className="flex items-center gap-3">
				<ChatBubbleLeftRightIcon className="h-6 w-6 text-univers flex-shrink-0" />
				<p className="text-sm font-medium text-univers">
					Vous avez {unreadCount} nouveau{unreadCount > 1 ? "x" : ""} message{unreadCount > 1 ? "s" : ""}.
				</p>
			</div>
			<Link
				href={messagesHref}
				className="px-4 py-2 rounded-lg bg-univers text-white text-sm font-semibold hover:bg-univers/90 transition-colors flex-shrink-0"
			>
				Voir mes messages
			</Link>
		</div>
	);
}
