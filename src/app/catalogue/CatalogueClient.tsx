"use client";

import React, { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Modal, Spin } from "antd";
import clsx from "clsx";
import type { Theme, ThemeWithTrainings } from "@/lib/types";

/** Un thème relève du secteur santé si son type mentionne « santé », sinon il est transversal. */
const isSante = (theme: Theme) => /sant/i.test(theme.type || "");

const ThemeBubble = memo(({ theme, onClick }: { theme: Theme; onClick: () => void }) => (
	<div
		onClick={onClick}
		className="flex justify-center items-center aspect-1 w-[130px] sm:w-[160px] ring-2 ring-cohesion/30 rounded-full shadow-2xl p-3 duration-500 cursor-pointer hover:ring-cohesion hover:transform hover:scale-110"
	>
		<h2 className="text-univers text-xs sm:text-base font-semibold text-center">{theme.title}</h2>
	</div>
));
ThemeBubble.displayName = "ThemeBubble";

function ThemeColumn({ title, themes, onSelect }: { title: string; themes: Theme[]; onSelect: (theme: Theme) => void }) {
	return (
		<div className="flex flex-col items-center">
			<h2 className="text-lg sm:text-2xl font-bold text-univers text-center mb-8 uppercase tracking-wider">{title}</h2>
			<div className="flex flex-wrap justify-center gap-5 sm:gap-6 mb-20">
				{themes.length > 0 ? (
					themes.map((theme) => <ThemeBubble key={theme._id} theme={theme} onClick={() => onSelect(theme)} />)
				) : (
					<p className="text-sm sm:text-base text-univers/60 text-center max-w-xs py-8">
						Catalogue en cours d’enrichissement. De nouvelles thématiques seront bientôt disponibles.
					</p>
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
export default function CatalogueClient({ themes }: { themes: Array<Theme & ThemeWithTrainings> }) {
	const router = useRouter();
	const [selectedTheme, setSelectedTheme] = useState<(Theme & ThemeWithTrainings) | null>(null);
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
			<div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 lg:divide-x lg:divide-univers/15">
					<div className="lg:pr-8">
						<ThemeColumn title="Formations transversales" themes={transversalThemes} onSelect={setSelectedTheme} />
					</div>
					<div className="lg:pl-8">
						<ThemeColumn title="Professionnels de la santé" themes={santeThemes} onSelect={setSelectedTheme} />
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
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center justify-center max-w-[500px] mx-auto py-5">
						{selectedTheme?.trainings.map((training) => {
							const isLoadingThis = routingId === training._id;
							return (
								<div
									key={training._id}
									onClick={!isLoadingThis ? () => handleRouting(training._id) : undefined}
									className={clsx(
										"relative flex justify-center items-center aspect-1 ring-2 ring-cohesion/30 rounded-xl shadow-2xl p-2 duration-500",
										isLoadingThis ? "cursor-wait" : "hover:ring-cohesion cursor-pointer hover:transform hover:scale-105"
									)}
								>
									<p className={clsx("text-wrap text-center text-univers text-xs sm:text-base font-semibold", isLoadingThis ? "opacity-30" : "")}>
										{training.title}
									</p>
									{isLoadingThis && (
										<div className="absolute inset-0 flex justify-center items-center">
											<Spin indicator={<LoadingOutlined spin />} size="default" className="text-cohesion" />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</Modal>
			</ConfigProvider>
		</>
	);
}
