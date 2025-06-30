import LabelNW from "@/components/atoms/LabelNW";
import LogoNW from "@/components/atoms/LogoNW";
import { cn } from "@/lib/utils";
import React from "react";
import { View, Text } from "react-native";

interface WelcomeHeaderProps {
	className?: string;
}

const WelcomeHeaderNW = ({ className }: WelcomeHeaderProps) => {
	return (
		<View className={cn("items-center w-full", className)}>
			{/* Logo Section - Professional positioning */}
			<View className="items-center">
				<LogoNW size="sm" showText={false} />
			</View>

			{/* Welcome Text - Simple and clean */}
			<View className="items-center w-full px-8">
				<LabelNW
					variant="headline"
					weight="bold"
					className="text-center dark:text-charcoal-100 text-2xl font-bold mb-4">
					WELCOME TO LOSTMATCHER
				</LabelNW>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "400",
						color: "#6B7280",
						textAlign: "center",
						marginBottom: 4,
					}}>
					Find your missing items with powerful image and text
					matching technology.
				</Text>
			</View>
		</View>
	);
};

export default WelcomeHeaderNW;
