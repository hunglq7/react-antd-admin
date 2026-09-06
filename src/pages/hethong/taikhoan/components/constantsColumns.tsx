import type { TaikhoanItemType } from "#src/api/hethong/taikhoan"
import type { ProColumns } from "@ant-design/pro-components"
import type { TFunction } from "i18next"
import { Avatar } from "antd"

export function getConstantColumns(
	t: TFunction<"translation", undefined>,
): ProColumns<TaikhoanItemType>[] {
	return [
		{
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: "Avatar",
			dataIndex: "Avatar",
			width: 80,
			search: false,
			render: (_, recode) => (
				<Avatar
					src={
						recode.avatar
							? `${import.meta.env.VITE_API_BASE_URL}${recode.avatar}`
							: undefined
					}
					size={40}
				/>
			),
		},
		{
			title: "Tài khoản",
			dataIndex: "userName",
			width: 120,
			ellipsis: true,
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
			title: "Email",
			dataIndex: "email",
			width: 250,
			ellipsis: true,
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
			title: "Họ",
			dataIndex: "firstName",
			width: 250,
			ellipsis: true,
			search: false,
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
			title: "Tên",
			dataIndex: "lastName",
			width: 250,
			ellipsis: true,
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
			title: "Ngày sinh",
			dataIndex: "dob",
			width: 150,
			valueType: "date",
			search: false,
		},

		{
			title: "Điện thoại",
			dataIndex: "phoneNumber",
			width: 220,
			ellipsis: true,
			search: false,
		},
	]
}
