import type { PhongbanItemType } from "#src/api/system/phongban";
import { fetchAddPhongban, fetchUpdatePhongban } from "#src/api/system/phongban";

import { ModalForm, ProFormRadio, ProFormText } from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<PhongbanItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({
	title,
	open,
	detailData,
	onCloseChange,
	refreshTable,
}: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<PhongbanItemType>();

	const onFinish = async (values: PhongbanItemType) => {
		if (detailData.id) {
			await fetchUpdatePhongban(values);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddPhongban(values);
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
		<ModalForm<PhongbanItemType>
			title={title}
			open={open}
			onOpenChange={(visible) => {
				if (visible === false) {
					onCloseChange();
				}
			}}
			labelCol={{ md: 5, xl: 3 }}
			layout="horizontal"
			form={form}
			autoFocusFirstInput
			modalProps={{
				destroyOnHidden: true,
			}}
			grid
			width={{
				xl: 600,
				md: 500,
			}}
			onFinish={onFinish}
			initialValues={{
				trangThai: true,
			}}
		>
			<ProFormText
				allowClear
				rules={[
					{
						required: true,
						message: t("form.required"),
					},
				]}
				labelCol={{ md: 5, xl: 6 }}
				colProps={{ md: 24, xl: 24 }}
				name="tenPhong"
				label={t("system.phongban.name")}
			/>

			<ProFormRadio.Group
				name="trangThai"
				label={t("common.status")}
				radioType="button"
				labelCol={{ md: 5, xl: 6 }}
				colProps={{ md: 24, xl: 24 }}
				options={[
					{
						label: t("common.enabled"),
						value: true,
					},
					{
						label: t("common.deactivated"),
						value: false,
					},
				]}
			/>
		</ModalForm>
	);
}
