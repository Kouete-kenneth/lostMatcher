import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LoadingStateProps {
	searchType: "text" | "image" | "combined";
	message?: string;
}

export default function LoadingStateNW({
	searchType,
	message,
}: LoadingStateProps) {
	const getIcon = () => {
		switch (searchType) {
			case "text":
				return "document-text-outline";
			case "image":
				return "image-outline";
			case "combined":
				return "layers-outline";
			default:
				return "search-outline";
		}
	};

	const getDefaultMessage = () => {
		switch (searchType) {
			case "text":
				return "Searching by description...";
			case "image":
				return "Analyzing image...";
			case "combined":
				return "Searching by description and image...";
			default:
				return "Searching...";
		}
	};

	return (
		<View className="flex-1 items-center justify-center py-16">
			<View className="items-center">
				<View className="bg-primary-100 rounded-full p-4 mb-4">
					<Ionicons
						name={getIcon() as any}
						size={32}
						color="#3B82F6"
					/>
				</View>
				<Text className="text-lg font-semibold text-gray-800 mb-2">
					Searching for matches
				</Text>
				<Text className="text-gray-600 text-center px-8">
					{message || getDefaultMessage()}
				</Text>
			</View>
		</View>
	);
}
