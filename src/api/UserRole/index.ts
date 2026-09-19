import type { AddUserRoleItemType, UserRoleItemType } from "./type"
import { request } from "#src/utils/request"

export function fetchUserRoleList() {
	return request
		.get<UserRoleItemType[]>("api/UserRole", {
			ignoreLoading: true,
		})
		.json()
}

export function addUserRole(data: AddUserRoleItemType) {
	return request.post("api/UserRole", { json: data }).json()
}
