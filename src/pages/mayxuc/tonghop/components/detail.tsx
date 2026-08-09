import type { TonghopmayxucItemType } from "#src/api/mayxuc/tonghop";
import { fetchMayxucList } from "#src/api/mayxuc/danhmuc";

import { fetchAddTonghopmayxucItem, fetchUpdateTonghopmayxucItem } from "#src/api/mayxuc/tonghop";
import { fetchPhongbanList } from "#src/api/system/phongban";
import {
	ModalForm,
	ProFormSelect,
	ProFormSwitch,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NhatkyTab } from "./nhatky-tab";
import { ThongsoTab } from "./thongso-tab";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<TonghopmayxucItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<TonghopmayxucItemType>();
	const [mayxucOptions, setMayxucOptions] = useState<{ label: string, value: number }[]>([]);
	const [phongbanOptions, setPhongbanOptions] = useState<{ label: string, value: number }[]>([]);

	const onFinish = async (values: TonghopmayxucItemType) => {
		const selectedMayxuc = mayxucOptions.find(item => item.value === values.mayxucId);
		const selectedPhongban = phongbanOptions.find(item => item.value === values.phongBanId);

		const payload: TonghopmayxucItemType = {
			...detailData,
			...values,
			tenMayXuc: selectedMayxuc?.label ?? detailData.tenMayXuc,
			tenPhongBan: selectedPhongban?.label ?? detailData.tenPhongBan,
		};

		if (detailData.id) {
			await fetchUpdateTonghopmayxucItem(payload);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await fetchAddTonghopmayxucItem(payload);
			window.$message?.success(t("common.addSuccess"));
		}
		refreshTable?.();
		return true;
	};

	useEffect(() => {
		const loadOptions = async () => {
			const [mayxucData, phongbanData] = await Promise.all([
				fetchMayxucList(),
				fetchPhongbanList(),
			]);

			const mayxucOptions = mayxucData.map(item => ({
				label: item.tenThietBi ?? "",
				value: item.id ?? 0,
			}));
			const phongbanOptions = phongbanData.map(item => ({
				label: item.tenPhong ?? "",
				value: item.id ?? 0,
			}));

			setMayxucOptions(mayxucOptions);
			setPhongbanOptions(phongbanOptions);

			if (open) {
				form.setFieldsValue({
					...detailData,
					mayxucId:
						detailData.mayxucId
						?? mayxucOptions.find(item => item.label === detailData.tenMayXuc)?.value,
					phongBanId:
						detailData.phongBanId
						?? phongbanOptions.find(item => item.label === detailData.tenPhongBan)?.value,
				});
			}
		};

		loadOptions();
	}, [open, detailData, form]);

	return (
		<ModalForm<TonghopmayxucItemType>
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
			width={700}
			onFinish={onFinish}
		>
			<Tabs defaultActiveKey="main">
				<Tabs.TabPane tab="Thông tin" key="main">
					<ProFormText name="maQuanLy" label="Mã quản lý" placeholder="Nhập mã quản lý" />
					<ProFormSelect
						name="mayxucId"
						label="Tên máy xúc"
						placeholder="Chọn máy xúc"
						options={mayxucOptions}
						fieldProps={{
							showSearch: true,
							optionFilterProp: "label",
						}}
						rules={[{ required: true, message: t("form.required") }]}
					/>
					<ProFormSelect
						name="phongBanId"
						label="Tên phòng ban"
						placeholder="Chọn phòng ban"
						options={phongbanOptions}
						fieldProps={{
							showSearch: true,
							optionFilterProp: "label",
						}}
						rules={[{ required: true, message: t("form.required") }]}
					/>
					<ProFormText name="loaiThietBi" label="Loại thiết bị" placeholder="Nhập loại thiết bị" />
					<ProFormText name="viTriLapDat" label="Vị trí lắp đặt" placeholder="Nhập vị trí lắp đặt" />
					<ProFormText name="ngayLap" label="Ngày lắp" placeholder="Nhập ngày lắp" />
					<ProFormText name="tinhTrang" label="Tình trạng" placeholder="Nhập tình trạng" />
					<ProFormText name="soLuong" label="Số lượng" placeholder="Nhập số lượng" />
					<ProFormSwitch name="duPhong" label="Dự phòng" />
					<ProFormTextArea name="ghiChu" label="Ghi chú" placeholder="Nhập ghi chú" />
				</Tabs.TabPane>
				<Tabs.TabPane tab="Nhật ký máy xúc" key="nhatky">
					<NhatkyTab tonghopmayxucId={detailData.id} />
				</Tabs.TabPane>
				<Tabs.TabPane tab="Thông số máy xúc" key="thongso">
					<ThongsoTab />
				</Tabs.TabPane>
			</Tabs>
		</ModalForm>
	);
}
