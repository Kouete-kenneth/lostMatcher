import React, { useState } from "react";
import { Alert, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import RegisterItemFlowNW from "@/components/organisms/RegisterItemFlowNW";
import { api, ApiError } from "@/lib/api";
import { logError } from "@/lib/errorUtils";

const RegisterItemScreen = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleComplete = async (data: any) => {
		try {
			setIsLoading(true);

			// Validate required fields
			if (!data.image) {
				Alert.alert("Error", "Please upload an image of the item");
				setIsLoading(false);
				return;
			}

			if (!data.name || !data.category) {
				Alert.alert("Error", "Please fill in all required fields");
				setIsLoading(false);
				return;
			}

			// Create FormData for file upload
			const formData = new FormData();

			// Add image if exists
			if (data.image) {
				const uriParts = data.image.split(".");
				const fileType = uriParts[uriParts.length - 1];

				formData.append("file", {
					uri: data.image,
					name: `photo.${fileType}`,
					type: `image/${fileType}`,
				} as any);
			}

			// Add item details
			const itemDetails = {
				name: data.name,
				description: data.description,
				category: data.category,
			};

			formData.append("itemDetails", JSON.stringify(itemDetails));

			// Add attributes
			const attributes = {
				color: data.color,
				size: data.size,
				material: data.material,
				brand: data.brand,
			};

			formData.append("attributes", JSON.stringify(attributes));

			// Submit to API
			console.log("Registering item:", formData);
			Alert.alert("Submitting", "Registering your item...");

			const response = await api.registerItem(formData);
			console.log("Register item response:", response);

			setIsLoading(false);
			Alert.alert(
				"Success",
				"Your item has been registered successfully!",
				[{ text: "OK", onPress: () => router.back() }]
			);
		} catch (error) {
			setIsLoading(false);
			console.error("Item registration error:", error);

			if (error instanceof ApiError) {
				Alert.alert(
					"Error",
					`Failed to register item: ${error.message}`
				);
			} else {
				const errorMsg =
					error instanceof Error
						? error.message
						: "Unknown error occurred";
				Alert.alert(
					"Error",
					`Failed to register item. Please try again later. (${errorMsg})`
				);
			}

			logError("Item registration failed", error);
		}
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<ScreenTemplateNW
			title="Register an Item"
			showBackButton={true}
			scrollable={false}
			contentClassName="px-0 py-0"
			onBackPress={handleCancel}
			keyboardAvoiding={true}>
			<RegisterItemFlowNW
				onComplete={handleComplete}
				onCancel={handleCancel}
			/>
		</ScreenTemplateNW>
	);
};

export default RegisterItemScreen;
