import React from "react";
import { View, Text } from "react-native";
import StatusBadgeNW from "../atoms/StatusBadgeNW";
import ClaimItemInfoNW from "../molecules/ClaimItemInfoNW";
import ClaimStatusInfoNW from "../molecules/ClaimStatusInfoNW";

interface ClaimCardData {
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

interface ClaimCardProps {
	claim: ClaimCardData;
}

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export default function ClaimCardNW({ claim }: ClaimCardProps) {
	return (
		<View className="bg-white rounded-lg border border-gray-200 mb-4 p-4">
			{/* Status Header */}
			<View className="flex-row items-center justify-between mb-3">
				<StatusBadgeNW status={claim.status} />
				<Text className="text-xs text-gray-500">
					{formatDate(claim.submittedAt)}
				</Text>
			</View>

			<ClaimItemInfoNW
				lostItemName={claim.lostItem.name}
				foundItemName={claim.foundItem.name}
				lostItemDescription={claim.lostItem.description}
				foundItemDescription={claim.foundItem.description}
				matchingScore={claim.matchingScore}
				claimMessage={claim.claimMessage}
			/>

			<ClaimStatusInfoNW
				status={claim.status}
				approvedAt={claim.approvedAt}
				rejectedAt={claim.rejectedAt}
				rejectionReason={claim.rejectionReason}
				finderContact={claim.finderContact}
			/>
		</View>
	);
}
