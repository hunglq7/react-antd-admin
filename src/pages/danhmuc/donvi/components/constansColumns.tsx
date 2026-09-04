import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import type { DonviItemType } from "#src/api/danhmuc/donvi/types";

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<DonviItemType>[] {
	return [
		{
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: "Đơn vị",
			dataIndex: "tenPhong",
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
			title: "Trạng thái",
			dataIndex: "trangThai",
			width: 250,
			ellipsis: true,
			search: false,
		},

	];
}
