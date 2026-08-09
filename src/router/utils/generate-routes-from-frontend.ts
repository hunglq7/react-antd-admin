import type { AppRouteRecordRaw } from "#src/router/types";

import { filterTree } from "#src/utils/tree";

/**
 * 动态生成路由 - 前端方式
 */
export function generateRoutesByFrontend(
	routes: AppRouteRecordRaw[],
	roles: string[],
) {
	// 根据角色标识过滤路由表，判断当前用户是否拥有指定权限
	const finalRoutes = filterTree(routes, (route) => {
		return hasAuthority(route, roles);
	});

	return finalRoutes;
}

/**
 * 判断路由是否有权限访问
 * @param route
 * @param accesses
 */
function hasAuthority(route: AppRouteRecordRaw, accesses: string[]) {
	const authority = route.handle?.roles?.map(role => role.toLowerCase());
	const normalizedAccesses = accesses.map(access => access.toLowerCase());
	if (!authority) {
		return true;
	}
	return normalizedAccesses.some(value => authority.includes(value));
}
