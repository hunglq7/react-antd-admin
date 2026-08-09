import type { BienapItemType } from "#src/api/bienap/danhmuc";
import { fetchAddBienapItem, fetchUpdateBienapItem } from "#src/api/bienap/danhmuc";

import { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<BienapItemType>
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
	const [form] = Form.useForm<BienapItemType>();

	const onFinish = async (values: BienapItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values;
		if (detailData.id) {
			await fetchUpdateBienapItem(payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddBienapItem(payload);
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
		<ModalForm<BienapItemType>
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
				name="tenThietBi"
				label="Tên thiết bị"
				placeholder="Nhập tên thiết bị"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="loaiThietBi"
				label="Loại thiết bị"
				placeholder="Nhập loại thiết bị"
			/>
			<ProFormTextArea
				name="ghiChu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"
			/>
		</ModalForm>
	);
}
