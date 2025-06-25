import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface AvatarProps {
	size?: "sm" | "md" | "lg";
	imageUrl?: string;
	initials?: string;
	className?: string;
}

const AvatarNW = ({
	size = "md",
	imageUrl,
	initials = "AT",
	className,
}: AvatarProps) => {
	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-12 h-12",
		lg: "w-16 h-16",
	};

	const textSizeClasses = {
		sm: "text-xs",
		md: "text-sm",
		lg: "text-lg",
	};

	return (
		<View
			className={cn(
				"rounded-full bg-primary-500 items-center justify-center",
				sizeClasses[size],
				className
			)}>
			<Text
				className={cn("text-white font-medium", textSizeClasses[size])}>
				{initials}
			</Text>
		</View>
	);
};

export default AvatarNW;
