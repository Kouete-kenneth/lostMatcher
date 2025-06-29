import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import NotificationFiltersNW from "@/components/molecules/NotificationFiltersNW";
import NotificationListNW from "@/components/organisms/NotificationListNW";
import { useNotifications } from "@/contexts/NotificationContext";

const NotificationScreen = () => {
	const router = useRouter();
	const { notifications, markAsRead, markAllAsRead, deleteAllNotifications } =
		useNotifications();

	const [activeFilter, setActiveFilter] = useState<
		"all" | "unread" | "match" | "claim" | "system"
	>("all");

	// Filter notifications based on active filter
	const filteredNotifications = notifications.filter((notification) => {
		switch (activeFilter) {
			case "unread":
				return !notification.isRead;
			case "match":
				return notification.type === "match";
			case "claim":
				return notification.type === "claim";
			case "system":
				return (
					notification.type === "system" ||
					notification.type === "update"
				);
			default:
				return true;
		}
	});

	// Calculate counts for filters
	const counts = {
		all: notifications.length,
		unread: notifications.filter((n) => !n.isRead).length,
		match: notifications.filter((n) => n.type === "match").length,
		claim: notifications.filter((n) => n.type === "claim").length,
		system: notifications.filter(
			(n) => n.type === "system" || n.type === "update"
		).length,
	};

	const handleNotificationPress = (id: string, notification: any) => {
		// Handle navigation based on notification type
		switch (notification.type) {
			case "match":
				// Navigate to claim screen with match data
				router.push(
					`/claim-screen?matchId=${notification.data?.matchId}`
				);
				break;
			case "claim":
				// Navigate to my claims screen
				router.push("/my-claims");
				break;
			case "system":
			case "update":
				// Show system message or navigate to settings
				Alert.alert(notification.title, notification.message);
				break;
			default:
				break;
		}
	};

	const handleMarkAsRead = (id: string) => {
		markAsRead(id);
	};

	const handleMarkAllAsRead = () => {
		markAllAsRead();
	};

	const handleDeleteAll = () => {
		Alert.alert(
			"Delete All Notifications",
			"Are you sure you want to delete all notifications? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete All",
					style: "destructive",
					onPress: () => deleteAllNotifications(),
				},
			]
		);
	};

	return (
		<ScreenTemplateNW
			title="Notifications"
			showBackButton={true}
			onBackPress={() => router.back()}
			scrollable={false}
			contentClassName="px-0 py-0">
			{/* Header Actions */}
			<View className="bg-white px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
				<Text className="text-lg font-semibold text-gray-900">
					{counts.unread > 0
						? `${counts.unread} unread`
						: "All caught up!"}
				</Text>
				<View className="flex-row space-x-3">
					{counts.unread > 0 && (
						<TouchableOpacity
							onPress={handleMarkAllAsRead}
							className="bg-primary-100 px-3 py-1 rounded-full">
							<Text className="text-primary-700 text-sm font-medium">
								Mark all read
							</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						onPress={handleDeleteAll}
						className="bg-red-100 px-3 py-1 rounded-full ml-2">
						<Ionicons name="trash" size={16} color="#DC2626" />
					</TouchableOpacity>
				</View>
			</View>

			{/* Filters */}
			<NotificationFiltersNW
				activeFilter={activeFilter}
				onFilterChange={setActiveFilter}
				counts={counts}
			/>

			{/* Notifications List */}
			<NotificationListNW
				notifications={filteredNotifications}
				onNotificationPress={handleNotificationPress}
				onMarkAsRead={handleMarkAsRead}
				isLoading={false}
			/>
		</ScreenTemplateNW>
	);
};

export default NotificationScreen;
