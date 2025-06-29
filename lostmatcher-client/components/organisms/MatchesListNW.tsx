import React from "react";
import { ScrollView, View, Text } from "react-native";
import MatchItemCardNW from "../molecules/MatchItemCardNW";
import EmptyStateNW from "../molecules/EmptyStateNW";

interface MatchItem {
	id: string;
	lostItemName: string;
	description: string;
	date: string;
	matchCount: number;
}

interface MatchesListProps {
	matches: MatchItem[];
	onMatchPress: (matchId: string, itemName: string) => void;
}

export default function MatchesListNW({
	matches,
	onMatchPress,
}: MatchesListProps) {
	if (matches.length === 0) {
		return (
			<EmptyStateNW
				icon="search"
				title="No Matches Yet"
				description="We'll notify you when we find potential matches for your lost items."
			/>
		);
	}

	return (
		<ScrollView
			className="flex-1 pt-4"
			showsVerticalScrollIndicator={false}>
			<View className="mx-4 mb-4">
				<Text className="text-gray-600">
					We found potential matches for your lost items
				</Text>
			</View>

			{matches.map((match) => (
				<MatchItemCardNW
					key={match.id}
					date={match.date}
					itemName={match.lostItemName}
					description={match.description}
					matchCount={match.matchCount}
					onPress={() => onMatchPress(match.id, match.lostItemName)}
				/>
			))}
		</ScrollView>
	);
}
