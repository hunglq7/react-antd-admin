import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import type { PhanQuyenItemType } from "#src/api/hethong/phanquyen/types";

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<PhanQuyenItemType>[] {
	return [
		{
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: "Tên quyền",
			dataIndex: "name",
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
			title: "Mô tả",
			dataIndex: "description",
			width: 220,
			ellipsis: true,
		},

	];
}
