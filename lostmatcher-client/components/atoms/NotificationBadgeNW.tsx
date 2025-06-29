import React from "react";
import { View, Text } from "react-native";

interface NotificationBadgeProps {
	type: "match" | "claim" | "system" | "update";
	className?: string;
}

export default function NotificationBadgeNW({
	type,
	className = "",
}: NotificationBadgeProps) {
	const getBadgeStyles = () => {
		switch (type) {
			case "match":
				return "bg-green-100 border-green-200 text-green-800";
			case "claim":
				return "bg-blue-100 border-blue-200 text-blue-800";
			case "system":
				return "bg-gray-100 border-gray-200 text-gray-800";
			case "update":
				return "bg-purple-100 border-purple-200 text-purple-800";
			default:
				return "bg-gray-100 border-gray-200 text-gray-800";
		}
	};

	const getBadgeText = () => {
		switch (type) {
			case "match":
				return "Match";
			case "claim":
				return "Claim";
			case "system":
				return "System";
			case "update":
				return "Update";
			default:
				return "System";
		}
	};

	return (
		<View
			className={`px-2 py-1 rounded-full border ${getBadgeStyles()} ${className}`}>
			<Text
				className={`text-xs font-medium ${getBadgeStyles()
					.split(" ")
					.find((cls) => cls.includes("text-"))}`}>
				{getBadgeText()}
			</Text>
		</View>
	);
}
