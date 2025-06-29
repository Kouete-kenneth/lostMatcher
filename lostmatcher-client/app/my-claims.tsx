import React from "react";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { ClaimsListNW } from "@/components/organisms";

// Dummy data for user's claims
const userClaims = [
	{
		id: "claim_1",
		status: "pending",
		submittedAt: "2024-12-20T10:30:00Z",
		lostItem: {
			id: "lost_1",
			name: "Black iPhone 14 Pro",
			description: "Lost near Central Station, has a blue case",
			category: "Electronics",
			image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop&crop=center",
		},
		foundItem: {
			id: "found_1",
			name: "iPhone with Blue Case",
			description: "Found at Central Station platform 2",
			category: "Electronics",
			image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop&crop=center",
		},
		matchingScore: 95,
		claimMessage:
			"This is definitely my phone. It has a small scratch on the back corner and my initials 'JD' engraved on the case.",
	},
	{
		id: "claim_2",
		status: "approved",
		submittedAt: "2024-12-18T14:20:00Z",
		approvedAt: "2024-12-19T09:15:00Z",
		lostItem: {
			id: "lost_2",
			name: "Blue Backpack",
			description: "Lost at university library",
			category: "Bags",
			image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&crop=center",
		},
		foundItem: {
			id: "found_2",
			name: "Student Backpack",
			description: "Found in library study area",
			category: "Bags",
			image: "https://images.unsplash.com/photo-1581605405669-fcdf81983e4d?w=300&h=200&fit=crop&crop=center",
		},
		matchingScore: 88,
		claimMessage:
			"My backpack with textbooks inside. Has my student ID in the front pocket.",
		finderContact: {
			name: "Emma Wilson",
			email: "emma.w@university.edu",
			phone: "+1-555-0123",
		},
	},
	{
		id: "claim_3",
		status: "rejected",
		submittedAt: "2024-12-15T16:45:00Z",
		rejectedAt: "2024-12-16T11:30:00Z",
		lostItem: {
			id: "lost_3",
			name: "Red Wallet",
			description: "Lost downtown, contains credit cards",
			category: "Accessories",
			image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=200&fit=crop&crop=center",
		},
		foundItem: {
			id: "found_3",
			name: "Leather Wallet",
			description: "Found in coffee shop",
			category: "Accessories",
			image: "https://images.unsplash.com/photo-1553749499-0844c7d9d41b?w=300&h=200&fit=crop&crop=center",
		},
		matchingScore: 72,
		claimMessage: "This looks like my wallet but I'm not 100% sure.",
		rejectionReason:
			"Insufficient verification details provided. Unable to confirm ownership.",
	},
];

const MyClaimsScreen = () => {
	const router = useRouter();

	return (
		<ScreenTemplateNW
			title="My Claims"
			showBackButton={true}
			onBackPress={() => router.back()}
			scrollable={false}
			contentClassName="px-4 py-4">
			<ClaimsListNW claims={userClaims as any} />
		</ScreenTemplateNW>
	);
};

export default function Screen(props: any) {
	// Remove the default Expo Router header
	return <MyClaimsScreen {...props} />;
}

export const options = { headerShown: false };
