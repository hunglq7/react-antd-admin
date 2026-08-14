import type { MaycaoThongsoItemType } from "#src/api/maycao/thongso/types";
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchMaycaoDanhmucList } from "#src/api/maycao/danhmuc";
import { fetchAddThongsokythuatmaycaoItem, fetchUpdateThongsokythuatmaycaoItem } from "#src/api/maycao/thongso";

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
			setMaycaoOptions(maycaoData.map(item => ({ label: item.tenThietBi, value: item.id ?? 0 })));
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
			<ProFormText name="noiDung" label="Nội dung" placeholder="Nhập nội dung" />
			<ProFormText name="donViTinh" label="Đơn vị tính" placeholder="Nhập đơn vị tính" />
			<ProFormTextArea name="thongSo" label="Thông số" placeholder="Nhập thông số" />
		</ModalForm>
	);
}
