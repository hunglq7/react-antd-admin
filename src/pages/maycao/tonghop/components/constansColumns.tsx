import type { ProColumns } from "@ant-design/pro-components"
import type { TFunction } from "i18next"
import type { MaycaoTonghopItemType } from "#src/api/maycao/tonghop/types"
import { Tag } from "antd"

export function getConstantColumns(_: TFunction<"translation", undefined>): ProColumns<MaycaoTonghopItemType>[] {
	return [
		{
			title: "Mã quản lý",
			dataIndex: "maQuanLy",
			search: false,
			ellipsis: true,
		},
		{
			title: "Thiết bị",
			dataIndex: "tenMayXuc",
			ellipsis: true,
		},
		{
			title: "Đơn vị",
			dataIndex: "tenPhongBan",
			ellipsis: true,
		},
		{
			title: "Vị trí lắp đặt",
			dataIndex: "viTriLapDat",
			ellipsis: true,
			search: false,
		},
		{
			title: "Ngày tháng",
			dataIndex: "ngayLap",
			valueType: "date",
			fieldProps: { format: "DD-MM-YYYY" },
			ellipsis: true,
		},
		{
			title: "Chiều dài máy",
			dataIndex: "chieuDaiMay",
			ellipsis: true,
			search: false,
		},
		{
			title: "Số lượng xích",
			dataIndex: "soLuongXich",
			ellipsis: true,
			search: false,
		},
		{
			title: "Số lượng cầu máng",
			dataIndex: "soLuongCauMang",
			ellipsis: true,
			search: false,
		},
		{
			title: "Tình trạng thiết bị",
			dataIndex: "tinhTrangThietBi",
			ellipsis: true,
			search: false,
		},
		{
			title: "Dự phòng",
			dataIndex: "duPhong",
			valueType: "switch",
			render: (value) => <Tag color={value ? "success" : "default"}>{value ? "Đang dùng" : "Dự phòng"}</Tag>,
		},
		{
			title: "Ghi chú",
			dataIndex: "ghiChu",
			ellipsis: true,
			search: false,
		},
	]
}
