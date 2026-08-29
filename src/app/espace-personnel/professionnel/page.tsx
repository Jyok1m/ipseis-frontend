import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/server/session";
import { getMyContracts, getMyResources, groupResourcesByTraining } from "@/lib/server/queries";
import RoleDashboard from "@/components/espace-personnel/RoleDashboard";

export default async function ProfessionnelDashboard() {
	const user = await requireUser(["professionnel"]);

	const [contracts, resources] = await Promise.all([
		getMyContracts().then((r) => r.items).catch(() => []),
		getMyResources().catch(() => []),
	]);

	return (
		<RoleDashboard
			user={user}
			role="professionnel"
			heading="Espace Professionnel"
			tagline="Retrouvez ici vos informations, contrats et outils professionnels."
			icon={<BriefcaseIcon className="h-10 w-10 text-maitrise flex-shrink-0" />}
			resourcesHref="/espace-personnel/professionnel/activite"
			contracts={contracts}
			resourceGroups={groupResourcesByTraining(resources)}
		/>
	);
}
