import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components"
import type { TonghopmayxucItemType } from "#src/api/mayxuc/tonghop"
import { ClearOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Popconfirm } from "antd"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { fetchDeleteTonghopmayxucItem, fetchDeleteTonghopmayxucItems, fetchTonghopmayxucListWithPagination } from "#src/api/mayxuc/tonghop"

import { BasicButton } from "#src/components/basic-button"
import { BasicContent } from "#src/components/basic-content"
import { BasicTable } from "#src/components/basic-table"
import { accessControlCodes, useAccess } from "#src/hooks/use-access"

import { getConstantColumns } from "./components/constansColumns"
import ExportExcel from "./components/ExportExcel"
import { Detail } from "./components/Model"

export default function MayxucDanhmuc() {
	const { t } = useTranslation()
	const { hasAccessByCodes } = useAccess()
	const [isOpen, setIsOpen] = useState(false)
	const [title, setTitle] = useState("")
	const [detailData, setDetailData] = useState<Partial<TonghopmayxucItemType>>({})
	const [filteredData, setFilteredData] = useState<TonghopmayxucItemType[]>([])
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
	const actionRef = useRef<ActionType>(null)

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteTonghopmayxucItem(id)
		setSelectedRowKeys([])
		await action?.reload?.()
		window.$message?.success(t("common.deleteSuccess"))
	}

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) return
		await fetchDeleteTonghopmayxucItems(selectedRowKeys as number[])
		setSelectedRowKeys([])
		await actionRef.current?.reload()
		window.$message?.success(t("common.deleteSuccess"))
	}

	const columns: ProColumns<TonghopmayxucItemType>[] = [
		...getConstantColumns(t),

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
						setIsOpen(true)
						setTitle("Sửa máy xúc")
						setDetailData(record)
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
	]

	const onCloseChange = () => {
		setIsOpen(false)
		setDetailData({})
	}

	const getSearchKeyword = (params?: Record<string, any>) =>
		String(params?.keyword ?? params?.tenMayXuc ?? params?.maQuanLy ?? params?.loaiThietBi ?? params?.tenPhongBan ?? "").trim()

	const handleResetSearch = (props: { form?: { resetFields: () => void } }) => {
		setSelectedRowKeys([])
		props.form?.resetFields()
		actionRef.current?.reload(true)
	}

	return (
		<BasicContent className="h-full">
			<BasicTable<TonghopmayxucItemType>
				adaptive
				columns={columns}
				actionRef={actionRef}
				rowSelection={{
					selectedRowKeys,
					onChange: (keys) => setSelectedRowKeys(keys),
				}}
				tableAlertRender={({ selectedRowKeys }) => <div>{t("common.selectedRows", { count: selectedRowKeys?.length ?? 0 })}</div>}
				tableAlertOptionRender={({ onCleanSelected }) => (
					<Button type="link" onClick={onCleanSelected}>
						{t("common.cancelAll")}
					</Button>
				)}
				request={async (params) => {
					const keyword = getSearchKeyword(params).toLowerCase()
					const pageIndex = Number(params.current ?? 1)
					const pageSize = Number(params.pageSize ?? 10)

					const result = await fetchTonghopmayxucListWithPagination({
						keyword,
						pageIndex,
						pageSize,
					})

					const data = Array.isArray(result?.items) ? result.items : []
					const total = Number.isFinite(result?.totalRecords) ? Number(result.totalRecords) : data.length

					setFilteredData(data)
					return {
						data,
						total,
					}
				}}
				search={{
					labelWidth: "auto",
					optionRender: (_, props) => [
						<Button
							key="search"
							type="primary"
							icon={<SearchOutlined />}
							onClick={() => {
								props.form?.submit()
							}}
						>
							Tìm
						</Button>,
						<Button
							key="reset"
							icon={<ClearOutlined />}
							onClick={() => {
								handleResetSearch(props)
							}}
						>
							Đặt lại
						</Button>,
					],
				}}
				headerTitle="Danh mục máy xúc"
				toolBarRender={() => [
					<Button
						key="add"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true)
							setTitle("Thêm máy xúc")
							setDetailData({})
						}}
					>
						{t("common.add")}
					</Button>,
					<ExportExcel key="export" data={filteredData} />,
					<Button
						key="delete"
						danger
						hidden={!hasAccessByCodes(accessControlCodes.delete) || selectedRowKeys.length === 0}
						onClick={handleBulkDelete}
					>
						{t("common.batchDelete")}
					</Button>,
				]}
				pagination={{
					defaultPageSize: 10,
					pageSizeOptions: [10, 20, 50, 100],
					showSizeChanger: true,
					showQuickJumper: true,
				}}
			/>
			<Detail
				title={title}
				open={isOpen}
				detailData={detailData}
				onCloseChange={onCloseChange}
				refreshTable={() => actionRef.current?.reload()}
			/>
		</BasicContent>
	)
}
