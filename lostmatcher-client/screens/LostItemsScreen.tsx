import React from "react";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { FlatList, View, Text, Image, TextInput } from "react-native";
import { SearchActionItemNW } from "@/components";

// Dummy data for lost items
const lostItems = [
	{
		id: "lost_1",
		title: "Black iPhone 14 Pro",
		description: "Lost near Central Station, has a blue case",
		image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop&crop=center",
	},
	{
		id: "lost_2",
		title: "Blue Backpack",
		description: "Lost at university library",
		image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&crop=center",
	},
	{
		id: "lost_3",
		title: "Silver Laptop",
		description: "Lost in coffee shop",
		image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop&crop=center",
	},
];

const LostItemsScreen = () => {
	const router = useRouter();
	const [search, setSearch] = React.useState("");

	const filteredItems = lostItems.filter(
		(item) =>
			item.title.toLowerCase().includes(search.toLowerCase()) ||
			item.description.toLowerCase().includes(search.toLowerCase())
	);

	const renderItem = ({ item }: any) => (
		<View className="flex-row items-center bg-white rounded-sm border-b-2 border-s-text-secondary border-primary-50 p-3">
			<Image
				source={{ uri: item.image }}
				style={{
					width: 60,
					height: 60,
					borderRadius: 12,
					marginRight: 12,
				}}
			/>
			<View className="flex-1">
				<Text className="font-bold text-base text-gray-900 mb-1">
					{item.title}
				</Text>
				<Text className="text-xs text-gray-500 mb-1">
					{item.description}
				</Text>
			</View>
		</View>
	);

	function onAddNewItem(): void {
		router.push("/report-lost");
	}

	return (
		<ScreenTemplateNW
			title="Lost Items"
			showBackButton={true}
			onBackPress={() => router.back()}
			keyboardAvoiding={false}
			scrollable={false}
			>
			{/* Search Bar */}
			<View className="mb-4">
				<TextInput
					placeholder="Search lost items..."
					value={search}
					onChangeText={setSearch}
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
					title="Add new Found item"
					description="Report a new found item"
					onPress={onAddNewItem}
				/>
			</View>
			<FlatList
				data={filteredItems}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingVertical: 8 }}
			/>
		</ScreenTemplateNW>
	);
};

export default LostItemsScreen;
