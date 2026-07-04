"use client";

import ResetPasswordForm from "@/components/espace-personnel/ResetPasswordForm";
import logoGreen from "@/_images/logo/logo_green.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReinitialiserMotDePassePage() {
	const params = useParams();
	const token = params.token as string;

	return (
		<div className="min-h-screen bg-support flex flex-col items-center justify-center px-4 py-12">
			<Link href="/" className="mb-8">
				<Image src={logoGreen} alt="Logo IPSEIS" height={60} />
			</Link>
			<ResetPasswordForm token={token} />
		</div>
	);
}
