import type { DonviItemType } from "#src/api/danhmuc/donvi/types"
import type { ProColumns } from "@ant-design/pro-components"
import type { TFunction } from "i18next"
import { Tag } from "antd"

export function getConstantColumns(
	t: TFunction<"translation", undefined>,
): ProColumns<DonviItemType>[] {
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
			valueType: "switch",
			search: false,
			render: value => (
				<Tag color={value ? "success" : "default"}>{value ? "Hoạt động" : "Không hoạt động"}</Tag>
			),
		},
	]
}
