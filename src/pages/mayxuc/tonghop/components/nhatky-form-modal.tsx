import type { Dayjs } from "dayjs";
import type { NhatkymayxucItemType } from "#src/api/mayxuc/nhatky";
import {
	ModalForm,
	ProFormDatePicker,
	ProFormSwitch,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	fetchAddNhatkymayxucItem,
	fetchUpdateNhatkymayxucItem,
} from "#src/api/mayxuc/nhatky";

interface NhatkyFormModalProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<NhatkymayxucItemType>
	tonghopmayxucId?: number
	onCloseChange: () => void
	refreshTable?: () => void
}

export function NhatkyFormModal({
	title,
	open,
	detailData,
	tonghopmayxucId,
	onCloseChange,
	refreshTable,
}: NhatkyFormModalProps) {
	const { t } = useTranslation();
	type NhatkymayxucFormType = Omit<NhatkymayxucItemType, "ngaythang" | "trangThai"> & {
		ngaythang?: Dayjs | string
		trangThai?: boolean
	};
	const [form] = Form.useForm<NhatkymayxucFormType>();

	const onFinish = async (values: NhatkymayxucFormType) => {
		if (!tonghopmayxucId) {
			window.$message?.error("Vui lòng lưu thông tin tổng hợp trước khi thêm nhật ký");
			return false;
		}

		if (!values.ngaythang) {
			window.$message?.error(t("form.required"));
			return false;
		}

		let ngaythangStr: string;
		if (typeof values.ngaythang === "string") {
			ngaythangStr = values.ngaythang;
		}
		else if (values.ngaythang && typeof values.ngaythang.format === "function") {
			ngaythangStr = values.ngaythang.format("YYYY-MM-DD");
		}
		else {
			window.$message?.error("Ngày thay không hợp lệ");
			return false;
		}

		const statusValue = values.trangThai ? "Hoạt động" : "Hỏng";

		const payload: NhatkymayxucItemType = {
			...detailData,
			...values,
			ngaythang: ngaythangStr,
			donVi: values.donVi,
			trangThai: statusValue,
			tonghopmayxucId,
		};

		if (detailData.id) {
			await fetchUpdateNhatkymayxucItem(detailData.id, payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddNhatkymayxucItem(payload);
			window.$message?.success(t("common.addSuccess"));
		}
		refreshTable?.();
		return true;
	};

	useEffect(() => {
		if (open) {
			form.setFieldsValue({
				...detailData,
				ngaythang: detailData.ngaythang ? dayjs(detailData.ngaythang) : undefined,
				trangThai: detailData.trangThai !== "Hỏng",
			});
		}
	}, [open, detailData, form]);

	return (
		<ModalForm<NhatkymayxucFormType>
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
			width={600}
			onFinish={onFinish}
			initialValues={{
				trangThai: true,
			}}
		>
			<ProFormDatePicker
				name="ngaythang"
				label="Ngày thay"
				placeholder="Chọn ngày thay"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="donVi"
				label="Đơn vị"
				placeholder="Nhập đơn vị"
			/>
			<ProFormText
				name="viTri"
				label="Vị trí"
				placeholder="Nhập vị trí"
			/>
			<ProFormSwitch name="trangThai" label="Trạng thái" />
			<ProFormTextArea
				name="ghiChu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"
			/>
		</ModalForm>
	);
}
