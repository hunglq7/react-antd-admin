import type { TonghopbienapItemType } from "#src/api/bienap/tonghop";
import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<TonghopbienapItemType>[] {
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
			width: 180,
		},
		{
			title: "Tên phòng ban",
			dataIndex: "tenPhongBan",
			width: 180,
		},
		{
			title: "Vị trí lắp đặt",
			dataIndex: "viTriLapDat",
			width: 200,
			ellipsis: true,
		},
		{
			title: "Ngày lắp",
			dataIndex: "ngayLap",
			width: 150,
			valueType: "date",
		},
		{
			title: "Dự phòng",
			dataIndex: "duPhong",
			width: 100,
			valueType: "switch",
		},
		{
			title: "Ghi chú",
			dataIndex: "ghiChu",
			width: 300,
			ellipsis: true,
		},
	];
}
