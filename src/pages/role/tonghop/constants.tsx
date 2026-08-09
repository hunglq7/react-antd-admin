import type { TonghopRoleItemType } from "#src/api/role/tonghop/types.js";
import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import { Tag } from "antd";
import dayjs from "dayjs";

export function getConstantColumns(t: TFunction<"translation", undefined>): ProColumns<TonghopRoleItemType>[] {
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
			title: "Đơn vị",
			dataIndex: "tenPhong",
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
			render: value => (value ? dayjs(value as string | Date | number).format("DD/MM/YYYY") : null),
		},
		{
			title: "Số lượng",
			dataIndex: "soLuong",
			width: 100,
			valueType: "digit",
		},
		{
			title: "Tình trạng TB",
			dataIndex: "tinhTrangThietBi",
			width: 100,
			ellipsis: true,
		},
		{
			title: "Dự phòng",
			dataIndex: "duPhong",
			width: 100,
			render: value => <Tag color={value ? "red" : "green"}>{value ? "Dự phòng" : "Đang dùng"}</Tag>,
		},
		{
			title: "Ghi chú",
			dataIndex: "ghiChu",
			width: 300,
			ellipsis: true,
		},
	];
}
