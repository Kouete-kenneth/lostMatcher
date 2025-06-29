import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	description: string;
}

export default function EmptyStateNW({
	icon,
	title,
	description,
}: EmptyStateProps) {
	return (
		<View className="flex-1 items-center justify-center px-8">
			<Ionicons name={icon} size={64} color="#9CA3AF" />
			<Text className="text-xl font-semibold text-gray-800 mb-2 mt-4">
				{title}
			</Text>
			<Text className="text-gray-600 text-center">{description}</Text>
		</View>
	);
}
