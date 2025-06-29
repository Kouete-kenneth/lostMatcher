import React from "react";
import { ScrollView } from "react-native";
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

			{/* Scrollable Content */}
			<ScrollView
				className="flex-1 bg-gray-50"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: 0 }}>
				{/* Welcome User Section */}
				<WelcomeUserSectionNW userName="Alice Taylor," />

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
