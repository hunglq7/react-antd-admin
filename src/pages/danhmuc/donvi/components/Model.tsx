import type { DonviItemType } from "#src/api/danhmuc/donvi/types";
import {
	fetchAddDonviItem,
	fetchUpdateDonviItem,
} from "#src/api/danhmuc/donvi/index";
import {
	ModalForm,
	ProFormSwitch,
	ProFormText,
} from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	title: React.ReactNode;
	open: boolean;
	detailData: Partial<DonviItemType>;
	onCloseChange: () => void;
	refreshTable?: () => void;
}

export function Model({
	title,
	open,
	detailData,
	onCloseChange,
	refreshTable,
}: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<DonviItemType>();
	const onFinish = async (values: DonviItemType) => {
		try {
			const payload = detailData.id ? { ...detailData, ...values } : values;
			if (detailData.id) {
				await fetchUpdateDonviItem(payload);
				window.$message?.success(t("common.updateSuccess"));
			}
			else {
				await fetchAddDonviItem(payload);
				window.$message?.success(t("common.addSuccess"));
			}
			refreshTable?.();
			onCloseChange();
			return true;
		}
		catch (error) {
			console.error("Save error:", error);
			window.$message?.error((error as any)?.message || t("common.saveFailed"));
			return false;
		}
	};

	useEffect(() => {
		if (open) {
			form.setFieldsValue(detailData);
		}
	}, [open]);
	return (
		<ModalForm<DonviItemType>
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
				name="tenPhong"
				label="Đơn vị"
				placeholder="Tên đơn vị"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSwitch name="trangThai" label="Trạng thái" initialValue={true} />
		</ModalForm>
	);
}
