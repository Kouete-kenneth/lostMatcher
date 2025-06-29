import React, { useState } from "react";
import {
	ScrollView,
	Modal,
	View,
	Text,
	Pressable,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import HeaderNW from "@/components/molecules/HeaderNW";
import WelcomeUserSectionNW from "@/components/molecules/WelcomeUserSectionNW";
import MetricsSectionNW from "@/components/molecules/MetricsSectionNW";
import ActionButtonsGridNW from "@/components/molecules/ActionButtonsGridNW";
import NotificationsSectionNW from "@/components/molecules/NotificationsSectionNW";
import { useNotifications } from "@/contexts/NotificationContext";

interface HomeScreenProps {
	className?: string;
}

const HomeScreenNW = ({ className }: HomeScreenProps) => {
	const { unreadCount } = useNotifications();
	const [donateVisible, setDonateVisible] = useState(false);

	const handleDonatePress = () => setDonateVisible(true);
	const handleClose = () => setDonateVisible(false);

	return (
		<SafeAreaView
			className={cn("flex-1 bg-primary-500", className)}
			edges={["top", "left", "right"]}>
			{/* Header */}
			<HeaderNW
				title="Home"
				showBackButton={false}
				showMenuButton={true}
				showNotificationButton={true}
				notificationCount={unreadCount}
				className="bg-primary-500"
				userName="Alice Taylor"
			/>

			{/* Donate Modal */}
			<Modal
				visible={donateVisible}
				animationType="slide"
				transparent
				onRequestClose={handleClose}>
				<View className="flex-1 justify-center items-center bg-black/40">
					<View className="bg-white rounded-2xl p-8 w-11/12 max-w-md shadow-lg items-center">
						<Text className="text-2xl font-bold text-primary-500 mb-2">
							Support Us
						</Text>
						<Text className="text-base text-gray-700 mb-4 text-center">
							Donate via Mobile Money to help us keep this service
							running!
						</Text>
						<View className="bg-yellow-100 rounded-xl px-4 py-3 mb-4 w-full items-center">
							<Text className="text-lg font-semibold text-yellow-700">
								Mobile Money
							</Text>
							<Text className="text-xl font-bold text-gray-900 mt-1 tracking-widest">
								654 130 795
							</Text>
							<Text className="text-base text-gray-700 mt-1">
								kouete kamta leonel
							</Text>
						</View>
						<Pressable
							className="bg-primary-500 rounded-lg px-6 py-2 mb-2"
							onPress={() => {
								if (Platform.OS !== "web") {
									// @ts-ignore
									import("react-native").then((RN) =>
										RN.Clipboard.setString("654130795")
									);
								}
							}}>
							<Text className="text-white font-semibold">
								Copy Number
							</Text>
						</Pressable>
						<Pressable className="mt-1" onPress={handleClose}>
							<Text className="text-primary-500 font-medium">
								Close
							</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			{/* Scrollable Content */}
			<ScrollView
				className="flex-1 bg-gray-50"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: 0 }}>
				{/* Welcome User Section */}
				<WelcomeUserSectionNW
					userName="Alice Taylor,"
					onDonatePress={handleDonatePress}
				/>

				{/* Action Buttons Grid */}
				<ActionButtonsGridNW />

				{/* Notifications Section */}
				<NotificationsSectionNW className="mt-4 mb-6" />

				{/* Metrics Section */}
				<MetricsSectionNW className="mt-4" />
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreenNW;
