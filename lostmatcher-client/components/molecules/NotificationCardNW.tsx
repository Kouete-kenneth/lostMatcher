import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import NotificationIconNW from "../atoms/NotificationIconNW";
import NotificationBadgeNW from "../atoms/NotificationBadgeNW";
import TimeStampNW from "../atoms/TimeStampNW";

interface NotificationCardNWProps {
	id: string;
	type: "match" | "claim" | "system" | "update";
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	onPress: (id: string) => void;
	onMarkAsRead?: (id: string) => void;
}

export default function NotificationCardNW({
	id,
	type,
	title,
	message,
	timestamp,
	isRead,
	onPress,
	onMarkAsRead,
}: NotificationCardNWProps) {
	const handlePress = () => {
		onPress(id);
		if (!isRead && onMarkAsRead) {
			onMarkAsRead(id);
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`p-4 border-b border-gray-100 ${
				!isRead ? "bg-blue-50" : "bg-white"
			}`}
			activeOpacity={0.7}>
			<View className="flex-row items-start space-x-3">
				{/* Notification Icon */}
				<NotificationIconNW type={type} isRead={isRead} />

				{/* Content */}
				<View className="flex-1">
					{/* Header with Badge and Timestamp */}
					<View className="flex-row items-center justify-between mb-1">
						<NotificationBadgeNW type={type} />
						<TimeStampNW timestamp={timestamp} />
					</View>

					{/* Title */}
					<Text
						className={`text-base font-semibold mb-1 ${
							!isRead ? "text-gray-900" : "text-gray-700"
						}`}>
						{title}
					</Text>

					{/* Message */}
					<Text
						className={`text-sm leading-5 ${
							!isRead ? "text-gray-700" : "text-gray-600"
						}`}
						numberOfLines={2}>
						{message}
					</Text>
				</View>

				{/* Unread Indicator */}
				{!isRead && (
					<View className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
				)}
			</View>
		</TouchableOpacity>
	);
}
