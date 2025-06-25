import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

interface IconButtonProps {
	name: keyof typeof Ionicons.glyphMap;
	size?: number;
	onPress: () => void;
	variant?: "default" | "filled" | "outline";
	color?: string;
	disabled?: boolean;
	className?: string;
	style?: ViewStyle;
}

export default function IconButton({
	name,
	size = 24,
	onPress,
	variant = "default",
	color = "#374151", // gray-700
	disabled = false,
	className,
	style,
}: IconButtonProps) {
	const baseClasses = "p-2 rounded-md justify-center items-center";

	const variantClasses = {
		default: "",
		filled: "bg-gray-100 shadow-sm",
		outline: "border border-gray-300",
	};

	const buttonClassName = cn(
		baseClasses,
		variantClasses[variant],
		disabled && "opacity-50",
		className
	);

	return (
		<TouchableOpacity
			className={buttonClassName}
			style={style}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.7}>
			<Ionicons
				name={name}
				size={size}
				color={disabled ? `${color}60` : color}
			/>
		</TouchableOpacity>
	);
}
