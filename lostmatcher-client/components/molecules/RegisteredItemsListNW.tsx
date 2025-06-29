import React from "react";
import { View, ScrollView, TextInput } from "react-native";
import SearchActionItemNW from "@/components/atoms/SearchActionItemNW";
import RegisteredItemNW from "@/components/atoms/RegisteredItemNW";

interface RegisteredItem {
	id: string;
	name: string;
	description: string;
	imageUri?: string;
}

interface RegisteredItemsListNWProps {
	items: RegisteredItem[];
	onAddNewItem: () => void;
	onSearchItem: (itemId: string) => void;
}

const RegisteredItemsListNW = ({
	items,
	onAddNewItem,
	onSearchItem,
}: RegisteredItemsListNWProps) => {
	return (
		<ScrollView
			className="flex-1"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingHorizontal: 8,
				paddingVertical: 8,
			}}>
			{/* Search Bar - Placeholder for future search functionality */}
			<View className="mb-4">
				{/* Placeholder for search input */}
				<TextInput
					placeholder="Search registered items..."
					style={{
						backgroundColor: "#f3f4f6",
						borderRadius: 8,
						padding: 8,
						fontSize: 16,
					}}
				/>
			</View>
			{/* Add New Item Action - Always at top */}
			<View className="mb-6">
				<SearchActionItemNW
					icon="plus"
					iconColor="#10B981"
					backgroundColor="#FACC15"
					title="Add new item"
					description="Add a new item to search for"
					onPress={onAddNewItem}
				/>
			</View>

			{/* Registered Items */}
			<View className="space-y-0">
				{items.map((item) => (
					<RegisteredItemNW
						key={item.id}
						id={item.id}
						name={item.name}
						description={item.description}
						imageUri={item.imageUri}
						onSearchPress={onSearchItem}
					/>
				))}
			</View>
		</ScrollView>
	);
};

export default RegisteredItemsListNW;
