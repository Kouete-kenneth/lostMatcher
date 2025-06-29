import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import AvatarNW from "@/components/atoms/AvatarNW";
import ButtonNW from "@/components/atoms/ButtonNW";
import { useRouter } from "expo-router";

interface WelcomeUserSectionProps {
	userName?: string;
	className?: string;
	onDonatePress?: () => void;
}

const WelcomeUserSectionNW = ({
	userName = "Alice Taylor",
	className,
	onDonatePress = () => {},
}: WelcomeUserSectionProps) => {
	const router = useRouter();
	return (
		<View className={cn("bg-white px-4 py-5", className)}>
			{/* User Avatar and Welcome */}
			<View className="flex-row items-center mb-4">
				{/* Profile Picture and Text - Left aligned, now tappable */}
				<TouchableOpacity
					className="mr-4"
					onPress={() => router.push("/profile")}
					activeOpacity={0.7}
					accessibilityRole="button">
					<AvatarNW size="lg" initials="AT" className="mb-2" />
					<View className="flex-row items-center">
						<Text className="text-black text-base font-bold mr-2">
							{userName}
						</Text>
						<Text className="text-gray-600 text-sm">
							Welcome back
						</Text>
					</View>
				</TouchableOpacity>

				{/* Spacer to push donate button to the right */}
				<View className="flex-1" />

				<ButtonNW
					title="Donate"
					variant="secondary"
					size="small"
					onPress={onDonatePress}
					className="bg-yellow-400 border-yellow-400"
					textClassName="text-black"
				/>
			</View>
		</View>
	);
};

export default WelcomeUserSectionNW;
