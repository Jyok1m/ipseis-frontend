import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { getMyResources, groupResourcesByTraining } from "@/lib/server/queries";
import MyResourcesList from "@/components/espace-personnel/MyResourcesList";

export default async function ApprenantFormationsPage() {
	const resources = await getMyResources().catch(() => []);

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
				<AcademicCapIcon className="h-7 w-7 text-gray-400" />
				Mes formations & ressources
			</h1>
			<p className="text-gray-500 mb-8">Retrouvez ici les ressources liées à vos formations.</p>

			<MyResourcesList groups={groupResourcesByTraining(resources)} />
		</div>
	);
}
