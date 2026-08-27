"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TitleSection } from "@/components/TitleSection";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
	faBullseye,
	faListCheck,
	faBrain,
	faCheck,
	faHandPointRight,
	faCircleInfo,
	faUsers,
	faStairs,
	faGraduationCap,
	faPersonChalkboard,
	faUserDoctor,
	faCalendarDays,
	faEuroSign,
	faUniversalAccess,
	faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import starOrange from "@/_images/logo/star_orange.svg";
import type { Training } from "@/lib/api";
import { DEFAULT_ACCESSIBILITY } from "@/lib/api";
import { MODALITIES } from "@/lib/trainingModalities";

/**
 * Liste à puces iconographiées.
 *
 * Chaque ligne encadrait son icône dans une boîte de 40×40 (h-10 min-w-10) pour
 * un glyphe de 14 px : c'est cette boîte qui imposait une hauteur de ligne de
 * 40 px et un retrait aussi large, d'où l'impression d'items flottant loin les
 * uns des autres. L'icône est désormais dimensionnée à sa taille réelle et
 * l'espacement vient d'un gap, réglable au même endroit pour les quatre listes.
 */
function IconList({
	items,
	icon,
	className,
	itemClassName,
}: {
	items: string[];
	icon: React.ReactNode;
	className?: string;
	itemClassName?: string;
}) {
	return (
		<ul className={className ?? "space-y-2"}>
			{items.map((item, index) => (
				<li key={index} className={`flex items-start gap-2.5 ${itemClassName ?? ""}`}>
					<span className="mt-[0.3em] flex-none text-cohesion" aria-hidden="true">
						{icon}
					</span>
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}

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
		<div className="bg-support px-5 pt-5 sm:px-6 sm:pt-8 lg:px-8 text-sm sm:text-base text-pretty min-h-full">
			{isLoading || !trainingData ? (
				<div className="col-start-2 row-start-2 flex justify-center items-center w-full min-h-[400px]">
					<Spin indicator={<LoadingOutlined spin />} size="large" className="text-cohesion" />
				</div>
			) : (
				<>
					<div className="mx-auto max-w-4xl text-univers mb-10">
						<TitleSection tag={trainingData?.theme} title={trainingData?.title} titleAs="h1" paddingSide={false} noPaddingVertical />
						{/* La fiche est proposée juste sous le titre : c'est le document
						    qu'un responsable formation transmet en interne, il doit être
						    atteignable sans parcourir toute la page. Le PDF est généré à la
						    volée depuis ces mêmes données (cf. ./fiche/route.ts). */}
						<a
							href={`/catalogue/formation/${trainingData._id}/fiche`}
							className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cohesion px-3.5 py-2 text-sm font-semibold text-cohesion transition-colors hover:bg-cohesion hover:text-support sm:text-base"
						>
							<FontAwesomeIcon icon={faFilePdf} className="h-4 w-4" />
							Télécharger la fiche programme (PDF)
						</a>
						{trainingData?.introduction && (
							<p className="mt-4 text-base leading-relaxed text-univers/90 sm:mt-6 sm:text-lg">{trainingData.introduction}</p>
						)}
						<div>
							<h2 className="mt-10 mb-5 text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-x-2">
								<FontAwesomeIcon icon={faBullseye} /> Objectifs pédagogiques
							</h2>
							<IconList
								items={trainingData?.pedagogical_objectives ?? []}
								icon={<Image src={starOrange} alt="" width={20} height={20} className="h-5 w-5" />}
							/>
						</div>
						<div>
							<h2 className="mt-10 mb-5 text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-x-2">
								<FontAwesomeIcon icon={faListCheck} /> Programme
							</h2>
							<IconList items={trainingData?.program ?? []} icon={<FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5" />} />
						</div>
						<div>
							<h2 className="mt-10 mb-5 text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-x-2">
								<FontAwesomeIcon icon={faBrain} /> Méthodes pédagogiques
							</h2>
							<IconList
								items={trainingData?.pedagogical_methods ?? []}
								icon={<FontAwesomeIcon icon={faHandPointRight} className="h-4 w-4" />}
								className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2"
							/>
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
									<IconList
										items={[
										...(trainingData?.evaluation_methods ?? []),
										// Garantit la présence de l'évaluation de la satisfaction (exigence Qualiopi).
										...(trainingData?.evaluation_methods?.some((m) => /satisfaction/i.test(m))
											? []
											: ["Évaluation de la satisfaction"]),
									]}
										icon={<FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5" />}
										className="mt-1 space-y-1.5 ml-1"
									/>
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
											<FontAwesomeIcon icon={faUsers} className="flex-none" />
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
											<FontAwesomeIcon icon={faUserDoctor} className="flex-none" />
										</div>
										<h3 className="font-semibold">Nombre de participants</h3>
									</div>
									{/* IPSEIS ne commercialise pas encore d'Inter, mais la modalité
									    doit apparaître : une fiche muette sur ce point laisse croire
									    que seul l'Intra existe. */}
									<dl className="ml-3 space-y-0.5">
										<div className="flex items-baseline gap-x-1.5">
											<dt className="shrink-0 font-semibold">{MODALITIES.intraLabel}&nbsp;:</dt>
											<dd>{trainingData?.number_of_trainees}</dd>
										</div>
										<div className="flex items-baseline gap-x-1.5">
											<dt className="shrink-0 font-semibold">{MODALITIES.interLabel}&nbsp;:</dt>
											<dd>{MODALITIES.interCapacity}</dd>
										</div>
									</dl>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faCalendarDays} className="flex-none" />
										</div>
										<h3 className="font-semibold">Durée</h3>
									</div>
									<span className="flex items-center ml-3">{trainingData?.duration}</span>
								</div>
								<div className="flex flex-col gap-x-3 ring-0 sm:ring-1 ring-cohesion rounded-lg p-0 sm:p-2">
									<div className="flex items-center">
										<div className="h-10 min-w-10 flex items-center justify-center text-cohesion">
											<FontAwesomeIcon icon={faEuroSign} className="flex-none" />
										</div>
										<h3 className="font-semibold">Tarification</h3>
									</div>
									<dl className="ml-3 space-y-0.5">
										<div className="flex items-baseline gap-x-1.5">
											<dt className="shrink-0 font-semibold">{MODALITIES.intraLabel}&nbsp;:</dt>
											<dd>{trainingData?.quote}</dd>
										</div>
										<div className="flex items-baseline gap-x-1.5">
											<dt className="shrink-0 font-semibold">{MODALITIES.interLabel}&nbsp;:</dt>
											<dd>{MODALITIES.interQuote}</dd>
										</div>
									</dl>
									<p className="ml-3 mt-1.5 text-xs text-univers/70 sm:text-sm">{MODALITIES.priceNote}</p>
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
					{/* Le renvoi vers le catalogue PDF a disparu d'ici : il proposait un
					    téléchargement qui n'existe pas encore, et Hélène le réserve à
					    l'onglet Formations. Reste ce qu'un visiteur cherche au bas d'une
					    fiche : demander un devis, ou repartir explorer. */}
					<div className="mx-auto mb-16 mt-10 max-w-4xl rounded-2xl border border-cohesion px-6 py-8 text-center">
						<h2 className="text-xl font-bold text-univers sm:text-2xl">Cette formation vous intéresse ?</h2>
						<p className="mx-auto mt-3 max-w-2xl text-base text-univers/80 sm:text-lg">
							Nous construisons chaque intervention avec vous. Demandez un devis ou posez-nous vos questions : nous vous répondons
							sous 72 heures.
						</p>
						<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link
								href="/contact"
								className="inline-flex w-full items-center justify-center rounded-lg bg-cohesion px-4 py-2.5 font-semibold text-support transition-colors hover:bg-cohesion/90 sm:w-auto"
							>
								Demander un devis
							</Link>
							<Link
								href="/formations"
								className="inline-flex w-full items-center justify-center rounded-lg border border-univers/30 px-4 py-2.5 font-semibold text-univers transition-colors hover:bg-univers hover:text-support sm:w-auto"
							>
								Voir toutes nos formations
							</Link>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
