import type { ThongsokythuatmayxucItemType } from "#src/api/mayxuc/thongso"
import { fetchMayxucList } from "#src/api/mayxuc/danhmuc"
import { fetchAddThongsokythuatmayxucItem, fetchUpdateThongsokythuatmayxucItem } from "#src/api/mayxuc/thongso"
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components"
import { Form } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<ThongsokythuatmayxucItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
	const { t } = useTranslation()
	const [form] = Form.useForm<ThongsokythuatmayxucItemType>()
	const [mayxucOptions, setMayxucOptions] = useState<{ label: string, value: number }[]>([])
	const onFinish = async (values: ThongsokythuatmayxucItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values
		if (detailData.id) {
			await fetchUpdateThongsokythuatmayxucItem(payload)
			window.$message?.success(t("common.updateSuccess"))
		}
		else {
			await fetchAddThongsokythuatmayxucItem(payload)
			window.$message?.success(t("common.addSuccess"))
		}
		refreshTable?.()
		return true
	}

	useEffect(() => {
		const loadOptions = async () => {
			const mayxucData = await fetchMayxucList()
			setMayxucOptions(mayxucData.map(item => ({ label: item.tenThietBi ?? "", value: item.id ?? 0 })))
		}
		loadOptions()
		if (open) {
			form.setFieldsValue(detailData)
		}
	}, [open, detailData, form])

	return (
		<ModalForm<ThongsokythuatmayxucItemType>
			title={title}
			open={open}
			onOpenChange={(visible) => {
				if (!visible)
					onCloseChange()
			}}
			labelCol={{ md: 6, xl: 5 }}
			layout="horizontal"
			form={form}
			autoFocusFirstInput
			modalProps={{ destroyOnHidden: true }}
			width={620}
			onFinish={onFinish}
		>
			<ProFormSelect
				name="mayXucId"
				label="Tên thiết bị"
				placeholder="Chọn thiết bị"
				options={mayxucOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText name="noiDung" label="Nội dung" placeholder="Nhập nội dung" />
			<ProFormText name="donViTinh" label="Đơn vị tính" placeholder="Nhập đơn vị tính" />
			<ProFormTextArea name="thongSo" label="Thông số" placeholder="Nhập thông số" />
		</ModalForm>
	)
}
