import type { NhatkymayxucItemType } from "#src/api/mayxuc/nhatky";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";

import {
	fetchDeleteNhatkymayxucItem,
	fetchDeleteNhatkymayxucItems,
	fetchNhatkymayxucListByTonghopId,
} from "#src/api/mayxuc/nhatky";
import { BasicButton } from "#src/components/basic-button";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NhatkyFormModal } from "./nhatky-form-modal";

interface NhatkyTabProps {
	tonghopmayxucId?: number
}

export function NhatkyTab({ tonghopmayxucId }: NhatkyTabProps) {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [formOpen, setFormOpen] = useState(false);
	const [formTitle, setFormTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<NhatkymayxucItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteNhatkymayxucItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0)
			return;
		await fetchDeleteNhatkymayxucItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const columns: ProColumns<NhatkymayxucItemType>[] = [
		{ title: "Ngày tháng", dataIndex: "ngaythang", ellipsis: true },
		{ title: "Đơn vị", dataIndex: "donVi", ellipsis: true },
		{ title: "Vị trí", dataIndex: "viTri", ellipsis: true },
		{ title: "Trạng thái", dataIndex: "trangThai", ellipsis: true },
		{ title: "Ghi chú", dataIndex: "ghiChu", ellipsis: true },
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 120,
			render: (_, record, __, action) => [
				<BasicButton
					key="edit"
					type="link"
					size="small"
					disabled={!hasAccessByCodes(accessControlCodes.update)}
					onClick={() => {
						setFormOpen(true);
						setFormTitle("Sửa nhật ký máy xúc");
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

	return (
		<div style={{ marginTop: "16px" }}>
			{!tonghopmayxucId
				? (
					<div style={{ padding: "16px", textAlign: "center", color: "#999" }}>
						Vui lòng lưu thông tin chính trước khi thêm nhật ký
					</div>
				)
				: (
					<>
						<div style={{ marginBottom: "16px" }}>
							<Button
								key="add"
								icon={<PlusCircleOutlined />}
								type="primary"
								disabled={!hasAccessByCodes(accessControlCodes.add) || !tonghopmayxucId}
								onClick={() => {
									setFormOpen(true);
									setFormTitle("Thêm nhật ký máy xúc");
									setDetailData({});
								}}
							>
								{t("common.add")}
							</Button>
							<Button
								style={{ marginLeft: "8px" }}
								danger
								disabled={!hasAccessByCodes(accessControlCodes.delete) || selectedRowKeys.length === 0}
								onClick={handleBulkDelete}
							>
								{t("common.batchDelete")}
							</Button>
						</div>
						<BasicTable<NhatkymayxucItemType>
							columns={columns}
							actionRef={actionRef}
							rowSelection={{
								selectedRowKeys,
								onChange: keys => setSelectedRowKeys(keys),
							}}
							request={async () => {
								if (!tonghopmayxucId)
									return { data: [], total: 0 };
								const data = await fetchNhatkymayxucListByTonghopId(tonghopmayxucId);
								return { data, total: data.length };
							}}
							search={false}
							pagination={{ pageSize: 10 }}
						/>
						<NhatkyFormModal
							title={formTitle}
							open={formOpen}
							detailData={detailData}
							tonghopmayxucId={tonghopmayxucId}
							onCloseChange={() => {
								setFormOpen(false);
								setDetailData({});
							}}
							refreshTable={() => actionRef.current?.reload()}
						/>
					</>
				)}
		</div>
	);
}
