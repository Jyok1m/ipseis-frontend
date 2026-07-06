import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons";

export default function NotFound() {
	return (
		<div className="bg-support min-h-full flex items-center justify-center px-6 lg:px-8">
			<div className="text-center">
				<div className="flex justify-center mb-6">
					<FontAwesomeIcon icon={faExclamationTriangle} className="text-6xl text-cohesion" />
				</div>
				<h1 className="text-3xl font-bold text-univers mb-4">Formation non trouvée</h1>
				<p className="text-lg text-gray-600 mb-8">Cette formation n'existe pas ou n'est plus disponible.</p>
				<div className="space-x-4">
					<Link
						href="/catalogue"
						className="inline-block bg-cohesion text-white px-6 py-3 rounded-lg font-semibold hover:bg-cohesion/90 transition-colors duration-300"
					>
						Retour au catalogue
					</Link>
					<Link
						href="/"
						className="inline-block border border-cohesion text-cohesion px-6 py-3 rounded-lg font-semibold hover:bg-cohesion hover:text-white transition-colors duration-300"
					>
						Accueil
					</Link>
				</div>
			</div>
		</div>
	);
}
