import type { ThongsokythuatmayxucItemType } from "#src/api/mayxuc/thongso";
import { fetchAddThongsokythuatmayxucItem, fetchUpdateThongsokythuatmayxucItem } from "#src/api/mayxuc/thongso";
import { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<ThongsokythuatmayxucItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<ThongsokythuatmayxucItemType>();

	const onFinish = async (values: ThongsokythuatmayxucItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values;
		if (detailData.id) {
			await fetchUpdateThongsokythuatmayxucItem(payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddThongsokythuatmayxucItem(payload);
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
		<ModalForm<ThongsokythuatmayxucItemType>
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
				name="tenThietBi"
				label="Tên thiết bị"
				placeholder="Nhập tên thiết bị"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="mayXucId"
				label="Mã máy xúc"
				placeholder="Nhập mã máy xúc"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText name="noiDung" label="Nội dung" placeholder="Nhập nội dung" />
			<ProFormText name="donViTinh" label="Đơn vị tính" placeholder="Nhập đơn vị tính" />
			<ProFormTextArea name="thongSo" label="Thông số" placeholder="Nhập thông số" />
		</ModalForm>
	);
}
