import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import { bienap } from "#src/router/extra-info/order";

import { lazy } from "react";

const BienapDanhmuc = lazy(() => import("#src/pages/bienap/danhmuc"));
const Tonghopbienap = lazy(() => import("#src/pages/bienap/tonghop"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/bienap",
		Component: ContainerLayout,
		handle: {
			icon: "ThunderboltOutlined",
			title: "common.menu.bienap",
			order: bienap,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/bienap/danhmuc",
				Component: BienapDanhmuc,
				handle: {
					icon: "TableOutlined",
					title: "system.bienap.bienapDanhmuc",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/bienap/tonghop",
				Component: Tonghopbienap,
				handle: {
					icon: "TableOutlined",
					title: "system.tonghopbienap.tonghopbienap",
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
