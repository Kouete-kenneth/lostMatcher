import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { MatchScoreNW } from "@/components/atoms";
import { BottomTabBarNW } from "@/components/molecules";
import { ItemComparisonNW, ClaimModalNW } from "@/components/organisms";

// Dummy data for potential matches
const potentialMatches = [
	{
		id: "1",
		matchingScore: 95,
		source: "Image Analysis",
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
				material: "Metal/Glass",
				brand: "Apple",
			},
			owner: {
				name: "John Doe",
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
				material: "Metal/Glass",
				brand: "Apple",
			},
			finder: {
				name: "Sarah Smith",
				town: "Central District",
			},
		},
	},
	{
		id: "2",
		matchingScore: 87,
		source: "Image Analysis",
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
				material: "Metal/Glass",
				brand: "Apple",
			},
			owner: {
				name: "John Doe",
				town: "Downtown",
			},
		},
		foundItem: {
			id: "found_2",
			name: "Dark Phone",
			description: "Black smartphone found near train station",
			category: "Electronics",
			dateFound: "2024-12-19",
			location: "Near Central Station",
			image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=200&fit=crop&crop=center",
			attributes: {
				color: "Dark Gray",
				size: "Standard",
				material: "Metal",
				brand: "Unknown",
			},
			finder: {
				name: "Sarah Johnson",
				town: "City Center",
			},
		},
	},
];

const ClaimScreen = () => {
	const router = useRouter();
	const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
	const [showClaimModal, setShowClaimModal] = useState(false);
	const [claimMessage, setClaimMessage] = useState("");

	const currentMatch = potentialMatches[currentMatchIndex];
	const isFirstMatch = currentMatchIndex === 0;
	const isLastMatch = currentMatchIndex === potentialMatches.length - 1;

	const handlePrevious = () => {
		if (!isFirstMatch) {
			setCurrentMatchIndex(currentMatchIndex - 1);
		}
	};

	const handleNext = () => {
		if (!isLastMatch) {
			setCurrentMatchIndex(currentMatchIndex + 1);
		}
	};

	const handleClaim = () => {
		setShowClaimModal(true);
	};

	const handleSubmitClaim = () => {
		// Log the fields needed to submit a claim
		console.log("=== CLAIM SUBMISSION FIELDS ===");
		console.log("Lost Item ID:", currentMatch.lostItem.id);
		console.log("Found Item ID:", currentMatch.foundItem.id);
		console.log("Match ID:", currentMatch.id);
		console.log("Matching Score:", currentMatch.matchingScore);
		console.log("Claim Message:", claimMessage);
		console.log("Claimant Info:", {
			// In a real app, this would come from user authentication
			userId: "current_user_id",
			timestamp: new Date().toISOString(),
		});
		console.log("Lost Item Owner:", currentMatch.lostItem.owner);
		// Note: Finder info is not included - only revealed after admin approval
		console.log("================================");

		setShowClaimModal(false);
		setClaimMessage("");
		Alert.alert(
			"Claim Submitted",
			"Your claim has been submitted successfully. You will be notified once it's reviewed.",
			[
				{
					text: "View My Claims",
					onPress: () => {
						router.back(); // Go back to matches first
						router.push("/my-claims"); // Then navigate to claims screen
					},
				},
				{
					text: "OK",
					onPress: () => router.back(),
				},
			]
		);
	};

	const handleNotMatch = () => {
		Alert.alert(
			"Not a Match",
			"This item will be removed from your matches. Are you sure?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: () => {
						// Remove this match and go to next or back
						Alert.alert(
							"Removed",
							"This match has been removed from your list."
						);
						if (potentialMatches.length === 1) {
							router.back();
						} else {
							handleNext();
						}
					},
				},
			]
		);
	};

	const bottomTabItems = [
		{
			icon: "chevron-back" as const,
			label: "Previous",
			onPress: handlePrevious,
			disabled: isFirstMatch,
			variant: "previous" as const,
		},
		{
			icon: "checkmark-done" as const,
			label: "Claim",
			onPress: handleClaim,
			disabled: false,
			variant: "claim" as const,
		},
		{
			icon: "close" as const,
			label: "Not Match",
			onPress: handleNotMatch,
			disabled: false,
			variant: "reject" as const,
		},
		{
			icon: "chevron-forward" as const,
			label: "Next",
			onPress: handleNext,
			disabled: isLastMatch,
			variant: "next" as const,
		},
	];

	return (
		<>
			<ScreenTemplateNW
				title="Match Review"
				showBackButton={true}
				onBackPress={() => router.back()}
				scrollable={false}
				contentClassName="px-0 py-0">
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}>
					{/* Matching Score Section */}
					<MatchScoreNW
						score={currentMatch.matchingScore}
						source={currentMatch.source}
						currentMatch={currentMatchIndex + 1}
						totalMatches={potentialMatches.length}
					/>

					{/* Items Comparison */}
					<ItemComparisonNW
						lostItem={currentMatch.lostItem}
						foundItem={currentMatch.foundItem}
					/>
				</ScrollView>

				{/* Bottom Navigation */}
				<BottomTabBarNW items={bottomTabItems} />
			</ScreenTemplateNW>

			{/* Claim Modal */}
			<ClaimModalNW
				visible={showClaimModal}
				claimMessage={claimMessage}
				onClaimMessageChange={setClaimMessage}
				onClose={() => setShowClaimModal(false)}
				onSubmit={handleSubmitClaim}
			/>
		</>
	);
};

export default ClaimScreen;
