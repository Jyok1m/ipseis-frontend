import React from "react";
import Image from "next/image";
import { FeatureBox } from "@/components/FeatureBox";
import { TitleSection } from "@/components/TitleSection";
import { StarBulletPoint } from "@/components/StarBulletPoint";
import starGreen from "@/_images/logo/star_green.svg";

const connaissanceList = [
	"Apports théoriques, scientifiques et réglementaires actualisé et ciblés",
	"Chaque session démarre par un socle de savoirs fondamentaux adaptés au niveau et aux besoins des apprenants",
];

const experimentationList = [
	"Études de cas collaboratives",
	"Les apprenants testent, analysent et retiennent. L’apprentissage passe par l’action dans un cadre sécurisé et motivant",
];

const interactionList = [
	"Questionnements réguliers, feedbacks en temps réel, adaptation des contenus",
	"Le formateur ajuste sa pédagogie en direct, l’apprenant devient acteur de son parcours",
];

const approachList = [
	"Simulations, jeux de rôles, scénarios pédagogiques, quizz",
	"L’apprentissage devient une expérience concrète et collective, favorisant l’ancrage et la transférabilité",
];

export const PedagogyMethodologySection = () => {
	return (
		<>
			<TitleSection tag="Notre méthode" title="Une méthode participative qui engage et transforme" />
			<div className="pb-10 mx-auto max-w-7xl px-6 lg:px-8 tracking-wider">
				{/* 3x3 grid where five cards sit like a die face (1,1  -  1,3  -  2,2  -  3,1  -  3,3) */}
				<div className="mx-auto max-w-5xl">
					<div className="relative grid grid-cols-1 gap-4 md:gap-24 md:grid-cols-2 md:grid-rows-2 place-items-stretch">
						{/* top-left */}
						<div className="md:col-start-1 md:row-start-1">
							<FeatureBox
								title="Connaissances clés"
								description={connaissanceList.map((dataNode, index) => (
									<StarBulletPoint key={index} dataNode={dataNode} isWhite />
								))}
								bgColor="maitrise"
							/>
						</div>
						{/* top-right */}
						<div className="md:col-start-2 md:row-start-1">
							<FeatureBox
								title="Expérimentation guidée"
								description={experimentationList.map((dataNode, index) => (
									<StarBulletPoint key={index} dataNode={dataNode} isWhite />
								))}
								bgColor="maitrise"
							/>
						</div>
						{/* center */}
						<div className="absolute inset-0 z-10 hidden md:flex items-center justify-center">
							<div className="relative z-20 md:-mt-20 md:-mb-20 md:-mx-20">
								<Image src={starGreen} alt="Image de l'étoile d'Ipseis" width={48} height={48} className="w-96 h-96" />
							</div>
						</div>
						{/* bottom-left */}
						<div className="md:col-start-1 md:row-start-2">
							<FeatureBox
								title="Interaction continue"
								description={interactionList.map((dataNode, index) => (
									<StarBulletPoint key={index} dataNode={dataNode} isWhite />
								))}
								bgColor="maitrise"
							/>
						</div>
						{/* bottom-right */}
						<div className="md:col-start-2 md:row-start-2">
							<FeatureBox
								title="Approche collaborative et immersive"
								description={approachList.map((dataNode, index) => (
									<StarBulletPoint key={index} dataNode={dataNode} isWhite />
								))}
								bgColor="maitrise"
							/>
						</div>
					</div>
					<p className="mx-auto max-w-3xl mt-10 md:mt-16 text-center text-base sm:text-lg text-univers">
						En combinant ces moyens pédagogiques, nous assurons un apprentissage significatif et durable, solidement enraciné
						dans la pratique professionnelle.
					</p>
				</div>
			</div>
		</>
	);
};
