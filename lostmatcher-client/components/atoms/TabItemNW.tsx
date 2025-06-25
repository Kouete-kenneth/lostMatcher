import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cn } from "@/lib/utils";

interface TabItemProps {
	icon: string;
	label: string;
	isActive?: boolean;
	onPress: () => void;
	className?: string;
}

const TabItemNW = ({
	icon,
	label,
	isActive = false,
	onPress,
	className,
}: TabItemProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			className={cn(
				"flex-1 items-center justify-center py-2",
				className
			)}>
			<Text
				className={cn(
					"text-2xl mb-1",
					isActive ? "text-primary-500" : "text-gray-500"
				)}>
				{icon}
			</Text>
			<Text
				className={cn(
					"text-xs",
					isActive ? "text-primary-500 font-medium" : "text-gray-500"
				)}>
				{label}
			</Text>
		</TouchableOpacity>
	);
};

export default TabItemNW;
