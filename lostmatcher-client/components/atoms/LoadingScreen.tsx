import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoadingScreenProps {
	message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-1 justify-center items-center px-6">
				<ActivityIndicator size="large" color="#2563EB" />
				<Text
					style={{
						marginTop: 16,
						fontSize: 16,
						color: "#6B7280",
						textAlign: "center",
					}}>
					{message}
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default LoadingScreen;
