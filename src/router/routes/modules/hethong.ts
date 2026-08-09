import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import { hethong } from "#src/router/extra-info/order";
import { lazy } from "react";

const PhanQuyen = lazy(() => import("#src/pages/hethong/phanquyen/index"));
const TaiKhoan = lazy(() => import("#src/pages/hethong/taikhoan/index"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/hethong",
		Component: ContainerLayout,
		handle: {
			icon: "SettingOutlined",
			title: "common.menu.hethong",
			order: hethong,
			roles: ["admin"],
		},
		children: [
			{
				path: "/hethong/phanquyen",
				Component: PhanQuyen,
				handle: {
					icon: "UserOutlined",
					title: "system.hethong.phanquyen",
					roles: ["admin"],
				},
			},
			{
				path: "/hethong/taikhoan",
				Component: TaiKhoan,
				handle: {
					icon: "UserOutlined",
					title: "system.hethong.taikhoan",
					roles: ["admin"],
				},
			},
		],
	},
];

export default routes;
