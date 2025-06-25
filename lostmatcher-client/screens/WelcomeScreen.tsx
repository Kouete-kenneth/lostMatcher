import WelcomeTemplate from "@/components/templates/WelcomeTemplate";
import { router } from "expo-router";
import React from "react";

const WelcomeScreen: React.FC = () => {
	const handleGetStarted = () => {
		// Navigate to the main lost items screen
		router.push("/(tabs)");
	};

	return <WelcomeTemplate onGetStarted={handleGetStarted} />;
};

export default WelcomeScreen;
