"use client";

import LoginForm from "@/components/espace-personnel/LoginForm";
import logoGreen from "@/_images/logo/logo_green.svg";
import Image from "next/image";
import Link from "next/link";

export default function ConnexionPage() {
	return (
		<div className="min-h-screen bg-support flex flex-col items-center justify-center px-4 py-12">
			<Link href="/" className="mb-8">
				<Image src={logoGreen} alt="Logo IPSEIS" height={60} />
			</Link>
			<LoginForm />
		</div>
	);
}
