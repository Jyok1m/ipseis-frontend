"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal, ConfigProvider, Spin } from "antd";
import clsx from "clsx";
import axios from "axios";
import { getThemes } from "@/lib/api";
import type { Theme } from "@/lib/api";

interface CatalogueClientProps {
	initialThemes?: Theme[];
}

// Un thème relève du secteur santé si son type mentionne « santé », sinon il est transversal.
const isSante = (theme: Theme) => /sant/i.test(theme.type || "");

const ThemeBubble = memo(({ theme, loading, onClick }: { theme?: Theme; loading?: boolean; onClick?: () => void }) => {
	return (
		<div
			onClick={onClick}
			className={clsx(
				"flex justify-center items-center aspect-1 w-[130px] sm:w-[160px] ring-2 ring-cohesion/30 rounded-full shadow-2xl p-3 duration-500",
				loading ? "cursor-wait" : "cursor-pointer hover:ring-cohesion hover:transform hover:scale-110"
			)}
		>
			{loading ? (
				<Spin indicator={<LoadingOutlined spin />} size="large" className="text-cohesion" />
			) : (
				<h2 className="text-univers text-xs sm:text-base font-semibold text-center">{theme?.title}</h2>
			)}
		</div>
	);
});
ThemeBubble.displayName = "ThemeBubble";

function ThemeColumn({
	title,
	themes,
	loading,
	onSelect,
}: {
	title: string;
	themes: Theme[];
	loading: boolean;
	onSelect: (theme: Theme) => void;
}) {
	return (
		<div className="flex flex-col items-center">
			<h2 className="text-lg sm:text-2xl font-bold text-univers text-center mb-8 uppercase tracking-wider">{title}</h2>
			<div className="flex flex-wrap justify-center gap-5 sm:gap-6">
				{loading ? (
					[0, 1, 2, 3].map((i) => <ThemeBubble key={i} loading />)
				) : themes.length > 0 ? (
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

export default function CatalogueClient({ initialThemes = [] }: CatalogueClientProps) {
	const router = useRouter();
	const [themesLoading, setThemesLoading] = useState(!initialThemes.length);
	const [routingLoading, setRoutingLoading] = useState<string | null>(null);
	const [themes, setThemes] = useState<Theme[]>(initialThemes);
	const [catalogue, setCatalogue] = useState<any[]>([]);
	const [selectedTheme, setSelectedTheme] = useState("");
	const [catalogueModalOpen, setCatalogueModalOpen] = useState(false);

	// Fetch themes seulement si pas déjà chargés (fallback)
	const fetchThemes = useCallback(async () => {
		if (initialThemes.length > 0) return; // Pas besoin de fetch si données déjà présentes

		try {
			const data = await getThemes();
			setThemes(data);
		} catch (error) {
			console.error("Erreur lors de la récupération des thématiques :", error);
		}
	}, [initialThemes.length]);

	useEffect(() => {
		if (initialThemes.length > 0) {
			setThemesLoading(false);
			return;
		}

		fetchThemes();
		return () => {
			setThemes([]);
			setCatalogue([]);
			setSelectedTheme("");
			setCatalogueModalOpen(false);
			setRoutingLoading(null);
		};
	}, [fetchThemes, initialThemes.length]);

	useEffect(() => {
		if (themes.length > 0) setThemesLoading(false);
	}, [themes]);

	useEffect(() => {
		if (catalogue.length > 0 && selectedTheme !== "") setCatalogueModalOpen(true);
	}, [catalogue, selectedTheme]);

	const fetchCatalogue = useCallback(async (themeId: string, themeTitle: string) => {
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trainings/by-theme/${themeId}`);
			if (response.status === 200) {
				setCatalogue(response.data);
				setSelectedTheme(themeTitle);
			}
		} catch (error) {
			console.error("Erreur lors de la récupération du catalogue :", error);
		}
	}, []);

	const handleModalClose = () => {
		setCatalogueModalOpen(false);
		setSelectedTheme("");
		setCatalogue([]);
		setRoutingLoading(null);
	};

	const handleRouting = (trainingId: string) => {
		setRoutingLoading(trainingId);
		router.push(`/catalogue/formation/${trainingId}`);
	};

	const onSelect = (theme: Theme) => fetchCatalogue(theme._id, theme.title);

	const transversalThemes = themes.filter((t) => !isSante(t));
	const santeThemes = themes.filter(isSante);

	return (
		<>
			<div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 lg:divide-x lg:divide-univers/15">
					<div className="lg:pr-8">
						<ThemeColumn title="Formations transversales" themes={transversalThemes} loading={themesLoading} onSelect={onSelect} />
					</div>
					<div className="lg:pl-8">
						<ThemeColumn title="Professionnels de la santé" themes={santeThemes} loading={themesLoading} onSelect={onSelect} />
					</div>
				</div>
			</div>
			<ConfigProvider
				theme={{
					components: {
						Modal: {
							titleFontSize: 18,
							titleColor: "#263c27",
							headerBg: "#fffce8",
							contentBg: "#fffce8",
						},
					},
					token: { fontFamily: "Halibut" },
				}}
			>
				<Modal title={`Thématique : ${selectedTheme}`} centered open={catalogueModalOpen} footer={null} width="min(600px, 95vw)" onCancel={handleModalClose}>
					<div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-5 items-center justify-center max-w-[500px] mx-auto py-5">
						{catalogue.map((training: any) => {
							const isLoadingThis = routingLoading === training._id;
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
