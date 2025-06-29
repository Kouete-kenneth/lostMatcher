import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomTabItem {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	onPress: () => void;
	disabled?: boolean;
	variant: "previous" | "claim" | "reject" | "next";
}

interface BottomTabBarProps {
	items: BottomTabItem[];
}

export default function BottomTabBarNW({ items }: BottomTabBarProps) {
	const getTabStyle = (variant: string, disabled?: boolean) => {
		if (disabled) return "bg-gray-50";

		switch (variant) {
			case "previous":
			case "next":
				return "bg-blue-50";
			case "claim":
				return "bg-green-50";
			case "reject":
				return "bg-red-50";
			default:
				return "bg-gray-50";
		}
	};

	const getIconStyle = (variant: string, disabled?: boolean) => {
		if (disabled) return "bg-gray-300";

		switch (variant) {
			case "previous":
			case "next":
				return "bg-blue-500";
			case "claim":
				return "bg-green-500";
			case "reject":
				return "bg-red-500";
			default:
				return "bg-gray-300";
		}
	};

	const getTextStyle = (variant: string, disabled?: boolean) => {
		if (disabled) return "text-gray-400";

		switch (variant) {
			case "previous":
			case "next":
				return "text-blue-700";
			case "claim":
				return "text-green-700";
			case "reject":
				return "text-red-700";
			default:
				return "text-gray-400";
		}
	};

	const getIconColor = (disabled?: boolean) => {
		return disabled ? "#9ca3af" : "white";
	};

	return (
		<View className="bg-white border-t border-gray-200 flex-row">
			{items.map((item, index) => (
				<TouchableOpacity
					key={index}
					onPress={item.onPress}
					disabled={item.disabled}
					className={`flex-1 flex-col items-center justify-center py-2 ${getTabStyle(
						item.variant,
						item.disabled
					)}`}>
					<View
						className={`rounded-full mb-1 items-center justify-center p-1 ${getIconStyle(
							item.variant,
							item.disabled
						)}`}>
						<Ionicons
							name={item.icon}
							size={16}
							color={getIconColor(item.disabled)}
						/>
					</View>
					<Text
						className={`text-xs font-medium ${getTextStyle(
							item.variant,
							item.disabled
						)}`}>
						{item.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}
