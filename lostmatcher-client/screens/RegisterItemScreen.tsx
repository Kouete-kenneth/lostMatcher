import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import RegisterItemFlowNW from "@/components/organisms/RegisterItemFlowNW";

const RegisterItemScreen = () => {
	const router = useRouter();

	const handleComplete = (data: any) => {
		// TODO: Submit to API
		console.log("Register Item:", data);
		Alert.alert("Success", "Item registered successfully!", [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<ScreenTemplateNW
			title="Register an Item"
			showBackButton={true}
			onBackPress={handleCancel}>
			<RegisterItemFlowNW
				onComplete={handleComplete}
				onCancel={handleCancel}
			/>
		</ScreenTemplateNW>
	);
};

export default RegisterItemScreen;
