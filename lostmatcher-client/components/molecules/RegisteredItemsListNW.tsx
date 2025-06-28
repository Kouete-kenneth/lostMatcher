import React from "react";
import { View, ScrollView } from "react-native";
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
				paddingHorizontal: 16,
				paddingVertical: 24,
			}}>
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
