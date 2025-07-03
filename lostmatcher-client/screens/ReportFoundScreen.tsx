import React, { useState } from "react";
import { Alert, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import ReportFoundItemFlowNW from "@/components/organisms/ReportFoundItemFlowNW";
import { api, ApiError } from "@/lib/api";
import { logError } from "@/lib/errorUtils";

const ReportFoundScreen = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleComplete = async (data: any) => {
		try {
			setIsLoading(true);

			// Validate required fields
			if (!data.image) {
				Alert.alert(
					"Error",
					"Please upload an image of the found item"
				);
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

			// Add found location and date
			formData.append("foundLocation", data.location || "");
			formData.append(
				"foundDate",
				data.date ? data.date.toISOString() : new Date().toISOString()
			);

			// Submit to API
			console.log("Submitting found report:", formData);
			Alert.alert(
				"Submitting",
				"Uploading your found item report and searching for matches..."
			);

			const response = await api.createFoundReport(formData);
			console.log("Found report response:", response);

			setIsLoading(false);

			// Check if we have any search results with potential matches
			const hasMatches =
				response.searchResults &&
				((response.searchResults.text &&
					response.searchResults.text.length > 0) ||
					(response.searchResults.image &&
						response.searchResults.image.length > 0) ||
					(response.searchResults.combined &&
						response.searchResults.combined.length > 0));

			// If we have search results, navigate to the search results screen
			if (hasMatches) {
				// Show success first
				Alert.alert(
					"Success",
					"Found item reported successfully! We've found potential matches.",
					[
						{
							text: "View Matches",
							onPress: () => {
								// Validate that we received a proper MongoDB ObjectId from the server
								const mongoId =
									response.foundReportId ||
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
										"Failed to create your found item report properly. Please try again.",
										[{ text: "OK" }]
									);
									return;
								}

								console.log(
									`Successfully created found report with MongoDB ID: ${mongoId}`
								);

								// Navigate to search results with the validated MongoDB ID
								router.push({
									pathname: "/search-results",
									params: {
										foundItemId: mongoId,
										itemName:
											response.itemName ||
											data.name ||
											"Found Item",
										searchType: "found",
										// Pass the search results directly - they'll be available in route.params
										searchResults: JSON.stringify(
											response.searchResults
										),
									},
								});
							},
						},
					]
				);
			} else {
				Alert.alert(
					"Success",
					"Found item reported successfully! No matches found at this time.",
					[{ text: "OK", onPress: () => router.back() }]
				);
			}
		} catch (error) {
			setIsLoading(false);
			console.error("Found report submission error:", error);

			if (error instanceof ApiError) {
				Alert.alert(
					"Error",
					`Failed to submit found item report: ${error.message}`
				);
			} else {
				const errorMsg =
					error instanceof Error
						? error.message
						: "Unknown error occurred";
				Alert.alert(
					"Error",
					`Failed to submit found item report. Please try again later. (${errorMsg})`
				);
			}

			logError("Report found item submission failed", error);
		}
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<ScreenTemplateNW
			title="Report Found Item"
			showBackButton={true}
			scrollable
			onBackPress={handleCancel}
			contentClassName="px-0 py-0"
			keyboardAvoiding={true}>
			{isLoading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			) : (
				<ReportFoundItemFlowNW
					onComplete={handleComplete}
					onCancel={handleCancel}
				/>
			)}
		</ScreenTemplateNW>
	);
};

export default ReportFoundScreen;
