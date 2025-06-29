import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface SearchTabProps {
	title: string;
	isActive: boolean;
	onPress: () => void;
	isLoading?: boolean;
	resultCount?: number;
}

export default function SearchTabNW({
	title,
	isActive,
	onPress,
	isLoading = false,
	resultCount = 0,
}: SearchTabProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={isLoading}
			className={`flex-1 py-3 px-2 border-b-2 ${
				isActive
					? "border-primary-500 bg-primary-50"
					: "border-gray-200 bg-white"
			}`}>
			<Text
				numberOfLines={1}
				adjustsFontSizeToFit={true}
				minimumFontScale={0.8}
				className={`text-center font-medium ${
					isActive ? "text-primary-700" : "text-gray-600"
				}`}>
				{title}
			</Text>
			{!isLoading && resultCount > 0 && (
				<Text className="text-center text-xs text-gray-500 mt-1">
					{resultCount} result{resultCount !== 1 ? "s" : ""}
				</Text>
			)}
			{isLoading && (
				<Text className="text-center text-xs text-gray-500 mt-1">
					Searching...
				</Text>
			)}
		</TouchableOpacity>
	);
}
