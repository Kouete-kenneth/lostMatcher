import React from "react";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { FlatList, View, Text, Image } from "react-native";

// Dummy data for recovered items
const recoveredItems = [
	{
		id: "rec_1",
		title: "Black iPhone 14 Pro",
		description: "Recovered from Central Station",
		date: "2025-06-01",
		image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop&crop=center",
	},
	{
		id: "rec_2",
		title: "Blue Backpack",
		description: "Recovered from university library",
		date: "2025-05-20",
		image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&crop=center",
	},
];

const MyRecoveredScreen = () => {
	const router = useRouter();

	const renderItem = ({ item }: any) => (
		<View className="flex-row items-center bg-white rounded-xl shadow mb-4 p-3">
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
				<Text className="text-xs text-emerald-600">
					Recovered: {item.date}
				</Text>
			</View>
		</View>
	);

	return (
		<ScreenTemplateNW
			title="My Recovered Items"
			showBackButton={true}
			onBackPress={() => router.back()}
			keyboardAvoiding={false}
			scrollable={false}>
			<FlatList
				data={recoveredItems}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingVertical: 8 }}
			/>
		</ScreenTemplateNW>
	);
};

export default MyRecoveredScreen;
