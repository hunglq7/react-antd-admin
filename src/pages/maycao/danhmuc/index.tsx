import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { MaycaoDanhmucItemType } from "#src/api/maycao/danhmuc/types";

import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { fetchDeleteMaycaoDanhmucItem, fetchDeleteMaycaoDanhmucItems, fetchMaycaoDanhmucList } from "#src/api/maycao/danhmuc";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";

import { Detail } from "./components/detail";

export default function MaycaoDanhmuc() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<MaycaoDanhmucItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteMaycaoDanhmucItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0)
			return;
		await fetchDeleteMaycaoDanhmucItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchMaycaoDanhmucList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Tên thiết bị": item.tenThietBi,
				"Loại thiết bị": item.loaiThietBi,
				"Ghi chú": item.ghiChu,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên thiết bị", "Loại thiết bị", "Ghi chú"],
			});
			worksheet["!cols"] = [{ wch: 5 }, { wch: 18 }, { wch: 20 }, { wch: 30 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "MaycaoDanhmuc");
			XLSX.writeFile(workbook, "maycao_danhmuc.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error(error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<MaycaoDanhmucItemType>[] = [
		{
			title: "Tên thiết bị",
			dataIndex: "tenThietBi",
			search: true,
			ellipsis: true,
		},

		{
			title: "Loại thiết bị",
			dataIndex: "loaiThietBi",
			search: true,
			ellipsis: true,
		},
		{
			title: "Ghi chú",
			dataIndex: "ghiChu",
			search: false,
			ellipsis: true,
		},

		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 160,
			fixed: "right",
			render: (_, record, __, action) => [
				<BasicButton
					key="edit"
					type="link"
					size="small"
					disabled={!hasAccessByCodes(accessControlCodes.update)}
					onClick={() => {
						setIsOpen(true);
						setTitle("Sửa chức vụ");
						setDetailData(record);
					}}
				>
					{t("common.edit")}
				</BasicButton>,
				<Popconfirm
					key="delete"
					title={t("common.confirmDelete")}
					onConfirm={() => handleDeleteRow(record.id!, action)}
					okText={t("common.confirm")}
					cancelText={t("common.cancel")}
				>
					<BasicButton type="link" size="small" danger disabled={!hasAccessByCodes(accessControlCodes.delete)}>
						{t("common.delete")}
					</BasicButton>
				</Popconfirm>,
			],
		},
	];

	const onCloseChange = () => {
		setIsOpen(false);
		setDetailData({});
	};

	return (
		<BasicContent className="h-full">
			<BasicTable<MaycaoDanhmucItemType>
				adaptive
				columns={columns}
				actionRef={actionRef}
				rowSelection={{
					selectedRowKeys,
					onChange: keys => setSelectedRowKeys(keys),
				}}
				tableAlertRender={({ selectedRowKeys }) => <div>{t("common.selectedRows", { count: selectedRowKeys?.length ?? 0 })}</div>}
				tableAlertOptionRender={({ onCleanSelected }) => (
					<Button type="link" onClick={onCleanSelected}>
						{t("common.cancelAll")}
					</Button>
				)}
				request={async (params) => {
					const data = await fetchMaycaoDanhmucList();
					const filtered = data.filter((item) => {
						const keyword = String(params?.tenThietBi ?? "").trim().toLowerCase();
						const loai = String(params?.loaiThietBi ?? "").trim().toLowerCase();
						return (
							(item.tenThietBi?.toLowerCase().includes(keyword) ?? false)
							&& (item.loaiThietBi?.toLowerCase().includes(loai) ?? false)
						);
					});
					return {
						data: filtered,
						total: filtered.length,
					};
				}}
				search={{ labelWidth: "auto", defaultCollapsed: false }}
				headerTitle="Chức vụ"
				toolBarRender={() => [
					<Button
						key="add"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle("Thêm chức vụ");
							setDetailData({});
						}}
					>
						{t("common.add")}
					</Button>,
					<Button key="export" icon={<DownloadOutlined />} onClick={handleExportExcel}>
						{t("common.exportExcel")}
					</Button>,
					<Popconfirm
						key="delete"
						title={t("common.confirmDelete")}
						onConfirm={() => handleBulkDelete()}
						okText={t("common.confirm")}
						cancelText={t("common.cancel")}
					>
						<Button danger disabled={!hasAccessByCodes(accessControlCodes.delete) || selectedRowKeys.length === 0}>
							{t("common.batchDelete")}
						</Button>
						,
					</Popconfirm>,

				]}
			/>
			<Detail title={title} open={isOpen} detailData={detailData} onCloseChange={onCloseChange} refreshTable={() => actionRef.current?.reload()} />
		</BasicContent>
	);
}
