export interface UserRoleItemType {
	id?: number
	userId: number
	roleId: number
	userName?: string
	roleName?: string
}

export interface AddUserRoleItemType {
	userId: number
	roleId: number
}
