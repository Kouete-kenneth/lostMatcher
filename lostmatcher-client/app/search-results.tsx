import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { SearchTabsNW, BottomTabBarNW } from "@/components/molecules";
import { SearchResultsContentNW, ClaimModalNW } from "@/components/organisms";

// Dummy search results data
const generateSearchResults = (
	searchType: "text" | "image" | "combined",
	lostItemId: string
) => {
	const baseResults = [
		{
			id: `${searchType}_result_1`,
			matchingScore:
				searchType === "combined"
					? 95
					: searchType === "text"
					? 88
					: 92,
			source:
				searchType === "text"
					? "Text Analysis"
					: searchType === "image"
					? "Image Analysis"
					: "Combined Analysis",
			lostItem: {
				id: lostItemId,
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
				id: `found_${searchType}_1`,
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
	];

	// Generate different numbers of results for each search type
	if (searchType === "text") {
		return baseResults.concat([
			{
				...baseResults[0],
				id: `${searchType}_result_2`,
				matchingScore: 82,
				foundItem: {
					...baseResults[0].foundItem,
					id: `found_${searchType}_2`,
					name: "Dark Phone",
					description: "Black smartphone found near train station",
					image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=200&fit=crop&crop=center",
					attributes: {
						color: "Dark Gray",
						size: "Standard",
						material: "Metal",
						brand: "Unknown",
					},
				},
			},
		]);
	} else if (searchType === "image") {
		return baseResults.concat([
			{
				...baseResults[0],
				id: `${searchType}_result_2`,
				matchingScore: 89,
				foundItem: {
					...baseResults[0].foundItem,
					id: `found_${searchType}_2`,
					name: "Similar iPhone",
					description: "Found iPhone with matching appearance",
					image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=200&fit=crop&crop=center",
				},
			},
			{
				...baseResults[0],
				id: `${searchType}_result_3`,
				matchingScore: 85,
				foundItem: {
					...baseResults[0].foundItem,
					id: `found_${searchType}_3`,
					name: "Black Phone Device",
					description: "Mobile device found at station",
					image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=300&h=200&fit=crop&crop=center",
				},
			},
		]);
	} else {
		// Combined search returns the most results
		return baseResults.concat([
			{
				...baseResults[0],
				id: `${searchType}_result_2`,
				matchingScore: 91,
				foundItem: {
					...baseResults[0].foundItem,
					id: `found_${searchType}_2`,
					name: "iPhone with Case",
					description: "Found iPhone matching description and image",
					image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=200&fit=crop&crop=center",
				},
			},
			{
				...baseResults[0],
				id: `${searchType}_result_3`,
				matchingScore: 87,
				foundItem: {
					...baseResults[0].foundItem,
					id: `found_${searchType}_3`,
					name: "Station Phone Find",
					description: "Black phone found at Central Station",
					image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=300&h=200&fit=crop&crop=center",
				},
			},
		]);
	}
};

const SearchResultsScreen = () => {
	const router = useRouter();
	const params = useLocalSearchParams();

	// Get lost item details from params (passed from report flow)
	const lostItemId = (params.lostItemId as string) || "lost_item_1";
	const itemName = (params.itemName as string) || "Lost Item";

	const [activeTab, setActiveTab] = useState<"text" | "image" | "combined">(
		"text"
	);
	const [isLoading, setIsLoading] = useState(true);
	const [currentResultIndex, setCurrentResultIndex] = useState(0);
	const [showClaimModal, setShowClaimModal] = useState(false);
	const [claimMessage, setClaimMessage] = useState("");

	// Search results for each tab
	const [searchResults, setSearchResults] = useState<{
		text: any[];
		image: any[];
		combined: any[];
	}>({
		text: [],
		image: [],
		combined: [],
	});

	// Simulate search process
	useEffect(() => {
		const simulateSearch = async () => {
			setIsLoading(true);

			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generate results for all search types
			const textResults = generateSearchResults("text", lostItemId);
			const imageResults = generateSearchResults("image", lostItemId);
			const combinedResults = generateSearchResults(
				"combined",
				lostItemId
			);

			setSearchResults({
				text: textResults,
				image: imageResults,
				combined: combinedResults,
			});

			setIsLoading(false);
		};

		simulateSearch();
	}, [lostItemId]);

	const handleTabChange = (tab: "text" | "image" | "combined") => {
		setActiveTab(tab);
		setCurrentResultIndex(0); // Reset to first result when switching tabs
	};

	const currentResults = searchResults[activeTab];
	const currentResult = currentResults[currentResultIndex];
	const isFirstResult = currentResultIndex === 0;
	const isLastResult = currentResultIndex === currentResults.length - 1;

	const handlePrevious = () => {
		if (!isFirstResult) {
			setCurrentResultIndex(currentResultIndex - 1);
		}
	};

	const handleNext = () => {
		if (!isLastResult) {
			setCurrentResultIndex(currentResultIndex + 1);
		}
	};

	const handleClaim = () => {
		setShowClaimModal(true);
	};

	const handleSubmitClaim = () => {
		// Log the fields needed to submit a claim
		console.log("=== SEARCH RESULT CLAIM SUBMISSION ===");
		console.log("Lost Item ID:", currentResult.lostItem.id);
		console.log("Found Item ID:", currentResult.foundItem.id);
		console.log("Search Result ID:", currentResult.id);
		console.log("Search Type:", activeTab);
		console.log("Matching Score:", currentResult.matchingScore);
		console.log("Claim Message:", claimMessage);
		console.log("Claimant Info:", {
			userId: "current_user_id",
			timestamp: new Date().toISOString(),
		});
		console.log("=====================================");

		setShowClaimModal(false);
		setClaimMessage("");
		Alert.alert(
			"Claim Submitted",
			"Your claim has been submitted successfully. You will be notified once it's reviewed.",
			[
				{
					text: "View My Claims",
					onPress: () => {
						router.back();
						router.push("/my-claims");
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
			"This item will be removed from your search results. Are you sure?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: () => {
						Alert.alert(
							"Removed",
							"This result has been removed from your search."
						);
						if (currentResults.length === 1) {
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
			disabled: isFirstResult || isLoading || currentResults.length === 0,
			variant: "previous" as const,
		},
		{
			icon: "checkmark-done" as const,
			label: "Claim",
			onPress: handleClaim,
			disabled: isLoading || currentResults.length === 0,
			variant: "claim" as const,
		},
		{
			icon: "close" as const,
			label: "Not Match",
			onPress: handleNotMatch,
			disabled: isLoading || currentResults.length === 0,
			variant: "reject" as const,
		},
		{
			icon: "chevron-forward" as const,
			label: "Next",
			onPress: handleNext,
			disabled: isLastResult || isLoading || currentResults.length === 0,
			variant: "next" as const,
		},
	];

	const resultCounts = {
		text: searchResults.text.length,
		image: searchResults.image.length,
		combined: searchResults.combined.length,
	};

	return (
		<>
			<ScreenTemplateNW
				title={`Search Results - ${itemName}`}
				showBackButton={true}
				onBackPress={() => router.back()}
				scrollable={false}
				contentClassName="px-0 py-0">
				{/* Search Tabs */}
				<SearchTabsNW
					activeTab={activeTab}
					onTabChange={handleTabChange}
					isLoading={isLoading}
					resultCounts={resultCounts}
				/>

				{/* Search Results Content */}
				<SearchResultsContentNW
					results={currentResults}
					currentResultIndex={currentResultIndex}
					searchType={activeTab}
					isLoading={isLoading}
				/>

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

export default SearchResultsScreen;
