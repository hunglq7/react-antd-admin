import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import { role } from "#src/router/extra-info/order";
import { lazy } from "react";

const RoleDanhmuc = lazy(() => import("#src/pages/role/danhmuc"));
const Tonghoprole = lazy(() => import("#src/pages/role/tonghop"));
const routes: AppRouteRecordRaw[] = [
	{
		path: "/role",
		Component: ContainerLayout,
		handle: {
			icon: "SafetyOutlined",
			title: "common.menu.role",
			order: role,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/role/danhmuc",
				Component: RoleDanhmuc,
				handle: {
					icon: "TableOutlined",
					title: "system.role.roleDanhmuc",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/role/tonghop",
				Component: Tonghoprole,
				handle: {
					icon: "TableOutlined",
					title: "system.tonghoprole.tonghoprole",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
		],
	},
];

export default routes;
