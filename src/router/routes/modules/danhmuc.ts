import type { AppRouteRecordRaw } from "#src/router/types";
import { lazy } from "react";
import ContainerLayout from "#src/layout/container-layout";
import { danhmuc } from "#src/router/extra-info/order";

const Chucvu = lazy(() => import("#src/pages/danhmuc/chucvu"));
const LoaiThietBi = lazy(() => import("#src/pages/danhmuc/loaithietbi"));
const routes: AppRouteRecordRaw[] = [
	{
		path: "/danhmuc",
		Component: ContainerLayout,
		handle: {
			icon: "ThunderboltOutlined",
			title: "common.menu.danhmuc",
			order: danhmuc,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/danhmuc/chucvu",
				Component: Chucvu,
				handle: {
					icon: "TableOutlined",
					title: "system.danhmuc.chucvu",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/danhmuc/loaithietbi",
				Component: LoaiThietBi,
				handle: {
					icon: "TableOutlined",
					title: "system.danhmuc.loaithietbi",
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
