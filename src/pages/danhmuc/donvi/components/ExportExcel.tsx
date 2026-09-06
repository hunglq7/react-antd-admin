import type { DonviItemType } from "#src/api/danhmuc/donvi/types"
import { DownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useTranslation } from "react-i18next"
import * as XLSX from "xlsx"

interface Props {
	data: DonviItemType[]
}

function DonviExport({ data }: Props) {
	const { t } = useTranslation()
	const handleExport = () => {
		try {
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Tên đơn vị": item.tenPhong,
				"Trạng thái": item.trangThai,
			}))
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên đơn vị", "Trạng thái"],
			})
			// Set độ rộng cột
			worksheet["!cols"] = [{ wch: 5 }, { wch: 20 }, { wch: 25 }]
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "Donvi")
			XLSX.writeFile(workbook, "donvi.xlsx")
			window.$message?.success(t("common.exportSuccess"))
		}
		catch (error) {
			console.error("Export failed", error)
			window.$message?.error(t("common.exportFailed"))
		}
	}

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	)
}

export default DonviExport
