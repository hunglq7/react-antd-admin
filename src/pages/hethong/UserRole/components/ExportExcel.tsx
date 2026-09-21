import type { UserRoleItemType } from "#src/api/hethong/UserRole/type"
import { DownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useTranslation } from "react-i18next"
import * as XLSX from "xlsx"

interface Props {
	data: UserRoleItemType[]
}

function UserRoleExport({ data }: Props) {
	const { t } = useTranslation()
	const handleExport = () => {
		try {
			const exportData = data.map((item, index) => ({
				STT: index + 1,
				"Tên người dùng": item.userName,
				Quyền: item.roleName,
			}))
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên người dùng", "Quyền"],
			})
			// Set độ rộng cột
			worksheet["!cols"] = [{ wch: 5 }, { wch: 20 }, { wch: 25 }]
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "UserRole")
			XLSX.writeFile(workbook, "userrole.xlsx")
			window.$message?.success(t("common.exportSuccess"))
		} catch (error) {
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

export default UserRoleExport
