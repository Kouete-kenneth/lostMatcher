import StatusBarNW from "@/components/atoms/StatusBarNW";
import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";

interface NavigationHeaderProps {
	className?: string;
}

export default function NavigationHeader({ className }: NavigationHeaderProps) {
	return (
		<View
			className={cn(
				"bg-primary-500 rounded-t-[44px] overflow-hidden",
				className
			)}>
			<StatusBarNW />
		</View>
	);
}
