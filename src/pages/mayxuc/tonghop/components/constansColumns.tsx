import type { TonghopmayxucItemType } from "#src/api/mayxuc/tonghop"
import type { ProColumns } from "@ant-design/pro-components"
import type { TFunction } from "i18next"
import { Tag } from "antd"

export function getConstantColumns(_: TFunction<"translation", undefined>): ProColumns<TonghopmayxucItemType>[] {
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
			title: "Loại thiết bị",
			dataIndex: "loaiThietBi",
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
			title: "Số lượng",
			dataIndex: "soLuong",
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
