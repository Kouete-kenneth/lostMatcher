import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	Dispatch,
	SetStateAction,
} from "react";

export interface Notification {
	id: string;
	type: "match" | "claim" | "system" | "update";
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	data: any;
}

interface NotificationContextType {
	notifications: Notification[];
	unreadCount: number;
	isLoading: boolean;
	markAsRead: (notificationId: string) => void;
	markAllAsRead: () => void;
	deleteNotification: (notificationId: string) => void;
	deleteAllNotifications: () => void;
	setNotifications: Dispatch<SetStateAction<Notification[]>>;
	addNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

// Dummy notification data (will come from backend/API)
const generateDummyNotifications = (): Notification[] => [
	{
		id: "1",
		type: "match",
		title: "New Match Found!",
		message:
			"We found a potential match for your lost iPhone. Check it out to see if it's yours.",
		timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
		isRead: false,
		data: { matchId: "match_1", itemId: "item_1" },
	},
	{
		id: "2",
		type: "claim",
		title: "Claim Approved",
		message:
			"Your claim for the black wallet has been approved! You can now contact the finder.",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
		isRead: false,
		data: { claimId: "claim_1", itemId: "item_2" },
	},
	{
		id: "3",
		type: "match",
		title: "Another Match Found!",
		message:
			"We found another potential match for your lost keys. This one looks very promising!",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
		isRead: false,
		data: { matchId: "match_3", itemId: "item_5" },
	},
	{
		id: "4",
		type: "system",
		title: "Welcome to LostMatcher!",
		message:
			"Thanks for joining LostMatcher. Here's how to get started with finding your lost items.",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
		isRead: true,
		data: null,
	},
	{
		id: "5",
		type: "claim",
		title: "New Claim Received",
		message:
			"Someone has claimed the blue backpack you reported as found. Please review their claim.",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
		isRead: true,
		data: { claimId: "claim_2", itemId: "item_3" },
	},
	{
		id: "6",
		type: "update",
		title: "App Update Available",
		message:
			"A new version of LostMatcher is available with improved matching algorithms.",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
		isRead: true,
		data: null,
	},
];

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider = ({
	children,
}: NotificationProviderProps): React.ReactElement => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Simulate loading notifications from API
	useEffect(() => {
		const loadNotifications = async () => {
			setIsLoading(true);
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setNotifications(generateDummyNotifications());
			setIsLoading(false);
		};

		loadNotifications();
	}, []);

	// Calculate unread count
	const unreadCount = notifications.filter(
		(notification) => !notification.isRead
	).length;

	// Mark notification as read
	const markAsRead = (notificationId: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === notificationId
					? { ...notification, isRead: true }
					: notification
			)
		);
	};

	// Mark all notifications as read
	const markAllAsRead = () => {
		setNotifications((prev) =>
			prev.map((notification) => ({ ...notification, isRead: true }))
		);
	};

	// Delete notification
	const deleteNotification = (notificationId: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== notificationId)
		);
	};

	// Delete all notifications
	const deleteAllNotifications = () => {
		setNotifications([]);
	};

	// Add new notification (for when new notifications arrive from backend)
	const addNotification = (notification: Omit<Notification, "id">) => {
		const newNotification: Notification = {
			...notification,
			id: Date.now().toString(), // Simple ID generation
		};
		setNotifications((prev) => [newNotification, ...prev]);
	};

	const value: NotificationContextType = {
		notifications,
		unreadCount,
		isLoading,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		deleteAllNotifications,
		addNotification,
		setNotifications,
	};

	return (
		<NotificationContext.Provider value={value}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = (): NotificationContextType => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotifications must be used within a NotificationProvider"
		);
	}
	return context;
};
