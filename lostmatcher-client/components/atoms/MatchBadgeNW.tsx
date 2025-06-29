import React from "react";
import { View, Text } from "react-native";

interface MatchBadgeProps {
	count: number;
}

export default function MatchBadgeNW({ count }: MatchBadgeProps) {
	return (
		<View className="bg-blue-100 px-2 py-1 rounded-full">
			<Text className="text-xs font-medium text-blue-700">
				{count} {count === 1 ? "match" : "matches"}
			</Text>
		</View>
	);
}
