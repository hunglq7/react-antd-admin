import type { PhongbanItemType } from "#src/api/system/phongban";
import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";

import { getYesNoOptions } from "#src/constants/options";
import { Tag } from "antd";

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<PhongbanItemType>[] {
	return [
		{
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: t("system.phongban.name"),
			dataIndex: "tenPhong",
			ellipsis: true,
			width: 200,
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
			title: t("common.status"),
			dataIndex: "trangThai",
			valueType: "select",
			width: 100,
			render: (_, record) => {
				return <Tag color={record.trangThai ? "success" : "default"}>{record.trangThai ? t("common.enabled") : t("common.deactivated")}</Tag>;
			},
			valueEnum: getYesNoOptions(t).reduce((acc, curr) => {
				acc.set(curr.value, curr.label);
				return acc;
			}, new Map()),
		},
	];
}
