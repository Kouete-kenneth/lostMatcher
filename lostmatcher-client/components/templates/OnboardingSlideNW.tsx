import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import OnboardingStepIndicatorNW from "../atoms/OnboardingStepIndicatorNW";
import OnboardingHeaderNW from "../atoms/OnboardingHeaderNW";

export default function OnboardingSlideNW({
    title,
    description,
    illustration,
    currentStep,
    totalSteps,
    onNext,
    onSkip,
    isLast,
}: {
    title: string;
    description: string;
    illustration: any;
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onSkip?: () => void;
    isLast: boolean;
}) {
    const Illustration = illustration;
    return (
        <View className="flex-1 bg-white">
            <OnboardingHeaderNW />
            <View className="flex-1 items-center justify-around w-full px-6">
                <Text className="text-lg font-bold text-text-primary text-center mt-6 mb-0">
                    {title}
                </Text>
                {typeof Illustration === "function" ? (
                    <Illustration
                        width={220}
                        height={220}
                        style={{ marginBottom: 12, marginTop: 12 }}
                    />
                ) : (
                    <Image
                        source={illustration}
                        style={{
                            width:250,
                            height: 240,
                            marginBottom: 12,
                            marginTop: 12,
                        }}
                        resizeMode="contain"
                    />
                )}
                <Text className="text-base text-gray-700 text-center mb-4.5">
                    {description}
                </Text>
                <OnboardingStepIndicatorNW
                    total={totalSteps}
                    current={currentStep}
                />
                <TouchableOpacity
                    className="bg-blue-600 rounded-lg py-3 px-8 mt-4 mb-2"
                    onPress={onNext}>
                    <Text className="text-white font-bold text-base">
                        {isLast ? "Finish" : "Next"}
                    </Text>
                </TouchableOpacity>
                {!isLast && (
                    <TouchableOpacity onPress={onSkip}>
                        <Text className="text-gray-400 text-xs text-center">
                            Skip
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
