import React from "react";
import Image from "next/image";
import Button from "@/components/global/Button";
import { TitleSection } from "@/components/TitleSection";

export const QualiopiSection = () => {
	return (
		<div className="flex justify-center px-6 lg:px-8 mt-10">
			<div className="max-w-7xl tracking-wider border-cohesion border rounded-2xl mb-10">
				<TitleSection
					centered
					title="Des formations délivrées par un organisme certifié"
					description="Notre organisme de formation est certifié Qualiopi, gage de notre engagement envers la qualité et la pertinence de nos enseignements."
				/>
				<div className="pb-10 flex flex-col gap-y-10 justify-center items-center mx-auto max-w-7xl px-8 lg:px-60 tracking-wider">
					<div className="w-full max-w-[320px]">
						<Image
							title="Logo Qualiopi"
							alt="Logo Qualiopi"
							src="/images/qualiopi_logo_bg_removed.png"
							width={789}
							height={316}
							sizes="(max-width: 640px) 240px, 320px"
							className="w-full h-auto object-contain"
						/>
					</div>

					<Button href="/catalogue">
						<span className="flex items-center gap-x-2 font-semibold text-center">
							<span className="hover:underline hover:underline-offset-8">Catalogue intéractif</span>
							<span className="mt-1">→</span>
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
};
