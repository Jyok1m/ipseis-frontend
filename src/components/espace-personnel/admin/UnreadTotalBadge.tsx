"use client";

import { useSocket } from "@/context/SocketContext";

/** Pastille du raccourci « Messages », alimentée par le socket. */
export default function UnreadTotalBadge() {
	const { unreadCount, contactUnreadCount } = useSocket();
	const total = unreadCount + contactUnreadCount;

	if (total === 0) return null;

	return (
		<span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-cohesion text-white text-xs font-bold px-1.5">{total}</span>
	);
}
