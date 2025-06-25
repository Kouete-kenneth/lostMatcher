import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import { router } from "expo-router";
import React from "react";

export default function WelcomeScreen() {
	const handleGetStarted = () => {
		// Navigate to the main lost items screen
		router.push("/(tabs)");
	};

	return <WelcomeTemplate onGetStarted={handleGetStarted} />;
}
