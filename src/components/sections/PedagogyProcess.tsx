import React from "react";
import Image from "next/image";
import { FeatureBox } from "@/components/FeatureBox";
import { TitleSection } from "@/components/TitleSection";
import starOrange from "@/_images/logo/star_orange.svg";

export const PedagogyProcessSection = () => {
	return (
		<>
			<TitleSection tag="Des formations adaptées et optimisées" title="Une démarche d'élaboration de projet efficace, fluide, collaborative et de proximité" />
			<div className="pb-10 mx-auto max-w-7xl px-6 lg:px-8 tracking-wider sm:mt-24 sm:mb-24">
				<div className="mx-auto max-w-5xl">
					<div className="relative grid grid-cols-1 gap-4 sm:gap-2 sm:[grid-template-columns:0.9fr_1fr_0.9fr] sm:[grid-template-rows:0.9fr_1fr_0.9fr] place-items-stretch">
						<div className="sm:col-start-2 sm:row-start-1 sm:-translate-y-24">
							<FeatureBox
								lighter
								description={
									<div className="relative pl-10">
										<span className="absolute left-0 -top-[12px]">
											<Image
												src="/images/objectifs_peda/1.png"
												alt="Check"
												width={40}
												height={40}
												className="w-11 h-11 flex-shrink-0 object-contain align-top"
											/>
										</span>
										<p className="font-bold">Analyse efficace de vos besoins & du contexte</p>
									</div>
								}
								bgColor="support"
								centered
							/>
						</div>

						<div className="sm:col-start-3 sm:row-start-1 sm:translate-y-14">
							<FeatureBox
								lighter
								description={
									<div className="relative pl-10">
										<span className="absolute left-0 -top-[12px]">
											<Image
												src="/images/objectifs_peda/2.png"
												alt="Check"
												width={40}
												height={40}
												className="w-11 h-11 flex-shrink-0 object-contain align-top"
											/>
										</span>
										<p className="font-bold">Proposition détaillée avec objectifs pédagogiques validés</p>
									</div>
								}
								bgColor="support"
								centered
							/>
						</div>

						<div className="sm:col-start-3 sm:row-start-2 sm:-translate-x-2 sm:translate-y-14">
							<FeatureBox
								lighter
								description={
									<div className="relative pl-10">
										<span className="absolute left-0 -top-[12px]">
											<Image
												src="/images/objectifs_peda/3.png"
												alt="Check"
												width={40}
												height={40}
												className="w-11 h-11 flex-shrink-0 object-contain align-top"
											/>
										</span>
										<p className="font-bold">Questionnaire de pré-formation envoyé aux apprenants</p>
									</div>
								}
								bgColor="support"
								centered
							/>
						</div>

						<div className="sm:col-start-3 sm:row-start-3 sm:-translate-x-24 md:-translate-x-32 lg:-translate-x-36 sm:translate-y-14">
							<FeatureBox
								lighter
								description={
									<div className="relative pl-10">
										<span className="absolute left-0 -top-[12px]">
											<Image
												src="/images/objectifs_peda/4.png"
												alt="Check"
												width={40}
												height={40}
												className="w-11 h-11 flex-shrink-0 object-contain align-top"
											/>
										</span>
										<p className="font-bold">Envoi d'une fiche pédagogique + informations pratiques</p>
									</div>
								}
								bgColor="support"
								centered
							/>
						</div>

						<div className="sm:col-start-1 sm:row-start-3 sm:translate-x-24 md:translate-x-32 lg:translate-x-36 sm:translate-y-14">
							<FeatureBox
								lighter
								description={
									<div className="relative pl-10">
										<span className="absolute left-0 -top-[12px]">
											<Image
												src="/images/objectifs_peda/5.png"
												alt="Check"
												width={40}
												height={40}
												className="w-11 h-11 flex-shrink-0 object-contain align-top"
											/>
										</span>
										<p className="font-bold">Formation active et immersive</p>
									</div>
								}
								bgColor="support"
								centered
							/>
						</div>

						<div className="sm:col-start-1 sm:row-start-2 sm:translate-x-2 sm:translate-y-14">
							<FeatureBox
								lighter
								description={
									<div className="relative pl-10">
										<span className="absolute left-0 -top-[12px]">
											<Image
												src="/images/objectifs_peda/6.png"
												alt="Check"
												width={40}
												height={40}
												className="w-11 h-11 flex-shrink-0 object-contain align-top"
											/>
										</span>
										<p className="font-bold">Questionnaire post-formation</p>
									</div>
								}
								bgColor="support"
								centered
							/>
						</div>

						<div className="sm:col-start-1 sm:row-start-1 sm:translate-y-14">
							<FeatureBox
								lighter
								description={
									<div className="relative pl-10">
										<span className="absolute left-0 -top-[12px]">
											<Image
												src="/images/objectifs_peda/7.png"
												alt="Check"
												width={40}
												height={40}
												className="w-11 h-11 flex-shrink-0 object-contain align-top"
											/>
										</span>
										<p className="font-bold">Débrief entre IPSEIS et la structure</p>
									</div>
								}
								bgColor="support"
								centered
							/>
						</div>

						<div className="sm:col-start-2 sm:row-start-2 justify-center items-center relative z-10 hidden sm:flex">
							<div className="absolute z-20 sm:-mt-8 sm:-mb-8 sm:-mx-6">
								<Image src={starOrange} alt="Image de l'étoile d'Ipseis" width={48} height={48} className="w-96 h-96" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
