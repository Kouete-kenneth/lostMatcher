import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import ReportLostItemFlowNW from "@/components/organisms/ReportLostItemFlowNW";
import AddItemModalNW from "@/components/molecules/AddItemModalNW";

const AddTab = () => {
	const router = useRouter();
	const params = useLocalSearchParams();

	// This ref tracks if we should perform the initial "deep link" action
	const isInitialAction = useRef(params.action === "reportLost");

	// Initialize state based on whether it's a direct navigation
	const [showFlow, setShowFlow] = useState(isInitialAction.current);
	const [isModalVisible, setIsModalVisible] = useState(
		!isInitialAction.current
	);

	useFocusEffect(
		React.useCallback(() => {
			// This effect runs every time the tab is focused
			if (isInitialAction.current) {
				// If it's the initial deep link, we show the flow and consume the ref
				isInitialAction.current = false; // Consume the one-time action
				setShowFlow(true);
				setIsModalVisible(false);
			} else {
				// For all subsequent focuses, we show the modal
				setShowFlow(false);
				setIsModalVisible(true);
			}

			return () => {
				// When the tab loses focus, hide the modal so it doesn't pop up unexpectedly
				setIsModalVisible(false);
			};
		}, [])
	);

	const handleCloseModal = () => {
		setIsModalVisible(false);
		// Go back to the previous screen, or home if there's no history
		if (router.canGoBack()) {
			router.back();
		} else {
			router.push("./(tabs)/");
		}
	};

	const handleRegisterItem = () => {
		setIsModalVisible(false);
		router.push("/register-item");
	};

	const handleReportLost = () => {
		setIsModalVisible(false);
		setShowFlow(true);
	};

	const handleReportFound = () => {
		setIsModalVisible(false);
		router.push("/report-found");
	};

	const handleFlowComplete = (data: any) => {
		console.log("Lost item report data:", data);
		setShowFlow(false);
		// On completion, navigate to the home/main tab
		router.push("./(tabs)/");
	};

	const handleFlowCancel = () => {
		setShowFlow(false);
		// After cancelling the flow, show the modal again
		setIsModalVisible(true);
	};

	// Conditional rendering based on state
	if (showFlow) {
		return (
			<ReportLostItemFlowNW
				onComplete={handleFlowComplete}
				onCancel={handleFlowCancel}
			/>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<View className="flex-1 items-center justify-center">
				<Text className="text-2xl font-bold text-gray-800 mb-4">
					Add Item
				</Text>
				<Text className="text-gray-600 text-center px-8">
					This screen will allow users to add new lost or found items.
				</Text>
			</View>

			<AddItemModalNW
				isVisible={isModalVisible}
				onClose={handleCloseModal}
				onRegisterItem={handleRegisterItem}
				onReportLost={handleReportLost}
				onReportFound={handleReportFound}
			/>
		</SafeAreaView>
	);
};

export default AddTab;
