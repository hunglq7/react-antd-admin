import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import type { TaikhoanItemType } from "#src/api/hethong/taikhoan";

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<TaikhoanItemType>[] {
	return [
		{
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: "Họ",
			dataIndex: "firstName",
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
		},
		{
			title: "Tên đăng nhập",
			dataIndex: "userName",
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
			title: "Điện thoại",
			dataIndex: "phoneNumber",
			width: 220,
			ellipsis: true,
		},

	];
}
