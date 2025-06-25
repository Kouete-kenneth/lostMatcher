import LabelNW from "@/components/atoms/LabelNW";
import LogoNW from "@/components/atoms/LogoNW";
import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";

interface WelcomeHeaderProps {
	className?: string;
}

const WelcomeHeaderNW = ({ className }: WelcomeHeaderProps) => {
	return (
		<View className={cn("items-center w-full", className)}>
			{/* Logo Section - Professional positioning */}
			<View className="items-center mb-16">
				<LogoNW size="lg" showText={false} />
			</View>

			{/* Welcome Text - Simple and clean */}
			<View className="items-center w-full px-8">
				<LabelNW
					variant="headline"
					weight="bold"
					className="text-center text-charcoal-800 dark:text-charcoal-100 text-2xl font-bold">
					WELCOME TO LOST MATCHER
				</LabelNW>
			</View>
		</View>
	);
};

export default WelcomeHeaderNW;
