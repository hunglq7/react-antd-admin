import type { NhatkymayxucCreatePayload, NhatkymayxucItemType } from "#src/api/mayxuc/nhatky";
import { fetchAddNhatkymayxucItem, fetchUpdateNhatkymayxucItem } from "#src/api/mayxuc/nhatky";
import { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<NhatkymayxucItemType>
	tonghopmayxucId?: number
	onCloseChange: () => void
	refreshTable?: () => void
}

export function NhatkyDetail({ title, open, detailData, tonghopmayxucId, onCloseChange, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<NhatkymayxucItemType>();

	const onFinish = async (values: NhatkymayxucItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : { ...values, tonghopmayxucId };
		if (detailData.id) {
			await fetchUpdateNhatkymayxucItem(detailData.id, payload as NhatkymayxucItemType);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddNhatkymayxucItem(payload as NhatkymayxucCreatePayload);
			window.$message?.success(t("common.addSuccess"));
		}
		refreshTable?.();
		return true;
	};

	useEffect(() => {
		if (open) {
			form.setFieldsValue({ ...detailData, tonghopmayxucId });
		}
	}, [open, detailData, tonghopmayxucId, form]);

	return (
		<ModalForm<NhatkymayxucItemType>
			title={title}
			open={open}
			onOpenChange={(visible) => {
				if (!visible)
					onCloseChange();
			}}
			labelCol={{ md: 6, xl: 5 }}
			layout="horizontal"
			form={form}
			autoFocusFirstInput
			modalProps={{ destroyOnHidden: true }}
			width={620}
			onFinish={onFinish}
		>
			<ProFormText name="tonghopmayxucId" label="Mã tổng hợp" disabled />
			<ProFormText name="ngaythang" label="Ngày tháng" placeholder="Nhập ngày tháng" />
			<ProFormText name="donVi" label="Đơn vị" placeholder="Nhập đơn vị" />
			<ProFormText name="viTri" label="Vị trí" placeholder="Nhập vị trí" />
			<ProFormText name="trangThai" label="Trạng thái" placeholder="Nhập trạng thái" />
			<ProFormTextArea name="ghiChu" label="Ghi chú" placeholder="Nhập ghi chú" />
		</ModalForm>
	);
}
