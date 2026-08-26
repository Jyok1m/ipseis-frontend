"use client";

import { useEffect, useRef } from "react";
import { ConfigProvider, notification } from "antd";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { ActionState } from "@/lib/server/actions/types";

const antdTheme = {
	token: {
		colorBgElevated: "#fffce8",
		colorTextHeading: "#263c27",
		colorText: "#263c27",
		fontFamily: "Halibut",
	},
};

interface Options {
	successTitle?: string;
	errorTitle?: string;
	/** Appelé une fois par état de succès (fermer une modale, vider un champ…). */
	onSuccess?: () => void;
}

/**
 * Affiche l'ActionState d'une server action dans la notification antd déjà
 * utilisée partout dans l'app, et renvoie le contextHolder à monter.
 *
 * Chaque soumission renvoie un nouvel objet d'état : deux erreurs identiques
 * successives déclenchent bien deux notifications.
 */
export function useActionFeedback(state: ActionState, { successTitle = "Parfait !", errorTitle = "Erreur", onSuccess }: Options = {}) {
	const [api, contextHolder] = notification.useNotification();
	const lastHandled = useRef<ActionState | null>(null);

	useEffect(() => {
		if (state === lastHandled.current) return;
		lastHandled.current = state;

		if (state.error) {
			api.error({
				message: errorTitle,
				description: state.error,
				icon: <XCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />,
			});
			return;
		}

		if (state.ok) {
			if (state.message) {
				api.success({
					message: successTitle,
					description: state.message,
					icon: <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />,
				});
			}
			onSuccess?.();
		}
	}, [state, api, successTitle, errorTitle, onSuccess]);

	return <ConfigProvider theme={antdTheme}>{contextHolder}</ConfigProvider>;
}
