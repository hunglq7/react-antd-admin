import type { DonviItemType } from "#src/api/danhmuc/donvi/types";
import type {
	ActionType,
	ProColumns,
	ProCoreActionType,
} from "@ant-design/pro-components";
import {
	fetchDeleteDonviItem,
	fetchDeleteDonviItems,
	fetchDonviList,
} from "#src/api/danhmuc/donvi/index";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getConstantColumns } from "./components/constansColumns";
import ExportExcel from "./components/ExportExcel";
import { Model } from "./components/Model";

export default function DonviPage() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<DonviItemType>>({});
	const [filteredData, setFilteredData] = useState<DonviItemType[]>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (
		id: number,
		action?: ProCoreActionType<object>,
	) => {
		await fetchDeleteDonviItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) {
			return;
		}
		await fetchDeleteDonviItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	// Tạo bảng dữ liệu
	const columns: ProColumns<DonviItemType>[] = [
		...getConstantColumns(t),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 80,
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
			<BasicTable<DonviItemType>
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
					const data = await fetchDonviList();
					const filtered = data.filter((item) => {
						const keyword = String(params?.tenPhong ?? "")
							.trim()
							.toLowerCase();

						return item.tenPhong?.toLowerCase().includes(keyword) ?? false;
					});
					setFilteredData(filtered);
					return {
						data: filtered,
						total: filtered.length,
					};
				}}
				search={{
					labelWidth: "auto",
					defaultCollapsed: false,
				}}
				headerTitle={t("system.donvi.donviDanhsach")}
				toolBarRender={() => [
					// Nút thêm mới
					<Button
						key="add-donvi"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("system.donvi.addDonvi"));
							setDetailData({});
						}}
					>
						{t("common.add")}
					</Button>,
					// Xuất dữ liệu ra file excel
					<ExportExcel key="export-excel" data={filteredData} />,
					// Nút xóa nhiều dòng
					<Popconfirm
						key="bulk-delete-confirm"
						title={`Bạn có muốn xóa ${selectedRowKeys.length} bản ghi`}
						onConfirm={handleBulkDelete}
					>
						<Button
							key="bulk-delete"
							hidden={
								!hasAccessByCodes(accessControlCodes.delete)
								|| selectedRowKeys.length === 0
							}
							danger
							icon={<DeleteOutlined />}
						>
							Xóa dòng chọn
						</Button>
					</Popconfirm>,
				]}
			/>
			<Model
				title={title}
				open={isOpen}
				detailData={detailData}
				onCloseChange={onCloseChange}
				refreshTable={refreshTable}
			/>
		</BasicContent>
	);
}
