import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import SearchActionItemNW from "@/components/atoms/SearchActionItemNW";
import RegisteredItemNW from "@/components/atoms/RegisteredItemNW";
import { useRouter } from "expo-router";

// Mock data for registered items
const mockRegisteredItems = [
	{
		id: "1",
		name: "iPhone 13 Pro",
		description: "Blue iPhone with cracked screen protector",
		imageUri: undefined,
	},
	{
		id: "2",
		name: "Black Backpack",
		description: "Nike backpack with laptop compartment",
		imageUri: undefined,
	},
	{
		id: "3",
		name: "Silver Watch",
		description: "Apple Watch Series 8 with sport band",
		imageUri: undefined,
	},
	{
		id: "4",
		name: "Red Umbrella",
		description: "Compact umbrella with wooden handle",
		imageUri: undefined,
	},
];

const SearchTabScreen = () => {
	const router = useRouter();
	const [showRegisteredItems, setShowRegisteredItems] = useState(false);

	const handleRegisteredItems = () => {
		setShowRegisteredItems(true);
	};

	const handleAddNewItem = () => {
		if (showRegisteredItems) {
			// From Registered Items view - go to Register an item
			console.log("Navigate to Register an Item");
			router.push("/register-item");
		} else {
			// From Search view - go to Report Lost item
			console.log("Navigate to Report Lost Item");
			router.push("/report-lost");
		}
	};

	const handleSearchItem = (itemId: string) => {
		console.log("Search for item:", itemId);
		// TODO: Navigate to search results for this item
	};

	const handleBackToSearch = () => {
		setShowRegisteredItems(false);
	};

	return (
		<ScreenTemplateNW
			title={showRegisteredItems ? "Registered Items" : "Search"}
			showBackButton={true}
			onBackPress={
				showRegisteredItems ? handleBackToSearch : () => router.back()
			}
			contentClassName="px-0 py-0"
			scrollable={false}>
			{!showRegisteredItems ? (
				/* Search Action Items */
				<View className="px-4 py-6 space-y-4">
					<SearchActionItemNW
						icon="format-list-bulleted"
						iconColor="#3B82F6"
						backgroundColor="#E5E7EB"
						title="Registered items"
						description="Choose from your registered items"
						onPress={handleRegisteredItems}
					/>

					<SearchActionItemNW
						icon="plus"
						iconColor="#10B981"
						backgroundColor="#E5E7EB"
						title="Add new item"
						description="Add a new item to search for"
						onPress={handleAddNewItem}
					/>
				</View>
			) : (
				/* Registered Items List */
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
							onPress={handleAddNewItem}
						/>
					</View>

					{/* Registered Items */}
					<View className="space-y-0">
						{mockRegisteredItems.map((item) => (
							<RegisteredItemNW
								key={item.id}
								id={item.id}
								name={item.name}
								description={item.description}
								imageUri={item.imageUri}
								onSearchPress={handleSearchItem}
							/>
						))}
					</View>
				</ScrollView>
			)}
		</ScreenTemplateNW>
	);
};

export default SearchTabScreen;
