import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";
import NotificationItemNW from "@/components/atoms/NotificationItemNW";
import MagnifierCheckIconNW from "@/components/atoms/MagnifierCheckIconNW";

interface NotificationsSectionProps {
	className?: string;
}

const NotificationsSectionNW = ({ className }: NotificationsSectionProps) => {
	return (
		<View
			className={cn(
				"mx-3 border border-gray-200 rounded-lg p-3 bg-white",
				className
			)}>
			{/* Section Title */}
			<View className="pb-2">
				<Text className="text-black text-lg font-medium">
					Notifications
				</Text>
			</View>

			{/* Notification Items */}
			<NotificationItemNW
				customIcon={<MagnifierCheckIconNW size={16} color="#10B981" />}
				title="Found Item!"
				subtitle="An item you lost has been found."
			/>

			<NotificationItemNW
				icon="check-circle"
				iconColor="#059669"
				title="Match Approved!"
				subtitle="Your match request has been approved."
			/>
		</View>
	);
};

export default NotificationsSectionNW;
