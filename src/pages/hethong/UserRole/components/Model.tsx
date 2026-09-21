import type { UserRoleItemType, UserRoleUpdateRequest } from "#src/api/hethong/UserRole/type"
import { fetchPhanQuyenList } from "#src/api/hethong/phanquyen/index"
import { fetchTaikhoanList } from "#src/api/hethong/taikhoan/index"
import { fetchAddUserRole, fetchUpdateUserRole } from "#src/api/hethong/UserRole/index"
import { ModalForm, ProFormSelect } from "@ant-design/pro-components"
import { Form } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<UserRoleItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Model({ title, open, detailData, onCloseChange, refreshTable }: DetailProps) {
	const { t } = useTranslation()
	const [form] = Form.useForm<UserRoleItemType>()
	const [userOptions, setUserOptions] = useState<{ label: string; value: number }[]>([])
	const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([])

	const onFinish = async (values: UserRoleItemType) => {
		try {
			const isEditing = Boolean(detailData.userId && detailData.roleId)
			if (isEditing) {
				const payload: UserRoleUpdateRequest = {
					...values,
					oldUserId: detailData.userId!,
					oldRoleId: detailData.roleId!,
				}
				await fetchUpdateUserRole(payload)
				window.$message?.success(t("common.updateSuccess"))
			} else {
				await fetchAddUserRole(values)
				window.$message?.success(t("common.addSuccess"))
			}
			refreshTable?.()
			onCloseChange()
			return true
		} catch (error) {
			console.error("Save error:", error)
			window.$message?.error((error as any)?.message || t("common.saveFailed"))
			return false
		}
	}

	useEffect(() => {
		if (open) {
			form.setFieldsValue(detailData)
		}
	}, [open])

	useEffect(() => {
		const loadOptions = async () => {
			const [users, roles] = await Promise.all([fetchTaikhoanList(), fetchPhanQuyenList()])
			setUserOptions(users.map((user) => ({ label: user.userName, value: user.id ?? 0 })))
			setRoleOptions(roles.map((role) => ({ label: role.name, value: role.id ?? 0 })))
		}
		loadOptions()
	}, [])

	return (
		<ModalForm<UserRoleItemType>
			title={title}
			open={open}
			onOpenChange={(visible) => {
				if (!visible) onCloseChange()
			}}
			labelCol={{ md: 6, xl: 4 }}
			layout="horizontal"
			form={form}
			autoFocusFirstInput
			modalProps={{ destroyOnHidden: true }}
			width={600}
			onFinish={onFinish}
		>
			<ProFormSelect
				name="userId"
				label="Người dùng"
				placeholder="Chọn người dùng"
				options={userOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="roleId"
				label="Quyền"
				placeholder="Chọn quyền"
				options={roleOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
		</ModalForm>
	)
}
