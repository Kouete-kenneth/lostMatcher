import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeHeaderNW from "@/components/molecules/WelcomeHeaderNW";
import ButtonNW from "@/components/atoms/ButtonNW";
import { useRouter } from "expo-router";

const WelcomeScreenNW = () => {
	const router = useRouter();

	const handleGetStarted = () => {
		// Navigate to home screen
		router.push("/(tabs)");
	};

	const handleSignIn = () => {
		// Handle sign in
		console.log("Sign in pressed");
	};

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			edges={["top", "left", "right", "bottom"]}>
			{/* Main Content */}
			<View className="flex-1 justify-center px-6">
				{/* Welcome Header */}
				<WelcomeHeaderNW className="mb-12" />

				{/* Action Buttons */}
				<View className="gap-4">
					<ButtonNW
						title="Get Started"
						onPress={handleGetStarted}
						variant="primary"
						size="large"
						className="w-full"
					/>

					<ButtonNW
						title="Sign In"
						onPress={handleSignIn}
						variant="outline"
						size="large"
						className="w-full"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default WelcomeScreenNW;
