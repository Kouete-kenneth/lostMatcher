import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatusBadgeProps {
	status: "pending" | "approved" | "rejected";
}

export default function StatusBadgeNW({ status }: StatusBadgeProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "approved":
				return "bg-green-100 text-green-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return "time-outline";
			case "approved":
				return "checkmark-circle-outline";
			case "rejected":
				return "close-circle-outline";
			default:
				return "help-circle-outline";
		}
	};

	const getIconColor = (status: string) => {
		switch (status) {
			case "approved":
				return "#065f46";
			case "rejected":
				return "#991b1b";
			case "pending":
				return "#92400e";
			default:
				return "#6b7280";
		}
	};

	return (
		<View
			className={`px-3 py-1 rounded-full flex-row items-center ${getStatusColor(
				status
			)}`}>
			<Ionicons
				name={getStatusIcon(status) as any}
				size={16}
				color={getIconColor(status)}
				style={{ marginRight: 4 }}
			/>
			<Text className="text-sm font-medium capitalize">{status}</Text>
		</View>
	);
}
