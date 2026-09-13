import type { Dayjs } from "dayjs"
import type { NhatkymaycaoItemType } from "#src/api/maycao/nhatky/types"
import {
	ModalForm,
	ProFormDatePicker,
	ProFormSelect,
	ProFormSwitch,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components"
import { Form } from "antd"
import dayjs from "dayjs"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
	fetchAddNhatkymaycaoItem,
	fetchUpdateNhatkymaycaoItem,
} from "#src/api/maycao/nhatky"
import { fetchPhongbanList } from "#src/api/system/phongban"

interface NhatkyFormModalProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<NhatkymaycaoItemType>
	tonghopmaycaoId?: number
	onCloseChange: () => void
	refreshTable?: () => void
}

export function NhatkyFormModal({
	title,
	open,
	detailData,
	tonghopmaycaoId,
	onCloseChange,
	refreshTable,
}: NhatkyFormModalProps) {
	const { t } = useTranslation()
	type NhatkymaycaoFormType = Omit<
		NhatkymaycaoItemType,
        "ngaythang" | "trangThai"
	> & {
		ngaythang?: Dayjs | string
		trangThai?: boolean
	}
	const [form] = Form.useForm<NhatkymaycaoFormType>()

	const onFinish = async (values: NhatkymaycaoFormType) => {
		if (!tonghopmaycaoId) {
			window.$message?.error(
				"Vui lòng lưu thông tin tổng hợp trước khi thêm nhật ký",
			)
			return false
		}

		if (!values.ngaythang) {
			window.$message?.error(t("form.required"))
			return false
		}

		let ngaythangStr: string
		if (typeof values.ngaythang === "string") {
			ngaythangStr = values.ngaythang
		}
		else if (
			values.ngaythang
			&& typeof values.ngaythang.format === "function"
		) {
			ngaythangStr = values.ngaythang.format("YYYY-MM-DD")
		}
		else {
			window.$message?.error("Ngày thay không hợp lệ")
			return false
		}

		const statusValue = values.trangThai ? "Hoạt động" : "Hỏng"

		const payload: NhatkymaycaoItemType = {
			...detailData,
			...values,
			ngaythang: ngaythangStr,
			donVi: values.donVi,
			trangThai: statusValue,
			tonghopmaycaoId,
		}

		if (detailData.id) {
			await fetchUpdateNhatkymaycaoItem(detailData.id, payload)
			window.$message?.success(t("common.updateSuccess"))
		}
		else {
			await fetchAddNhatkymaycaoItem(payload)
			window.$message?.success(t("common.addSuccess"))
		}
		refreshTable?.()
		return true
	}

	useEffect(() => {
		if (open) {
			form.setFieldsValue({
				...detailData,
				ngaythang: detailData.ngaythang
					? dayjs(detailData.ngaythang)
					: undefined,
				trangThai: detailData.trangThai !== "Hỏng",
			})
		}
	}, [open, detailData, form])

	return (
		<ModalForm<NhatkymaycaoFormType>
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
			modalProps={{
				destroyOnHidden: true,
				getContainer: () => document.body,
			}}
			width={600}
			onFinish={onFinish}
			initialValues={{
				trangThai: true,
			}}
		>
			<ProFormDatePicker
				name="ngaythang"
				label="Ngày thay"
				placeholder="Chọn ngày thay"
				rules={[{ required: true, message: t("form.required") }]}
			/>

			<ProFormSelect
				name="donVi"
				label="Đơn vị"
				placeholder="Chọn đơn vị"
				showSearch
				request={async () => {
					const res: any = await fetchPhongbanList()
					const list = Array.isArray(res?.data)
						? res.data
						: Array.isArray(res)
							? res
							: []

					// 1. Lọc bỏ các bản ghi không có tenPhong hoặc bị trùng tên phòng
					const uniqueList = list.filter(
						(item: any, index: number, self: any[]) =>
							item?.tenPhong
							&& index
							=== self.findIndex(
								t => t?.tenPhong?.trim() === item.tenPhong.trim(),
							),
					)

					// 2. Trả về label và value ĐỀU LÀ CHUỖI TENPHONG
					return uniqueList.map((item: any) => ({
						label: item.tenPhong.trim(),
						value: item.tenPhong.trim(), // Backend nhận String (ví dụ: "Phòng KCS")
					}))
				}}
				fieldProps={{
					filterOption: (input, option) =>
						(option?.label ?? "")
							.toString()
							.toLowerCase()
							.includes(input.toLowerCase()),
				}}
				rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
			/>
			<ProFormText name="viTri" label="Vị trí" placeholder="Nhập vị trí" />
			<ProFormSwitch name="trangThai" label="Trạng thái" />
			<ProFormTextArea
				name="ghiChu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"
			/>
		</ModalForm>
	)
}
