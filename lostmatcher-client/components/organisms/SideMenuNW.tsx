import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { cn } from "@/lib/utils";
import AvatarNW from "@/components/atoms/AvatarNW";
import { useRouter } from "expo-router";

interface MenuItem {
	id: string;
	icon: string;
	label: string;
	onPress: () => void;
}

interface SideMenuNWProps {
	isVisible: boolean;
	onClose: () => void;
	userName?: string;
	userAvatar?: string;
	className?: string;
	isAdmin?: boolean;
}

const SideMenuNW = ({
	isVisible,
	onClose,
	userName = "Alice Taylor",
	userAvatar,
	className,
	isAdmin = false,
}: SideMenuNWProps) => {
	const router = useRouter();
	const menuItems: MenuItem[] = [
		{
			id: "profile",
			icon: "👤",
			label: "Profile",
			onPress: () => {
				router.push("/profile");
				onClose();
			},
		},
		{
			id: "tour",
			icon: "🎯",
			label: "Take a Tour",
			onPress: () => {
				console.log("Start Tour");
				onClose();
			},
		},
		{
			id: "support",
			icon: "💬",
			label: "Support",
			onPress: () => {
				router.push("/support");
				onClose();
			},
		},
	];

	if (isAdmin) {
		menuItems.unshift({
			id: "admin",
			icon: "🛠️",
			label: "Admin Panel",
			onPress: () => {
				router.push("/admin/dashboard");
				onClose();
			},
		});
	}

	menuItems.push({
		id: "logout",
		icon: "🚪",
		label: "Logout",
		onPress: () => {
			console.log("Logout");
			onClose();
		},
	});

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			onRequestClose={onClose}>
			{/* Backdrop */}
			<TouchableOpacity
				className="flex-1 bg-black/50"
				activeOpacity={1}
				onPress={onClose}>
				{/* Menu Container */}
				<View className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl">
					{/* Menu Content */}
					<View className={cn("flex-1 pt-16", className)}>
						{/* User Section */}
						<View className="px-6 py-6 border-b border-gray-100">
							<View className="flex-row items-center">
								<AvatarNW
									size="lg"
									imageUrl={userAvatar}
									initials={
										userName
											?.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase() || "AT"
									}
									className="mr-4"
								/>
								<View className="flex-1">
									<Text className="text-lg font-bold text-charcoal-800">
										{userName}
									</Text>
									<Text className="text-sm text-slate-500">
										Welcome back!
									</Text>
								</View>
							</View>
						</View>

						{/* Menu Items */}
						<View className="flex-1 py-4">
							{menuItems.map((item) => (
								<TouchableOpacity
									key={item.id}
									onPress={item.onPress}
									className="flex-row items-center px-6 py-4 hover:bg-gray-50 active:bg-gray-100">
									{/* Icon Circle */}
									<View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-4">
										<Text className="text-lg">
											{item.icon}
										</Text>
									</View>

									{/* Label */}
									<Text className="text-base font-medium text-charcoal-700 flex-1">
										{item.label}
									</Text>

									{/* Arrow */}
									<Text className="text-slate-400 text-lg">
										›
									</Text>
								</TouchableOpacity>
							))}
						</View>

						{/* Footer */}
						<View className="px-6 py-4 border-t border-gray-100">
							<Text className="text-xs text-slate-400 text-center">
								LostMatcher v1.0.0
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

export default SideMenuNW;
