import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/lib/server/session";
import { getMyContracts, getMyResources, groupResourcesByTraining } from "@/lib/server/queries";
import RoleDashboard from "@/components/espace-personnel/RoleDashboard";

export default async function ApprenantDashboard() {
	const user = await requireUser(["apprenant"]);

	// Les deux lectures partent ensemble : plus de cascade contrats → ressources.
	const [contracts, resources] = await Promise.all([
		getMyContracts().then((r) => r.items).catch(() => []),
		getMyResources().catch(() => []),
	]);

	return (
		<RoleDashboard
			user={user}
			role="apprenant"
			heading="Espace Apprenant"
			tagline="Retrouvez ici vos informations, contrats et suivi pédagogique."
			icon={<AcademicCapIcon className="h-10 w-10 text-maitrise flex-shrink-0" />}
			resourcesHref="/espace-personnel/apprenant/formations"
			contracts={contracts}
			resourceGroups={groupResourcesByTraining(resources)}
		/>
	);
}
