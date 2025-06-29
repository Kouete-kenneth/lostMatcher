import React, { useState } from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { ScreenTemplateNW } from "@/components";
import FeedbackFormOrganism from "@/components/organisms/FeedbackFormOrganism";
import FeedbackSuccessNW from "@/components/molecules/FeedbackSuccessNW";
import { useRouter } from "expo-router";

const FeedbackScreen = () => {
	const [success, setSuccess] = useState(false);
	const router = useRouter();
	return (
		<ScreenTemplateNW
			title="Feedback"
			showBackButton={true}
			onBackPress={() => router.back()}
			scrollable={false}
			contentClassName="px-0 py-0">
			<TouchableWithoutFeedback
				onPress={Keyboard.dismiss}
				accessible={false}>
				<View className="flex-1 items-center bg-gray-50 px-4 py-8">
					{success ? (
						<FeedbackSuccessNW
							onDismiss={() => setSuccess(false)}
						/>
					) : (
						<FeedbackFormOrganism
							onSuccess={() => setSuccess(true)}
						/>
					)}
				</View>
			</TouchableWithoutFeedback>
		</ScreenTemplateNW>
	);
};

export default FeedbackScreen;
