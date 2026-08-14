import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { MaycaoThongsoItemType } from "#src/api/maycao/thongso/types";

import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import { fetchDeleteThongsokythuatmaycaoItem, fetchDeleteThongsokythuatmaycaoItems, fetchThongsokythuatmaycaoList } from "#src/api/maycao/thongso";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";

import { Detail } from "./components/detail";

export default function MaycaoThongso() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<MaycaoThongsoItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteThongsokythuatmaycaoItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0)
			return;
		await fetchDeleteThongsokythuatmaycaoItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchThongsokythuatmaycaoList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Tên thiết bị": item.mayCaoId,
				"Nội dung": item.noiDung,
				"Đơn vị tính": item.donViTinh,
				"Thông số": item.thongSo,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên thiết bị", "Nội dung", "Đơn vị tính", "Thông số"],
			});
			worksheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 30 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Thongsomaycao");
			XLSX.writeFile(workbook, "thongsomaycao.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error(error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<MaycaoThongsoItemType>[] = [
		{
			title: "Tên thiết bị",
			dataIndex: "tenThietBi",
			ellipsis: true,
		},

		{
			title: "Nội dung",
			dataIndex: "noiDung",
			ellipsis: true,
			search: false,
		},
		{
			title: "Đơn vị tính",
			dataIndex: "donViTinh",
			ellipsis: true,
			search: false,
		},
		{
			title: "Thông số",
			dataIndex: "thongSo",
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
						setTitle("Sửa thông số máy cào");
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
			<BasicTable<MaycaoThongsoItemType>
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
					const data = await fetchThongsokythuatmaycaoList();
					const filtered = data.filter((item) => {
						const mayCaoId = String(params?.mayCaoId ?? "").trim();
						return (

							(mayCaoId ? String(item.mayCaoId ?? "").includes(mayCaoId) : true)
						);
					});
					return {
						data: filtered,
						total: filtered.length,
					};
				}}
				search={{ labelWidth: "auto", defaultCollapsed: false }}
				headerTitle="Thông số máy cào"
				toolBarRender={() => [
					<Button
						key="add"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle("Thêm thông số máy cào");
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
