import type { LoaithietbiItemType } from "#src/api/danhmuc/loaithietbi/types";
import { ModalForm, ProFormSwitch, ProFormText } from "@ant-design/pro-components";

import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAddLoaithietbiItem, fetchUpdateLoaithietbiItem } from "#src/api/danhmuc/loaithietbi";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<LoaithietbiItemType>
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
	const [form] = Form.useForm<LoaithietbiItemType>();

	const onFinish = async (values: LoaithietbiItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values;
		if (detailData.id) {
			await fetchUpdateLoaithietbiItem(payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddLoaithietbiItem(payload);
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
		<ModalForm<LoaithietbiItemType>
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
				name="tenLoai"
				label="Loại thiết bị"
				placeholder="Nhập tên loại thiết bị"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSwitch
				name="trangThai"
				label="Trạng thái"
				initialValue={true}
			/>

		</ModalForm>
	);
}
