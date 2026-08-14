import type { AppRouteRecordRaw } from "#src/router/types";
import { lazy } from "react";
import ContainerLayout from "#src/layout/container-layout";
import { maycao } from "#src/router/extra-info/order";

const MaycaoDanhmuc = lazy(() => import("#src/pages/maycao/danhmuc/index"));
const MaycaoThongso = lazy(() => import("#src/pages/maycao/thongso/index"));
const MaycaoTonghop = lazy(() => import("#src/pages/maycao/tonghop/index"));
const routes: AppRouteRecordRaw[] = [
	{
		path: "/maycao",
		Component: ContainerLayout,
		handle: {
			icon: "ThunderboltOutlined",
			title: "common.menu.maycao",
			order: maycao,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/maycao/danhmuc",
				Component: MaycaoDanhmuc,
				handle: {
					icon: "TableOutlined",
					title: "system.maycao.maycaoDanhmuc",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/maycao/thongso",
				Component: MaycaoThongso,
				handle: {
					icon: "TableOutlined",
					title: "system.maycao.maycaoThongso",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/maycao/tonghop",
				Component: MaycaoTonghop,
				handle: {
					icon: "TableOutlined",
					title: "system.maycao.maycaoTonghop",
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
