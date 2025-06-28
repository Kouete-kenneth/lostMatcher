import React from "react";
import { View } from "react-native";
import SearchActionItemNW from "@/components/atoms/SearchActionItemNW";

interface SearchActionsNWProps {
	onRegisteredItems: () => void;
	onAddNewItem: () => void;
}

const SearchActionsNW = ({
	onRegisteredItems,
	onAddNewItem,
}: SearchActionsNWProps) => {
	return (
		<View className="px-4 py-6 space-y-4">
			<SearchActionItemNW
				icon="format-list-bulleted"
				iconColor="#3B82F6"
				backgroundColor="#E5E7EB"
				title="Registered items"
				description="Choose from your registered items"
				onPress={onRegisteredItems}
			/>

			<SearchActionItemNW
				icon="plus"
				iconColor="#10B981"
				backgroundColor="#E5E7EB"
				title="Add new item"
				description="Add a new item to search for"
				onPress={onAddNewItem}
			/>
		</View>
	);
};

export default SearchActionsNW;
