import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cn } from "@/lib/utils";

interface CategoryButtonProps {
	title: string;
	isSelected: boolean;
	onPress: () => void;
	className?: string;
}

export default function CategoryButtonNW({
	title,
	isSelected,
	onPress,
	className,
}: CategoryButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			className={cn(
				"border rounded-lg px-4 py-3 min-h-[44px] items-center justify-center",
				isSelected
					? "border-primary-500 bg-primary-50"
					: "border-gray-300 bg-white",
				className
			)}>
			<Text
				className={cn(
					"text-sm font-medium",
					isSelected ? "text-primary-700" : "text-gray-700"
				)}>
				{title}
			</Text>
		</TouchableOpacity>
	);
}
