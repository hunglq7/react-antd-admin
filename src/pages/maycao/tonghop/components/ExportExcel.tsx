import type { MaycaoTonghopItemType } from "#src/api/maycao/tonghop/types"
import { DownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useTranslation } from "react-i18next"
import * as XLSX from "xlsx"

interface Props {
	data: MaycaoTonghopItemType[]
}

function TonghopmaycaoExport({ data }: Props) {
	const { t } = useTranslation()
	const handleExport = () => {
		try {
			const exportData = data.map((item, index) => ({
				STT: index + 1,
				"Mã quản lý": item.maQuanLy,
				"Thiết bị": item.tenMayCao,
				"Đơn vị": item.tenPhongBan,
				"Vị trí lắp đặt": item.viTriLapDat,
				"Ngày lắp": item.ngayLap,
				"Chiều dài máy": item.chieuDaiMay,
				"Số lượng xích": item.soLuongXic,
				"Số lượng cẩu măng": item.soLuongCauMang,
				"Tình trạng thiết bị": item.tinhTrangThietBi,
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
					"Vị trí lắp đặt",
					"Ngày lắp",
					"Chiều dài máy",
					"Số lượng xích",
					"Số lượng cẩu măng",
					"Tình trạng thiết bị",
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
				{ wch: 15 },
				{ wch: 15 },
				{ wch: 15 },
				{ wch: 20 },
				{ wch: 18 },
				{ wch: 20 },
				{ wch: 18 },
				{ wch: 30 },
			]
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "TonghopMaycao")
			XLSX.writeFile(workbook, "tonghop_maycao.xlsx")
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

export default TonghopmaycaoExport
