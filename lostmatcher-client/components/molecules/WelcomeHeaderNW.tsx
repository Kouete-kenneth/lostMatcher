import LabelNW from "@/components/atoms/LabelNW";
import LogoNW from "@/components/atoms/LogoNW";
import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";

interface WelcomeHeaderProps {
	className?: string;
}

export default function WelcomeHeader({ className }: WelcomeHeaderProps) {
	return (
		<View className={cn("items-center w-full", className)}>
			{/* Logo Section - Professional positioning */}
			<View className="items-center mb-16">
				<LogoNW size="lg" showText={false} />
			</View>

			{/* Welcome Text Card - Professional typography matching Figma */}
			<View className="items-center w-full px-4">
				{/* Main Title - Bold and prominent */}
				<View className="items-center mb-8">
					<LabelNW
						variant="headline"
						weight="bold"
						className="text-center text-charcoal-800 dark:text-charcoal-100 text-3xl font-bold leading-tight">
						WELCOME TO LOST MATCHER
					</LabelNW>
				</View>

				{/* Description - Professional and clear */}
				<View className="items-center">
					<LabelNW
						variant="body"
						className="text-center text-charcoal-600 dark:text-charcoal-300 text-xl leading-relaxed font-normal">
						Find your missing items with power image and text
						matching technology
					</LabelNW>
				</View>
			</View>
		</View>
	);
}
