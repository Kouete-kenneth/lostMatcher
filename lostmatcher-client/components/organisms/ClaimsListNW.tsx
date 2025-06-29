import React from "react";
import { ScrollView, View, Text } from "react-native";
import ClaimCardNW from "../molecules/ClaimCardNW";
import EmptyStateNW from "../molecules/EmptyStateNW";

interface ClaimData {
	id: string;
	status: "pending" | "approved" | "rejected";
	submittedAt: string;
	approvedAt?: string;
	rejectedAt?: string;
	lostItem: {
		name: string;
		description: string;
	};
	foundItem: {
		name: string;
		description: string;
	};
	matchingScore: number;
	claimMessage: string;
	rejectionReason?: string;
	finderContact?: {
		name: string;
		email: string;
		phone: string;
	};
}

interface ClaimsListProps {
	claims: ClaimData[];
}

export default function ClaimsListNW({ claims }: ClaimsListProps) {
	if (claims.length === 0) {
		return (
			<EmptyStateNW
				icon="document-outline"
				title="No Claims Yet"
				description="When you submit claims for lost items, they will appear here."
			/>
		);
	}

	return (
		<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
			<View className="mb-4">
				<Text className="text-lg font-semibold text-gray-900 mb-2">
					Your Item Claims
				</Text>
				<Text className="text-sm text-gray-600">
					Track the status of your submitted claims
				</Text>
			</View>

			{claims.map((claim) => (
				<ClaimCardNW key={claim.id} claim={claim} />
			))}
		</ScrollView>
	);
}
