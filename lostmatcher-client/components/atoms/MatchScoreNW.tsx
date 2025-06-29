import React from "react";
import { View, Text } from "react-native";

interface MatchScoreProps {
	score: number;
	source: string;
	currentMatch: number;
	totalMatches: number;
}

export default function MatchScoreNW({
	score,
	source,
	currentMatch,
	totalMatches,
}: MatchScoreProps) {
	return (
		<View className="bg-gray-50 border-b border-gray-200 px-4 py-3">
			<View className="flex-row items-center justify-between mb-2">
				<View className="flex-row items-center">
					<View className="bg-blue-100 rounded-lg px-3 py-1">
						<Text className="text-blue-700 font-semibold text-sm">
							{score}% Match
						</Text>
					</View>
					<Text className="text-gray-500 text-sm ml-3">
						via {source}
					</Text>
				</View>
				<Text className="text-gray-400 text-xs">
					{currentMatch} of {totalMatches}
				</Text>
			</View>
		</View>
	);
}
