import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import MayxucTonghop from "#src/pages/mayxuc/tonghop/index";
import { mayxuc } from "#src/router/extra-info/order";
import { lazy } from "react";

const MayxucDanhmuc = lazy(() => import("#src/pages/mayxuc/danhmuc/index"));
const MayxucThongso = lazy(() => import("#src/pages/mayxuc/thongso/index"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/mayxuc",
		Component: ContainerLayout,
		handle: {
			icon: "ThunderboltOutlined",
			title: "common.menu.mayxuc",
			order: mayxuc,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/mayxuc/danhmuc",
				Component: MayxucDanhmuc,
				handle: {
					icon: "TableOutlined",
					title: "system.mayxuc.mayxucDanhmuc",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/mayxuc/thongso",
				Component: MayxucThongso,
				handle: {
					icon: "TableOutlined",
					title: "system.thongsomayxuc.thongsomayxuc",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/mayxuc/tonghop",
				Component: MayxucTonghop,
				handle: {
					icon: "TableOutlined",
					title: "system.tonghopmayxuc.tonghopmayxuc",
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
