import React from "react";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import ReportLostItemFlowNW from "@/components/organisms/ReportLostItemFlowNW";

const ReportLostScreen = () => {
	const router = useRouter();

	const handleComplete = (data: any) => {
		// TODO: Submit to API
		console.log("Report Lost:", data);

		// Navigate to search results with the lost item data
		router.push({
			pathname: "/search-results",
			params: {
				lostItemId: data.id || `lost_${Date.now()}`,
				itemName: data.name || "Your Lost Item",
				// Pass other relevant data for the search
				description: data.description,
				category: data.category,
				image: data.image,
			},
		});
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
			<ReportLostItemFlowNW
				onComplete={handleComplete}
				onCancel={handleCancel}
			/>
		</ScreenTemplateNW>
	);
};

export default ReportLostScreen;
