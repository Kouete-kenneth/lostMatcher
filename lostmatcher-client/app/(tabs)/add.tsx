import React, { useState, useEffect } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import ReportLostItemFlowNW from "@/components/organisms/ReportLostItemFlowNW";
import ReportFoundItemFlowNW from "@/components/organisms/ReportFoundItemFlowNW";
import RegisterItemFlowNW from "@/components/organisms/RegisterItemFlowNW";
import AddItemModalNW from "@/components/molecules/AddItemModalNW";
import { addTabEvents, ADD_TAB_PRESSED } from "@/lib/addTabEvents";

type AddScreenType = "reportLost" | "reportFound" | "registerItem";

const AddTab = () => {
	const params = useLocalSearchParams();
	const router = useRouter();

	// Default to reportLost, or use the action from params
	const [currentScreen, setCurrentScreen] = useState<AddScreenType>(
		(params.action as AddScreenType) || "reportLost"
	);
	const [isModalVisible, setIsModalVisible] = useState(false);

	// Listen for add tab press events
	useEffect(() => {
		const handleAddTabPress = () => {
			setIsModalVisible(true);
		};

		addTabEvents.on(ADD_TAB_PRESSED, handleAddTabPress);

		return () => {
			addTabEvents.off(ADD_TAB_PRESSED, handleAddTabPress);
		};
	}, []);

	// Handle direct navigation from search with action param
	useFocusEffect(
		React.useCallback(() => {
			// Check if we have a direct navigation action from search
			if (params.action) {
				setCurrentScreen(params.action as AddScreenType);
				// Don't show modal for direct navigation - go straight to the flow
			}
		}, [params.action])
	);

	const getScreenTitle = () => {
		switch (currentScreen) {
			case "reportLost":
				return "Report Lost Item";
			case "reportFound":
				return "Report Found Item";
			case "registerItem":
				return "Register Item";
			default:
				return "Add Item";
		}
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		// Stay on current screen instead of going back
	};

	const handleRegisterItem = () => {
		setIsModalVisible(false);
		setCurrentScreen("registerItem");
	};

	const handleReportLost = () => {
		setIsModalVisible(false);
		setCurrentScreen("reportLost");
	};

	const handleReportFound = () => {
		setIsModalVisible(false);
		setCurrentScreen("reportFound");
	};

	const handleBackPress = () => {
		// Go to previous screen
		router.back();
	};

	const handleFlowComplete = (data: any) => {
		console.log("=== HANDLE FLOW COMPLETE CALLED ===");
		console.log("Item report data:", data);
		console.log("Current screen:", currentScreen);

		// Instead of handling API calls here, redirect to the proper dedicated screens
		// that have the validated API handling and MongoDB ObjectId validation
		if (currentScreen === "reportLost") {
			console.log("Redirecting to dedicated ReportLostScreen...");
			router.push("/report-lost");
		} else if (currentScreen === "reportFound") {
			console.log("Redirecting to dedicated ReportFoundScreen...");
			router.push("/report-found");
		} else {
			// For register items, stay on current screen
			console.log("Completed:", currentScreen);
		}
	};

	const handleFlowCancel = () => {
		// Show modal again when flow is cancelled
		setIsModalVisible(true);
	};

	const renderCurrentScreen = () => {
		switch (currentScreen) {
			case "reportLost":
				return (
					<ReportLostItemFlowNW
						onComplete={handleFlowComplete}
						onCancel={handleFlowCancel}
					/>
				);
			case "reportFound":
				return (
					<ReportFoundItemFlowNW
						onComplete={handleFlowComplete}
						onCancel={handleFlowCancel}
					/>
				);
			case "registerItem":
				return (
					<RegisterItemFlowNW
						onComplete={handleFlowComplete}
						onCancel={handleFlowCancel}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<ScreenTemplateNW
				title={getScreenTitle()}
				showBackButton={true}
				onBackPress={handleBackPress}
				contentClassName="px-0 py-0"
				scrollable={false}>
				{renderCurrentScreen()}
			</ScreenTemplateNW>

			<AddItemModalNW
				isVisible={isModalVisible}
				onClose={handleCloseModal}
				onRegisterItem={handleRegisterItem}
				onReportLost={handleReportLost}
				onReportFound={handleReportFound}
			/>
		</>
	);
};

export default AddTab;
