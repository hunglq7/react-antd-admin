import type { BienapItemType } from "#src/api/bienap/danhmuc";
import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<BienapItemType>[] {
	return [
		{
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: "Tên thiết bị",
			dataIndex: "tenThietBi",
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
			title: "Loại thiết bị",
			dataIndex: "loaiThietBi",
			width: 220,
			ellipsis: true,
		},
		{
			title: "Ghi chú",
			dataIndex: "ghiChu",
			width: 300,
			ellipsis: true,
		},
	];
}
