import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import LabelNW from "@/components/atoms/LabelNW";
import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
	title: string;
	showBackButton?: boolean;
	onBackPress?: () => void;
	className?: string;
}

const ScreenHeaderNW = ({
	title,
	showBackButton = true,
	onBackPress,
	className,
}: ScreenHeaderProps) => {
	const router = useRouter();

	const handleBackPress = () => {
		if (onBackPress) {
			onBackPress();
		} else {
			router.back();
		}
	};

	return (
		<View
			className={cn(
				"flex-row items-center justify-between px-1 py-2 bg-primary-500 border-b border-gray-200",
				className
			)}>
			{/* Left side - Back button and title */}
			<View className="flex-row items-center flex-1">
				{showBackButton && (
					<TouchableOpacity
						onPress={handleBackPress}
						className="mr-2 p-1">
						<MaterialCommunityIcons
							name="chevron-left"
							size={28}
							color="white"
						/>
					</TouchableOpacity>
				)}
				<LabelNW
					variant="headline"
					weight="semibold"
					className="text-white text-lg">
					{title}
				</LabelNW>
			</View>

			{/* Right side - Support icon */}
			<TouchableOpacity
				onPress={() => router.push("/support")}
				className="p-1">
				<MaterialCommunityIcons
					name="help-circle-outline"
					size={28}
					color="white"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default ScreenHeaderNW;
