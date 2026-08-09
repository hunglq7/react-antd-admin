import type { ColumnsType } from "antd/es/table";

import { fetchBienapList } from "#src/api/bienap/danhmuc";
import { fetchMayxucList } from "#src/api/mayxuc/danhmuc";
import { fetchThongsokythuatmayxucList } from "#src/api/mayxuc/thongso";
import { fetchTonghopmayxucList } from "#src/api/mayxuc/tonghop";
import { Card, Spin, Table } from "antd";
import { useEffect, useState } from "react";

interface StatisticItem {
	key: string
	title: string
	count: number
	description: string
}

const columns: ColumnsType<StatisticItem> = [
	{
		title: "Thống kê",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Số lượng",
		dataIndex: "count",
		key: "count",
		align: "right",
	},
	{
		title: "Ghi chú",
		dataIndex: "description",
		key: "description",
	},
];

export default function StatisticsTable() {
	const [loading, setLoading] = useState(true);
	const [statistics, setStatistics] = useState<StatisticItem[]>([]);

	useEffect(() => {
		async function loadStatistics() {
			setLoading(true);
			try {
				const [bienap, mayxuc, tonghop, thongso] = await Promise.all([
					fetchBienapList(),
					fetchMayxucList(),
					fetchTonghopmayxucList(),
					fetchThongsokythuatmayxucList(),
				]);

				setStatistics([
					{
						key: "bienap",
						title: "Số lượng biến áp",
						count: bienap.length,
						description: "Tổng số bản ghi biến áp trong hệ thống",
					},
					{
						key: "mayxuc",
						title: "Số lượng máy xúc",
						count: mayxuc.length,
						description: "Tổng số loại máy xúc đã khai báo",
					},
					{
						key: "tonghop",
						title: "Số lượng tổng hợp máy xúc",
						count: tonghop.length,
						description: "Tổng số bản ghi tổng hợp máy xúc",
					},
					{
						key: "thongso",
						title: "Số lượng thông số kỹ thuật",
						count: thongso.length,
						description: "Tổng số chỉ số kỹ thuật máy xúc",
					},
				]);
			}
			catch (error) {
				console.error("Load statistics failed", error);
			}
			finally {
				setLoading(false);
			}
		}

		loadStatistics();
	}, []);

	return (
		<Card title="Bảng thống kê" className="h-full">
			<Spin spinning={loading}>
				<Table<StatisticItem>
					rowKey="key"
					columns={columns}
					dataSource={statistics}
					pagination={false}
					bordered
				/>
			</Spin>
		</Card>
	);
}
