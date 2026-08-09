import type { LoginInfo, UserInfoType } from "./types";

import { useAuthStore } from "#src/store/auth";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchLogin(data: LoginInfo) {
	return request
		.post("api/Users/authenticate", { json: data })
		.json<{ isSuccessed: boolean, message: string, resultObj: string }>();
}

export function fetchLogout() {
	return request.post("api/Users/logout").json();
}

export function fetchAsyncRoutes() {
	return request.get("api/Users/get-async-routes").json();
}

export function fetchUserInfo(): UserInfoType {
	const token = useAuthStore.getState().token;
	if (!token)
		throw new Error("No token");

	try {
		const payload = token.split(".")[1];
		if (!payload)
			throw new Error("Invalid JWT token");

		const base64 = String(payload).replaceAll("-", "+").replaceAll("_", "/");
		const normalizedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
		const jsonPayload = decodeURIComponent(
			atob(normalizedBase64)
				.split("")
				.map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
				.join(""),
		);
		const decoded = JSON.parse(jsonPayload) as Record<string, unknown>;
		const id = String(decoded.nameid ?? decoded.sub ?? "");
		const username = String(decoded.name ?? "");
		const email = String(decoded.mail ?? "");
		const roleText = typeof decoded.role === "string" ? decoded.role : "";

		return {
			id,
			username,
			email,
			phoneNumber: "",
			description: "",
			avatar: "",
			roles: roleText
				? roleText.split(",").map(role => role.trim().toLowerCase()).filter(Boolean)
				: [],
		};
	}
	catch (error) {
		console.error("Failed to decode token", error);
		throw error;
	}
}

export interface RefreshTokenResult {
	result: {
		token: string
		refreshToken: string
	}
}

export function fetchRefreshToken(data: { readonly refreshToken: string }) {
	return request.post("refresh-token", { json: data }).json();
}
