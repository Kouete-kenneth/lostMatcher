import React from "react";
import { View, Text } from "react-native";

export default function OnboardingHeaderNW() {
	return (
		<View
			style={{
				width: "100%",
				backgroundColor: "#2563EB",
				alignItems: "center",
				paddingTop: 24, // bring header up
				paddingBottom: 16,
			}}>
			{/* Use your logo if available, else use a placeholder */}
			<Text
				style={{
					color: "#fff",
					fontWeight: "700",
					fontSize: 18,
					letterSpacing: 1,
					marginBottom: 4, // space between heading and next item
				}}>
				Onboarding
			</Text>
		</View>
	);
}
