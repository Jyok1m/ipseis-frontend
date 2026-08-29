"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { SessionUser } from "@/lib/types";

interface SocketContextType {
	socket: Socket | null;
	unreadCount: number;
	contactUnreadCount: number;
	refreshContactUnreadCount: () => void;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	unreadCount: 0,
	contactUnreadCount: 0,
	refreshContactUnreadCount: () => {},
});

interface SocketProviderProps {
	children: React.ReactNode;
	user: SessionUser;
	/** Compteurs rendus côté serveur : le badge est juste dès le premier paint. */
	initialUnreadCount: number;
	initialContactUnreadCount: number;
}

/**
 * Temps réel de la messagerie. Le provider ne fait plus de GET au montage :
 * les compteurs initiaux arrivent du Server Component parent, le socket ne sert
 * qu'aux mises à jour ultérieures. Deux allers-retours REST en moins par
 * chargement de page de l'espace personnel.
 */
export function SocketProvider({ children, user, initialUnreadCount, initialContactUnreadCount }: SocketProviderProps) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
	const [contactUnreadCount, setContactUnreadCount] = useState(initialContactUnreadCount);
	const socketRef = useRef<Socket | null>(null);

	// Les compteurs serveur font foi après une navigation (revalidatePath).
	useEffect(() => setUnreadCount(initialUnreadCount), [initialUnreadCount]);
	useEffect(() => setContactUnreadCount(initialContactUnreadCount), [initialContactUnreadCount]);

	const refreshContactUnreadCount = useCallback(async () => {
		if (user.role !== "administrateur") return;
		try {
			// Route proxy first-party : le cookie httpOnly n'est pas lisible en JS.
			const response = await fetch("/api/proxy/messages/admin/unread-count", { credentials: "include" });
			if (response.ok) setContactUnreadCount((await response.json()).count);
		} catch {
			// Compteur non critique : on garde la dernière valeur connue.
		}
	}, [user.role]);

	useEffect(() => {
		const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3098";
		const newSocket = io(backendUrl, { withCredentials: true, transports: ["websocket", "polling"] });

		newSocket.on("unread-count", (data: { count: number }) => setUnreadCount(data.count));

		socketRef.current = newSocket;
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
			socketRef.current = null;
			setSocket(null);
		};
	}, [user._id]);

	return (
		<SocketContext.Provider value={{ socket, unreadCount, contactUnreadCount, refreshContactUnreadCount }}>
			{children}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	return useContext(SocketContext);
}
