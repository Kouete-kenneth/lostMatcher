import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import ReportFoundItemFlowNW from "@/components/organisms/ReportFoundItemFlowNW";

const ReportFoundScreen = () => {
	const router = useRouter();

	const handleComplete = (data: any) => {
		// TODO: Submit to API
		console.log("Report Found:", data);
		Alert.alert("Success", "Found item reported successfully!", [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<ScreenTemplateNW
			title="Report Found Item"
			showBackButton={true}
			onBackPress={handleCancel}>
			<ReportFoundItemFlowNW
				onComplete={handleComplete}
				onCancel={handleCancel}
			/>
		</ScreenTemplateNW>
	);
};

export default ReportFoundScreen;
