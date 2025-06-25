import { cn } from "@/lib/utils";
import React from "react";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: "primary" | "secondary" | "outline";
	size?: "small" | "medium" | "large";
	disabled?: boolean;
	className?: string;
	textClassName?: string;
	style?: ViewStyle;
	textStyle?: TextStyle;
}

export default function Button({
	title,
	onPress,
	variant = "primary",
	size = "medium",
	disabled = false,
	className,
	textClassName,
	style,
	textStyle,
}: ButtonProps) {
	// Base button classes
	const baseClasses = "rounded-lg justify-center items-center";

	// Variant classes
	const variantClasses = {
		primary: "bg-primary-500 shadow-sm",
		secondary: "bg-secondary-100",
		outline: "border border-primary-500 bg-transparent",
	};

	// Size classes
	const sizeClasses = {
		small: "px-3 py-1.5 min-h-[32px]",
		medium: "px-4 py-2.5 min-h-[44px]",
		large: "px-6 py-3.5 min-h-[52px]",
	};

	// Text classes
	const baseTextClasses = "font-semibold text-center";

	const textVariantClasses = {
		primary: "text-white",
		secondary: "text-secondary-900",
		outline: "text-primary-500",
	};

	const textSizeClasses = {
		small: "text-sm",
		medium: "text-base",
		large: "text-lg",
	};

	const buttonClassName = cn(
		baseClasses,
		variantClasses[variant],
		sizeClasses[size],
		disabled && "opacity-50",
		className
	);

	const textClassNameFinal = cn(
		baseTextClasses,
		textVariantClasses[variant],
		textSizeClasses[size],
		disabled && "opacity-60",
		textClassName
	);

	return (
		<TouchableOpacity
			className={buttonClassName}
			style={style}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.7}>
			<Text className={textClassNameFinal} style={textStyle}>
				{title}
			</Text>
		</TouchableOpacity>
	);
}
