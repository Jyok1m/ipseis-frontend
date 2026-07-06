import React from "react";
import TitlePage from "@/components/global/TitlePage";
import ContactForm from "@/components/home/ContactForm";
import JsonLd from "@/components/utils/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/components/utils/seo";

export const metadata: Metadata = buildMetadata({
	title: "Contact IPSEIS - Demande d'information & devis",
	description: "Contactez IPSEIS pour toute question sur nos formations santé et médico-social : informations, devis, accompagnement personnalisé.",
	path: "/contact",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Contact", path: "/contact" }]);

export default function Contact() {
	return (
		<div className="bg-support min-h-full flex flex-col items-center pb-10">
			<JsonLd data={breadcrumbJsonLd} />
			<TitlePage
				title="Formulaire de contact"
				descriptionNode={
					<>
						Si vous souhaitez en savoir plus sur nos formations, nos tarifs ou nos disponibilités, n'hésitez pas à nous contacter via le formulaire
						ci-dessous.
					</>
				}
			/>
			<ContactForm />
		</div>
	);
}
