import type { TaikhoanItemType } from "#src/api/hethong/taikhoan"
import { DownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useTranslation } from "react-i18next"
import * as XLSX from "xlsx"

interface Props {
	data: TaikhoanItemType[]
}

function TaikhoanExport({ data }: Props) {
	const { t } = useTranslation()
	const handleExport = () => {
		try {
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Họ và tên": `${item.firstName} ${item.lastName}`,
				"Tên tài khoản": item.userName,
				"Email": item.email,
				"Số điện thoại": item.phoneNumber,
			}))
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Họ và tên", "Tên tài khoản", "Email", "Số điện thoại"],
			})
			// Set độ rộng cột
			worksheet["!cols"] = [{ wch: 5 }, { wch: 20 }, { wch: 25 }, { wch: 35 }, { wch: 30 }]
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "Taikhoan")
			XLSX.writeFile(workbook, "taikhoan.xlsx")
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

export default TaikhoanExport
