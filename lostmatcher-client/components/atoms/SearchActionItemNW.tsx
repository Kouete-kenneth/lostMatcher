import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { cn } from "@/lib/utils";

interface SearchActionItemProps {
	icon: keyof typeof MaterialCommunityIcons.glyphMap;
	iconColor?: string;
	backgroundColor?: string;
	title: string;
	description: string;
	onPress: () => void;
	className?: string;
}

const SearchActionItemNW = ({
	icon,
	iconColor = "#6B7280",
	backgroundColor = "#E5E7EB",
	title,
	description,
	onPress,
	className,
}: SearchActionItemProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			className={cn("flex-row items-center w-full py-4", className)}>
			{/* Icon Container */}
			<View
				className="w-10 h-10 rounded-md items-center justify-center mr-4"
				style={{ backgroundColor }}>
				<MaterialCommunityIcons name={icon} size={24} color="#6B7280" />
			</View>

			{/* Content */}
			<View className="flex-1">
				<Text className="text-charcoal-800 text-base font-semibold mb-1">
					{title}
				</Text>
				<Text className="text-gray-500 text-sm">{description}</Text>
			</View>

			{/* Arrow */}
			<MaterialCommunityIcons
				name="chevron-right"
				size={20}
				color="#6B7280"
			/>
		</TouchableOpacity>
	);
};

export default SearchActionItemNW;
