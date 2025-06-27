import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
	steps: string[];
	className?: string;
}

export default function StepIndicatorNW({
	currentStep,
	totalSteps,
	steps,
	className,
}: StepIndicatorProps) {
	return (
		<View className={cn("w-full px-4 py-6", className)}>
			{/* Progress Bar */}
			<View className="flex-row items-center mb-4">
				{Array.from({ length: totalSteps }, (_, index) => (
					<React.Fragment key={index}>
						{/* Step Circle */}
						<View
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center border-2",
								index < currentStep
									? "bg-primary-500 border-primary-500"
									: index === currentStep
									? "bg-white border-primary-500"
									: "bg-gray-100 border-gray-300"
							)}>
							<Text
								className={cn(
									"text-sm font-semibold",
									index < currentStep
										? "text-white"
										: index === currentStep
										? "text-primary-500"
										: "text-gray-400"
								)}>
								{index + 1}
							</Text>
						</View>

						{/* Connector Line */}
						{index < totalSteps - 1 && (
							<View
								className={cn(
									"flex-1 h-0.5 mx-2",
									index < currentStep
										? "bg-primary-500"
										: "bg-gray-300"
								)}
							/>
						)}
					</React.Fragment>
				))}
			</View>

			{/* Current Step Label */}
			<View className="items-center">
				<Text className="text-lg font-semibold text-gray-900 mb-1">
					Step {currentStep + 1} of {totalSteps}
				</Text>
				<Text className="text-sm text-gray-600 text-center">
					{steps[currentStep]}
				</Text>
			</View>
		</View>
	);
}
