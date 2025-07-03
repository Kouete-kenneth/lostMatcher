import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, ActivityIndicator, View } from "react-native";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import ReportLostItemFlowNW from "@/components/organisms/ReportLostItemFlowNW";
import { api, ApiError } from "@/lib/api";
import { logError } from "@/lib/errorUtils";

const ReportLostScreen = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleComplete = async (data: any) => {
		try {
			setIsLoading(true);

			// Validate required fields
			if (!data.image) {
				Alert.alert("Error", "Please upload an image of the lost item");
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
			};

			formData.append("attributes", JSON.stringify(attributes));

			// Add lost location and date
			formData.append("lostLocation", data.location || "");
			formData.append(
				"lostDate",
				data.date ? data.date.toISOString() : new Date().toISOString()
			);

			// Submit to API
			console.log("Submitting lost report:", formData);
			Alert.alert("Submitting", "Uploading your lost item report...");

			const response = await api.createLostReport(formData);
			console.log("Lost report response:", response);

			setIsLoading(false);

			// Show success message
			Alert.alert(
				"Success",
				"Your lost item report has been submitted successfully!",
				[
					{
						text: "Search for Matches",
						onPress: () => {
							// Validate that we received a proper MongoDB ObjectId from the server
							const mongoId =
								response.lostItemId ||
								(response.data && response.data._id);

							if (
								!mongoId ||
								typeof mongoId !== "string" ||
								mongoId.length !== 24
							) {
								console.error(
									"Invalid MongoDB ObjectId received from server:",
									mongoId
								);
								Alert.alert(
									"Error",
									"Failed to create your lost item report properly. Please try again.",
									[{ text: "OK" }]
								);
								return;
							}

							console.log(
								`Successfully created lost report with MongoDB ID: ${mongoId}`
							);

							// Navigate to search results with the validated MongoDB ID
							router.push({
								pathname: "/search-results",
								params: {
									lostItemId: mongoId,
									itemName:
										response.itemName ||
										data.name ||
										"Your Lost Item",
									searchType: "lost",
									description:
										response.description ||
										data.description ||
										"",
									category:
										response.category ||
										data.category ||
										"",
								},
							});
						},
					},
				]
			);
		} catch (error) {
			setIsLoading(false);

			if (error instanceof ApiError) {
				Alert.alert("Error", error.message);
			} else {
				Alert.alert("Error", "Failed to submit lost item report");
			}

			logError("Report lost item submission failed", error);
		}
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<ScreenTemplateNW
			title="Report Lost Item"
			showBackButton={true}
			onBackPress={handleCancel}
			keyboardAvoiding={true}>
			{isLoading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			) : (
				<ReportLostItemFlowNW
					onComplete={handleComplete}
					onCancel={handleCancel}
				/>
			)}
		</ScreenTemplateNW>
	);
};

export default ReportLostScreen;
