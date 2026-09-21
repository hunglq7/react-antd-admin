export interface UserRoleItemType {
	userId: string
	roleId: string
	userName?: string
	roleName?: string
}

export interface UserRoleUpdateRequest extends UserRoleItemType {
	oldUserId: string
	oldRoleId: string
}
