import type { TonghopbienapItemType } from "#src/api/bienap/tonghop";
import type { Dayjs } from "dayjs";
import { fetchBienapList } from "#src/api/bienap/danhmuc";
import { fetchAddTonghopbienapItem, fetchUpdateTonghopbienapItem } from "#src/api/bienap/tonghop";

import { fetchPhongbanList } from "#src/api/system/phongban";
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type TonghopbienapFormType = Omit<TonghopbienapItemType, "ngayLap"> & {
	ngayLap?: Dayjs
};

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<TonghopbienapItemType>
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
	const [form] = Form.useForm<TonghopbienapFormType>();
	const [bienapOptions, setBienapOptions] = useState<{ label: string, value: number }[]>([]);
	const [phongbanOptions, setPhongbanOptions] = useState<{ label: string, value: number }[]>([]);

	const onFinish = async (values: TonghopbienapFormType) => {
		try {
			if (!values.ngayLap) {
				window.$message?.error(t("form.required"));
				return false;
			}

			let ngayLapStr: string;
			if (typeof values.ngayLap === "string") {
				ngayLapStr = values.ngayLap;
			}
			else if (values.ngayLap && typeof values.ngayLap.format === "function") {
				ngayLapStr = values.ngayLap.format("YYYY-MM-DD");
			}
			else {
				window.$message?.error("Ngày lắp không hợp lệ");
				return false;
			}

			const normalizedValues: TonghopbienapItemType = {
				...values,
				ngayLap: ngayLapStr,
			};
			const payload: TonghopbienapItemType = detailData.id ? { ...detailData, ...normalizedValues } : normalizedValues;
			if (detailData.id) {
				await fetchUpdateTonghopbienapItem(payload);
				window.$message?.success(t("common.updateSuccess"));
			}
			else {
				await fetchAddTonghopbienapItem(payload);
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
			const bienapData = await fetchBienapList();
			const phongbanData = await fetchPhongbanList();
			setBienapOptions(bienapData.map(item => ({ label: item.tenThietBi, value: item.id ?? 0 })));
			setPhongbanOptions(phongbanData.map(item => ({ label: item.tenPhong, value: item.id ?? 0 })));
		};

		loadOptions();

		if (open) {
			form.setFieldsValue({
				bienapId: detailData.bienapId,
				phongbanId: detailData.phongbanId,
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
		<ModalForm<TonghopbienapFormType>
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
				name="bienapId"
				label="Tên thiết bị"
				placeholder="Chọn thiết bị"
				options={bienapOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="phongbanId"
				label="Tên phòng ban"
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
			<ProFormSwitch
				name="duPhong"
				label="Dự phòng"
			/>
			<ProFormTextArea
				name="ghiChu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"
			/>
		</ModalForm>
	);
}
