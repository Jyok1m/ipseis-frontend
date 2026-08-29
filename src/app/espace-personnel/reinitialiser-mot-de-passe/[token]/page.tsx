import AuthPageShell from "@/components/espace-personnel/AuthPageShell";
import ResetPasswordForm from "@/components/espace-personnel/ResetPasswordForm";

/** Le token vient des params de route côté serveur, plus de useParams client. */
export default async function ReinitialiserMotDePassePage({ params }: { params: Promise<{ token: string }> }) {
	const { token } = await params;

	return (
		<AuthPageShell>
			<ResetPasswordForm token={token} />
		</AuthPageShell>
	);
}
