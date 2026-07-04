"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TitleSection } from "@/components/TitleSection";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
	faBullseyePointer,
	faListCheck,
	faHeadSideBrain,
	faCheck,
	faHandBackPointRight,
	faCircleInfo,
	faScreenUsers,
	faStairs,
	faGraduationCap,
	faPersonChalkboard,
	faUsersMedical,
	faCalendarClock,
	faCircleEuro,
	faUniversalAccess,
} from "@fortawesome/pro-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import starOrange from "@/_images/logo/star_orange.svg";
import CatalogueCtaSection from "@/components/sections/CatalogueCtaSection";
import type { Training } from "@/lib/api";
import { DEFAULT_ACCESSIBILITY } from "@/lib/api";

interface TrainingClientProps {
	id?: string;
	initialTraining?: Training | null;
}

export default function TrainingClient({ id = "", initialTraining = null }: TrainingClientProps) {
	const trainingId = id;
	const [trainingData, setTrainingData] = useState<Training | null>(initialTraining);
	const [isLoading, setIsLoading] = useState(!initialTraining);

	// Fetch training seulement si pas déjà chargée (fallback pour pages non pré-générées)
	const fetchtrainingData = useCallback(async () => {
		if (initialTraining || !trainingId) return; // Pas besoin de fetch si données déjà présentes

		setIsLoading(true);
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trainings/by-id/${trainingId}`);
			if (response.status === 200) {
				setTrainingData(response.data);
			}
		} catch (error) {
			console.error("Erreur lors de la récupération de la formation :", error);
		} finally {
			setIsLoading(false);
		}
	}, [trainingId, initialTraining]);

	useEffect(() => {
		// Si on a des données initiales, pas besoin de fetch
		if (initialTraining) {
			setIsLoading(false);
			return;
		}

		fetchtrainingData();
		return () => setTrainingData(null);
	}, [fetchtrainingData, initialTraining]);

	return (
		<div className="bg-support px-6 pt-8 lg:px-8 text-sm sm:text-base text-pretty min-h-full">
			{isLoading || !trainingData ? (
				<div className="col-start-2 row-start-2 flex justify-center items-center w-full min-h-[400px]">
					<Spin indicator={<LoadingOutlined spin />} size="large" className="text-cohesion" />
				</div>
			) : (
				<>
					<div className="mx-auto max-w-3xl text-univers mb-10">
						<TitleSection tag={trainingData?.theme} title={trainingData?.title} paddingSide={false} noPaddingVertical />
						{trainingData?.introduction && (
							<p className="mt-6 text-base sm:text-lg leading-relaxed text-univers/90">{trainingData.introduction}</p>
						)}
						<div>
							<h2 className="mt-10 mb-5 text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-x-2">
								<FontAwesomeIcon icon={faBullseyePointer} /> Objectifs pédagogiques
							</h2>
							{trainingData?.pedagogical_objectives.map((el: string, index: number) => (
								<div key={index} className="flex mb-2">
									<Image
										aria-hidden="true"
										src={starOrange}
										alt="Logo Ipseis"
										title="Logo Ipseis"
										width={40}
										height={40}
										className="h-10 w-10 flex-none -mt-2.5"
									/>
									<span>{el}</span>
								</div>
							))}
						</div>
						<div>
							<h2 className="mt-10 mb-5 text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-x-2">
								<FontAwesomeIcon icon={faListCheck} /> Programme
							</h2>
							{trainingData?.program.map((el: string, index: number) => (
								<div key={index} className="flex mb-2">
									<div className="h-10 min-w-10 flex justify-center text-cohesion">
										<FontAwesomeIcon icon={faCheck} className="flex-none mt-1" />
									</div>
									<span>{el}</span>
								</div>
							))}
						</div>
						<div>
							<h2 className="mt-10 mb-5 text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-x-2">
								<FontAwesomeIcon icon={faHeadSideBrain} /> Méthodes pédagogiques
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{trainingData?.pedagogical_methods.map((el: string, index: number) => (
									<div key={index} className="flex rounded-lg p-0 sm:p-2 mb-2 sm:mb-0">
										<div className="h-10 min-w-10 flex justify-center text-cohesion">
											<FontAwesomeIcon icon={faHandBackPointRight} className="flex-none mt-1" />
										</div>
										<span>{el}</span>
									</div>
								))}
							</div>
						</div>
						<div>
							<h2 className="mt-10 mb-3 sm:mb-5 text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-x-2">
								<FontAwesomeIcon icon={faCircleInfo} /> Infos pratiques
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2 col-span-full">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faGraduationCap} className="flex-none" />
										</div>
										<h3 className="font-semibold">Méthodes d'évaluation</h3>
									</div>
									{[
										...(trainingData?.evaluation_methods ?? []),
										// Garantit la présence de l'évaluation de la satisfaction (exigence Qualiopi).
										...(trainingData?.evaluation_methods?.some((m) => /satisfaction/i.test(m))
											? []
											: ["Évaluation de la satisfaction"]),
									].map((el: string, index: number) => (
										<div key={index} className="flex">
											<div className="h-10 min-w-10 flex justify-center">
												<FontAwesomeIcon icon={faCheck} className="flex-none mt-1" />
											</div>
											<span>{el}</span>
										</div>
									))}
									<Link
										href="/glossaire"
										className="ml-3 mt-1 inline-flex w-fit text-sm font-semibold text-cohesion underline underline-offset-4 hover:text-univers transition-colors"
									>
										Consulter le glossaire
									</Link>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faScreenUsers} className="flex-none" />
										</div>
										<h3 className="font-semibold">Public</h3>
									</div>
									<span className="flex items-center ml-3">{trainingData?.audience}</span>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faStairs} className="flex-none" />
										</div>
										<h3 className="font-semibold">Prérequis</h3>
									</div>
									<span className="flex items-center ml-3">{trainingData?.prerequisites}</span>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faPersonChalkboard} className="flex-none" />
										</div>
										<h3 className="font-semibold">Intervenant</h3>
									</div>
									<span className="flex items-center ml-3">{trainingData?.trainer}</span>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faUsersMedical} className="flex-none" />
										</div>
										<h3 className="font-semibold">Capacité</h3>
									</div>
									<span className="flex items-center ml-3">{trainingData?.number_of_trainees}</span>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faCalendarClock} className="flex-none" />
										</div>
										<h3 className="font-semibold">Durée</h3>
									</div>
									<span className="flex items-center ml-3">{trainingData?.duration}</span>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faCircleEuro} className="flex-none" />
										</div>
										<h3 className="font-semibold">Tarification</h3>
									</div>
									<span className="flex items-center ml-3">Devis {trainingData?.quote}</span>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2 col-span-full">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faUniversalAccess} className="flex-none" />
										</div>
										<h3 className="font-semibold">Accessibilité Handicap</h3>
									</div>
									<span className="flex items-start ml-3">{trainingData?.accessibility || DEFAULT_ACCESSIBILITY}</span>
								</div>
							</div>
						</div>
					</div>
					{/* <Divider /> */}
					<div className="mx-auto max-w-3xl">
						<CatalogueCtaSection
							title="Vous souhaitez en savoir plus ou nous contacter ?"
							description="Téléchargez notre catalogue PDF complet avec toutes les formations détaillées, les modalités et les tarifs."
						/>
					</div>
				</>
			)}
		</div>
	);
}
