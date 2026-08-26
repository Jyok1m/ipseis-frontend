import { getAdminThemes, getAdminTrainings } from "@/lib/server/queries";
import FormationsClient from "./FormationsClient";

export default async function FormationsPage() {
	const [trainings, themes] = await Promise.all([getAdminTrainings(), getAdminThemes()]);

	return <FormationsClient trainings={trainings} themes={themes} />;
}
