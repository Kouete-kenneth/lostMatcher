import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
	icon?: keyof typeof MaterialCommunityIcons.glyphMap;
	customIcon?: React.ReactNode;
	iconColor?: string;
	title: string;
	subtitle: string;
	className?: string;
}

const NotificationItemNW = ({
	icon,
	customIcon,
	iconColor = "#6B7280",
	title,
	subtitle,
	className,
}: NotificationItemProps) => {
	return (
		<View
			className={cn(
				"flex-row items-center py-3 border-b border-gray-100",
				className
			)}>
			{/* Icon Container */}
			<View className="w-8 h-8 bg-gray-100 rounded-md items-center justify-center mr-2">
				{customIcon ? (
					customIcon
				) : icon ? (
					<MaterialCommunityIcons
						name={icon}
						size={16}
						color={iconColor}
					/>
				) : null}
			</View>

			{/* Content */}
			<View className="flex-1">
				<Text className="text-black text-sm font-medium mb-1">
					{title}
				</Text>
				<Text className="text-gray-500 text-xs">{subtitle}</Text>
			</View>
		</View>
	);
};

export default NotificationItemNW;
