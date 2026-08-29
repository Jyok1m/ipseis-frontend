import Image from "next/image";
import Link from "next/link";
import logoGreen from "@/_images/logo/logo_green.svg";

/** Cadre commun aux pages d'authentification. Server Component : aucun JS envoyé. */
export default function AuthPageShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-support flex flex-col items-center justify-center px-4 py-12">
			<Link href="/" className="mb-8">
				<Image src={logoGreen} alt="Logo IPSEIS" height={60} />
			</Link>
			{children}
		</div>
	);
}
