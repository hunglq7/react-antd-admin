import type { MayxucItemType } from "#src/api/mayxuc/danhmuc";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";

import { fetchDeleteMayxucItem, fetchDeleteMayxucItems, fetchMayxucList } from "#src/api/mayxuc/danhmuc";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";

import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import { Detail } from "./components/detail";

export default function MayxucDanhmuc() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<MayxucItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteMayxucItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0)
			return;
		await fetchDeleteMayxucItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchMayxucList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Mã tài sản": item.maTaiSan,
				"Tên thiết bị": item.tenThietBi,
				"Loại thiết bị": item.loaiThietBi,
				"Năm sản xuất": item.namSanXuat,
				"Hãng sản xuất": item.hangSanXuat,
				"Tình trạng": item.tinhTrang ? "Hoạt động" : "Không hoạt động",
				"Ghi chú": item.ghiChu,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Mã tài sản", "Tên thiết bị", "Loại thiết bị", "Năm sản xuất", "Hãng sản xuất", "Tình trạng", "Ghi chú"],
			});
			worksheet["!cols"] = [{ wch: 5 }, { wch: 18 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 30 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Mayxuc");
			XLSX.writeFile(workbook, "mayxuc_danhmuc.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error(error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<MayxucItemType>[] = [
		{
			title: "Mã tài sản",
			dataIndex: "maTaiSan",
			search: false,
			ellipsis: true,
		},
		{
			title: "Tên thiết bị",
			dataIndex: "tenThietBi",
			ellipsis: true,
		},
		{
			title: "Loại thiết bị",
			dataIndex: "loaiThietBi",
			ellipsis: true,
		},
		{
			title: "Năm sản xuất",
			dataIndex: "namSanXuat",
			ellipsis: true,
			search: false,
		},
		{
			title: "Hãng sản xuất",
			dataIndex: "hangSanXuat",
			ellipsis: true,
			search: false,
		},
		{
			title: "Tình trạng",
			dataIndex: "tinhTrang",
			valueType: "switch",
			render: value => (
				<Tag color={value ? "success" : "default"}>{value ? "Hoạt động" : "Không hoạt động"}</Tag>
			),
		},
		{
			title: "Ghi chú",
			dataIndex: "ghiChu",
			ellipsis: true,
			search: false,
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
						setTitle("Sửa máy xúc");
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
			<BasicTable<MayxucItemType>
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
					const data = await fetchMayxucList();
					const filtered = data.filter((item) => {
						const keyword = String(params?.tenThietBi ?? "").trim().toLowerCase();
						const code = String(params?.maTaiSan ?? "").trim().toLowerCase();
						const type = String(params?.loaiThietBi ?? "").trim().toLowerCase();
						return (
							(item.tenThietBi?.toLowerCase().includes(keyword) ?? false)
							&& (item.maTaiSan?.toLowerCase().includes(code) ?? false)
							&& (item.loaiThietBi?.toLowerCase().includes(type) ?? false)
						);
					});
					return {
						data: filtered,
						total: filtered.length,
					};
				}}
				search={{ labelWidth: "auto", defaultCollapsed: false }}
				headerTitle="Danh mục máy xúc"
				toolBarRender={() => [
					<Button
						key="add"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle("Thêm máy xúc");
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
