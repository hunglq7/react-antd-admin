import type { PhongbanItemType } from "#src/api/system/phongban";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";

import { fetchDeletePhongban, fetchPhongbanList } from "#src/api/system/phongban";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Detail } from "./components/detail";
import { getConstantColumns } from "./constants";

export default function Phongban() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<PhongbanItemType>>({});

	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeletePhongban(id);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const columns: ProColumns<PhongbanItemType>[] = [
		...getConstantColumns(t),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 120,
			fixed: "right",
			render: (_, record, __, action) => {
				return [
					<BasicButton
						key="editable"
						type="link"
						size="small"
						// disabled={!hasAccessByCodes(accessControlCodes.update)}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("system.phongban.editPhongban"));
							setDetailData({ ...record });
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
						<BasicButton type="link" size="small">{t("common.delete")}</BasicButton>
					</Popconfirm>,
				];
			},
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
			<BasicTable<PhongbanItemType>
				adaptive
				columns={columns}
				actionRef={actionRef}
				request={async () => {
					const data = await fetchPhongbanList();
					return {
						data,
						total: data.length,
					};
				}}
				headerTitle={`${t("common.menu.phongban")} （${t("common.demoOnly")}）`}
				toolBarRender={() => [
					<Button
						key="add-phongban"
						icon={<PlusCircleOutlined />}
						type="primary"
						// disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("system.phongban.addPhongban"));
							setDetailData({});
						}}
					>
						{t("common.add")}
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
