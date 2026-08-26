"use client";

import { useFormStatus } from "react-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import clsx from "clsx";

/**
 * Bouton de soumission d'un <form action>. useFormStatus lit l'état de la
 * server action en cours dans le formulaire parent : plus besoin d'un useState
 * isLoading manuel synchronisé à la main autour de chaque appel.
 */
export default function SubmitButton({
	children,
	className,
	spinnerClassName = "text-support",
}: {
	children: React.ReactNode;
	className?: string;
	spinnerClassName?: string;
}) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className={clsx(pending ? "cursor-not-allowed opacity-70" : "cursor-pointer", className)}
		>
			{pending ? <Spin indicator={<LoadingOutlined spin />} size="small" className={spinnerClassName} /> : children}
		</button>
	);
}
