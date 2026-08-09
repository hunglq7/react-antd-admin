import type { MayxucItemType } from "#src/api/mayxuc/danhmuc";
import { fetchAddMayxucItem, fetchUpdateMayxucItem } from "#src/api/mayxuc/danhmuc";
import { ModalForm, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<MayxucItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<MayxucItemType>();

	const onFinish = async (values: MayxucItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values;
		if (detailData.id) {
			await fetchUpdateMayxucItem(payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddMayxucItem(payload);
			window.$message?.success(t("common.addSuccess"));
		}
		refreshTable?.();
		return true;
	};

	useEffect(() => {
		if (open) {
			form.setFieldsValue(detailData);
		}
	}, [open, detailData, form]);

	return (
		<ModalForm<MayxucItemType>
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
			<ProFormText
				name="maTaiSan"
				label="Mã tài sản"
				placeholder="Nhập mã tài sản"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="tenThietBi"
				label="Tên thiết bị"
				placeholder="Nhập tên thiết bị"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText name="loaiThietBi" label="Loại thiết bị" placeholder="Nhập loại thiết bị" />
			<ProFormText name="namSanXuat" label="Năm sản xuất" placeholder="Nhập năm sản xuất" />
			<ProFormText name="hangSanXuat" label="Hãng sản xuất" placeholder="Nhập hãng sản xuất" />
			<ProFormSwitch name="tinhTrang" label="Tình trạng" />
			<ProFormTextArea name="ghiChu" label="Ghi chú" placeholder="Nhập ghi chú" />
		</ModalForm>
	);
}
