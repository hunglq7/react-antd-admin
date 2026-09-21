import type { AppRouteRecordRaw } from "#src/router/types"
import ContainerLayout from "#src/layout/container-layout"
import { hethong } from "#src/router/extra-info/order"
import { lazy } from "react"

const Quyenhan = lazy(() => import("#src/pages/hethong/phanquyen/index"))
const TaiKhoan = lazy(() => import("#src/pages/hethong/taikhoan/index"))
const PhanQuyen = lazy(() => import("#src/pages/hethong/UserRole/index"))
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
				path: "/hethong/quyenhan",
				Component: Quyenhan,
				handle: {
					icon: "UserOutlined",
					title: "system.hethong.quyenhan",
					roles: ["admin"],
					permissions: ["permission:button:add", "permission:button:update", "permission:button:delete"],
				},
			},
			{
				path: "/hethong/taikhoan",
				Component: TaiKhoan,
				handle: {
					icon: "UserOutlined",
					title: "system.hethong.taikhoan",
					roles: ["admin"],
					permissions: ["permission:button:add", "permission:button:update", "permission:button:delete"],
				},
			},
			{
				path: "/hethong/phanquyen",
				Component: PhanQuyen,
				handle: {
					icon: "UserOutlined",
					title: "system.hethong.phanquyen",
					roles: ["admin"],
					permissions: ["permission:button:add", "permission:button:update", "permission:button:delete"],
				},
			},
		],
	},
]

export default routes
