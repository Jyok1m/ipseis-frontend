"use client";

import React, { useState } from "react";
import Button from "@/components/global/Button";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
	Bars3Icon,
	XMarkIcon,
	EnvelopeIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Modal, ConfigProvider, Spin } from "antd";
import logoBeige from "@/_images/logo/logo_beige.svg";
import Image from "next/image";
import Link from "next/link";

const navigation = [
	{
		name: "Nous connaître",
		href: "/a-propos",
		ready: true,
		desktopOnly: false,
	},
	{ name: "Pédagogie", href: "/pedagogie", ready: true, desktopOnly: false },
	{ name: "Formations", href: "/formations", ready: true, desktopOnly: false },
	{ name: "Qualité", href: "/qualite", ready: true, desktopOnly: false },
	{ name: "Autres secteurs", href: "/", ready: false, desktopOnly: true },
];

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);

	return (
		<header className="bg-univers z-20 w-full">
			{/* Desktop */}

			<nav
				aria-label="Global"
				className="mx-auto flex max-w-7xl items-center justify-between gap-x-4 lg:gap-x-6 px-6 py-3 lg:px-8"
			>
				<div className="flex-shrink-0">
					<Link href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">Ipseis</span>
						<Image
							src={logoBeige}
							alt="Logo Ipseis"
							title="Logo Ipseis"
							height={40}
						/>
					</Link>
				</div>
				<div className="hidden md:flex md:gap-x-6 lg:gap-x-10">
					{navigation
						.filter((item) => !item.desktopOnly)
						.map((item) =>
							item.ready ? (
								<Link
									key={item.name}
									href={item.href}
									className="text-base lg:text-lg font-normal text-support whitespace-nowrap hover:underline hover:underline-offset-8"
								>
									{item.name}
								</Link>
							) : (
								<button
									key={item.name}
									onClick={() => setShowModal(true)}
									className="text-base lg:text-lg font-normal text-support whitespace-nowrap hover:underline hover:underline-offset-8"
								>
									{item.name}
								</button>
							),
						)}
				</div>
				<div className="flex items-center gap-x-3 flex-shrink-0">
					<Link
						href="/espace-personnel"
						className="hidden md:block rounded-md bg-support/15 border border-support/30 px-3 py-1.5 text-base text-support font-normal shadow-sm hover:bg-support/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-support transition-colors whitespace-nowrap"
					>
						<span className="flex items-center gap-x-2">
							<UserCircleIcon aria-hidden="true" className="size-5" />
							<span className="hidden lg:inline">Espace Personnel</span>
						</span>
					</Link>
					<Link
						href="/contact"
						className="rounded-md bg-maitrise px-3 py-1.5 text-base text-support font-normal shadow-sm hover:bg-maitrise/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maitrise whitespace-nowrap"
					>
						<span className="flex items-center gap-x-2">
							<EnvelopeIcon aria-hidden="true" className="size-5" />
							Contact
						</span>
					</Link>
					<button
						type="button"
						onClick={() => setMobileMenuOpen(true)}
						className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-support"
					>
						<span className="sr-only">Ouvrir le menu</span>
						<Bars3Icon aria-hidden="true" className="size-6" />
					</button>
				</div>
			</nav>

			{/* Mobile */}

			<Dialog
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
				className="md:hidden"
			>
				<div className="fixed inset-0 z-20" />
				<DialogPanel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-maitrise px-6 py-6 sm:max-w-sm">
					<div className="flex items-center justify-between">
						<Link
							href="/"
							className="-m-1.5 p-1.5"
							onClick={() => setMobileMenuOpen(false)}
							tabIndex={-1}
						>
							<span className="sr-only">Ipseis</span>
							<Image
								src={logoBeige}
								alt="Logo Ipseis"
								title="Logo Ipseis"
								height={40}
							/>
						</Link>

						<div className="flex items-center gap-x-3">
							<Link
								href="/contact"
								onClick={() => setMobileMenuOpen(false)}
								className="rounded-md bg-univers px-3 py-1 text-base font-normal text-support shadow-sm hover:bg-univers/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
							>
								<span className="flex items-center gap-x-2">
									<EnvelopeIcon aria-hidden="true" className="size-4" />
									Contact
								</span>
							</Link>

							<button
								type="button"
								onClick={() => setMobileMenuOpen(false)}
								className="-m-2.5 rounded-md p-2.5 text-univers"
							>
								<span className="sr-only">Fermer le menu</span>
								<XMarkIcon aria-hidden="true" className="size-6" />
							</button>
						</div>
					</div>
					<div className="mt-6 flow-root">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="space-y-2 py-6">
								{navigation
									.filter((item) => !item.desktopOnly)
									.map((item) =>
										item.ready ? (
											<Link
												key={item.name}
												href={item.href}
												onClick={() => setMobileMenuOpen(false)}
												className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-univers hover:bg-support"
											>
												{item.name}
											</Link>
										) : (
											<button
												key={item.name}
												onClick={() => setShowModal(true)}
												className="-ml-3 rounded-lg px-3 py-2 text-base font-semibold text-univers hover:bg-support w-full flex"
											>
												{item.name}
											</button>
										),
									)}
								<Link
									href="/espace-personnel"
									onClick={() => setMobileMenuOpen(false)}
									className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-univers hover:bg-support"
								>
									<UserCircleIcon aria-hidden="true" className="size-5" />
									Espace Personnel
								</Link>
							</div>
						</div>
					</div>
				</DialogPanel>
			</Dialog>

			{/* Modal */}

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
					token: {
						fontFamily: "Halibut",
					},
				}}
			>
				<Modal
					title={
						<p className="text-lg sm:text-xl font-bold tracking-wider text-univers">
							Un peu de patience...
						</p>
					}
					centered
					open={showModal}
					footer={null}
					width="min(600px, 95vw)"
					onCancel={() => setShowModal(false)}
				>
					<p className="text-base sm:text-lg text-univers">
						Cette page sera bientôt disponible !
					</p>
				</Modal>
			</ConfigProvider>
		</header>
	);
};

export default Header;
