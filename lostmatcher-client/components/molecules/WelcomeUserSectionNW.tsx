import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";
import AvatarNW from "@/components/atoms/AvatarNW";
import ButtonNW from "@/components/atoms/ButtonNW";

interface WelcomeUserSectionProps {
	userName?: string;
	className?: string;
}

const WelcomeUserSectionNW = ({
	userName = "Alice Taylor",
	className,
}: WelcomeUserSectionProps) => {
	return (
		<View className={cn("bg-white px-4 py-5", className)}>
			{/* User Avatar and Welcome */}
			<View className="flex-row items-center mb-4">
				{/* Profile Picture and Text - Left aligned */}
				<View className="mr-4">
					<AvatarNW size="lg" initials="AT" className="mb-2" />
					<View className="flex-row items-center">
						<Text className="text-black text-base font-bold mr-2">
							{userName}
						</Text>
						<Text className="text-gray-600 text-sm">
							Welcome back
						</Text>
					</View>
				</View>

				{/* Spacer to push donate button to the right */}
				<View className="flex-1" />

				<ButtonNW
					title="Donate"
					variant="secondary"
					size="small"
					onPress={() => {}}
					className="bg-yellow-400 border-yellow-400"
					textClassName="text-black"
				/>
			</View>
		</View>
	);
};

export default WelcomeUserSectionNW;
