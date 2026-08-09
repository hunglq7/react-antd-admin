import type { ButtonProps } from "antd";
import type { NotificationItem } from "./types";

// import { fetchNotifications } from "#src/api/notifications";

import { useEffect, useState } from "react";
import { NotificationPopup } from "./index";

// Mock notifications data
const mockNotifications: NotificationItem[] = [
	{
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		date: "2024-01-01",
		isRead: false,
		message: "This is a mock notification message 1.",
		title: "Mock Notification 1",
	},
	{
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
		date: "2024-01-02",
		isRead: true,
		message: "This is a mock notification message 2.",
		title: "Mock Notification 2",
	},
	{
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
		date: "2024-01-03",
		isRead: false,
		message: "This is a mock notification message 3.",
		title: "Mock Notification 3",
	},
	// Add more mock notifications as needed
];

export function NotificationContainer({ ...restProps }: ButtonProps) {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);

	useEffect(() => {
		// Mock fetching notifications
		setNotifications(mockNotifications);
	}, []);

	return (
		<NotificationPopup
			notifications={notifications}
			{...restProps}
		/>
	);
}
