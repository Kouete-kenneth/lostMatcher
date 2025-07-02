import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeHeaderNW from "@/components/molecules/WelcomeHeaderNW";
import ButtonNW from "@/components/atoms/ButtonNW";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/atoms/LoadingScreen";

const WelcomeScreenNW = () => {
	const router = useRouter();
	const { hasCompletedOnboarding, isLoading } = useOnboarding();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		// No auto-redirect on mount; only handle navigation on button press
	}, []);

	const handleGetStarted = async () => {
		try {
			if (!hasCompletedOnboarding) {
				// Check if user is already authenticated
				if (!isAuthenticated) {
					router.push("/(tabs)"); // Go directly to home
					return;
				}

				// Check if user is registered (this would typically be done with an email check)
				// For now, we'll assume they need to sign in if they've completed onboarding
				router.push("/login");
			} else {
				router.push("/onboarding"); // Go to onboarding if not complete
			}
		} catch (error) {
			console.warn(
				"Navigation error (message only):",
				error instanceof Error ? error.message : "Unknown error"
			);
			// Fallback to onboarding if there's an error
			router.push("/onboarding");
		}
	};

	if (isLoading) return <LoadingScreen />;

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			edges={["top", "left", "right", "bottom"]}>
			{/* Main Content */}
			<View className="flex-1 justify-evenly px-6">
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
				</View>
			</View>
		</SafeAreaView>
	);
};

export default WelcomeScreenNW;
