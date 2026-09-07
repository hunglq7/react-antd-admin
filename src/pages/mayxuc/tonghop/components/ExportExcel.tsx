import type { TonghopmayxucItemType } from "#src/api/mayxuc/tonghop"
import { DownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useTranslation } from "react-i18next"
import * as XLSX from "xlsx"

interface Props {
	data: TonghopmayxucItemType[]
}

function TonghopmayxucExport({ data }: Props) {
	const { t } = useTranslation()
	const handleExport = () => {
		try {
			const exportData = data.map((item, index) => ({
				STT: index + 1,
				"Mã quản lý": item.maQuanLy,
				"Thiết bị": item.tenMayXuc,
				"Đơn vị": item.tenPhongBan,
				"Loại thiết bị": item.loaiThietBi,
				"Vị trí lắp đặt": item.viTriLapDat,
				"Ngày lắp": item.ngayLap,
				"Số lượng": item.soLuong,
				"Dự phòng": item.duPhong ? "Đang dùng" : "Dự phòng",
				"Ghi chú": item.ghiChu,
			}))
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: [
					"STT",
					"Mã quản lý",
					"Thiết bị",
					"Đơn vị",
					"Loại thiết bị",
					"Vị trí lắp đặt",
					"Ngày lắp",
					"Số lượng",
					"Dự phòng",
					"Ghi chú",
				],
			})
			worksheet["!cols"] = [
				{ wch: 5 },
				{ wch: 18 },
				{ wch: 30 },
				{ wch: 20 },
				{ wch: 15 },
				{ wch: 20 },
				{ wch: 18 },
				{ wch: 20 },
				{ wch: 18 },
				{ wch: 30 },
			]
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "TonghopMayxuc")
			XLSX.writeFile(workbook, "tonghop_mayxuc.xlsx")
			window.$message?.success(t("common.exportSuccess"))
		} catch (error) {
			console.error(error)
			window.$message?.error(t("common.exportFailed"))
		}
	}

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	)
}

export default TonghopmayxucExport
