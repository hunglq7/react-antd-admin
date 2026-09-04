import type { TaikhoanItemType } from "#src/api/hethong/taikhoan";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import { fetchDeleteMutipleTaikhoan, fetchDeleteTaikhoan, fetchTaikhoanList } from "#src/api/hethong/taikhoan";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getConstantColumns } from "./components/constantsColumns";
import ExportExcel from "./components/ExportExcel";
import { Model } from "./components/Model";

export default function Taikhoan() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<TaikhoanItemType>>({});
	const [filteredData, setFilteredData] = useState<TaikhoanItemType[]>([]);
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
		await fetchDeleteMutipleTaikhoan(selectedRowKeys.map(String));
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	// Tạo bảng dữ liệu
	const columns: ProColumns<TaikhoanItemType>[] = [
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
				headerTitle={t("system.taikhoan.taikhoanDanhsach")}
				toolBarRender={() => [
					// Nút thêm mới
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
					// Xuất dữ liệu ra file excel
					<ExportExcel key="export-excel" data={filteredData} />,
					// Nút xóa nhiều dòng
					<Popconfirm
						key="bulk-delete-confirm"
						title={`Bạn có muốn xóa ${selectedRowKeys.length} bản ghi`}
						onConfirm={handleBulkDelete}
					>
						<Button key="bulk-delete" hidden={!hasAccessByCodes(accessControlCodes.delete) || selectedRowKeys.length === 0} danger icon={<DeleteOutlined />}>
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
