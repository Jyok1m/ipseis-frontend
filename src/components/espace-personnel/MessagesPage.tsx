"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getConversations, getArchivedConversations, getUsers, getConversation, getContactMessages, getContactMessage } from "@/lib/authApi";
import {
	archiveConversationAction,
	markContactMessageReadAction,
	replyToContactMessageAction,
	sendInternalMessageAction,
	unarchiveConversationAction,
} from "@/lib/server/actions/messages";
import { useSocket } from "@/context/SocketContext";
import type { ContactMessage, ContactReply, InternalMessage, MessageUser, SessionUser } from "@/lib/types";
import { notification, ConfigProvider, Spin, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
	CheckCircleIcon,
	XCircleIcon,
	EnvelopeIcon,
	EnvelopeOpenIcon,
	ChatBubbleLeftRightIcon,
	MagnifyingGlassIcon,
	ArrowUturnLeftIcon,
	PlusIcon,
	GlobeAltIcon,
	ArchiveBoxArrowDownIcon,
	ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

type NotificationType = "success" | "error";

// Le fil de discussion utilise le type partagé InternalMessage.
type Message = InternalMessage;

interface MessagesPageProps {
	/** Fourni par le Server Component parent : plus de GET /auth/me au montage. */
	user: SessionUser;
	canComposeNew?: boolean;
}

const inputClass =
	"block w-full rounded-lg px-4 py-2.5 text-gray-900 bg-white border border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20 shadow-sm placeholder:text-gray-400 text-sm font-medium transition-all duration-200";

export default function MessagesPage({ user, canComposeNew = false }: MessagesPageProps) {
	const [api, contextHolder] = notification.useNotification();
	const { socket, contactUnreadCount, refreshContactUnreadCount } = useSocket();

	// View: for admin "internal" | "contact", for others always internal
	const [activeView, setActiveView] = useState<"internal" | "contact">("internal");

	// Sub-filter for internal messages: active or archived
	const [internalFilter, setInternalFilter] = useState<"active" | "archived">("active");

	// Internal messages
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState<any>(null);

	// Conversation modal
	const [conversationOpen, setConversationOpen] = useState(false);
	const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
	const [conversationLoading, setConversationLoading] = useState(false);
	const [conversationSubject, setConversationSubject] = useState("");
	const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
	const conversationEndRef = useRef<HTMLDivElement>(null);

	// Archive / Unarchive
	const [archiving, setArchiving] = useState(false);
	const [viewingArchived, setViewingArchived] = useState(false);

	// Reply in conversation
	const [replyContent, setReplyContent] = useState("");
	const [replying, setReplying] = useState(false);

	// Compose modal (admin only)
	const [composeOpen, setComposeOpen] = useState(false);
	const [composeRecipient, setComposeRecipient] = useState<MessageUser | null>(null);
	const [composeSubject, setComposeSubject] = useState("");
	const [composeContent, setComposeContent] = useState("");
	const [composeSending, setComposeSending] = useState(false);

	// Archive / Unarchive conversation
	const handleArchive = async () => {
		if (!activeConversationId) return;
		setArchiving(true);
		try {
			const result = viewingArchived
				? await unarchiveConversationAction(activeConversationId)
				: await archiveConversationAction(activeConversationId);

			if (!result.ok) {
				openNotification("error", "Erreur", result.error ?? (viewingArchived ? "Impossible de désarchiver la conversation." : "Impossible d'archiver la conversation."));
				return;
			}

			openNotification("success", viewingArchived ? "Désarchivée" : "Archivée", result.message ?? "");
			setConversationOpen(false);
			loadMessages(1);
		} finally {
			setArchiving(false);
		}
	};

	// User search for compose
	const [userSearch, setUserSearch] = useState("");
	const [userResults, setUserResults] = useState<any[]>([]);
	const [userSearchLoading, setUserSearchLoading] = useState(false);

	// Contact messages (admin)
	const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
	const [contactLoading, setContactLoading] = useState(false);
	const [contactPagination, setContactPagination] = useState<any>(null);
	const [contactDetailOpen, setContactDetailOpen] = useState(false);
	const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
	const [contactDetailLoading, setContactDetailLoading] = useState(false);
	const [contactReplyContent, setContactReplyContent] = useState("");
	const [contactReplying, setContactReplying] = useState(false);

	const openNotification = (type: NotificationType, title: string, message: string) => {
		api[type]({
			message: title,
			description: message,
			icon:
				type === "success" ? (
					<CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
				) : (
					<XCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />
				),
		});
	};

	// ========== Internal messages ==========

	const loadMessages = useCallback(
		async (page: number = 1) => {
			setLoading(true);
			try {
				const response = internalFilter === "archived"
					? await getArchivedConversations(page)
					: await getConversations(page);
				setMessages(response.data.messages);
				setPagination(response.data.pagination);
			} catch {
				openNotification("error", "Erreur", "Impossible de charger les messages.");
			} finally {
				setLoading(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[internalFilter]
	);

	useEffect(() => {
		if (activeView === "internal") loadMessages(1);
	}, [activeView, internalFilter, loadMessages]);

	// Real-time: listen for new messages via socket
	useEffect(() => {
		if (!socket) return;
		const handleNewMessage = () => {
			if (activeView === "internal") loadMessages(pagination?.page || 1);
		};
		socket.on("new-message", handleNewMessage);
		return () => { socket.off("new-message", handleNewMessage); };
	}, [socket, loadMessages, pagination?.page, activeView]);

	// Open conversation thread
	const handleOpenConversation = async (msg: Message) => {
		const convId = msg.conversationId || msg._id;
		setActiveConversationId(convId);
		setConversationSubject(msg.subject);
		setConversationOpen(true);
		setConversationLoading(true);
		setReplyContent("");
		setViewingArchived(internalFilter === "archived");

		try {
			const response = await getConversation(convId);
			setConversationMessages(response.data.messages);
			setMessages((prev) =>
				prev.map((m) => (m.conversationId === convId || m._id === convId ? { ...m, isRead: true, unreadInThread: 0 } : m))
			);
		} catch {
			openNotification("error", "Erreur", "Impossible de charger la conversation.");
			setConversationOpen(false);
		} finally {
			setConversationLoading(false);
		}
	};

	// Scroll to bottom of conversation when messages load
	useEffect(() => {
		if (conversationMessages.length > 0 && conversationEndRef.current) {
			setTimeout(() => conversationEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
		}
	}, [conversationMessages]);

	// Reply inside conversation thread
	const submitReply = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!activeConversationId || !replyContent.trim() || conversationMessages.length === 0) return;
		setReplying(true);

		const lastMsg = conversationMessages[conversationMessages.length - 1];
		const recipientId =
			lastMsg.senderUser._id === user._id ? lastMsg.recipientUser._id : lastMsg.senderUser._id;

		try {
			const result = await sendInternalMessageAction({
				recipientUser: recipientId,
				subject: conversationSubject.startsWith("Re: ") ? conversationSubject : `Re: ${conversationSubject}`,
				content: replyContent,
				parentMessage: lastMsg._id,
			});
			if (!result.ok) {
				openNotification("error", "Erreur", result.error ?? "Erreur lors de l'envoi.");
				return;
			}
			setReplyContent("");
			const response = await getConversation(activeConversationId);
			setConversationMessages(response.data.messages);
			loadMessages(pagination?.page || 1);
		} finally {
			setReplying(false);
		}
	};

	// User search for compose
	useEffect(() => {
		if (!canComposeNew || !composeOpen || userSearch.length < 2) {
			setUserResults([]);
			return;
		}
		const timer = setTimeout(async () => {
			setUserSearchLoading(true);
			try {
				const response = await getUsers(1, undefined, userSearch);
				setUserResults(response.data.users || []);
			} catch {
				setUserResults([]);
			} finally {
				setUserSearchLoading(false);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [userSearch, canComposeNew, composeOpen]);

	const submitCompose = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!composeRecipient || !composeSubject.trim() || !composeContent.trim()) {
			openNotification("error", "Erreur", "Veuillez remplir tous les champs.");
			return;
		}
		setComposeSending(true);
		try {
			const result = await sendInternalMessageAction({
				recipientUser: composeRecipient._id,
				subject: composeSubject,
				content: composeContent,
			});
			if (!result.ok) {
				openNotification("error", "Erreur", result.error ?? "Erreur lors de l'envoi.");
				return;
			}
			openNotification("success", "Envoyé", "Message envoyé avec succès.");
			setComposeOpen(false);
			setComposeRecipient(null);
			setComposeSubject("");
			setComposeContent("");
			setUserSearch("");
			loadMessages(1);
		} finally {
			setComposeSending(false);
		}
	};

	// ========== Contact messages (admin) ==========

	const loadContactMessages = useCallback(
		async (page: number = 1) => {
			setContactLoading(true);
			try {
				const response = await getContactMessages(page);
				setContactMessages(response.data.messages);
				setContactPagination(response.data.pagination);
			} catch {
				openNotification("error", "Erreur", "Impossible de charger les messages du site.");
			} finally {
				setContactLoading(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	// Load contact messages when switching to contact view
	useEffect(() => {
		if (activeView === "contact" && canComposeNew) {
			loadContactMessages(1);
		}
	}, [activeView, canComposeNew, loadContactMessages]);

	// Open contact message detail
	const handleOpenContactDetail = async (msg: ContactMessage) => {
		setSelectedContact(msg);
		setContactDetailOpen(true);
		setContactDetailLoading(true);
		setContactReplyContent("");

		try {
			const response = await getContactMessage(msg._id);
			setSelectedContact(response.data.message);
		} catch (error: any) {
			openNotification("error", "Erreur", error.response?.data?.error || "Impossible de charger le message.");
			setContactDetailOpen(false);
			setContactDetailLoading(false);
			return;
		}

		// Mark as read + refresh global count
		if (!msg.isRead) {
			const result = await markContactMessageReadAction(msg._id);
			if (result.ok) {
				setContactMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m)));
				refreshContactUnreadCount();
			}
		}

		setContactDetailLoading(false);
	};

	// Reply to contact message
	const submitContactReply = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedContact || !contactReplyContent.trim()) return;
		setContactReplying(true);

		try {
			const result = await replyToContactMessageAction(selectedContact._id, contactReplyContent);
			if (!result.ok) {
				openNotification("error", "Erreur", result.error ?? "Erreur lors de l'envoi de la réponse.");
				return;
			}
			openNotification("success", "Envoyé", "Réponse envoyée par email avec succès.");
			if (result.contactMessage) setSelectedContact(result.contactMessage);
			setContactReplyContent("");
			loadContactMessages(contactPagination?.page || 1);
			refreshContactUnreadCount();
		} finally {
			setContactReplying(false);
		}
	};

	const roleLabels: Record<string, string> = {
		administrateur: "Admin",
		apprenant: "Apprenant",
		professionnel: "Pro",
	};

	return (
		<div>
			<ConfigProvider
				theme={{
					token: {
						colorBgElevated: "#ffffff",
						colorTextHeading: "#1a1a1a",
						colorText: "#374151",
						fontFamily: "Halibut",
					},
					components: {
						Modal: {
							titleFontSize: 18,
							titleColor: "#1a1a1a",
							headerBg: "#ffffff",
							contentBg: "#ffffff",
						},
					},
				}}
			>
				{contextHolder}

				<div className="flex items-center justify-between mb-2">
					<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
						<ChatBubbleLeftRightIcon className="h-7 w-7 text-gray-400" />
						Mes messages
					</h1>
					{canComposeNew && (
						<button
							onClick={() => {
								setComposeRecipient(null);
								setComposeSubject("");
								setComposeContent("");
								setUserSearch("");
								setComposeOpen(true);
							}}
							className="flex items-center gap-2 rounded-lg bg-univers px-5 py-3 text-white font-bold shadow-sm hover:bg-univers/90 transition-all duration-200 whitespace-nowrap"
						>
							<PlusIcon className="h-5 w-5" />
							Nouveau message
						</button>
					)}
				</div>
				<p className="text-gray-500 mb-8">Consultez et gérez vos messages.</p>

				{/* Tabs: admin sees both, others see nothing (just the list) */}
				{canComposeNew && (
					<div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
						<button
							onClick={() => setActiveView("internal")}
							className={clsx(
								"px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2",
								activeView === "internal" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
							)}
						>
							<ChatBubbleLeftRightIcon className="h-4 w-4" />
							Messages internes
						</button>
						<button
							onClick={() => setActiveView("contact")}
							className={clsx(
								"px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2",
								activeView === "contact" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
							)}
						>
							<GlobeAltIcon className="h-4 w-4" />
							Messages du site
							{contactUnreadCount > 0 && (
								<span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-cohesion text-white text-xs font-bold px-1.5">
									{contactUnreadCount}
								</span>
							)}
						</button>
					</div>
				)}

				{/* ===== Contact messages view ===== */}
				{canComposeNew && activeView === "contact" ? (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200">
						{contactLoading ? (
							<div className="flex justify-center py-12">
								<Spin indicator={<LoadingOutlined spin className="text-2xl text-gray-400" />} />
							</div>
						) : contactMessages.length === 0 ? (
							<div className="text-center py-12">
								<GlobeAltIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
								<p className="text-gray-500">Aucun message du site.</p>
							</div>
						) : (
							<div className="divide-y divide-gray-100">
								{contactMessages.map((msg) => {
									const isUnread = !msg.isRead;
									const hasReplies = msg.replies && msg.replies.length > 0;
									return (
										<button
											key={msg._id}
											onClick={() => handleOpenContactDetail(msg)}
											className={clsx(
												"w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4",
												isUnread && "bg-univers/[0.03]"
											)}
										>
											<div className="flex-shrink-0 mt-0.5">
												{isUnread ? (
													<EnvelopeIcon className="h-5 w-5 text-univers" />
												) : (
													<EnvelopeOpenIcon className="h-5 w-5 text-gray-300" />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center justify-between gap-2 mb-0.5">
													<div className="flex items-center gap-2 min-w-0">
														<span className={clsx("text-sm truncate", isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700")}>
															{msg.firstName} {msg.lastName}
														</span>
														{hasReplies && (
															<span className="flex-shrink-0 text-[10px] font-bold bg-univers/10 text-univers px-1.5 py-0.5 rounded">
																Répondu
															</span>
														)}
													</div>
													<span className="text-xs text-gray-400 flex-shrink-0">
														{new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
													</span>
												</div>
												<p className="text-xs text-gray-400 truncate">{msg.email}</p>
												<p className={clsx("text-sm truncate mt-0.5", isUnread ? "font-semibold text-gray-900" : "text-gray-700")}>
													{msg.message}
												</p>
												{msg.interestedFormations && msg.interestedFormations.length > 0 && (
													<div className="flex gap-1 mt-1 flex-wrap">
														{msg.interestedFormations.map((f) => (
															<span key={f} className="text-[10px] bg-maitrise/10 text-maitrise px-1.5 py-0.5 rounded font-medium">
																{f}
															</span>
														))}
													</div>
												)}
											</div>
											{isUnread && (
												<span className="flex-shrink-0 mt-2">
													<span className="w-2.5 h-2.5 rounded-full bg-univers block" />
												</span>
											)}
										</button>
									);
								})}
							</div>
						)}

						{/* Contact Pagination */}
						{contactPagination && contactPagination.pages > 1 && (
							<div className="flex justify-center gap-2 py-4 border-t border-gray-100">
								{Array.from({ length: contactPagination.pages }, (_, i) => (
									<button
										key={i + 1}
										onClick={() => loadContactMessages(i + 1)}
										className={clsx(
											"px-3 py-1 rounded text-sm font-medium",
											contactPagination.page === i + 1 ? "bg-univers text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
										)}
									>
										{i + 1}
									</button>
								))}
							</div>
						)}
					</div>
				) : (

				/* ===== Internal messages view ===== */
				<div>
				{/* Sub-filter: Conversations / Archivés */}
				<div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
					<button
						onClick={() => setInternalFilter("active")}
						className={clsx(
							"px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5",
							internalFilter === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
						)}
					>
						<ChatBubbleLeftRightIcon className="h-4 w-4" />
						Conversations
					</button>
					<button
						onClick={() => setInternalFilter("archived")}
						className={clsx(
							"px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5",
							internalFilter === "archived" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
						)}
					>
						<ArchiveBoxArrowDownIcon className="h-4 w-4" />
						Archivés
					</button>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200">
					{loading ? (
						<div className="flex justify-center py-12">
							<Spin indicator={<LoadingOutlined spin className="text-2xl text-gray-400" />} />
						</div>
					) : messages.length === 0 ? (
						<div className="text-center py-12">
							{internalFilter === "archived" ? (
								<>
									<ArchiveBoxArrowDownIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-500">Aucune conversation archivée.</p>
								</>
							) : (
								<>
									<EnvelopeIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-500">Aucun message.</p>
								</>
							)}
						</div>
					) : (
						<div className="divide-y divide-gray-100">
							{messages.map((msg) => {
								const person = msg.senderUser?._id === user._id ? msg.recipientUser : msg.senderUser;
								const isUnread = (msg.unreadInThread ?? 0) > 0;
								return (
									<button
										key={msg._id}
										onClick={() => handleOpenConversation(msg)}
										className={clsx(
											"w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4",
											isUnread && "bg-univers/[0.03]"
										)}
									>
										<div className="flex-shrink-0 mt-0.5">
											{isUnread ? (
												<EnvelopeIcon className="h-5 w-5 text-univers" />
											) : (
												<EnvelopeOpenIcon className="h-5 w-5 text-gray-300" />
											)}
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center justify-between gap-2 mb-0.5">
												<span className={clsx("text-sm truncate", isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700")}>
													{person ? `${person.firstName} ${person.lastName}` : "Utilisateur supprimé"}
												</span>
												<div className="flex items-center gap-2 flex-shrink-0">
													{msg.threadCount && msg.threadCount > 1 && (
														<span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
															{msg.threadCount}
														</span>
													)}
													<span className="text-xs text-gray-400">
														{new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
													</span>
												</div>
											</div>
											<p className={clsx("text-sm truncate", isUnread ? "font-semibold text-gray-900" : "text-gray-700")}>
												{msg.subject}
											</p>
											<p className="text-xs text-gray-400 truncate mt-0.5">{msg.content}</p>
										</div>
										{isUnread && (
											<span className="flex items-center gap-1 flex-shrink-0 mt-2">
												{msg.unreadInThread && msg.unreadInThread > 0 ? (
													<span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-cohesion text-white text-xs font-bold px-1.5">
														{msg.unreadInThread}
													</span>
												) : (
													<span className="w-2.5 h-2.5 rounded-full bg-univers" />
												)}
											</span>
										)}
									</button>
								);
							})}
						</div>
					)}

					{/* Pagination */}
					{pagination && pagination.pages > 1 && (
						<div className="flex justify-center gap-2 py-4 border-t border-gray-100">
							{Array.from({ length: pagination.pages }, (_, i) => (
								<button
									key={i + 1}
									onClick={() => loadMessages(i + 1)}
									className={clsx(
										"px-3 py-1 rounded text-sm font-medium",
										pagination.page === i + 1 ? "bg-univers text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
									)}
								>
									{i + 1}
								</button>
							))}
						</div>
					)}
				</div>
				</div>
				)}

				{/* Contact Detail Modal */}
				<Modal
					title={null}
					open={contactDetailOpen}
					onCancel={() => setContactDetailOpen(false)}
					footer={null}
					width="min(680px, 95vw)"
					centered
					destroyOnClose
					styles={{ body: { padding: 0 } }}
				>
					{contactDetailLoading ? (
						<div className="flex justify-center py-12">
							<Spin indicator={<LoadingOutlined spin className="text-2xl text-gray-400" />} />
						</div>
					) : selectedContact && (
						<div className="mt-2">
							{/* Header */}
							<div className="px-1 mb-4">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="text-lg font-bold text-gray-900">
										{selectedContact.firstName} {selectedContact.lastName}
									</h3>
									<span className="text-[10px] font-bold uppercase tracking-wide bg-cohesion/10 text-cohesion px-1.5 py-0.5 rounded">
										Message du site
									</span>
								</div>
								<div className="flex items-center gap-3 text-sm text-gray-500">
									<a href={`mailto:${selectedContact.email}`} className="text-univers hover:underline">{selectedContact.email}</a>
									<span>
										{new Date(selectedContact.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
									</span>
								</div>
								{selectedContact.interestedFormations && selectedContact.interestedFormations.length > 0 && (
									<div className="flex gap-1.5 mt-2 flex-wrap">
										{selectedContact.interestedFormations.map((f) => (
											<span key={f} className="text-xs bg-maitrise/10 text-maitrise px-2 py-0.5 rounded-full font-medium">
												{f}
											</span>
										))}
									</div>
								)}
							</div>

							{/* Original message */}
							<div className="mx-1 bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
								<p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
							</div>

							{/* Replies history */}
							{selectedContact.replies && selectedContact.replies.length > 0 && (
								<div className="mx-1 space-y-3 mb-4">
									{selectedContact.replies.map((reply) => (
										<div key={reply._id} className="border-l-3 border-univers pl-4 py-2">
											<div className="flex items-center gap-2 mb-1">
												<span className="text-xs font-semibold text-gray-700">
													{reply.sentBy ? `${reply.sentBy.firstName} ${reply.sentBy.lastName}` : "Admin"}
												</span>
												<span className="text-xs text-gray-400">
													{new Date(reply.sentAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
												</span>
											</div>
											<p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{reply.content}</p>
										</div>
									))}
								</div>
							)}

							{/* Reply form */}
							<form onSubmit={submitContactReply} className="border-t border-gray-100 pt-4 px-1">
								<p className="text-xs text-gray-400 mb-2">
									La réponse sera envoyée par email à <span className="font-medium">{selectedContact.email}</span>
								</p>
								<div className="flex flex-col sm:flex-row gap-3">
									<textarea
										value={contactReplyContent}
										onChange={(e) => setContactReplyContent(e.target.value)}
										placeholder="Écrivez votre réponse..."
										rows={3}
										disabled={contactReplying}
										className={clsx(inputClass, "resize-none flex-1")}
									/>
									<button
										type="submit"
										disabled={contactReplying || !contactReplyContent.trim()}
										className={clsx(
											contactReplying || !contactReplyContent.trim() ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-univers/90",
											"px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-univers shadow-sm transition-all duration-200 flex items-center gap-2 self-end"
										)}
									>
										{contactReplying ? (
											<Spin indicator={<LoadingOutlined spin className="text-base text-white" />} />
										) : (
											<>
												<ArrowUturnLeftIcon className="h-4 w-4" />
												Répondre par email
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					)}
				</Modal>

				{/* Conversation Thread Modal */}
				<Modal
					title={null}
					open={conversationOpen}
					onCancel={() => setConversationOpen(false)}
					footer={null}
					width="min(680px, 95vw)"
					centered
					destroyOnClose
					styles={{ body: { padding: 0 } }}
				>
					<div className="mt-2">
						<div className="flex items-center gap-2 mb-4 px-1 pr-8">
							<h3 className="text-lg font-bold text-gray-900">{conversationSubject}</h3>
							<button
								onClick={handleArchive}
								disabled={archiving}
								title={viewingArchived ? "Désarchiver la conversation" : "Archiver la conversation"}
								className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-univers hover:bg-univers/10 transition-colors disabled:opacity-50"
							>
								{viewingArchived ? (
									<ArchiveBoxXMarkIcon className="h-5 w-5" />
								) : (
									<ArchiveBoxArrowDownIcon className="h-5 w-5" />
								)}
							</button>
						</div>

						{conversationLoading ? (
							<div className="flex justify-center py-12">
								<Spin indicator={<LoadingOutlined spin className="text-2xl text-gray-400" />} />
							</div>
						) : (
							<>
								{/* Messages thread */}
								<div className="max-h-[400px] overflow-y-auto space-y-3 mb-4 px-1">
									{conversationMessages.map((msg) => {
										const isMine = msg.senderUser._id === user._id;
										return (
											<div key={msg._id} className={clsx("flex", isMine ? "justify-end" : "justify-start")}>
												<div
													className={clsx(
														"max-w-[80%] rounded-xl px-4 py-3",
														isMine ? "bg-univers/10 border border-univers/20" : "bg-gray-50 border border-gray-200"
													)}
												>
													<div className="flex items-center gap-2 mb-1">
														<span className="text-xs font-semibold text-gray-700">
															{msg.senderUser.firstName} {msg.senderUser.lastName}
														</span>
														<span className="text-xs text-gray-400">
															{new Date(msg.createdAt).toLocaleDateString("fr-FR", {
																day: "numeric",
																month: "short",
																hour: "2-digit",
																minute: "2-digit",
															})}
														</span>
													</div>
													<p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
														{msg.content}
													</p>
												</div>
											</div>
										);
									})}
									<div ref={conversationEndRef} />
								</div>

								{/* Reply form */}
								<form onSubmit={submitReply} className="border-t border-gray-100 pt-4 px-1">
									<div className="flex flex-col sm:flex-row gap-3">
										<textarea
											value={replyContent}
											onChange={(e) => setReplyContent(e.target.value)}
											placeholder="Écrivez votre réponse..."
											rows={2}
											disabled={replying}
											className={clsx(inputClass, "resize-none flex-1")}
										/>
										<button
											type="submit"
											disabled={replying || !replyContent.trim()}
											className={clsx(
												replying || !replyContent.trim() ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-univers/90",
												"px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-univers shadow-sm transition-all duration-200 flex items-center gap-2 self-end"
											)}
										>
											{replying ? (
												<Spin indicator={<LoadingOutlined spin className="text-base text-white" />} />
											) : (
												<>
													<ArrowUturnLeftIcon className="h-4 w-4" />
													Répondre
												</>
											)}
										</button>
									</div>
								</form>
							</>
						)}
					</div>
				</Modal>

				{/* Compose Modal (admin) */}
				{canComposeNew && (
					<Modal
						title="Nouveau message"
						open={composeOpen}
						onCancel={() => !composeSending && setComposeOpen(false)}
						footer={null}
						width="min(600px, 95vw)"
						centered
						destroyOnClose
					>
						<form onSubmit={submitCompose} className="space-y-4 mt-4">
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">
									Destinataire<span className="text-red-400 ml-1">*</span>
								</label>
								{composeRecipient ? (
									<div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
										<span className="text-sm font-medium text-gray-900">
											{composeRecipient.firstName} {composeRecipient.lastName}
											<span className="text-gray-400 ml-2">({composeRecipient.email})</span>
										</span>
										<button
											type="button"
											onClick={() => {
												setComposeRecipient(null);
												setUserSearch("");
											}}
											className="text-xs text-red-500 hover:text-red-700 font-medium"
										>
											Changer
										</button>
									</div>
								) : (
									<div className="relative">
										<MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
										<input
											type="text"
											value={userSearch}
											onChange={(e) => setUserSearch(e.target.value)}
											placeholder="Rechercher un utilisateur..."
											className="pl-9 pr-4 py-2.5 w-full rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-univers focus:ring-2 focus:ring-univers/20"
										/>
										{userSearchLoading && (
											<div className="absolute right-3 top-1/2 -translate-y-1/2">
												<Spin indicator={<LoadingOutlined spin className="text-sm text-gray-400" />} />
											</div>
										)}
										{userResults.length > 0 && (
											<div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
												{userResults.map((u: any) => (
													<button
														key={u._id}
														type="button"
														onClick={() => {
															setComposeRecipient(u);
															setUserSearch("");
															setUserResults([]);
														}}
														className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center justify-between"
													>
														<span className="font-medium text-gray-900">
															{u.firstName} {u.lastName}
														</span>
														<span className="text-xs text-gray-400">{roleLabels[u.role] || u.role}</span>
													</button>
												))}
											</div>
										)}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">
									Sujet<span className="text-red-400 ml-1">*</span>
								</label>
								<input
									type="text"
									value={composeSubject}
									onChange={(e) => setComposeSubject(e.target.value)}
									placeholder="Sujet du message"
									disabled={composeSending}
									className={inputClass}
								/>
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-1 block">
									Message<span className="text-red-400 ml-1">*</span>
								</label>
								<textarea
									value={composeContent}
									onChange={(e) => setComposeContent(e.target.value)}
									placeholder="Écrivez votre message..."
									rows={6}
									disabled={composeSending}
									className={clsx(inputClass, "resize-none")}
								/>
							</div>
							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setComposeOpen(false)}
									disabled={composeSending}
									className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={composeSending || !composeRecipient || !composeSubject.trim() || !composeContent.trim()}
									className={clsx(
										composeSending || !composeRecipient || !composeSubject.trim() || !composeContent.trim()
											? "cursor-not-allowed opacity-70"
											: "cursor-pointer hover:bg-univers/90",
										"px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-univers shadow-sm transition-all duration-200 flex items-center gap-2"
									)}
								>
									{composeSending ? (
										<Spin indicator={<LoadingOutlined spin className="text-base text-white" />} />
									) : (
										<>
											<PlusIcon className="h-4 w-4" />
											Envoyer
										</>
									)}
								</button>
							</div>
						</form>
					</Modal>
				)}
			</ConfigProvider>
		</div>
	);
}
