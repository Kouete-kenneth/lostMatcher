import React from "react";
import { View, Text } from "react-native";

interface ClaimItemInfoProps {
	lostItemName: string;
	foundItemName: string;
	lostItemDescription: string;
	foundItemDescription: string;
	matchingScore: number;
	claimMessage: string;
}

export default function ClaimItemInfoNW({
	lostItemName,
	foundItemName,
	lostItemDescription,
	foundItemDescription,
	matchingScore,
	claimMessage,
}: ClaimItemInfoProps) {
	return (
		<>
			{/* Items Info */}
			<View className="mb-3">
				<Text className="text-base font-semibold text-gray-900 mb-1">
					{lostItemName} → {foundItemName}
				</Text>
				<Text className="text-sm text-gray-600 mb-2">
					{matchingScore}% Match
				</Text>
				<Text className="text-sm text-gray-500">
					Lost: {lostItemDescription}
				</Text>
				<Text className="text-sm text-gray-500">
					Found: {foundItemDescription}
				</Text>
			</View>

			{/* Claim Message */}
			<View className="mb-3">
				<Text className="text-sm font-medium text-gray-700 mb-1">
					Your Message:
				</Text>
				<Text className="text-sm text-gray-600 italic">
					&ldquo;{claimMessage}&rdquo;
				</Text>
			</View>
		</>
	);
}
