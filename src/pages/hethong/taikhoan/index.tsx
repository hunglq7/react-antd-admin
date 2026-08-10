import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { TaikhoanItemType } from "#src/api/hethong/taikhoan";
import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { fetchDeleteMutipleTaikhoan, fetchDeleteTaikhoan, fetchTaikhoanList } from "#src/api/hethong/taikhoan";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";
import { Detail } from "./components/detail";
import { getConstantColumns } from "./constants";

export default function Taikhoan() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<TaikhoanItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteTaikhoan(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) {
			return;
		}
		await fetchDeleteMutipleTaikhoan(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchTaikhoanList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Tên tài khoản": item.userName,
				"Email": item.email,
				"Số điện thoại": item.phoneNumber,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên tài khoản", "Email", "Số điện thoại"],
			});
			// Set độ rộng cột
			worksheet["!cols"] = [{ wch: 5 }, { wch: 25 }, { wch: 35 }, { wch: 30 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Taikhoan");
			XLSX.writeFile(workbook, "taikhoan.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error("Export failed", error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<TaikhoanItemType>[] = [
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
						setTitle(t("system.taikhoan.editTaikhoan"));
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
			<BasicTable<TaikhoanItemType>
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
					const data = await fetchTaikhoanList();
					const filtered = data.filter((item) => {
						const keyword = String(params?.userName ?? "").trim().toLowerCase();
						const email = String(params?.email ?? "").trim().toLowerCase();
						const ten = String(params?.lastName ?? "").trim().toLowerCase();
						const ho = String(params?.firstName ?? "").trim().toLowerCase();
						return (
							(item.userName?.toLowerCase().includes(keyword) ?? false)
							&& (email ? (item.email?.toLowerCase().includes(email) ?? false) : true)
							&& (ten ? (item.lastName?.toLowerCase().includes(ten) ?? false) : true)
							&& (ho ? (item.firstName?.toLowerCase().includes(ho) ?? false) : true)
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
				headerTitle={t("system.taikhoan.taikhoanDanhsach")}
				toolBarRender={() => [
					<Button
						key="add-taikhoan"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("system.taikhoan.addTaikhoan"));
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
