import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { MatchScoreNW } from "@/components/atoms";
import { ItemComparisonNW } from "@/components/organisms";
import BottomTabBarNW from "@/components/molecules/BottomTabBarNW";

// Dummy data for pending matches
const pendingMatches = [
	{
		id: "1",
		matchingScore: 92,
		source: "Image Analysis",
		claimMessage:
			"I am sure this is my phone because of the blue case and location.",
		lostItem: {
			id: "lost_1",
			name: "Black iPhone 14 Pro",
			description: "Lost near Central Station, has a blue case",
			category: "Electronics",
			dateLost: "2024-12-20",
			location: "Central Station",
			image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop&crop=center",
			attributes: {
				color: "Black",
				size: "Standard",
				brand: "Apple",
				material: "Metal/Glass",
			},
			owner: {
				name: "kouete piere",
				town: "Downtown",
			},
		},
		foundItem: {
			id: "found_1",
			name: "iPhone with Blue Case",
			description: "Found at Central Station platform 2",
			category: "Electronics",
			dateFound: "2024-12-20",
			location: "Central Station - Platform 2",
			image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop&crop=center",
			attributes: {
				color: "Black",
				size: "Standard",
				brand: "Apple",
				material: "Metal/Glass",
			},
			finder: {
				name: "Sarah anthony",
				town: "Central District",
			},
		},
		status: "pending",
		submittedAt: "2024-12-21T10:00:00Z",
	},
	{
		id: "2",
		matchingScore: 85,
		source: "Image Analysis",
		claimMessage: "Wallet contains my ID and cards, please verify.",
		lostItem: {
			id: "lost_2",
			name: "Brown Leather Wallet",
			description: "Lost at City Mall, contains ID and cards",
			category: "Accessories",
			dateLost: "2024-12-18",
			location: "City Mall",
			image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=200&fit=crop&crop=center",
			attributes: {
				color: "Brown",
				material: "Leather",
				brand: "Fossil",
				size: "Medium",
			},
			owner: {
				name: "Jane clourette",
				town: "Bepanda",
			},
		},
		foundItem: {
			id: "found_2",
			name: "Leather Wallet",
			description: "Brown wallet found at mall food court",
			category: "Accessories",
			dateFound: "2024-12-18",
			location: "City Mall Food Court",
			image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=200&fit=crop&crop=center",
			attributes: {
				color: "Brown",
				material: "Leather",
				brand: "Unknown",
				size: "Medium",
			},
			finder: {
				name: "Mike Brown",
				town: "Bonabo",
			},
		},
		status: "pending",
		submittedAt: "2024-12-19T15:30:00Z",
	},
];

export default function AdminApprovalsScreen() {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	// Bottom tab actions for detail view
	const handleApprove = () => {
		Alert.alert("Approved", "This match has been approved.");
	};
	const handleReject = () => {
		Alert.alert("Rejected", "This match has been rejected.");
	};
	const handlePrev = () => {
		if (selectedIndex && selectedIndex > 0)
			setSelectedIndex(selectedIndex - 1);
	};
	const handleNext = () => {
		if (selectedIndex !== null && selectedIndex < pendingMatches.length - 1)
			setSelectedIndex(selectedIndex + 1);
	};

	if (selectedIndex !== null) {
		const match = pendingMatches[selectedIndex];
		const isFirst = selectedIndex === 0;
		const isLast = selectedIndex === pendingMatches.length - 1;

		// Bottom tab items for admin approval actions
		const bottomTabItems = [
			{
				icon: "chevron-back" as const,
				label: "Prev",
				onPress: handlePrev,
				disabled: isFirst,
				variant: "previous" as const,
			},
			{
				icon: "checkmark-done" as const,
				label: "Approve",
				onPress: handleApprove,
				disabled: false,
				variant: "claim" as const,
			},
			{
				icon: "close" as const,
				label: "Reject",
				onPress: handleReject,
				disabled: false,
				variant: "reject" as const,
			},
			{
				icon: "chevron-forward" as const,
				label: "Next",
				onPress: handleNext,
				disabled: isLast,
				variant: "next" as const,
			},
		];

		return (
			<ScreenTemplateNW
				title="Approval Details"
				showBackButton={true}
				onBackPress={() => setSelectedIndex(null)}
				scrollable={false}
				contentClassName="px-0 py-0">
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}>
					{/* User Claim Message */}
					<View className="my-4 mx-4 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
						<Text className="text-xs text-blue-700 font-semibold mb-1">
							User&#39;s Claim Message:
						</Text>
						<Text className="text-sm text-blue-900">
							{match.claimMessage || "No message provided."}
						</Text>
					</View>
					<MatchScoreNW
						score={match.matchingScore}
						source={match.source}
						currentMatch={selectedIndex + 1}
						totalMatches={pendingMatches.length}
					/>
					<ItemComparisonNW
						lostItem={match.lostItem}
						foundItem={match.foundItem}
					/>
				</ScrollView>
				{/* Bottom Navigation */}
				<BottomTabBarNW items={bottomTabItems} />
			</ScreenTemplateNW>
		);
	}

	// List view
	return (
		<ScrollView className="flex-1 bg-white">
			<View className="px-6 pt-6 mb-2">
				<Text className="text-base text-gray-700 text-center mb-4">
					Review and approve or reject item matches submitted by
					users.
				</Text>
			</View>
			{pendingMatches.map((match, idx) => (
				<TouchableOpacity
					key={match.id}
					className="rounded-lg px-4 py-4 mb-2 mx-4 border border-gray-200"
					activeOpacity={0.85}
					onPress={() => setSelectedIndex(idx)}>
					<View className="flex-row items-center mb-2">
						<Text
							className="text-lg font-semibold flex-1"
							numberOfLines={1}>
							{match.lostItem.name} ↔ {match.foundItem.name}
						</Text>
						<Text className="text-xs text-gray-500 ml-2">
							{new Date(match.submittedAt).toLocaleDateString()}
						</Text>
					</View>
					<Text
						className="text-sm text-gray-600 mb-1"
						numberOfLines={2}>
						{match.lostItem.description}
					</Text>
					<View className="flex-row items-center justify-between mt-2">
						<Text className="text-xs text-gray-500">
							Score:{" "}
							<Text className="font-bold text-primary-500">
								{match.matchingScore}%
							</Text>
						</Text>
						<Text className="text-xs text-gray-500">
							Submitted by:{" "}
							<Text className="font-medium">
								{match.lostItem.owner.name}
							</Text>
						</Text>
					</View>
				</TouchableOpacity>
			))}
			{pendingMatches.length === 0 && (
				<Text className="text-center text-gray-400 mt-12">
					No pending approvals.
				</Text>
			)}
		</ScrollView>
	);
}
