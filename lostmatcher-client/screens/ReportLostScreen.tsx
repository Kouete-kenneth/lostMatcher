import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import ReportLostItemFlowNW from "@/components/organisms/ReportLostItemFlowNW";

const ReportLostScreen = () => {
	const router = useRouter();

	const handleComplete = (data: any) => {
		// TODO: Submit to API
		console.log("Report Lost:", data);
		Alert.alert("Success", "Lost item reported successfully!", [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<ScreenTemplateNW
			title="Report Lost Item"
			showBackButton={true}
			onBackPress={handleCancel}>
			<ReportLostItemFlowNW
				onComplete={handleComplete}
				onCancel={handleCancel}
			/>
		</ScreenTemplateNW>
	);
};

export default ReportLostScreen;
