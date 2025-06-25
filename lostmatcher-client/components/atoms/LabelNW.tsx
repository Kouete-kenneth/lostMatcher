import { cn } from "@/lib/utils";
import React from "react";
import { Text, TextStyle } from "react-native";

interface LabelProps {
	children: string;
	variant?: "body" | "caption" | "headline" | "subheading";
	weight?: "normal" | "medium" | "semibold" | "bold";
	color?: "primary" | "secondary" | "error" | "success" | "warning";
	align?: "left" | "center" | "right";
	className?: string;
	style?: TextStyle;
}

export default function Label({
	children,
	variant = "body",
	weight = "normal",
	color = "primary",
	align = "left",
	className,
	style,
}: LabelProps) {
	const baseClasses = "leading-6";

	const variantClasses = {
		body: "text-base",
		caption: "text-xs leading-4",
		headline: "text-2xl leading-8",
		subheading: "text-xl leading-7",
	};

	const weightClasses = {
		normal: "font-normal",
		medium: "font-medium",
		semibold: "font-semibold",
		bold: "font-bold",
	};

	const colorClasses = {
		primary: "text-gray-900",
		secondary: "text-gray-600",
		error: "text-red-600",
		success: "text-green-600",
		warning: "text-amber-600",
	};

	const alignClasses = {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	};

	const textClassName = cn(
		baseClasses,
		variantClasses[variant],
		weightClasses[weight],
		colorClasses[color],
		alignClasses[align],
		className
	);

	return (
		<Text className={textClassName} style={style}>
			{children}
		</Text>
	);
}
