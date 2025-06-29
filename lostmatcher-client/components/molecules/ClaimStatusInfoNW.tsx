import React from "react";
import { View, Text } from "react-native";

interface ClaimStatusInfoProps {
	status: "pending" | "approved" | "rejected";
	approvedAt?: string;
	rejectedAt?: string;
	rejectionReason?: string;
	finderContact?: {
		name: string;
		email: string;
		phone: string;
	};
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

export default function ClaimStatusInfoNW({
	status,
	approvedAt,
	rejectedAt,
	rejectionReason,
	finderContact,
}: ClaimStatusInfoProps) {
	if (status === "approved" && finderContact) {
		return (
			<View className="bg-green-50 rounded-lg p-3 mb-3">
				<Text className="text-sm font-semibold text-green-800 mb-2">
					Claim Approved! Contact the finder:
				</Text>
				<Text className="text-sm text-green-700">
					Name: {finderContact.name}
				</Text>
				<Text className="text-sm text-green-700">
					Email: {finderContact.email}
				</Text>
				<Text className="text-sm text-green-700">
					Phone: {finderContact.phone}
				</Text>
				{approvedAt && (
					<Text className="text-xs text-green-600 mt-2">
						Approved: {formatDate(approvedAt)}
					</Text>
				)}
			</View>
		);
	}

	if (status === "rejected" && rejectionReason) {
		return (
			<View className="bg-red-50 rounded-lg p-3 mb-3">
				<Text className="text-sm font-semibold text-red-800 mb-2">
					Claim Rejected:
				</Text>
				<Text className="text-sm text-red-700">{rejectionReason}</Text>
				{rejectedAt && (
					<Text className="text-xs text-red-600 mt-2">
						Rejected: {formatDate(rejectedAt)}
					</Text>
				)}
			</View>
		);
	}

	if (status === "pending") {
		return (
			<View className="bg-yellow-50 rounded-lg p-3">
				<Text className="text-sm text-yellow-800">
					Your claim is being reviewed by our admin team. You will be
					notified once a decision is made.
				</Text>
			</View>
		);
	}

	return null;
}
