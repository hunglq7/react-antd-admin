import type { PhanQuyenItemType } from "#src/api/hethong/phanquyen/types";
import { ModalForm, ProFormText } from "@ant-design/pro-components";

import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAddPhanQuyen, fetchUpdatePhanQuyen } from "#src/api/hethong/phanquyen";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<PhanQuyenItemType>
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
	const [form] = Form.useForm<PhanQuyenItemType>();

	const onFinish = async (values: PhanQuyenItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values;
		if (detailData.id) {
			await fetchUpdatePhanQuyen(detailData.id, payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddPhanQuyen(payload);
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
		<ModalForm<PhanQuyenItemType>
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
				name="name"
				label="Tên quyền"
				placeholder="Nhập tên quyền"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="description"
				label="Mô tả"
				placeholder="Nhập mô tả"
			/>

		</ModalForm>
	);
}
