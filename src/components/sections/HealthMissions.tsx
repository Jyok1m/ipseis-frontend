import React from "react";
import { FeatureBox } from "@/components/FeatureBox";
import { TitleSection } from "@/components/TitleSection";

export const HealthMissionSection = () => {
	return (
		<>
			<TitleSection tag="Nos missions" title="Agir, transmettre, transformer, engager vos équipes" />
			<div className="pb-10 mx-auto max-w-4xl px-6 lg:px-8 tracking-wider">
				{/* 3x3 grid where five cards sit like a die face (1,1  -  1,3  -  2,2  -  3,1  -  3,3) */}
				<div className="mx-auto max-w-4xl">
					<div className="relative grid grid-cols-1 gap-4 sm:gap-0 sm:grid-cols-3 sm:grid-rows-3">
						{/* top-left */}
						<div className="sm:col-start-1 sm:row-start-1">
							<FeatureBox
								title="Transmettre par l’expérimentation"
								description="Innover avec des espaces de co-apprentissage dynamiques, et des dispositifs comme les SEGAPTM « Serious escape games pédagogiques »."
								bgColor="support"
								centered
							/>
						</div>
						{/* top-right */}
						<div className="sm:col-start-3 sm:row-start-1">
							<FeatureBox
								title="Renforcer les compétences"
								description="Proposer des parcours exigeants, immersifs et collectifs, qui renforcent autonomie, intelligence collective et transversalité."
								bgColor="support"
								centered
							/>
						</div>
						{/* center */}
						<div className="sm:col-start-2 sm:row-start-2 flex justify-center">
							<div className="relative z-20 sm:-my-8 sm:-mx-6 flex items-center justify-center">
								<FeatureBox
									title="Former autrement"
									description="Concevoir et animer des formations actives, engageantes et sur-mesure, centrées sur le réel et pour une performance respectueuse."
									bgColor="maitrise"
									className="p-6 sm:h-[320px]"
									centered
								/>
							</div>
						</div>
						{/* bottom-left */}
						<div className="sm:col-start-1 sm:row-start-3">
							<FeatureBox
								title="Transformer les pratiques"
								description="Accompagner les professionnels vers plus d’efficacité, de confiance et de bien-être au travail."
								bgColor="support"
								centered
							/>
						</div>
						{/* bottom-right */}
						<div className="sm:col-start-3 sm:row-start-3">
							<FeatureBox
								title="Garantir l’excellence"
								description="S’appuyer sur une démarche qualité continue, certifiée et reconnue."
								bgColor="support"
								centered
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
