import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import SideMenuNW from "@/components/organisms/SideMenuNW";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface HeaderNWProps {
	title: string;
	showBackButton?: boolean;
	showMenuButton?: boolean;
	showNotificationButton?: boolean;
	notificationCount?: number;
	backgroundColor?: string;
	className?: string;
	userName?: string;
	userAvatar?: string;
	onBackPress?: () => void;
	onNotificationPress?: () => void;
}

const HeaderNW = ({
	title,
	showBackButton = false,
	showMenuButton = true,
	showNotificationButton = true,
	notificationCount = 3,
	backgroundColor = "bg-primary-500",
	className,
	userName = "Alice Taylor",
	userAvatar,
	onBackPress,
	onNotificationPress,
}: HeaderNWProps) => {
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const handleMenuPress = () => {
		setIsMenuVisible(true);
	};

	const handleMenuClose = () => {
		setIsMenuVisible(false);
	};

	const handleNotificationPress = () => {
		onNotificationPress?.();
		console.log("Notifications pressed");
	};

	return (
		<>
			<View
				className={cn(
					"flex-row items-center justify-between px-4 py-2",
					backgroundColor,
					className
				)}>
				{/* Left Side - Menu or Back Button */}
				<View className="flex-row items-center">
					{showBackButton ? (
						<TouchableOpacity onPress={onBackPress}>
							<Text className="text-white text-xl">←</Text>
						</TouchableOpacity>
					) : showMenuButton ? (
						<TouchableOpacity onPress={handleMenuPress}>
							{/* Hamburger Menu Icon */}
							<View className="w-6 h-6 justify-center">
								<View className="h-0.5 bg-white mb-1 rounded"></View>
								<View className="h-0.5 bg-white mb-1 rounded"></View>
								<View className="h-0.5 bg-white rounded"></View>
							</View>
						</TouchableOpacity>
					) : null}
				</View>

				{/* Center Title */}
				<Text className="text-white text-lg font-bold flex-1 text-center">
					{title}
				</Text>

				{/* Right Side - Notification Icon */}
				<View className="flex-row items-center">
					{showNotificationButton && (
						<TouchableOpacity
							onPress={handleNotificationPress}
							className="relative">
							{/* Material Design Notification Bell Icon */}
							<MaterialIcons
								name="notifications"
								size={24}
								color="white"
							/>

							{/* Notification Badge */}
							{notificationCount > 0 && (
								<View className="absolute -top-2 -right-2 bg-red-600 rounded-full min-w-5 h-5 items-center justify-center px-1 shadow-md">
									<Text className="text-white text-xs font-semibold">
										{notificationCount > 99
											? "99+"
											: notificationCount}
									</Text>
								</View>
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Side Menu */}
			<SideMenuNW
				isVisible={isMenuVisible}
				onClose={handleMenuClose}
				userName={userName}
				userAvatar={userAvatar}
			/>
		</>
	);
};

export default HeaderNW;
