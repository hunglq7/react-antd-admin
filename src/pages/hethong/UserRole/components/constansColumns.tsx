import type { UserRoleItemType } from "#src/api/hethong/UserRole/type"
import type { ProColumns } from "@ant-design/pro-components"
import type { TFunction } from "i18next"

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<UserRoleItemType>[] {
	return [
		{
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: "Người dùng",
			dataIndex: "userName",
			width: 250,
			ellipsis: true,
			search: true,
			formItemProps: {
				rules: [
					{
						required: true,
						message: t("form.required"),
					},
				],
			},
		},
		{
			title: "Quyền",
			dataIndex: "roleName",
			width: 250,
			ellipsis: true,
			search: true,
			formItemProps: {
				rules: [
					{
						required: true,
						message: t("form.required"),
					},
				],
			},
		},
	]
}
