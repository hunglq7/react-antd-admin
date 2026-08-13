import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { ChucvuItemType } from "#src/api/danhmuc/chucvu/types";

import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { fetchChucvuList, fetchDeleteChucvuItem, fetchDeleteChucvuItems } from "#src/api/danhmuc/chucvu";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";

import { Detail } from "./components/detail";

export default function ChucVu() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<ChucvuItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteChucvuItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0)
			return;
		await fetchDeleteChucvuItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchChucvuList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Chức vụ": item.tenChucVu,
				"Trạng thái": item.trangThai ? "Hoạt động" : "Không hoạt động",

			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Chức vụ", "Trạng thái"],
			});
			worksheet["!cols"] = [{ wch: 5 }, { wch: 18 }, { wch: 30 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "ChucVu");
			XLSX.writeFile(workbook, "chucvu_danhmuc.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error(error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<ChucvuItemType>[] = [
		{
			title: "Chức vụ",
			dataIndex: "tenChucVu",
			search: true,
			ellipsis: true,
		},

		{
			title: "Trạng thái",
			dataIndex: "trangThai",
			valueType: "switch",
			search: false,
			render: value => (
				<Tag color={value ? "success" : "default"}>{value ? "Hoạt động" : "Không hoạt động"}</Tag>
			),
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
			<BasicTable<ChucvuItemType>
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
					const data = await fetchChucvuList();
					const filtered = data.filter((item) => {
						const keyword = String(params?.tenChucVu ?? "").trim().toLowerCase();

						return (
							(item.tenChucVu?.toLowerCase().includes(keyword) ?? false)

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
					<Button key="delete" danger disabled={!hasAccessByCodes(accessControlCodes.delete) || selectedRowKeys.length === 0} onClick={handleBulkDelete}>
						{t("common.batchDelete")}
					</Button>,
				]}
			/>
			<Detail title={title} open={isOpen} detailData={detailData} onCloseChange={onCloseChange} refreshTable={() => actionRef.current?.reload()} />
		</BasicContent>
	);
}
