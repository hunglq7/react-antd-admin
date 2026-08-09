import type { TonghopRoleItemType } from "#src/api/role/tonghop/types";
import type { Dayjs } from "dayjs";
import type { ReactNode } from "react";
import { fetchDanhmucRoleLiest } from "#src/api/role/danhmuc/index.js";

import {
	fetchAddTonghoproleItem,
	fetchUpdateTonghoproleItem,
} from "#src/api/role/tonghop/index.js";
import { fetchPhongbanList } from "#src/api/system/phongban";
import {
	ModalForm,
	ProFormDatePicker,
	ProFormDigit,
	ProFormSelect,
	ProFormSwitch,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type TonghoproleFormType = Omit<TonghopRoleItemType, "ngayLap"> & {
	ngayLap?: Dayjs
};

interface DetailProps {
	title: ReactNode
	open: boolean
	detailData: Partial<TonghopRoleItemType>
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
	const [form] = Form.useForm<TonghoproleFormType>();
	const [roleOptions, setRoleOptions] = useState<
		{ label: string, value: number }[]
	>([]);
	const [phongbanOptions, setPhongbanOptions] = useState<
		{ label: string, value: number }[]
	>([]);

	const onFinish = async (values: TonghoproleFormType) => {
		try {
			if (!values.ngayLap) {
				window.$message?.error(t("form.required"));
				return false;
			}

			let ngayLapStr: string;
			if (typeof values.ngayLap === "string") {
				ngayLapStr = values.ngayLap;
			}
			else if (
				values.ngayLap
				&& typeof values.ngayLap.format === "function"
			) {
				ngayLapStr = values.ngayLap.format("YYYY-MM-DD");
			}
			else {
				window.$message?.error("Ngày lắp không hợp lệ");
				return false;
			}

			const selectedRole = roleOptions.find(
				item => item.value === values.roleId,
			);
			const selectedPhongban = phongbanOptions.find(
				item => item.value === values.phongBanId,
			);

			const normalizedValues: TonghopRoleItemType = {
				...values,
				ngayLap: ngayLapStr,
				tenThietBi: selectedRole?.label ?? detailData.tenThietBi ?? "",
				tenPhong: selectedPhongban?.label ?? detailData.tenPhong ?? "",
			};
			const payload: TonghopRoleItemType = detailData.id
				? { ...(detailData as TonghopRoleItemType), ...normalizedValues }
				: normalizedValues;
			if (detailData.id) {
				await fetchUpdateTonghoproleItem(payload);
				window.$message?.success(t("common.updateSuccess"));
			}
			else {
				await fetchAddTonghoproleItem(payload);
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
		const loadOptions = async () => {
			const roleData = await fetchDanhmucRoleLiest();
			const phongbanData = await fetchPhongbanList();
			setRoleOptions(
				roleData.map(item => ({
					label: item.tenThietBi,
					value: item.id ?? 0,
				})),
			);
			setPhongbanOptions(
				phongbanData.map(item => ({
					label: item.tenPhong,
					value: item.id ?? 0,
				})),
			);
		};

		loadOptions();

		if (open) {
			form.setFieldsValue({
				roleId: detailData.roleId,
				phongBanId: detailData.phongBanId,
				tenThietBi: detailData.tenThietBi,
				soLuong: detailData.soLuong,
				tinhTrangThietBi: detailData.tinhTrangThietBi,
				viTriLapDat: detailData.viTriLapDat,
				ngayLap: detailData.ngayLap ? dayjs(detailData.ngayLap) : undefined,
				duPhong: detailData.duPhong ?? false,
				ghiChu: detailData.ghiChu,
			});
		}
		else {
			form.resetFields();
		}
	}, [open, detailData]);

	return (
		<ModalForm<TonghoproleFormType>
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
			<ProFormSelect
				name="roleId"
				label="Tên thiết bị"
				placeholder="Chọn thiết bị"
				options={roleOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="phongBanId"
				label="Đơn vị"
				placeholder="Chọn phòng ban"
				options={phongbanOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText
				name="viTriLapDat"
				label="Vị trí lắp đặt"
				placeholder="Nhập vị trí lắp đặt"
			/>
			<ProFormDatePicker
				name="ngayLap"
				label="Ngày lắp"
				placeholder="Chọn ngày lắp"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormDigit
				name="soLuong"
				label="Số lượng"
				min={1}
				fieldProps={{
					precision: 0, // chỉ cho số nguyên
				}}
				rules={[{ required: true, message: "Nhập số lượng" }]}
			/>
			<ProFormText name="tinhTrangThietBi" label="Tình trạng" />
			<ProFormSwitch name="duPhong" label="Dự phòng" />
			<ProFormTextArea
				name="ghiChu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"
			/>
		</ModalForm>
	);
}
