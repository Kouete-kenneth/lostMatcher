import React from "react";
import { View, Text } from "react-native";

interface AuthHeaderProps {
	title: string;
	showBackButton?: boolean;
	onBackPress?: () => void;
}

export default function AuthHeaderNW({
	title,
	showBackButton = false,
	onBackPress,
}: AuthHeaderProps) {
	return (
		<View
			style={{
				width: "100%",
				backgroundColor: "#2563EB",
				alignItems: "center",
				paddingTop: 16, // Remove top padding
				paddingBottom: 16,
				paddingHorizontal: 16,
			}}>
			{/* Back button area if needed */}
			{showBackButton && (
				<View style={{ position: "absolute", left: 16, top: 24 }}>
					{/* Add back button icon here if needed */}
				</View>
			)}

			{/* Title */}
			<Text
				style={{
					color: "#fff",
					fontWeight: "700",
					fontSize: 18,
					letterSpacing: 1,
					textAlign: "center",
				}}>
				{title}
			</Text>

			{/* Subtitle */}
			<Text
				style={{
					color: "#E5E7EB",
					fontWeight: "400",
					fontSize: 14,
					textAlign: "center",
					marginTop: 4,
				}}>
				Secure your account
			</Text>
		</View>
	);
}
