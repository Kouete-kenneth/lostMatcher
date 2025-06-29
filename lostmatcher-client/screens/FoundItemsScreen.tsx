import React from "react";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { FlatList, View, Text, Image, TextInput } from "react-native";
import { SearchActionItemNW } from "@/components";

// Dummy data for found items
const foundItems = [
	{
		id: "found_1",
		title: "iPhone with Blue Case",
		description: "Found at Central Station platform 2",
		status: "Active",
		image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop&crop=center",
	},
	{
		id: "found_2",
		title: "Student Backpack",
		description: "Found in library study area",
		status: "Claimed",
		image: "https://images.unsplash.com/photo-1581605405669-fcdf81983e4d?w=300&h=200&fit=crop&crop=center",
	},
	{
		id: "found_3",
		title: "Silver Laptop",
		description: "Found in coffee shop",
		status: "Approved",
		image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop&crop=center",
	},
	{
		id: "found_4",
		title: "Black Wallet",
		description: "Found at bus stop",
		status: "Recovered",
		image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=200&fit=crop&crop=center",
	},
];

const statusColors: Record<string, string> = {
	Active: "#2563eb", // blue-600
	Claimed: "#f59e42", // orange-400
	Approved: "#10b981", // emerald-500
	Recovered: "#ec4899", // pink-500
};

const FoundItemsScreen = () => {
	const router = useRouter();
	const onAddNewItem = () => {
		router.push("/report-found");
	};
	const [search, setSearch] = React.useState("");

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
				<View
					style={{
						backgroundColor: statusColors[item.status],
						borderRadius: 8,
						alignSelf: "flex-start",
						paddingHorizontal: 8,
						paddingVertical: 2,
					}}>
					<Text style={{ color: "white", fontSize: 12 }}>
						{item.status}
					</Text>
				</View>
			</View>
		</View>
	);

	return (
		<ScreenTemplateNW
			title="Found Items"
			showBackButton={true}
			onBackPress={() => router.back()}
			scrollable={false}>
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
				data={foundItems}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingVertical: 8 }}
			/>
		</ScreenTemplateNW>
	);
};

export default FoundItemsScreen;
