"use client";

import React from "react";
import Link from "next/link";

const Footer = ({ background = "bg-support" }) => {
	return (
		<div className={`mx-auto w-full shrink-0 text-xs sm:text-base ${background === "bg-univers" ? "text-support" : "text-univers"} ${background}`}>
			<footer
				aria-labelledby="footer-heading"
				className="relative border-t border-gray-900/10 flex flex-col gap-y-1.5 sm:flex-row items-center justify-evenly py-3 sm:py-5 px-4"
			>
				<span>
					Site web par{" "}
					<Link href="https://www.linkedin.com/in/joachim-jasmin/" target="_blank" className="font-semibold hover:underline underline-offset-4">
						Joachim Jasmin
					</Link>
				</span>
				<span className="hidden sm:flex sm:justify-center sm:items-center sm:gap-x-4">
					<Link href="/mentions-legales" className="hover:underline underline-offset-4">
						Mentions légales
					</Link>
					<span className="opacity-40">|</span>
					<Link href="/politique-de-confidentialite" className="hover:underline underline-offset-4">
						Confidentialité
					</Link>
				</span>
				<span>
					Design par{" "}
					<Link href="https://www.malt.fr/profile/titouanguignouard/" target="_blank" className="font-semibold hover:underline underline-offset-4">
						Titouan Gignouard
					</Link>
				</span>
				<span className="sm:hidden flex justify-center items-center gap-x-4">
					<Link href="/mentions-legales" className="hover:underline underline-offset-4">
						Mentions légales
					</Link>
					<span className="opacity-40">|</span>
					<Link href="/politique-de-confidentialite" className="hover:underline underline-offset-4">
						Confidentialité
					</Link>
				</span>
			</footer>
		</div>
	);
};

export default Footer;
