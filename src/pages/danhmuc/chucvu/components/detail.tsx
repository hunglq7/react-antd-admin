import type { ChucvuItemType } from "#src/api/danhmuc/chucvu/types";
import { ModalForm, ProFormSwitch, ProFormText } from "@ant-design/pro-components";

import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAddChucvuItem, fetchUpdateChucvuItem } from "#src/api/danhmuc/chucvu";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<ChucvuItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({
	title,
	open,
	onCloseChange,
	detailData,
	refreshTable,
}: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<ChucvuItemType>();

	const onFinish = async (values: ChucvuItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values;
		if (detailData.id) {
			await fetchUpdateChucvuItem(payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddChucvuItem(payload);
			window.$message?.success(t("common.addSuccess"));
		}
		refreshTable?.();
		return true;
	};

	useEffect(() => {
		if (open) {
			form.setFieldsValue(detailData);
		}
	}, [open]);

	return (
		<ModalForm<ChucvuItemType>
			title={title}
			open={open}
			onOpenChange={(visible) => {
				if (!visible)
					onCloseChange();
			}}
			labelCol={{ md: 6, xl: 4 }}
			layout="horizontal"
			form={form}
			autoFocusFirstInput
			modalProps={{ destroyOnHidden: true }}
			width={600}
			onFinish={onFinish}
		>
			<ProFormText
				name="tenChucVu"
				label="Chức vụ"
				placeholder="Nhập tên chức vụ"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSwitch
				name="trangThai"
				label="Trạng thái"
			/>

		</ModalForm>
	);
}
