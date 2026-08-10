import type { Dayjs } from "dayjs";
import type { TaikhoanDetailItemType } from "#src/api/hethong/taikhoan";
import { ModalForm, ProFormDatePicker, ProFormText } from "@ant-design/pro-components";

import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAddTaikhoan, fetchUpdateTaikhoan } from "#src/api/hethong/taikhoan";

type TaikhoanFormType = Omit<TaikhoanDetailItemType, "dob"> & {
	dob?: Dayjs | string
};

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<TaikhoanDetailItemType>
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
	const [form] = Form.useForm<TaikhoanFormType>();
	const onFinish = async (values: TaikhoanFormType) => {
		try {
			if (!values.dob) {
				window.$message?.error(t("form.required"));
				return false;
			}

			let ngaytaoStr: string;
			if (typeof values.dob === "string") {
				ngaytaoStr = values.dob;
			}
			else if (values.dob && typeof values.dob.format === "function") {
				ngaytaoStr = values.dob.format("YYYY-MM-DD");
			}
			else {
				window.$message?.error("Ngày lắp không hợp lệ");
				return false;
			}

			const normalizedValues: TaikhoanFormType = {
				...values,
				dob: ngaytaoStr ? dayjs(ngaytaoStr) : undefined,
			};
			const payload: TaikhoanFormType = detailData.id ? { ...detailData, ...normalizedValues } : normalizedValues;
			if (detailData.id) {
				await fetchUpdateTaikhoan(detailData.id, payload as TaikhoanDetailItemType);
				window.$message?.success(t("common.updateSuccess"));
			}
			else {
				await fetchAddTaikhoan(payload as TaikhoanDetailItemType);
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
		<ModalForm<TaikhoanFormType>
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
				name="firstName"
				label="Tên"
				placeholder="Tên người dùng"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="lastName"
				label="Họ"
				placeholder="Họ người dùng"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormDatePicker
				name="dob"
				label="Ngày sinh"
				placeholder="Chọn ngày sinh"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="email"
				label="Email"
				placeholder="Nhập Email"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="phoneNumber"
				label="Điện thoại"
				placeholder="Nhập số điện thoại"
			/>
			<ProFormText
				name="userName"
				label="Tên tài khoản"
				placeholder="Nhập tên tài khoản"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="fullName"
				label="Tên đầy đủ"
				placeholder="Nhập tên đầy đủ"
			/>
			<ProFormText
				name="password"
				label="Mật khẩu"
				placeholder="Nhập mật khẩu"
			/>
			<ProFormText
				name="confirmPassword"
				label="Nhập lại mật khẩu"
				placeholder="Nhập lại mật khẩu"
			/>
		</ModalForm>
	);
}
