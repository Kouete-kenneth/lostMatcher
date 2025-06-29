import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NotificationIconNWProps {
	type: "match" | "claim" | "system" | "update";
	isRead: boolean;
	className?: string;
}

export default function NotificationIconNW({
	type,
	isRead,
	className = "",
}: NotificationIconNWProps) {
	const getIconDetails = () => {
		switch (type) {
			case "match":
				return {
					name: "checkmark-circle" as const,
					color: isRead ? "#10B981" : "#059669",
					bgColor: isRead ? "bg-green-50" : "bg-green-100",
				};
			case "claim":
				return {
					name: "hand-left" as const,
					color: isRead ? "#3B82F6" : "#2563EB",
					bgColor: isRead ? "bg-blue-50" : "bg-blue-100",
				};
			case "system":
				return {
					name: "information-circle" as const,
					color: isRead ? "#6B7280" : "#374151",
					bgColor: isRead ? "bg-gray-50" : "bg-gray-100",
				};
			case "update":
				return {
					name: "refresh-circle" as const,
					color: isRead ? "#8B5CF6" : "#7C3AED",
					bgColor: isRead ? "bg-purple-50" : "bg-purple-100",
				};
			default:
				return {
					name: "information-circle" as const,
					color: isRead ? "#6B7280" : "#374151",
					bgColor: isRead ? "bg-gray-50" : "bg-gray-100",
				};
		}
	};

	const iconDetails = getIconDetails();

	return (
		<View
			className={`w-10 h-10 rounded-full items-center justify-center ${iconDetails.bgColor} ${className}`}>
			<Ionicons
				name={iconDetails.name}
				size={20}
				color={iconDetails.color}
			/>
		</View>
	);
}
