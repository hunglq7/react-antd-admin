import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { TonghopmayxucItemType } from "#src/api/mayxuc/tonghop";

import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import { fetchDeleteTonghopmayxucItem, fetchDeleteTonghopmayxucItems, fetchTonghopmayxucList } from "#src/api/mayxuc/tonghop";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";

import { Detail } from "./components/detail";

export default function MayxucDanhmuc() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<TonghopmayxucItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteTonghopmayxucItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0)
			return;
		await fetchDeleteTonghopmayxucItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchTonghopmayxucList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Mã quản lý": item.maQuanLy,
				"Thiết bị": item.tenMayXuc,
				"Đơn vị": item.tenPhongBan,
				"Loại thiết bị": item.loaiThietBi,
				"Vị trí lắp đặt": item.viTriLapDat,
				"Ngày lắp": item.ngayLap,
				"Số lượng": item.soLuong,
				"Dự phòng": item.duPhong ? "Đang dùng" : "Dự phòng",
				"Ghi chú": item.ghiChu,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Mã quản lý", "Thiết bị", "Đơn vị", "Loại thiết bị", "Vị trí lắp đặt", "Ngày lắp", "Số lượng", "Dự phòng", "Ghi chú"],
			});
			worksheet["!cols"] = [{ wch: 5 }, { wch: 18 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 18 }, { wch: 30 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "TonghopMayxuc");
			XLSX.writeFile(workbook, "tonghop_mayxuc.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error(error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<TonghopmayxucItemType>[] = [
		{
			title: "Mã quản lý",
			dataIndex: "maQuanLy",
			search: false,
			ellipsis: true,
		},
		{
			title: "Thiết bị",
			dataIndex: "tenMayXuc",
			ellipsis: true,
		},
		{
			title: "Đơn vị",
			dataIndex: "tenPhongBan",
			ellipsis: true,
		},
		{
			title: "Loại thiết bị",
			dataIndex: "loaiThietBi",
			ellipsis: true,
		},
		{
			title: "Vị trí lắp đặt",
			dataIndex: "viTriLapDat",
			ellipsis: true,
			search: false,
		},
		{
			title: "Ngày tháng",
			dataIndex: "ngayLap",
			valueType: "date",
			fieldProps: { format: "DD-MM-YYYY" },
			ellipsis: true,
		},
		{
			title: "Số lượng",
			dataIndex: "soLuong",
			ellipsis: true,
			search: false,
		},
		{
			title: "Dự phòng",
			dataIndex: "duPhong",
			valueType: "switch",
			render: value => (
				<Tag color={value ? "success" : "default"}>{value ? "Đang dùng" : "Dự phòng"}</Tag>
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
			<BasicTable<TonghopmayxucItemType>
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
					const data = await fetchTonghopmayxucList();
					const filtered = data.filter((item) => {
						const keyword = String(params?.tenMayXuc ?? "").trim().toLowerCase();
						const code = String(params?.maQuanLy ?? "").trim().toLowerCase();
						const type = String(params?.loaiThietBi ?? "").trim().toLowerCase();
						return (
							(item.tenMayXuc?.toLowerCase().includes(keyword) ?? false)
							&& (item.maQuanLy?.toLowerCase().includes(code) ?? false)
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
