import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { SearchTabsNW, BottomTabBarNW } from "@/components/molecules";
import { SearchResultsContentNW, ClaimModalNW } from "@/components/organisms";
import { api, ApiError } from "@/lib/api";

// Define search result type
export type SearchResult = {
	id: string;
	matchingScore: number;
	source: string;
	lostItem: any;
	foundItem: any;
};

const SearchResultsScreen = () => {
	const router = useRouter();
	const params = useLocalSearchParams();

	// Get item details from params (passed from report flow)
	const lostItemId = (params.lostItemId as string) || "";
	const foundItemId = (params.foundItemId as string) || "";
	const itemName = (params.itemName as string) || "Item";
	const searchType = (params.searchType as string) || "lost"; // "lost" or "found"
	const searchResultsParam = params.searchResults as string;

	const [activeTab, setActiveTab] = useState<"text" | "image" | "combined">(
		"combined"
	);
	const [isLoading, setIsLoading] = useState(true);
	const [currentResultIndex, setCurrentResultIndex] = useState(0);
	const [showClaimModal, setShowClaimModal] = useState(false);
	const [claimMessage, setClaimMessage] = useState("");

	// Search results for each tab
	const [searchResults, setSearchResults] = useState<{
		text: SearchResult[];
		image: SearchResult[];
		combined: SearchResult[];
	}>({
		text: [],
		image: [],
		combined: [],
	});

	// Load search results - either from API or from params
	useEffect(() => {
		const loadSearchResults = async () => {
			setIsLoading(true);

			try {
				let results: {
					text: SearchResult[];
					image: SearchResult[];
					combined: SearchResult[];
				} = {
					text: [],
					image: [],
					combined: [],
				};

				// Check if search results were passed in params (from found report)
				if (searchType === "found" && searchResultsParam) {
					try {
						// Parse the search results passed from the found report screen
						const parsedResults = JSON.parse(searchResultsParam);
						console.log(
							"Using search results from params:",
							parsedResults
						);

						// Validate the parsed results have the expected structure
						if (
							parsedResults &&
							typeof parsedResults === "object" &&
							Array.isArray(parsedResults.text) &&
							Array.isArray(parsedResults.image) &&
							Array.isArray(parsedResults.combined)
						) {
							results = {
								text: parsedResults.text || [],
								image: parsedResults.image || [],
								combined: parsedResults.combined || [],
							};
						} else {
							console.warn(
								"Search results in unexpected format:",
								parsedResults
							);
						}
					} catch (error) {
						console.error("Failed to parse search results:", error);
						// Continue with API fetch if parsing fails
					}
				}

				// If we don't have results from params, fetch from API
				if (
					results.text.length === 0 &&
					results.image.length === 0 &&
					results.combined.length === 0
				) {
					if (lostItemId) {
						// Validate that we have a proper MongoDB ObjectId
						if (!lostItemId || lostItemId.length !== 24) {
							console.error(
								"Invalid MongoDB ObjectId for lost item:",
								lostItemId
							);
							Alert.alert(
								"Error",
								"Invalid item ID. Please try creating your report again.",
								[
									{
										text: "Go Back",
										onPress: () => router.back(),
									},
								]
							);
							return;
						}

						// Fetch results for lost item
						console.log(
							"Fetching search results for lost item:",
							lostItemId
						);
						try {
							console.log(
								`API Request: Fetching matches for lost item ID: ${lostItemId}`
							);
							const response = await api.getMatchesForLostReport(
								lostItemId
							);
							console.log(
								"Lost item matches response:",
								response
							);

							// Check for the new three-result-sets format first
							if (
								response &&
								response.imageMatches &&
								response.textMatches &&
								response.combinedMatches
							) {
								// Use the new consistent format
								results = {
									text: Array.isArray(response.textMatches)
										? response.textMatches
										: [],
									image: Array.isArray(response.imageMatches)
										? response.imageMatches
										: [],
									combined: Array.isArray(
										response.combinedMatches
									)
										? response.combinedMatches
										: [],
								};
								console.log(
									"Using new three-result-sets format for lost item"
								);
							} else {
								// Fallback to legacy format (for backward compatibility)
								const matchesArray =
									response?.matches ||
									response?.data?.matches ||
									[];

								if (
									response &&
									Array.isArray(matchesArray) &&
									matchesArray.length > 0
								) {
									console.log(
										"Using legacy format for lost item"
									);
									const formattedMatches: SearchResult[] = [];

									for (
										let i = 0;
										i < matchesArray.length;
										i++
									) {
										const match = matchesArray[i];
										if (!match) continue;

										const score =
											typeof match.similarity_score ===
											"number"
												? match.similarity_score
												: 0.5;

										const lostItem = match.lostItem || {};
										const foundItem =
											match.document ||
											match.foundItem ||
											{};

										formattedMatches.push({
											id: `combined_result_${
												match.id || i
											}`,
											matchingScore: Math.round(
												score * 100
											),
											source: "Combined Analysis",
											lostItem: {
												id: lostItemId,
												name:
													itemName ||
													lostItem?.itemDetails
														?.name ||
													"Lost Item",
												description:
													lostItem?.itemDetails
														?.description || "",
												category:
													lostItem?.itemDetails
														?.category || "",
												dateLost: lostItem?.lostDate
													? new Date(
															lostItem.lostDate
													  )
															.toISOString()
															.split("T")[0]
													: "Unknown",
												location:
													lostItem?.lostLocation ||
													"Unknown",
												image:
													lostItem?.image?.url || "",
												attributes:
													lostItem?.attributes || {},
												owner: lostItem?.reporter
													? {
															name:
																lostItem
																	.reporter
																	.name ||
																"Unknown",
															id:
																lostItem
																	.reporter
																	._id || "",
													  }
													: {
															name: "Unknown",
															id: "",
													  },
											},
											foundItem: {
												id:
													foundItem._id ||
													foundItem.id ||
													`found_${i}`,
												name:
													foundItem?.itemDetails
														?.name || "Found Item",
												description:
													foundItem?.itemDetails
														?.description || "",
												category:
													foundItem?.itemDetails
														?.category || "",
												dateFound: foundItem?.foundDate
													? new Date(
															foundItem.foundDate
													  )
															.toISOString()
															.split("T")[0]
													: "Unknown",
												location:
													foundItem?.foundLocation ||
													"Unknown",
												image:
													foundItem?.image?.url || "",
												attributes:
													foundItem?.attributes || {},
											},
										});
									}

									results = {
										text: [],
										image: [],
										combined: formattedMatches,
									};
								}
							}
						} catch (error) {
							console.error(
								"Error fetching matches for lost item:",
								error
							);
							Alert.alert(
								"Error",
								"Failed to fetch matching results. Please try again later."
							);
						}
					} else if (foundItemId) {
						// Validate that we have a proper MongoDB ObjectId
						if (!foundItemId || foundItemId.length !== 24) {
							console.error(
								"Invalid MongoDB ObjectId for found item:",
								foundItemId
							);
							Alert.alert(
								"Error",
								"Invalid item ID. Please try creating your report again.",
								[
									{
										text: "Go Back",
										onPress: () => router.back(),
									},
								]
							);
							return;
						}

						// Fetch results for found item
						console.log(
							"Fetching search results for found item:",
							foundItemId
						);
						try {
							console.log(
								`API Request: Fetching matches for found item ID: ${foundItemId}`
							);
							const response = await api.getMatchesForFoundReport(
								foundItemId
							);
							console.log(
								"Found item matches response:",
								response
							);

							// Check for the new three-result-sets format first
							if (
								response &&
								response.imageMatches &&
								response.textMatches &&
								response.combinedMatches
							) {
								// Use the new consistent format
								results = {
									text: Array.isArray(response.textMatches)
										? response.textMatches
										: [],
									image: Array.isArray(response.imageMatches)
										? response.imageMatches
										: [],
									combined: Array.isArray(
										response.combinedMatches
									)
										? response.combinedMatches
										: [],
								};
								console.log(
									"Using new three-result-sets format for found item"
								);
							} else if (
								response &&
								(response.searchResults ||
									response.data?.searchResults)
							) {
								// Fallback to legacy nested format
								const searchResults =
									response.searchResults ||
									response.data?.searchResults ||
									{};
								results = {
									text: Array.isArray(searchResults.text)
										? searchResults.text
										: [],
									image: Array.isArray(searchResults.image)
										? searchResults.image
										: [],
									combined: Array.isArray(
										searchResults.combined
									)
										? searchResults.combined
										: [],
								};
								console.log(
									"Using legacy nested format for found item"
								);
							}
						} catch (error) {
							console.error(
								"Error fetching matches for found item:",
								error
							);
							Alert.alert(
								"Error",
								"Failed to fetch matching results. Please try again later."
							);
						}
					}
				}

				// If we still have no results, show appropriate message
				if (
					results.text.length === 0 &&
					results.image.length === 0 &&
					results.combined.length === 0
				) {
					console.log("No matching results found from the server");

					// Show message to user about no results
					Alert.alert(
						"No Matches Found",
						"We couldn't find any matching items at this time. Please try again later or check if your item has been reported.",
						[
							{
								text: "Go Back",
								onPress: () => router.back(),
							},
							{
								text: "Stay",
								style: "cancel",
							},
						]
					);

					// Keep empty results
					results = {
						text: [],
						image: [],
						combined: [],
					};
				}

				setSearchResults(results);
			} catch (error) {
				console.error("Error loading search results:", error);
				Alert.alert(
					"Error",
					"Failed to load search results. Please try again."
				);

				// Fallback to empty results
				setSearchResults({
					text: [],
					image: [],
					combined: [],
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadSearchResults();
	}, [
		lostItemId,
		foundItemId,
		searchType,
		searchResultsParam,
		itemName,
		router,
	]);

	const handleTabChange = (tab: "text" | "image" | "combined") => {
		setActiveTab(tab);
		setCurrentResultIndex(0); // Reset to first result when switching tabs
	};

	const currentResults = searchResults[activeTab] || [];
	const currentResult =
		currentResults.length > 0
			? currentResults[currentResultIndex]
			: undefined;
	const isFirstResult = currentResultIndex === 0;
	const isLastResult =
		currentResultIndex === currentResults.length - 1 ||
		currentResults.length === 0;

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
		// Check if we have a valid current result
		if (!currentResult) {
			Alert.alert("Error", "No result selected to claim");
			return;
		}

		// Log the fields needed to submit a claim
		console.log("=== SEARCH RESULT CLAIM SUBMISSION ===");
		console.log("Lost Item ID:", currentResult?.lostItem?.id || "unknown");
		console.log(
			"Found Item ID:",
			currentResult?.foundItem?.id || "unknown"
		);
		console.log("Search Result ID:", currentResult?.id || "unknown");
		console.log("Search Type:", activeTab);
		console.log("Matching Score:", currentResult?.matchingScore || 0);
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
