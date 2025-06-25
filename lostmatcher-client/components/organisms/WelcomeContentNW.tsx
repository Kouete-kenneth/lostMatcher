import ButtonNW from "@/components/atoms/ButtonNW";
import WelcomeHeaderNW from "@/components/molecules/WelcomeHeaderNW";
import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";

interface WelcomeContentProps {
	onGetStarted: () => void;
	className?: string;
}

export default function WelcomeContent({
	onGetStarted,
	className,
}: WelcomeContentProps) {
	return (
		<View className={cn("flex-1 bg-white dark:bg-charcoal-900", className)}>
			{/* Professional Content Container matching Figma design */}
			<View className="flex-1 items-center justify-center px-6">
				{/* Content Area - Centered with proper spacing */}
				<View className="flex-1 justify-center items-center w-full max-w-sm">
					<WelcomeHeaderNW />
				</View>

				{/* Button Section - Professional styling with proper margins */}
				<View className="w-full max-w-sm pb-8">
					<ButtonNW
						title="Get Started"
						variant="primary"
						size="large"
						onPress={onGetStarted}
						className="w-full bg-primary-500 dark:bg-primary-600 rounded-xl py-4 shadow-lg border-0"
						textClassName="text-white font-bold text-lg"
					/>
				</View>
			</View>
		</View>
	);
}
