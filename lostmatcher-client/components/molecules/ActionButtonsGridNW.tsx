import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TagPlusIconNW from "@/components/atoms/TagPlusIconNW";
import MagnifierCheckIconNW from "@/components/atoms/MagnifierCheckIconNW";
import MagnifierMinusIconNW from "@/components/atoms/MagnifierMinusIconNW";

interface ActionButtonsGridProps {
	className?: string;
}

interface ActionButton {
	icon: string;
	iconLibrary: "MaterialIcons" | "MaterialCommunityIcons" | "Custom";
	label: string;
	color: string;
	onPress: () => void;
}

const ActionButtonsGridNW = ({ className }: ActionButtonsGridProps) => {
	const actionButtons: ActionButton[] = [
		{
			icon: "tag-plus",
			iconLibrary: "Custom",
			label: "Add item",
			color: "bg-green-500",
			onPress: () => console.log("Add item pressed"),
		},
		{
			icon: "magnifier-check",
			iconLibrary: "Custom",
			label: "Found",
			color: "bg-blue-500",
			onPress: () => console.log("Found pressed"),
		},
		{
			icon: "magnifier-minus",
			iconLibrary: "Custom",
			label: "Lost",
			color: "bg-orange-500",
			onPress: () => console.log("Lost pressed"),
		},
		{
			icon: "check-box",
			iconLibrary: "MaterialIcons",
			label: "Approved",
			color: "bg-emerald-500",
			onPress: () => console.log("Approved pressed"),
		},
		{
			icon: "history",
			iconLibrary: "MaterialIcons",
			label: "Recovered",
			color: "bg-pink-500",
			onPress: () => console.log("Recovered pressed"),
		},
	];

	return (
		<View className={cn("py-4 bg-white", className)}>
			<View className="flex-row justify-between">
				{actionButtons.map((button, index) => (
					<TouchableOpacity
						key={index}
						onPress={button.onPress}
						className="items-center flex-1 mx-1">
						{/* Icon Container */}
						<View
							className={`w-12 h-12 ${button.color} ${
								button.label === "Approved"
									? "rounded-lg"
									: "rounded"
							} items-center justify-center mb-2 shadow-sm`}>
							{button.iconLibrary === "Custom" &&
							button.icon === "tag-plus" ? (
								<TagPlusIconNW size={20} color="white" />
							) : button.iconLibrary === "Custom" &&
							  button.icon === "magnifier-check" ? (
								<MagnifierCheckIconNW size={20} color="white" />
							) : button.iconLibrary === "Custom" &&
							  button.icon === "magnifier-minus" ? (
								<MagnifierMinusIconNW size={20} color="white" />
							) : button.iconLibrary ===
							  "MaterialCommunityIcons" ? (
								<MaterialCommunityIcons
									name={button.icon as any}
									size={20}
									color="white"
								/>
							) : (
								<MaterialIcons
									name={button.icon as any}
									size={20}
									color="white"
								/>
							)}
						</View>

						{/* Text Label */}
						<Text className="text-xs font-medium text-gray-700 text-center">
							{button.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

export default ActionButtonsGridNW;
