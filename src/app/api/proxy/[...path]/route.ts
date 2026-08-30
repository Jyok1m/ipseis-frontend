import { NextRequest, NextResponse } from "next/server";

const backendUrl = () => process.env.BACKEND_URL || "http://localhost:3098";

async function proxyRequest(request: NextRequest, method: string) {
	const path = request.nextUrl.pathname.replace("/api/proxy", "");
	const search = request.nextUrl.search;
	const targetUrl = `${backendUrl()}${path}${search}`;

	// Read the first-party token cookie
	const token = request.cookies.get("token")?.value;

	// Build headers to forward
	const headers: HeadersInit = {};
	const contentType = request.headers.get("content-type");
	if (contentType) headers["Content-Type"] = contentType;
	if (token) headers["Cookie"] = `token=${token}`;

	// Build fetch options
	const fetchOptions: RequestInit = { method, headers };

	// Forward body for non-GET requests
	if (method !== "GET" && method !== "HEAD") {
		if (contentType?.includes("multipart/form-data")) {
			// For FormData, let fetch set the boundary
			delete headers["Content-Type"];
			fetchOptions.body = await request.arrayBuffer();
			headers["Content-Type"] = contentType;
		} else {
			fetchOptions.body = await request.arrayBuffer();
		}
	}

	const backendRes = await fetch(targetUrl, fetchOptions);

	// Handle binary responses (PDFs, blobs)
	const resContentType = backendRes.headers.get("content-type") || "";
	if (resContentType.includes("application/pdf") || resContentType.includes("application/octet-stream")) {
		const buffer = await backendRes.arrayBuffer();
		const response = new NextResponse(buffer, {
			status: backendRes.status,
			headers: {
				"Content-Type": resContentType,
				"Content-Disposition": backendRes.headers.get("content-disposition") || "",
			},
		});
		return response;
	}

	// Parse JSON response
	let data;
	try {
		data = await backendRes.json();
	} catch {
		return new NextResponse(null, { status: backendRes.status });
	}

	const response = NextResponse.json(data, { status: backendRes.status });

	// On login success: set the token as a first-party cookie
	if (path === "/auth/login" && backendRes.ok && data.token) {
		const maxAge = data.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
		response.cookies.set("token", data.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge,
			path: "/",
		});
	}

	// On logout: clear the cookie
	if (path === "/auth/logout") {
		response.cookies.delete("token");
	}

	return response;
}

export async function GET(request: NextRequest) {
	return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
	return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
	return proxyRequest(request, "PUT");
}

export async function PATCH(request: NextRequest) {
	return proxyRequest(request, "PATCH");
}

export async function DELETE(request: NextRequest) {
	return proxyRequest(request, "DELETE");
}