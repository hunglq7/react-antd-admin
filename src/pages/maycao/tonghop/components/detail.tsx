import type { MaycaoThongsoItemType } from "#src/api/maycao/thongso/types";
import { ModalForm, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchMaycaoDanhmucList } from "#src/api/maycao/danhmuc";
import { fetchAddThongsokythuatmaycaoItem, fetchUpdateThongsokythuatmaycaoItem } from "#src/api/maycao/thongso";
import { fetchPhongbanList } from "#src/api/system/phongban";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<MaycaoThongsoItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<MaycaoThongsoItemType>();
	const [maycaoOptions, setMaycaoOptions] = useState<{ label: string, value: number }[]>([]);
	const [phongbanOptions, setPhongbanOptions] = useState<{ label: string, value: number }[]>([]);
	const onFinish = async (values: MaycaoThongsoItemType) => {
		const payload = detailData.id ? { ...detailData, ...values } : values;
		if (detailData.id) {
			await fetchUpdateThongsokythuatmaycaoItem(payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddThongsokythuatmaycaoItem(payload);
			window.$message?.success(t("common.addSuccess"));
		}
		refreshTable?.();
		return true;
	};

	useEffect(() => {
		const loadOptions = async () => {
			const maycaoData = await fetchMaycaoDanhmucList();
			const phongbanData = await fetchPhongbanList();
			setMaycaoOptions(maycaoData.map(item => ({ label: item.tenThietBi, value: item.id ?? 0 })));
			setPhongbanOptions(phongbanData.map(item => ({ label: item.tenPhong, value: item.id ?? 0 })));
		};
		loadOptions();
		if (open) {
			form.setFieldsValue(detailData);
		}
	}, [open, detailData, form]);

	return (
		<ModalForm<MaycaoThongsoItemType>
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
			<ProFormText name="maQuanLy" label="Mã quản lý" placeholder="Nhập mã quản lý" />
			<ProFormSelect
				name="mayCaoId"
				label="Tên thiết bị"
				placeholder="Chọn thiết bị"
				options={maycaoOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="donViId"
				label="Tên phòng ban"
				placeholder="Chọn phòng ban"
				options={phongbanOptions}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormText name="viTriLapDat" label="Vị trí lắp đặt" placeholder="Nhập vị trí lắp đặt" />
			<ProFormText name="ngayLap" label="Ngày lắp" placeholder="Nhập ngày lắp" />
			<ProFormTextArea name="soLuong" label="Số lượng" placeholder="Nhập số lượng" />
			<ProFormTextArea name="chieuDaiMay" label="Chiều dài máy" placeholder="Nhập chiều dài máy" />
			<ProFormTextArea name="soLuongXic" label="Số lượng xích" placeholder="Nhập số lượng xích" />
			<ProFormTextArea name="soLuongCauMang" label="Số lượng cầu mang" placeholder="Nhập số lượng cầu mang" />
			<ProFormTextArea name="tinhTrangThietBi" label="Tình trạng thiết bị" placeholder="Nhập tình trạng thiết bị" />
			<ProFormSwitch name="duPhong" label="Dự phòng" />
			<ProFormTextArea name="ghiChu" label="Ghi chú" placeholder="Nhập ghi chú" />

		</ModalForm>
	);
}
