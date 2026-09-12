import type { LoginInfo, UserInfoType } from "./types"

import { useAuthStore } from "#src/store/auth"
import { request } from "#src/utils/request"

export * from "./types"

export function fetchLogin(data: LoginInfo) {
	return request
		.post("api/Users/authenticate", { json: data })
		.json<{ isSuccessed: boolean, message: string, resultObj: { accessToken: string, refreshToken: string, userId: string } }>()
}

export function fetchLogout(refreshToken?: string) {
	return request.post("api/Users/logout", {
		json: { refreshToken },
	}).json()
}

export function fetchAsyncRoutes() {
	return request.get("api/Users/get-async-routes").json()
}

export async function fetchUserInfo(): Promise<UserInfoType> {
	const token = useAuthStore.getState().token
	if (!token)
		throw new Error("No token")

	try {
		const payload = token.split(".")[1]
		if (!payload)
			throw new Error("Invalid JWT token")

		const base64 = String(payload).replaceAll("-", "+").replaceAll("_", "/")
		const normalizedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
		const jsonPayload = decodeURIComponent(
			atob(normalizedBase64)
				.split("")
				.map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
				.join(""),
		)
		const decoded = JSON.parse(jsonPayload) as Record<string, unknown>
		const id = String(decoded.nameid ?? decoded.sub ?? "")
		const username = String(decoded.name ?? "")
		const email = String(decoded.mail ?? "")
		const roleText = typeof decoded.role === "string" ? decoded.role : ""

		const response = await request
			.get(`api/Users/${id}`, { ignoreLoading: true })
			.json<{ resultObj?: { avatar?: string, phoneNumber?: string, firstName?: string, lastName?: string, dob?: string } }>()
		const profile = response.resultObj

		return {
			id,
			username,
			firstName: profile?.firstName,
			lastName: profile?.lastName,
			dob: profile?.dob,
			email,
			phoneNumber: profile?.phoneNumber ?? "",
			description: "",
			avatar: profile?.avatar ?? "",
			roles: roleText
				? roleText.split(",").map(role => role.trim().toLowerCase()).filter(Boolean)
				: [],
		}
	}
	catch (error) {
		console.error("Failed to decode token", error)
		throw error
	}
}

export function updateUserProfile(id: string, data: {
	avatar: string
	firstName?: string
	lastName?: string
	dob?: string
	email: string
	phoneNumber: string
}) {
	return request.put(`api/Users/${id}`, {
		json: {
			id,
			firstName: data.firstName,
			lastName: data.lastName,
			dob: data.dob,
			email: data.email,
			phoneNumber: data.phoneNumber,
			avatar: data.avatar,
		},
	})
}

export interface RefreshTokenResult {
	isSuccessed: boolean
	message: string
	resultObj: {
		accessToken: string
		refreshToken: string
		userId: string
	}
}

export function fetchRefreshToken(data: { readonly refreshToken: string }) {
	return request.post("api/Users/refresh-token", { json: data }).json<RefreshTokenResult>()
}
