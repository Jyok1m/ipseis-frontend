"use client";

import React, { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Modal, Spin } from "antd";
import clsx from "clsx";
import Image from "next/image";
import starOrange from "@/_images/logo/star_orange.svg";
import type { Theme, ThemeWithTrainings } from "@/lib/types";

/** Thématique du catalogue, formations incluses. */
type CatalogueTheme = Theme & ThemeWithTrainings;

/** Un thème relève du secteur santé si son type mentionne « santé », sinon il est transversal. */
const isSante = (theme: Theme) => /sant/i.test(theme.type || "");

/**
 * Diamètre des bulles, partagé avec la pastille « bientôt » pour aligner les
 * colonnes. Fluide en dessous de sm : 40vw garantit deux bulles par ligne même
 * sur un écran de 320 px (2 × 128 + 16 de gouttière = 272 pour 280 utiles),
 * tout en laissant grandir jusqu'à 9.5rem sur les téléphones larges.
 */
const BUBBLE_SIZE = "w-[min(9.5rem,40vw)] sm:w-[9.75rem] lg:w-[10.5rem]";

const ThemeBubble = memo(({ theme, onClick }: { theme: CatalogueTheme; onClick: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className={clsx(
			BUBBLE_SIZE,
			"flex aspect-1 cursor-pointer items-center justify-center rounded-full bg-support px-3 shadow-lg ring-2 ring-cohesion/30 transition duration-300 sm:px-4",
			"hover:scale-105 hover:shadow-xl hover:ring-cohesion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cohesion"
		)}
	>
		<span className="text-balance text-center text-[0.8rem] font-semibold leading-snug text-univers sm:text-sm lg:text-base">{theme.title}</span>
	</button>
));
ThemeBubble.displayName = "ThemeBubble";

/**
 * Occupe la place d'une bulle quand une colonne n'a pas encore de thématique.
 * Sans elle, la colonne se réduisait à un paragraphe gris flottant dans le vide
 * et les deux moitiés du catalogue n'avaient plus rien de comparable.
 */
function EmptyThemePlaceholder() {
	return (
		<div className="flex flex-col items-center gap-5">
			<div
				className={clsx(
					BUBBLE_SIZE,
					"flex aspect-1 items-center justify-center rounded-full border-2 border-dashed border-cohesion/35 bg-support/40"
				)}
			>
				<Image src={starOrange} alt="" aria-hidden className="h-10 w-10 opacity-50 lg:h-12 lg:w-12" />
			</div>
			<p className="max-w-[17rem] text-pretty text-center text-sm text-univers/60 lg:text-base">
				Catalogue en cours d’enrichissement. De nouvelles thématiques seront bientôt disponibles.
			</p>
		</div>
	);
}

function ThemeColumn({ title, themes, onSelect }: { title: string; themes: CatalogueTheme[]; onSelect: (theme: CatalogueTheme) => void }) {
	return (
		<div className="flex flex-col items-center">
			<h2 className="mb-6 text-center text-base font-bold uppercase tracking-wider text-univers sm:mb-8 sm:text-xl lg:text-2xl">{title}</h2>

			{/* La largeur maximale force deux bulles par ligne : flex-wrap centre
			    alors la dernière ligne, au lieu du 3 + 1 orphelin d'avant. */}
			<div className="flex max-w-[19.5rem] flex-wrap items-center justify-center gap-4 sm:max-w-[21.5rem] sm:gap-6">
				{themes.length > 0 ? (
					themes.map((theme) => <ThemeBubble key={theme._id} theme={theme} onClick={() => onSelect(theme)} />)
				) : (
					<EmptyThemePlaceholder />
				)}
			</div>
		</div>
	);
}

/**
 * Le catalogue complet (thèmes + formations) est rendu par le serveur en ISR.
 *
 * Avant, ce composant refetchait les thèmes au montage alors qu'ils étaient
 * déjà dans les props, puis faisait un GET /trainings/by-theme à chaque
 * ouverture de modale. Les deux ont disparu : l'ouverture est instantanée.
 */
export default function CatalogueClient({ themes }: { themes: CatalogueTheme[] }) {
	const router = useRouter();
	const [selectedTheme, setSelectedTheme] = useState<CatalogueTheme | null>(null);
	const [routingId, setRoutingId] = useState<string | null>(null);

	const handleRouting = (trainingId: string) => {
		setRoutingId(trainingId);
		router.push(`/catalogue/formation/${trainingId}`);
	};

	const handleClose = () => {
		setSelectedTheme(null);
		setRoutingId(null);
	};

	const transversalThemes = themes.filter((t) => !isSante(t));
	const santeThemes = themes.filter(isSante);

	return (
		<>
			{/* Séparation par un filet plutôt que par un grand vide : trait horizontal
			    entre les deux sections sur mobile, vertical entre les colonnes à partir
			    de lg. L'espacement vient du padding des colonnes, pas d'un gap qui
			    décrocherait le filet du contenu. */}
			<div className="mx-auto mt-2 max-w-7xl px-5 pb-12 sm:mt-4 sm:px-6 sm:pb-16 lg:px-8">
				<div className="grid grid-cols-1 divide-y divide-univers/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0 lg:divide-univers/15">
					<div className="pb-10 lg:pb-0 lg:pr-10">
						<ThemeColumn title="Professionnels de la santé" themes={santeThemes} onSelect={setSelectedTheme} />
					</div>
					<div className="pt-10 lg:pl-10 lg:pt-0">
						<ThemeColumn title="Formations transversales" themes={transversalThemes} onSelect={setSelectedTheme} />
					</div>
				</div>
			</div>

			<ConfigProvider
				theme={{
					components: { Modal: { titleFontSize: 18, titleColor: "#263c27", headerBg: "#fffce8", contentBg: "#fffce8" } },
					token: { fontFamily: "Halibut" },
				}}
			>
				<Modal
					title={`Thématique : ${selectedTheme?.title ?? ""}`}
					centered
					open={!!selectedTheme}
					footer={null}
					width="min(600px, 95vw)"
					onCancel={handleClose}
				>
					{/* Pas d'aspect-1 : des tuiles carrées de 250 px pour deux lignes de
					    texte laissaient un vide énorme au centre de chacune. Et une seule
					    formation reste sur une colonne, plutôt que d'occuper la moitié
					    gauche d'une grille en deux colonnes. */}
					<div
						className={clsx(
							"mx-auto grid gap-3 py-3 sm:gap-4 sm:py-4",
							(selectedTheme?.trainings.length ?? 0) > 1 ? "sm:grid-cols-2" : "max-w-sm"
						)}
					>
						{selectedTheme?.trainings.map((training) => {
							const isLoadingThis = routingId === training._id;
							return (
								<button
									key={training._id}
									type="button"
									onClick={!isLoadingThis ? () => handleRouting(training._id) : undefined}
									disabled={isLoadingThis}
									className={clsx(
										"relative flex min-h-[4.75rem] items-center justify-center rounded-xl bg-support px-4 py-5 text-center ring-2 ring-cohesion/30 transition duration-200",
										isLoadingThis ? "cursor-wait" : "cursor-pointer hover:bg-cohesion/5 hover:ring-cohesion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cohesion"
									)}
								>
									<span
										className={clsx(
											"text-balance text-sm font-semibold leading-snug text-univers sm:text-base",
											isLoadingThis && "opacity-30"
										)}
									>
										{training.title}
									</span>
									{isLoadingThis && (
										<span className="absolute inset-0 flex items-center justify-center">
											<Spin indicator={<LoadingOutlined spin />} size="default" className="text-cohesion" />
										</span>
									)}
								</button>
							);
						})}
					</div>
				</Modal>
			</ConfigProvider>
		</>
	);
}
