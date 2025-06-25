import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderNW from "@/components/molecules/HeaderNW";

const FeedbackScreen = () => {
	return (
		<SafeAreaView
			className="flex-1 bg-primary-500"
			edges={["top", "left", "right"]}>
			{/* Header */}
			<HeaderNW
				title="Feedback"
				showBackButton={false}
				showMenuButton={true}
				showNotificationButton={true}
				notificationCount={0}
				className="bg-primary-500"
				userName="Alice Taylor"
			/>

			{/* Content */}
			<View className="flex-1 justify-center items-center bg-gray-50">
				<Text className="text-xl font-semibold text-gray-800 text-center mb-4">
					Feedback
				</Text>
				<Text className="text-gray-600 text-center">
					Your feedback helps us improve the LostMatcher experience.
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default FeedbackScreen;
