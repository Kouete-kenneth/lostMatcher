import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import AddItemModalNW from "@/components/molecules/AddItemModalNW";

const AddTab = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const router = useRouter();

	// Show modal when this tab becomes focused
	useFocusEffect(
		React.useCallback(() => {
			setIsModalVisible(true);
		}, [])
	);

	const handleCloseModal = () => {
		setIsModalVisible(false);
		// Navigate back to home tab after closing modal
		router.push("/");
	};

	const handleRegisterItem = () => {
		setIsModalVisible(false);
		// Navigate to register item screen
		router.push("/register-item");
	};

	const handleReportLost = () => {
		setIsModalVisible(false);
		// Navigate to report lost screen
		router.push("/report-lost");
	};

	const handleReportFound = () => {
		setIsModalVisible(false);
		// Navigate to report found screen
		router.push("/report-found");
	};

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
