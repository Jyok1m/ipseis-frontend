"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Modal, ConfigProvider } from "antd";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const CERT_IMAGE = "/images/certificat_qualiopi.png";
const CERT_PDF = "/pdf/certificat_qualiopi_ipseis.pdf";

export default function QualiopiCertificate() {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col items-center gap-3">
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Afficher le certificat Qualiopi"
				className="group flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors hover:bg-univers/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-univers cursor-pointer"
			>
				<Image
					src="/images/qualiopi_logo_bg_removed.png"
					alt="Logo Qualiopi"
					width={789}
					height={316}
					className="h-24 w-auto sm:h-28"
					priority={false}
				/>
				<span className="text-base sm:text-lg font-bold text-univers underline underline-offset-4 decoration-univers/40 group-hover:decoration-univers">
					Certificat Qualiopi
				</span>
			</button>

			<ConfigProvider
				theme={{
					components: { Modal: { contentBg: "#fffce8", headerBg: "#fffce8" } },
					token: { fontFamily: "Halibut" },
				}}
			>
				<Modal
					title={<p className="text-lg sm:text-xl font-bold tracking-wider text-univers">Certificat Qualiopi</p>}
					open={open}
					onCancel={() => setOpen(false)}
					centered
					width="min(900px, 95vw)"
					footer={
						<div className="flex justify-end">
							<a
								href={CERT_PDF}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 rounded-lg bg-univers px-4 py-2 text-sm font-semibold text-support transition-colors hover:bg-univers/90"
							>
								<ArrowTopRightOnSquareIcon className="h-4 w-4" />
								Ouvrir le PDF
							</a>
						</div>
					}
				>
					<div className="relative w-full">
						<Image
							src={CERT_IMAGE}
							alt="Certificat Qualiopi IPSEIS"
							width={1478}
							height={1042}
							className="h-auto w-full rounded-lg border border-univers/20"
						/>
					</div>
				</Modal>
			</ConfigProvider>
		</div>
	);
}
