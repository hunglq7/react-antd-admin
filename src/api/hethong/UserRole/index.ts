import type { UserRoleItemType, UserRoleUpdateRequest } from "./type"
import { request } from "#src/utils/request"

export function fetchUserRoleList() {
	return request
		.get<UserRoleItemType[]>("api/UserRole/getAll", {
			ignoreLoading: true,
		})
		.json()
}

export function fetchAddUserRole(data: UserRoleItemType) {
	return request.post("api/UserRole/Create", { json: data }).json()
}

export function fetchUpdateUserRole(data: UserRoleUpdateRequest) {
	return request.put("api/UserRole", { json: data }).json()
}

export function fetchDeleteUserRole(data: UserRoleItemType) {
	return request.delete(`api/UserRole/${data.userId}/${data.roleId}`).json()
}

/* Xóa nhiều bản ghi */
export function fetchDeleteUserRoleItems(items: UserRoleItemType[]) {
	return request
		.post("api/UserRole/DeleteMultiple", {
			json: items,
			ignoreLoading: true,
		})
		.json()
}
