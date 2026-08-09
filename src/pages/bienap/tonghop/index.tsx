import type { TonghopbienapItemType } from "#src/api/bienap/tonghop";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";

import { fetchDeleteTonghopbienapItem, fetchDeleteTonghopbienapItems, fetchTonghopbienapList } from "#src/api/bienap/tonghop";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";

import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import { Detail } from "./components/detail";
import { getConstantColumns } from "./constants";

export default function Tonghopbienap() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<TonghopbienapItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteTonghopbienapItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) {
			return;
		}
		await fetchDeleteTonghopbienapItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchTonghopbienapList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Tên thiết bị": item.tenThietBi ?? item.bienapId,
				"Tên phòng ban": item.tenPhongBan ?? item.phongbanId,
				"Vị trí lắp đặt": item.viTriLapDat,
				"Ngày lắp": item.ngayLap,
				"Dự phòng": item.duPhong ? "Có" : "Không",
				"Ghi chú": item.ghiChu,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "ID Biến áp", "ID Phòng ban", "Vị trí lắp đặt", "Ngày lắp", "Dự phòng", "Ghi chú"],
			});
			// Set độ rộng cột
			worksheet["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 30 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Tonghopbienap");
			XLSX.writeFile(workbook, "tonghopbienap.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error("Export failed", error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<TonghopbienapItemType>[] = [
		...getConstantColumns(t),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 160,
			fixed: "right",
			render: (_, record, __, action) => [
				<BasicButton
					key="editable"
					type="link"
					size="small"
					disabled={!hasAccessByCodes(accessControlCodes.update)}
					onClick={() => {
						setIsOpen(true);
						setTitle(t("system.tonghopbienap.editTonghopbienap"));
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
					<BasicButton
						type="link"
						size="small"
						danger
						disabled={!hasAccessByCodes(accessControlCodes.delete)}
					>
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

	const refreshTable = () => {
		actionRef.current?.reload();
	};

	return (
		<BasicContent className="h-full">
			<BasicTable<TonghopbienapItemType>
				adaptive
				columns={columns}
				actionRef={actionRef}
				rowSelection={{
					selectedRowKeys,
					onChange: keys => setSelectedRowKeys(keys),
				}}
				tableAlertRender={({ selectedRowKeys }) => (
					<div>
						{t("common.selectedRows", { count: selectedRowKeys?.length ?? 0 })}
					</div>
				)}
				tableAlertOptionRender={({ onCleanSelected }) => (
					<Button type="link" onClick={onCleanSelected}>
						{t("common.cancelAll")}
					</Button>
				)}
				request={async (params) => {
					const data = await fetchTonghopbienapList();
					const filtered = data.filter((item) => {
						const keyword = String(params?.viTriLapDat ?? "").trim().toLowerCase();
						const donvi = String(params?.tenPhongBan ?? "").trim().toLowerCase();
						return (
							(item.viTriLapDat?.toLowerCase().includes(keyword) ?? false)
							&& (item.tenPhongBan?.toLowerCase().includes(donvi) ?? false)
						);
					});
					return {
						data: filtered,
						total: filtered.length,
					};
				}}
				search={{
					labelWidth: "auto",
					defaultCollapsed: false,
				}}
				headerTitle={t("system.tonghopbienap.tonghopbienap")}
				toolBarRender={() => [
					<Button
						key="add-tonghopbienap"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("system.tonghopbienap.addTonghopbienap"));
							setDetailData({});
						}}
					>
						{t("common.add")}
					</Button>,
					<Button
						key="export-excel"
						icon={<DownloadOutlined />}
						onClick={handleExportExcel}
					>
						{t("common.exportExcel")}
					</Button>,
					<Button
						key="bulk-delete"
						danger
						disabled={!hasAccessByCodes(accessControlCodes.delete) || selectedRowKeys.length === 0}
						onClick={handleBulkDelete}
					>
						{t("common.batchDelete")}
					</Button>,
				]}
			/>
			<Detail
				title={title}
				open={isOpen}
				detailData={detailData}
				onCloseChange={onCloseChange}
				refreshTable={refreshTable}
			/>
		</BasicContent>
	);
}
