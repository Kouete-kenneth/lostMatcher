import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { MatchesListNW } from "@/components/organisms";

// Dummy data for matches
const matchesData = [
	{
		id: "1",
		lostItemName: "Black iPhone 14 Pro",
		description: "Lost near Central Station, has a blue case",
		date: "2024-12-20",
		matchCount: 3,
	},
	{
		id: "2",
		lostItemName: "Brown Leather Wallet",
		description:
			"Contains ID and credit cards, brown leather with gold zipper",
		date: "2024-12-19",
		matchCount: 2,
	},
	{
		id: "3",
		lostItemName: "Silver MacBook Pro",
		description: "13-inch MacBook Pro with stickers on the back",
		date: "2024-12-18",
		matchCount: 1,
	},
	{
		id: "4",
		lostItemName: "Blue Backpack",
		description: "Nike blue backpack with laptop compartment",
		date: "2024-12-17",
		matchCount: 4,
	},
];

const MatchesTabScreen = () => {
	const router = useRouter();

	const handleMatchPress = (matchId: string, itemName: string) => {
		router.push({
			pathname: "/claim-screen",
			params: { matchId, itemName },
		});
	};

	return (
		<ScreenTemplateNW
			title="Matches"
			showBackButton={true}
			onBackPress={() => router.back()}
			scrollable={false}
			contentClassName="px-0 py-0">
			<View className="flex-1 bg-gray-50">
				<MatchesListNW
					matches={matchesData}
					onMatchPress={handleMatchPress}
				/>
			</View>
		</ScreenTemplateNW>
	);
};

export default MatchesTabScreen;
