import { BasicContent } from "#src/components/basic-content";
import { Tabs } from "antd";
import * as React from "react";

const MayxucTonghop: React.FC = () => {
	return (
		<BasicContent className="h-full">
			<Tabs defaultActiveKey="main">
				<Tabs.TabPane tab="Tổng hợp" key="main">
					<div>Tab Tổng hợp content</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Nhật ký máy xúc" key="nhatky">
					<div>Tab Nhật ký content</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Thông số máy xúc" key="thongso">
					<div>Tab Thông số content</div>
				</Tabs.TabPane>
			</Tabs>
		</BasicContent>
	);
};

export default MayxucTonghop;
