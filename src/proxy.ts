import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPages = [
	"/espace-personnel/connexion",
	"/espace-personnel/inscription",
	"/espace-personnel/mot-de-passe-oublie",
	"/espace-personnel/reinitialiser-mot-de-passe",
];

function isPublicPage(pathname: string) {
	return publicPages.some((page) => pathname.startsWith(page));
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("token")?.value;

	// Pages publiques de l'espace personnel (connexion, inscription, etc.)
	if (isPublicPage(pathname)) {
		// Si l'utilisateur est déjà connecté, rediriger vers l'espace personnel
		if (token) {
			return NextResponse.redirect(new URL("/espace-personnel", request.url));
		}
		return NextResponse.next();
	}

	// Pages protégées de l'espace personnel
	if (pathname.startsWith("/espace-personnel")) {
		if (!token) {
			return NextResponse.redirect(new URL("/espace-personnel/connexion", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/espace-personnel/:path*"],
};
