import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderNW from "@/components/molecules/HeaderNW";

const MatchesTabScreen = () => {
	return (
		<SafeAreaView
			className="flex-1 bg-primary-500"
			edges={["top", "left", "right"]}>
			{/* Header */}
			<HeaderNW
				title="Matches"
				showBackButton={false}
				showMenuButton={true}
				showNotificationButton={true}
				notificationCount={2}
				className="bg-primary-500"
				userName="Alice Taylor"
			/>

			{/* Scrollable Content */}
			<View className="flex-1 bg-gray-50">
				<View className="flex-1 items-center justify-center">
					<Text className="text-2xl font-bold text-gray-800 mb-4">
						Matches
					</Text>
					<Text className="text-gray-600 text-center px-8">
						This screen will show matched items between lost and
						found listings.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default MatchesTabScreen;
