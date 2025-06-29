import React from "react";
import { View } from "react-native";
import SearchTabNW from "../atoms/SearchTabNW";

interface SearchTabsProps {
	activeTab: "text" | "image" | "combined";
	onTabChange: (tab: "text" | "image" | "combined") => void;
	isLoading: boolean;
	resultCounts: {
		text: number;
		image: number;
		combined: number;
	};
}

export default function SearchTabsNW({
	activeTab,
	onTabChange,
	isLoading,
	resultCounts,
}: SearchTabsProps) {
	return (
		<View className="bg-white border-b border-gray-200 flex-row justify-between">
			<SearchTabNW
				title="Text Results"
				isActive={activeTab === "text"}
				onPress={() => onTabChange("text")}
				isLoading={isLoading}
				resultCount={resultCounts.text}
			/>
			<SearchTabNW
				title="Image Results"
				isActive={activeTab === "image"}
				onPress={() => onTabChange("image")}
				isLoading={isLoading}
				resultCount={resultCounts.image}
			/>
			<SearchTabNW
				title="Combined"
				isActive={activeTab === "combined"}
				onPress={() => onTabChange("combined")}
				isLoading={isLoading}
				resultCount={resultCounts.combined}
			/>
		</View>
	);
}
