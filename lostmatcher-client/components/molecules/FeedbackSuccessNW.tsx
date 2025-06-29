import React from "react";
import { View, Text } from "react-native";
import ButtonNW from "@/components/atoms/ButtonNW";

interface FeedbackSuccessProps {
	onDismiss: () => void;
	userName?: string;
}

const FeedbackSuccessNW = ({
	onDismiss,
	userName = "User",
}: FeedbackSuccessProps) => {
	return (
		<View className="flex-1 justify-center items-center bg-gray-50 px-6">
			{/* Success Icon */}
			<View className="mb-8">
				<Text className="text-5xl mb-4 text-green-600">✓</Text>
			</View>

			{/* Title */}
			<Text className="text-xl font-bold text-gray-900 mb-2 text-center">
				Thank you for your feedback!
			</Text>

			{/* Message */}
			<Text className="text-base text-gray-600 text-center mb-8">
				We appreciate your input and will use it to improve LostMatcher.
			</Text>

			<ButtonNW
				title="Send Another"
				onPress={onDismiss}
				variant="primary"
				size="large"
				className="w-full max-w-xs"
			/>
		</View>
	);
};

export default FeedbackSuccessNW;
