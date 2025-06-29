import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateLabelNW from "../atoms/DateLabelNW";
import MatchBadgeNW from "../atoms/MatchBadgeNW";

interface MatchItemCardProps {
	date: string;
	itemName: string;
	description: string;
	matchCount: number;
	onPress: () => void;
}

export default function MatchItemCardNW({
	date,
	itemName,
	description,
	matchCount,
	onPress,
}: MatchItemCardProps) {
	return (
		<TouchableOpacity
			className="bg-white mx-4 mb-3 rounded-lg p-4 border border-gray-200"
			onPress={onPress}>
			<View className="flex-row items-center justify-between">
				<View className="flex-1 mr-3">
					<DateLabelNW date={date} />

					<Text className="text-lg font-semibold text-gray-900 mb-1">
						{itemName}
					</Text>

					<Text
						className="text-sm text-gray-600 mb-2"
						numberOfLines={2}>
						{description}
					</Text>

					<View className="flex-row items-center">
						<MatchBadgeNW count={matchCount} />
					</View>
				</View>

				<View className="ml-2">
					<Ionicons
						name="chevron-forward"
						size={20}
						color="#6B7280"
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}
