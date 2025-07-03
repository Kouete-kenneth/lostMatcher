import React from "react";
import { ScrollView } from "react-native";
import { MatchScoreNW, LoadingStateNW } from "../atoms";
import { EmptyStateNW } from "../molecules";
import ItemComparisonNW from "./ItemComparisonNW";

interface SearchResult {
	id: string;
	matchingScore: number;
	source: string;
	lostItem: any;
	foundItem: any;
}

interface SearchResultsContentProps {
	results: SearchResult[];
	currentResultIndex: number;
	searchType: "text" | "image" | "combined";
	isLoading: boolean;
}

export default function SearchResultsContentNW({
	results,
	currentResultIndex,
	searchType,
	isLoading,
}: SearchResultsContentProps) {
	if (isLoading) {
		return <LoadingStateNW searchType={searchType} />;
	}

	if (!results || results.length === 0) {
		const getEmptyMessage = () => {
			switch (searchType) {
				case "text":
					return "No matches found using text description. Try image search or combined search.";
				case "image":
					return "No matches found using image analysis. Try text search or combined search.";
				case "combined":
					return "No matches found using combined search. Try adjusting your item description.";
				default:
					return "No matches found for this search.";
			}
		};

		return (
			<EmptyStateNW
				icon="search"
				title="No Matches Found"
				description={getEmptyMessage()}
			/>
		);
	}

	const currentResult = results[currentResultIndex];

	if (!currentResult) {
		return (
			<EmptyStateNW
				icon="alert-circle"
				title="Invalid Result"
				description="There was an error displaying this search result."
			/>
		);
	}

	// Safely access nested properties
	const lostItem = currentResult.lostItem || {};
	const foundItem = currentResult.foundItem || {};

	return (
		<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
			{/* Matching Score Section */}
			<MatchScoreNW
				score={currentResult.matchingScore || 0}
				source={currentResult.source || "Analysis"}
				currentMatch={currentResultIndex + 1}
				totalMatches={results.length}
			/>

			{/* Items Comparison */}
			<ItemComparisonNW lostItem={lostItem} foundItem={foundItem} />
		</ScrollView>
	);
}
