import type { ThongsokythuatmayxucItemType } from "#src/api/mayxuc/thongso";
import type { ProColumns } from "@ant-design/pro-components";

import { fetchThongsokythuatmayxucList } from "#src/api/mayxuc/thongso";
import { BasicTable } from "#src/components/basic-table";

import { useRef } from "react";

export function ThongsoTab() {
	const actionRef = useRef(null);

	const columns: ProColumns<ThongsokythuatmayxucItemType>[] = [
		{ title: "Tên thiết bị", dataIndex: "tenThietBi", ellipsis: true },
		{ title: "Mã máy xúc", dataIndex: "mayXucId", search: false },
		{ title: "Nội dung", dataIndex: "noiDung", ellipsis: true, search: false },
		{ title: "Đơn vị tính", dataIndex: "donViTinh", ellipsis: true, search: false },
		{ title: "Thông số", dataIndex: "thongSo", ellipsis: true, search: false },
	];

	return (
		<div style={{ marginTop: "16px" }}>
			<div style={{ padding: "12px 0", color: "#666", fontSize: "12px" }}>
				Bảng thông số này chỉ dùng để xem, không thể thêm, sửa hoặc xóa
			</div>
			<BasicTable<ThongsokythuatmayxucItemType>
				columns={columns}
				actionRef={actionRef}
				request={async () => {
					try {
						const data = await fetchThongsokythuatmayxucList();
						return { data, total: data.length };
					}
					catch (error) {
						console.error("Error fetching thongso data:", error);
						return { data: [], total: 0 };
					}
				}}
				search={false}
				pagination={{ pageSize: 10 }}
			/>
		</div>
	);
}
