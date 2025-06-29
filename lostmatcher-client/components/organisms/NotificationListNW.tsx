import React from "react";
import { View, Text, FlatList } from "react-native";
import NotificationCardNW from "../molecules/NotificationCardNW";
import { EmptyStateNW } from "../molecules";

interface Notification {
	id: string;
	type: "match" | "claim" | "system" | "update";
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	data?: any; // Additional data for navigation
}

interface NotificationListNWProps {
	notifications: Notification[];
	onNotificationPress: (id: string, notification: Notification) => void;
	onMarkAsRead: (id: string) => void;
	isLoading?: boolean;
}

export default function NotificationListNW({
	notifications,
	onNotificationPress,
	onMarkAsRead,
	isLoading = false,
}: NotificationListNWProps) {
	const renderNotification = ({ item }: { item: Notification }) => (
		<NotificationCardNW
			id={item.id}
			type={item.type}
			title={item.title}
			message={item.message}
			timestamp={item.timestamp}
			isRead={item.isRead}
			onPress={(id) => onNotificationPress(id, item)}
			onMarkAsRead={onMarkAsRead}
		/>
	);

	if (isLoading) {
		return (
			<View className="flex-1 justify-center items-center p-8">
				<Text className="text-gray-500 text-center">
					Loading notifications...
				</Text>
			</View>
		);
	}

	if (notifications.length === 0) {
		return (
			<EmptyStateNW
				title="No Notifications"
				description="You're all caught up! No new notifications at the moment."
				icon="notifications-outline"
			/>
		);
	}

	return (
		<FlatList
			data={notifications}
			renderItem={renderNotification}
			keyExtractor={(item) => item.id}
			showsVerticalScrollIndicator={false}
			className="flex-1"
		/>
	);
}
